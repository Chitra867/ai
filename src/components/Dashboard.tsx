import React from 'react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
        <p className="text-gray-400">AI-powered threat detection and system monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">System Status</p>
              <p className="text-2xl font-bold text-sea-green">Operational</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Threats</p>
              <p className="text-2xl font-bold text-crimson">3</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Files Scanned</p>
              <p className="text-2xl font-bold text-medium-slate-blue">1,247</p>
            </div>
            <div className="text-3xl">📁</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">AI Confidence</p>
              <p className="text-2xl font-bold text-orange-400">94%</p>
            </div>
            <div className="text-3xl">🤖</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Recent Threats</h3>
          <div className="space-y-3">
            {[
              { type: 'Insider Threat', severity: 'high', time: '2 minutes ago' },
              { type: 'Suspicious Login', severity: 'medium', time: '15 minutes ago' },
              { type: 'Access Anomaly', severity: 'low', time: '1 hour ago' },
            ].map((threat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-gray/20 rounded">
                <div>
                  <p className="font-medium">{threat.type}</p>
                  <p className="text-sm text-gray-400">{threat.time}</p>
                </div>
                <span className={`badge-${threat.severity}`}>
                  {threat.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4">System Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'File scan completed', status: 'success', time: '5 minutes ago' },
              { action: 'Threat analysis started', status: 'processing', time: '10 minutes ago' },
              { action: 'User login detected', status: 'info', time: '30 minutes ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-gray/20 rounded">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-sea-green' :
                  activity.status === 'processing' ? 'bg-orange-400' : 'bg-medium-slate-blue'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;