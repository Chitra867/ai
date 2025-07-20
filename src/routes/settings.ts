import express from 'express';
import { authenticate, AuthRequest, authorize } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Get user settings
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user!._id).select('settings');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update user settings
router.put('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { aiAlerts, emailNotifications, dataRetentionDays } = req.body;

    const updateData: any = {};
    
    if (typeof aiAlerts === 'boolean') {
      updateData['settings.aiAlerts'] = aiAlerts;
    }
    
    if (typeof emailNotifications === 'boolean') {
      updateData['settings.emailNotifications'] = emailNotifications;
    }
    
    if (dataRetentionDays && dataRetentionDays >= 30 && dataRetentionDays <= 365) {
      updateData['settings.dataRetentionDays'] = dataRetentionDays;
    }

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('settings');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

// Get system configuration (admin only)
router.get('/system', authenticate, authorize(['admin']), (req: AuthRequest, res) => {
  const systemConfig = {
    aiEngine: {
      version: '1.0.0',
      status: 'active',
      lastUpdate: new Date('2024-01-01'),
      confidenceThreshold: 75
    },
    scanning: {
      maxFileSize: 100 * 1024 * 1024, // 100MB
      allowedFileTypes: ['*'],
      quarantineEnabled: true,
      realTimeScanningEnabled: true
    },
    alerts: {
      emailEnabled: true,
      smsEnabled: false,
      webhookEnabled: true,
      alertThresholds: {
        critical: 1,
        high: 5,
        medium: 10
      }
    },
    retention: {
      logRetentionDays: 90,
      reportRetentionDays: 365,
      scanResultRetentionDays: 180
    },
    integration: {
      siemEnabled: false,
      apiEnabled: true,
      webhookUrl: process.env.WEBHOOK_URL || '',
      apiKeys: {
        active: 2,
        total: 5
      }
    }
  };

  res.json(systemConfig);
});

// Update system configuration (admin only)
router.put('/system', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const {
      aiEngine,
      scanning,
      alerts,
      retention,
      integration
    } = req.body;

    // In a real implementation, you would validate and store these settings
    // For now, we'll just return the updated configuration
    const updatedConfig = {
      aiEngine: aiEngine || {},
      scanning: scanning || {},
      alerts: alerts || {},
      retention: retention || {},
      integration: integration || {},
      lastUpdated: new Date(),
      updatedBy: req.user!.username
    };

    res.json({
      message: 'System configuration updated successfully',
      config: updatedConfig
    });
  } catch (error) {
    console.error('Update system config error:', error);
    res.status(500).json({ message: 'Error updating system configuration' });
  }
});

// Generate new API key (admin only)
router.post('/api-keys', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const { name, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'API key name is required' });
    }

    // Generate a new API key (in production, use a more secure method)
    const apiKey = `ai_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    const keyData = {
      id: Date.now().toString(),
      name,
      key: apiKey,
      permissions: permissions || ['read'],
      createdAt: new Date(),
      createdBy: req.user!.username,
      isActive: true,
      lastUsed: null
    };

    // In a real implementation, you would store this in the database
    res.status(201).json({
      message: 'API key created successfully',
      apiKey: keyData
    });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ message: 'Error creating API key' });
  }
});

// List API keys (admin only)
router.get('/api-keys', authenticate, authorize(['admin']), (req: AuthRequest, res) => {
  // Mock API keys data
  const apiKeys = [
    {
      id: '1',
      name: 'Production API',
      keyPreview: 'ai_****_****_****',
      permissions: ['read', 'write'],
      createdAt: new Date('2024-01-01'),
      createdBy: 'admin',
      isActive: true,
      lastUsed: new Date()
    },
    {
      id: '2',
      name: 'Integration API',
      keyPreview: 'ai_****_****_****',
      permissions: ['read'],
      createdAt: new Date('2024-01-15'),
      createdBy: 'admin',
      isActive: true,
      lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  res.json(apiKeys);
});

// Revoke API key (admin only)
router.delete('/api-keys/:id', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const keyId = req.params.id;

    // In a real implementation, you would mark the API key as inactive in the database
    res.json({
      message: 'API key revoked successfully',
      keyId
    });
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({ message: 'Error revoking API key' });
  }
});

// Test email notifications
router.post('/test-email', authenticate, async (req: AuthRequest, res) => {
  try {
    const { email } = req.body;
    const testEmail = email || req.user!.email;

    // In a real implementation, you would send an actual email
    console.log(`Test email would be sent to: ${testEmail}`);

    res.json({
      message: 'Test email sent successfully',
      email: testEmail,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ message: 'Error sending test email' });
  }
});

// Get notification preferences
router.get('/notifications', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user!._id).select('settings email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notifications = {
      email: user.email,
      emailNotifications: user.settings.emailNotifications,
      aiAlerts: user.settings.aiAlerts,
      notificationTypes: {
        criticalThreats: true,
        malwareDetection: true,
        systemAlerts: user.settings.aiAlerts,
        reportGeneration: false,
        maintenanceUpdates: false
      }
    };

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Error fetching notification preferences' });
  }
});

// Update notification preferences
router.put('/notifications', authenticate, async (req: AuthRequest, res) => {
  try {
    const { notificationTypes } = req.body;

    // In a real implementation, you would store detailed notification preferences
    // For now, we'll update the basic settings
    const updateData: any = {};
    
    if (notificationTypes?.systemAlerts !== undefined) {
      updateData['settings.aiAlerts'] = notificationTypes.systemAlerts;
    }

    if (Object.keys(updateData).length > 0) {
      await User.findByIdAndUpdate(
        req.user!._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    res.json({
      message: 'Notification preferences updated successfully',
      preferences: req.body
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ message: 'Error updating notification preferences' });
  }
});

export default router;