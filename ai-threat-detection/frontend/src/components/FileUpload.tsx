import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

interface UploadResult {
  type: 'threat' | 'malware';
  fileName: string;
  status: string;
  details: any;
}

const FileUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'threat' | 'malware'>('threat');
  const [results, setResults] = useState<UploadResult[]>([]);
  const { addNotification } = useNotification();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => handleFileUpload(file));
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => handleFileUpload(file));
    event.target.value = '';
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const endpoint = uploadType === 'threat' ? '/threats/analyze' : '/malware/scan';
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result: UploadResult = {
        type: uploadType,
        fileName: file.name,
        status: 'success',
        details: response.data,
      };

      setResults(prev => [result, ...prev]);
      addNotification(`${file.name} processed successfully`, 'success');
    } catch (error) {
      const result: UploadResult = {
        type: uploadType,
        fileName: file.name,
        status: 'error',
        details: null,
      };
      setResults(prev => [result, ...prev]);
      addNotification(`Failed to process ${file.name}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-900/20 border-green-500';
      case 'error': return 'text-red-400 bg-red-900/20 border-red-500';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-white">File Upload</h1>
      </motion.div>

      {/* Upload Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-4"
      >
        <button
          onClick={() => setUploadType('threat')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            uploadType === 'threat'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Threat Analysis
        </button>
        <button
          onClick={() => setUploadType('malware')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            uploadType === 'malware'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Malware Scan
        </button>
      </motion.div>

      {/* File Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-900/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          multiple
          disabled={uploading}
          accept={uploadType === 'threat' ? '.log,.txt,.csv' : '*'}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer"
        >
          <div className="space-y-6">
            <div className="text-8xl text-gray-400">
              {uploadType === 'threat' ? '📊' : '🛡️'}
            </div>
            <div>
              <div className="text-2xl text-white font-medium mb-2">
                {uploading ? 'Processing files...' : 'Drop files here or click to upload'}
              </div>
              <div className="text-gray-400">
                {uploadType === 'threat'
                  ? 'Upload log files for AI-powered threat analysis'
                  : 'Upload any file type for malware detection'
                }
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {uploadType === 'threat'
                  ? 'Supported formats: .log, .txt, .csv'
                  : 'All file types supported'
                }
              </div>
            </div>
            {uploading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </label>
      </motion.div>

      {/* Upload Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-white">Recent Uploads</h2>
          <div className="space-y-3">
            {results.slice(0, 10).map((result, index) => (
              <motion.div
                key={`${result.fileName}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {result.type === 'threat' ? '📊' : '🛡️'}
                    </div>
                    <div>
                      <div className="text-white font-medium">{result.fileName}</div>
                      <div className="text-sm text-gray-400">
                        {result.type === 'threat' ? 'Threat Analysis' : 'Malware Scan'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        result.status
                      )}`}
                    >
                      {result.status === 'success' ? 'Processed' : 'Failed'}
                    </span>
                  </div>
                </div>
                
                {result.status === 'success' && result.details && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="text-sm text-gray-300">
                      {result.type === 'threat' ? (
                        <div>
                          <span className="font-medium">Risk Level:</span>{' '}
                          <span className={
                            result.details.threatLevel === 'High'
                              ? 'text-red-400'
                              : result.details.threatLevel === 'Medium'
                              ? 'text-yellow-400'
                              : 'text-green-400'
                          }>
                            {result.details.threatLevel}
                          </span>
                          {result.details.threats?.length > 0 && (
                            <span className="ml-4">
                              <span className="font-medium">Threats:</span> {result.details.threats.length}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium">Status:</span>{' '}
                          <span className={
                            result.details.scanStatus === 'infected'
                              ? 'text-red-400'
                              : result.details.scanStatus === 'suspicious'
                              ? 'text-yellow-400'
                              : 'text-green-400'
                          }>
                            {result.details.scanStatus}
                          </span>
                          {result.details.malwareName && (
                            <span className="ml-4 text-red-400">
                              <span className="font-medium">Malware:</span> {result.details.malwareName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;