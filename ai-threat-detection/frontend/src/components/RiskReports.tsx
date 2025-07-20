import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportData {
  threatCategories: { name: string; value: number; color: string }[];
  userBehavior: { user: string; anomalies: number; riskScore: number }[];
  infectionTrends: { date: string; infections: number; threats: number }[];
  systemHealth: {
    totalThreats: number;
    activeMalware: number;
    cleanSystems: number;
    riskyUsers: number;
  };
}

const RiskReports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const { addNotification } = useNotification();
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reports?range=${dateRange}`);
      setReportData(response.data);
    } catch (error) {
      addNotification('Failed to fetch report data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = async () => {
    if (!reportRef.current || !reportData) return;

    try {
      setGenerating(true);
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add title
      pdf.setFontSize(20);
      pdf.setTextColor(44, 82, 130);
      pdf.text('AI-Based Security Risk Report', pageWidth / 2, 20, { align: 'center' });
      
      // Add date
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: 'center' });
      pdf.text(`Report Period: Last ${dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : '90 days'}`, pageWidth / 2, 35, { align: 'center' });
      
      // Add summary section
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Executive Summary', 20, 50);
      
      pdf.setFontSize(12);
      let yPos = 60;
      pdf.text(`• Total Threats Detected: ${reportData.systemHealth.totalThreats}`, 25, yPos);
      yPos += 7;
      pdf.text(`• Active Malware Instances: ${reportData.systemHealth.activeMalware}`, 25, yPos);
      yPos += 7;
      pdf.text(`• Clean Systems: ${reportData.systemHealth.cleanSystems}`, 25, yPos);
      yPos += 7;
      pdf.text(`• High-Risk Users: ${reportData.systemHealth.riskyUsers}`, 25, yPos);
      
      // Capture charts as images
      const chartElements = reportRef.current.querySelectorAll('.chart-container');
      
      for (let i = 0; i < chartElements.length; i++) {
        const element = chartElements[i] as HTMLElement;
        const canvas = await html2canvas(element, {
          backgroundColor: '#1f2937',
          scale: 2,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add new page if needed
        if (yPos + imgHeight > pageHeight - 20) {
          pdf.addPage();
          yPos = 20;
        }
        
        yPos += 20;
        pdf.addImage(imgData, 'PNG', 20, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10;
      }
      
      // Save PDF
      pdf.save(`security-risk-report-${new Date().toISOString().split('T')[0]}.pdf`);
      addNotification('PDF report generated successfully', 'success');
      
    } catch (error) {
      addNotification('Failed to generate PDF report', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 text-lg">No report data available</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-white">Risk Reports</h1>
        <div className="flex space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={generatePDFReport}
            disabled={generating}
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${
              generating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {generating ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </motion.div>

      <div ref={reportRef} className="space-y-8">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Threats</p>
                <p className="text-2xl font-bold text-red-400">{reportData.systemHealth.totalThreats}</p>
              </div>
              <div className="text-3xl">⚠️</div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Malware</p>
                <p className="text-2xl font-bold text-orange-400">{reportData.systemHealth.activeMalware}</p>
              </div>
              <div className="text-3xl">🦠</div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Clean Systems</p>
                <p className="text-2xl font-bold text-green-400">{reportData.systemHealth.cleanSystems}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Risky Users</p>
                <p className="text-2xl font-bold text-yellow-400">{reportData.systemHealth.riskyUsers}</p>
              </div>
              <div className="text-3xl">👤</div>
            </div>
          </div>
        </motion.div>

        {/* Threat Categories Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 chart-container"
        >
          <h2 className="text-xl font-bold text-white mb-6">Threat Categories Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={reportData.threatCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {reportData.threatCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#374151', 
                  border: '1px solid #4b5563', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Behavior Anomalies Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 chart-container"
        >
          <h2 className="text-xl font-bold text-white mb-6">User Behavior Anomalies</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.userBehavior}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="user" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#374151', 
                  border: '1px solid #4b5563', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Bar dataKey="anomalies" fill="#ef4444" name="Anomalies" />
              <Bar dataKey="riskScore" fill="#f97316" name="Risk Score" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Infection Trends Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700 chart-container"
        >
          <h2 className="text-xl font-bold text-white mb-6">Security Trends Over Time</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={reportData.infectionTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#374151', 
                  border: '1px solid #4b5563', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="infections" stroke="#ef4444" strokeWidth={3} name="Infections" />
              <Line type="monotone" dataKey="threats" stroke="#f97316" strokeWidth={3} name="Threats" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default RiskReports;