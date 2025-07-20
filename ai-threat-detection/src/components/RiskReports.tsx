import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { FileText, Download, Calendar, TrendingUp, Shield, AlertTriangle, Eye } from 'lucide-react';
import jsPDF from 'jspdf';
import { generateRiskChart, generateThreatTrendChart, generateDashboardStats } from '../utils/aiDataGenerator';
import { ChartData, DashboardStats } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const RiskReports: React.FC = () => {
  const [riskChart, setRiskChart] = useState<ChartData | null>(null);
  const [trendChart, setTrendChart] = useState<ChartData | null>(null);
  const [threatOverTime, setThreatOverTime] = useState<ChartData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('30d');

  useEffect(() => {
    loadReportData();
  }, [reportPeriod]);

  const loadReportData = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setRiskChart(generateRiskChart());
    setTrendChart(generateThreatTrendChart());
    setStats(generateDashboardStats());
    
    // Generate threat over time chart
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    setThreatOverTime({
      labels: last30Days,
      datasets: [
        {
          label: 'High Risk Threats',
          data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 2),
          backgroundColor: ['#D9534F'],
          borderColor: ['#C9302C']
        },
        {
          label: 'Medium Risk Threats',
          data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 15) + 5),
          backgroundColor: ['#F0AD4E'],
          borderColor: ['#EC971F']
        }
      ]
    });
  };

  const generatePDFReport = async () => {
    setIsGenerating(true);
    
    try {
      // Create a new PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Header
      pdf.setFillColor(30, 137, 193); // Primary blue
      pdf.rect(0, 0, pageWidth, 30, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AI Threat Detection Report', 20, 20);
      
      // Report date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
      pdf.text(`Report Period: Last ${reportPeriod}`, 20, 47);
      
      // Executive Summary
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Executive Summary', 20, 60);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const summaryText = [
        `Total security scans performed: ${stats?.totalScans.toLocaleString()}`,
        `Threats detected and analyzed: ${stats?.threatsFound.toLocaleString()}`,
        `Malware instances quarantined: ${stats?.malwareCount.toLocaleString()}`,
        `System health score: ${stats?.systemHealth}%`,
        '',
        'AI Analysis Summary:',
        'Our advanced threat detection system has successfully identified and',
        'neutralized multiple security threats across all monitored endpoints.',
        'The behavioral analysis engine shows normal patterns with elevated',
        'monitoring during peak business hours.'
      ];
      
      let yPosition = 70;
      summaryText.forEach(line => {
        pdf.text(line, 20, yPosition);
        yPosition += 6;
      });
      
      // Key Metrics
      yPosition += 10;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Security Metrics', 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Create a simple table
      const metrics = [
        ['Metric', 'Value', 'Status'],
        ['Detection Rate', '99.7%', 'Excellent'],
        ['False Positives', '0.3%', 'Very Low'],
        ['Response Time', '<1s', 'Optimal'],
        ['System Uptime', '99.9%', 'Excellent'],
        ['Active Monitoring', '24/7', 'Active']
      ];
      
      metrics.forEach((row, index) => {
        const xPositions = [20, 80, 140];
        row.forEach((cell, cellIndex) => {
          if (index === 0) {
            pdf.setFont('helvetica', 'bold');
          } else {
            pdf.setFont('helvetica', 'normal');
          }
          pdf.text(cell, xPositions[cellIndex], yPosition);
        });
        yPosition += 8;
      });
      
      // New page for charts
      pdf.addPage();
      
      // Charts section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Threat Analysis Charts', 20, 20);
      
      // Capture chart elements and add to PDF
      const chartElements = document.querySelectorAll('.chart-container canvas');
      let chartY = 30;
      
      for (let i = 0; i < Math.min(chartElements.length, 2); i++) {
        const canvas = chartElements[i] as HTMLCanvasElement;
        if (canvas) {
          const chartImage = canvas.toDataURL('image/png');
          pdf.addImage(chartImage, 'PNG', 20, chartY, 170, 80);
          chartY += 90;
        }
      }
      
      // Recommendations
      if (chartY < 180) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AI Recommendations', 20, chartY + 20);
        
        const recommendations = [
          '• Continue current security monitoring protocols',
          '• Implement additional user training for high-risk accounts',
          '• Consider enabling enhanced real-time scanning',
          '• Schedule quarterly security policy reviews',
          '• Monitor after-hours access patterns more closely'
        ];
        
        let recY = chartY + 35;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        recommendations.forEach(rec => {
          pdf.text(rec, 20, recY);
          recY += 7;
        });
      }
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`ThreatGuard AI - Confidential Security Report - Page 1 of ${pdf.getNumberOfPages()}`, 20, pageHeight - 10);
      
      // Save the PDF
      pdf.save(`threat-detection-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Risk Reports</h1>
        <p className="text-gray-400">Comprehensive security analytics and threat intelligence reports</p>
      </div>

      {/* Report Controls */}
      <div className="mb-6 card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="input-field pl-10 pr-8 appearance-none"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
            
            <button
              onClick={loadReportData}
              className="btn-secondary flex items-center"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
          </div>

          <button
            onClick={generatePDFReport}
            disabled={isGenerating}
            className="btn-primary flex items-center"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <Shield className="w-8 h-8 text-primary-blue mx-auto mb-3" />
          <div className="text-2xl font-bold text-text-light">{stats?.totalScans.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Scans</div>
        </div>
        
        <div className="card text-center">
          <AlertTriangle className="w-8 h-8 text-alert-red mx-auto mb-3" />
          <div className="text-2xl font-bold text-text-light">{stats?.threatsFound.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Threats Detected</div>
        </div>
        
        <div className="card text-center">
          <Eye className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-text-light">{stats?.malwareCount.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Malware Blocked</div>
        </div>
        
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-success-green mx-auto mb-3" />
          <div className="text-2xl font-bold text-text-light">{stats?.systemHealth}%</div>
          <div className="text-sm text-gray-400">System Health</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Distribution Chart */}
        <div className="card chart-container">
          <h3 className="text-xl font-semibold text-text-light mb-4">Risk Level Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            {riskChart && (
              <Pie 
                data={riskChart} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        color: '#E0E0E0',
                        padding: 20
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Weekly Threat Trends */}
        <div className="card chart-container">
          <h3 className="text-xl font-semibold text-text-light mb-4">Weekly Threat Trends</h3>
          <div className="h-64">
            {trendChart && (
              <Bar 
                data={trendChart} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      ticks: { color: '#E0E0E0' },
                      grid: { color: '#555555' }
                    },
                    y: {
                      ticks: { color: '#E0E0E0' },
                      grid: { color: '#555555' }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Monthly Threat Analysis */}
      <div className="card chart-container mb-8">
        <h3 className="text-xl font-semibold text-text-light mb-4">30-Day Threat Analysis</h3>
        <div className="h-80">
          {threatOverTime && (
            <Line 
              data={threatOverTime} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#E0E0E0'
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: { 
                      color: '#E0E0E0',
                      maxTicksLimit: 10
                    },
                    grid: { color: '#555555' }
                  },
                  y: {
                    ticks: { color: '#E0E0E0' },
                    grid: { color: '#555555' }
                  }
                }
              }}
            />
          )}
        </div>
      </div>

      {/* AI Analysis Summary */}
      <div className="card bg-gradient-to-r from-gray-800 to-gray-900 border-primary-blue/30">
        <div className="flex items-start">
          <div className="p-2 bg-primary-blue rounded-lg mr-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-light mb-2">AI-Generated Security Report</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Key Findings:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• {stats?.threatsFound.toLocaleString()} threats detected with 99.7% accuracy</li>
                  <li>• 15% increase in after-hours access attempts detected</li>
                  <li>• Zero critical vulnerabilities in the past {reportPeriod}</li>
                  <li>• Behavioral analysis shows normal user patterns</li>
                  <li>• All malware instances successfully quarantined</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Recommendations:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Maintain current security monitoring protocols</li>
                  <li>• Consider additional training for high-risk users</li>
                  <li>• Enable enhanced real-time scanning for critical assets</li>
                  <li>• Schedule quarterly security policy reviews</li>
                  <li>• Monitor geographic login patterns more closely</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskReports;