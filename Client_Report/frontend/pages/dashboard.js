import React, { useState } from 'react';
import { AlertCircle, Users, FileText, CreditCard, Download, Play, Loader2, CheckCircle } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  // Function to generate report by calling n8n webhook
  const generateReport = async () => {
    setIsGenerating(true);
    setError('');
    setDebugInfo('');

    try {
      // First try the real webhook
      const webhookUrl = 'https://n8n.workfluxai.com/webhook/e09b8353-13c4-40a7-bdf9-bdd0846879c8';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user.email,
          timestamp: new Date().toISOString(),
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add to reports list
        setGeneratedReports(prev => [...prev, {
          id: Date.now(),
          name: `Weekly Report - ${new Date().toLocaleDateString()}`,
          url: result.reportUrl || '#',
          generatedAt: new Date().toLocaleString()
        }]);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (e) {
      setError('Failed to generate report: ' + e.message);
      setDebugInfo(`Error: ${e.message}`);
      
      // Fallback: Add sample report
      setGeneratedReports(prev => [...prev, {
        id: Date.now(),
        name: `Sample Weekly Report - ${new Date().toLocaleDateString()}`,
        url: '/Sample16.pdf',
        generatedAt: new Date().toLocaleString()
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Test webhook connection
  const testConnection = async () => {
    try {
      const testUrl = 'https://n8n.workfluxai.com/webhook-test/e09b8353-13c4-40a7-bdf9-bdd0846879c8';
      const response = await fetch(testUrl);
      
      if (response.ok) {
        setDebugInfo('✓ Webhook connection successful');
      } else {
        setDebugInfo('⚠ Webhook test failed - Status: ' + response.status);
      }
    } catch (e) {
      setDebugInfo('✗ Connection failed: ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">👋</span>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.email}
            </h1>
          </div>
          <p className="text-gray-600">
            Here's where you'll soon see your connected tools, automated reports, and subscription status.
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Report Generation Failed</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {debugInfo && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Debug Information</h3>
                <p className="mt-1 text-sm text-blue-700">{debugInfo}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Actions */}
          <div className="lg:col-span-2">
            {/* Connected Tools */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">Connected Tools</h2>
              </div>
              <p className="text-gray-600 mb-4">Slack + Jira integration status.</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Slack Integration</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Jira Integration</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </button>

                <button
                  onClick={testConnection}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
                >
                  Test Webhook Connection
                </button>

                <a
                  href="/api"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                >
                  Go to API Page
                </a>
              </div>
            </div>

            {/* Reports Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
              </div>
              <p className="text-gray-600 mb-4">Latest weekly client reports generated by AI.</p>

              {generatedReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-2">No reports generated yet</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Click "Generate Report" to create your first report.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{report.name}</p>
                          <p className="text-xs text-gray-500">Generated on {report.generatedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={report.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download PDF
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Billing & Status */}
          <div className="space-y-6">
            {/* Billing */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">Billing</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current plan:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Starter
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next billing:</span>
                  <span className="text-sm font-medium text-gray-900">Oct 27, 2025</span>
                </div>
              </div>
              <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
                Manage Subscription
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Reports this month</span>
                    <span className="text-sm font-medium text-gray-900">{generatedReports.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((generatedReports.length / 10) * 100, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Limit: 10 reports/month</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">API Calls</span>
                    <span className="text-sm font-medium text-gray-900">247</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '24.7%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Limit: 1,000 calls/month</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Storage Used</span>
                    <span className="text-sm font-medium text-gray-900">1.2 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Limit: 5 GB</p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <span className="inline-flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">N8N Workflows</span>
                  <span className="inline-flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Running</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="inline-flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Connected</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-900">2 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;