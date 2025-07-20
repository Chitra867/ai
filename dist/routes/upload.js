"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const MalwareScan_1 = __importDefault(require("../models/MalwareScan"));
const aiService_1 = __importDefault(require("../services/aiService"));
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    // Allow most file types but limit size
    const maxSize = 100 * 1024 * 1024; // 100MB
    cb(null, true);
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
        files: 1 // Single file upload
    }
});
// Generate file hashes
const generateFileHashes = (filePath) => {
    return new Promise((resolve, reject) => {
        const md5Hash = crypto_1.default.createHash('md5');
        const sha1Hash = crypto_1.default.createHash('sha1');
        const sha256Hash = crypto_1.default.createHash('sha256');
        const stream = fs_1.default.createReadStream(filePath);
        stream.on('data', (data) => {
            md5Hash.update(data);
            sha1Hash.update(data);
            sha256Hash.update(data);
        });
        stream.on('end', () => {
            resolve({
                md5: md5Hash.digest('hex'),
                sha1: sha1Hash.digest('hex'),
                sha256: sha256Hash.digest('hex')
            });
        });
        stream.on('error', reject);
    });
};
// Upload and scan file
router.post('/scan', auth_1.authenticate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const file = req.file;
        const filePath = file.path;
        // Generate file hashes
        const hashes = await generateFileHashes(filePath);
        // Check if file was already scanned (by hash)
        const existingScan = await MalwareScan_1.default.findOne({
            userId: req.user._id,
            'fileHash.sha256': hashes.sha256
        });
        if (existingScan) {
            // Delete uploaded file since we already have it
            fs_1.default.unlinkSync(filePath);
            return res.json({
                message: 'File already scanned',
                scanId: existingScan._id,
                results: existingScan.scanResults
            });
        }
        // Create scan record
        const scan = new MalwareScan_1.default({
            userId: req.user._id,
            filename: file.filename,
            originalName: file.originalname,
            fileSize: file.size,
            fileType: file.mimetype,
            filePath: filePath,
            fileHash: hashes,
            status: 'scanning'
        });
        await scan.save();
        // Start AI analysis in background
        setImmediate(async () => {
            try {
                const startTime = Date.now();
                const result = await aiService_1.default.analyzeMalwareFile(filePath, hashes);
                const scanDuration = Date.now() - startTime;
                scan.scanResults = result;
                scan.scanMetadata.scanDuration = scanDuration;
                scan.status = 'completed';
                await scan.save();
                // If file is infected, move to quarantine
                if (result.isInfected) {
                    const quarantineDir = path_1.default.join(__dirname, '../../quarantine');
                    if (!fs_1.default.existsSync(quarantineDir)) {
                        fs_1.default.mkdirSync(quarantineDir, { recursive: true });
                    }
                    const quarantinePath = path_1.default.join(quarantineDir, file.filename);
                    fs_1.default.renameSync(filePath, quarantinePath);
                    scan.filePath = quarantinePath;
                    await scan.save();
                }
            }
            catch (error) {
                console.error('Malware analysis error:', error);
                scan.status = 'failed';
                scan.errorMessage = 'Analysis failed';
                await scan.save();
            }
        });
        res.status(202).json({
            message: 'File uploaded and scan started',
            scanId: scan._id,
            filename: file.originalname,
            status: 'scanning'
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        // Clean up uploaded file on error
        if (req.file) {
            try {
                fs_1.default.unlinkSync(req.file.path);
            }
            catch (unlinkError) {
                console.error('Error deleting uploaded file:', unlinkError);
            }
        }
        res.status(500).json({ message: 'Error uploading file' });
    }
});
// Upload multiple files
router.post('/scan-multiple', auth_1.authenticate, upload.array('files', 10), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        const scanPromises = files.map(async (file) => {
            const hashes = await generateFileHashes(file.path);
            // Check if file was already scanned
            const existingScan = await MalwareScan_1.default.findOne({
                userId: req.user._id,
                'fileHash.sha256': hashes.sha256
            });
            if (existingScan) {
                fs_1.default.unlinkSync(file.path);
                return {
                    filename: file.originalname,
                    scanId: existingScan._id,
                    status: 'already_scanned'
                };
            }
            // Create scan record
            const scan = new MalwareScan_1.default({
                userId: req.user._id,
                filename: file.filename,
                originalName: file.originalname,
                fileSize: file.size,
                fileType: file.mimetype,
                filePath: file.path,
                fileHash: hashes,
                status: 'scanning'
            });
            await scan.save();
            // Start AI analysis in background
            setImmediate(async () => {
                try {
                    const startTime = Date.now();
                    const result = await aiService_1.default.analyzeMalwareFile(file.path, hashes);
                    const scanDuration = Date.now() - startTime;
                    scan.scanResults = result;
                    scan.scanMetadata.scanDuration = scanDuration;
                    scan.status = 'completed';
                    await scan.save();
                    if (result.isInfected) {
                        const quarantineDir = path_1.default.join(__dirname, '../../quarantine');
                        if (!fs_1.default.existsSync(quarantineDir)) {
                            fs_1.default.mkdirSync(quarantineDir, { recursive: true });
                        }
                        const quarantinePath = path_1.default.join(quarantineDir, file.filename);
                        fs_1.default.renameSync(file.path, quarantinePath);
                        scan.filePath = quarantinePath;
                        await scan.save();
                    }
                }
                catch (error) {
                    console.error('Malware analysis error:', error);
                    scan.status = 'failed';
                    scan.errorMessage = 'Analysis failed';
                    await scan.save();
                }
            });
            return {
                filename: file.originalname,
                scanId: scan._id,
                status: 'scanning'
            };
        });
        const results = await Promise.all(scanPromises);
        res.status(202).json({
            message: 'Files uploaded and scans started',
            results
        });
    }
    catch (error) {
        console.error('Multiple upload error:', error);
        // Clean up uploaded files on error
        if (req.files) {
            req.files.forEach(file => {
                try {
                    fs_1.default.unlinkSync(file.path);
                }
                catch (unlinkError) {
                    console.error('Error deleting uploaded file:', unlinkError);
                }
            });
        }
        res.status(500).json({ message: 'Error uploading files' });
    }
});
// Get upload statistics
router.get('/stats', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const days = parseInt(req.query.days) || 30;
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const stats = await MalwareScan_1.default.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalUploads: { $sum: 1 },
                    totalSize: { $sum: '$fileSize' },
                    infectedFiles: {
                        $sum: { $cond: ['$scanResults.isInfected', 1, 0] }
                    },
                    avgScanTime: { $avg: '$scanMetadata.scanDuration' }
                }
            }
        ]);
        const result = stats[0] || {
            totalUploads: 0,
            totalSize: 0,
            infectedFiles: 0,
            avgScanTime: 0
        };
        res.json({
            totalUploads: result.totalUploads,
            totalSize: result.totalSize,
            infectedFiles: result.infectedFiles,
            cleanFiles: result.totalUploads - result.infectedFiles,
            avgScanTime: Math.round(result.avgScanTime || 0)
        });
    }
    catch (error) {
        console.error('Upload stats error:', error);
        res.status(500).json({ message: 'Error fetching upload statistics' });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map