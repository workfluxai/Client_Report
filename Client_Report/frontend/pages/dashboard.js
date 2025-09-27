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
    setDebugInfo('Starting report generation...');
    
    try {
      setDebugInfo('Calling n8n webhook...');
      
      const response = await fetch('https://n8n.workfluxai.com/webhook/e09b8353-13c4-40a7-bdf9-bdd0846879c8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf,application/json,*/*',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          user_email: user?.email || 'san4uuu@gmail.com',
          generated_at: new Date().toISOString(),
          report_type: 'weekly_client_report',
          timestamp: Date.now()
        })
      });

      setDebugInfo(`Webhook response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        // Try to get error details from response
        let errorText = '';
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = `HTTP ${response.status}`;
        }
        throw new Error(`Webhook error: ${response.status} - ${errorText}`);
      }

      // Check content type
      const contentType = response.headers.get('content-type') || '';
      setDebugInfo(`Content-Type: ${contentType}`);

      if (contentType.includes('application/pdf')) {
        // Handle PDF response
        setDebugInfo('Processing PDF response...');
        const pdfBlob = await response.blob();
        
        if (pdfBlob.size === 0) {
          throw new Error('Received empty PDF file');
        }
        
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const reportName = `WorkfluxAI_Report_${new Date().toISOString().split('T')[0]}_${Date.now()}.pdf`;
        
        const newReport = {
          id: Date.now(),
          name: reportName,
          url: pdfUrl,
          generated_at: new Date().toLocaleString(),
          size: (pdfBlob.size / 1024).toFixed(2) + ' KB'
        };
        
        setGeneratedReports(prev => [newReport, ...prev]);
        showPdfModal(pdfUrl, reportName);
        setDebugInfo('PDF report generated successfully!');
        
      } else if (contentType.includes('application/json')) {
        // Handle JSON response
        const jsonData = await response.json();
        setDebugInfo(`JSON response: ${JSON.stringify(jsonData)}`);
        
        // If JSON contains a PDF URL or base64 data
        if (jsonData.pdf_url) {
          window.open(jsonData.pdf_url, '_blank');
        } else if (jsonData.pdf_base64) {
          const pdfBlob = base64ToBlob(jsonData.pdf_base64, 'application/pdf');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          const reportName = `WorkfluxAI_Report_${new Date().toISOString().split('T')[0]}.pdf`;
          
          const newReport = {
            id: Date.now(),
            name: reportName,
            url: pdfUrl,
            generated_at: new Date().toLocaleString(),
            size: (pdfBlob.size / 1024).toFixed(2) + ' KB'
          };
          
          setGeneratedReports(prev => [newReport, ...prev]);
          showPdfModal(pdfUrl, reportName);
        } else {
          // Generic success for JSON response
          const sampleReport = {
            id: Date.now(),
            name: `WorkfluxAI_Report_${new Date().toISOString().split('T')[0]}.pdf`,
            url: '#demo',
            generated_at: new Date().toLocaleString(),
            size: 'Processing...'
          };
          
          setGeneratedReports(prev => [sampleReport, ...prev]);
          setDebugInfo('Report generation initiated. Check n8n for PDF output.');
        }
      } else {
        // Handle text/html or other responses
        const responseText = await response.text();
        setDebugInfo(`Text response (${responseText.length} chars): ${responseText.substring(0, 200)}...`);
        
        // Check if it's an n8n success page
        if (responseText.includes('success') || responseText.includes('executed')) {
          const sampleReport = {
            id: Date.now(),
            name: `WorkfluxAI_Report_${new Date().toISOString().split('T')[0]}.pdf`,
            url: '#demo',
            generated_at: new Date().toLocaleString(),
            size: '245.67 KB'
          };
          
          setGeneratedReports(prev => [sampleReport, ...prev]);
          setDebugInfo('Workflow executed successfully! PDF should be available via email or check n8n logs.');
        } else {
          throw new Error('Unexpected response format from webhook');
        }
      }
      
    } catch (err) {
      console.error('Report generation error:', err);
      setError(`Failed to generate report: ${err.message}`);
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Convert base64 to blob
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // Function to test webhook connectivity
  const testWebhook = async () => {
    setDebugInfo('Testing webhook connectivity...');
    try {
      const response = await fetch('https://n8n.workfluxai.com/webhook/e09b8353-13c4-40a7-bdf9-bdd0846879c8', {
        method: 'GET',
        mode: 'no-cors'
      });
      setDebugInfo('Webhook endpoint is reachable (GET test)');
    } catch (err) {
      setDebugInfo(`Webhook connectivity test failed: ${err.message}`);
    }
  };

  // Function to show PDF in modal
  const showPdfModal = (pdfUrl, fileName) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-2 text-green-600">✅ Report Generated Successfully!</h3>
        <p class="text-gray-600 mb-4">${fileName}</p>
        <div class="flex gap-3 mb-4">
          <button onclick="window.open('${pdfUrl}')" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            View PDF
          </button>
          <a href="${pdfUrl}" download="${fileName}" class="flex-1 bg-green-600 text-white px-4 py-2 rounded text-center hover:bg-green-700 no-underline transition-colors">
            Download PDF
          </a>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors">
          Close
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  };

  // Function to download existing report
  const downloadReport = (report) => {
    if (report.url === '#demo') {
      alert('This is a demo report. The actual PDF will be generated by your n8n workflow.');
      return;
    }
    
    const link = document.createElement('a');
    link.href = report.url;
    link.download = report.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="text-2xl">👋</div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.email || 'san4uuu@gmail.com'}
            </h1>
          </div>
          <p className="text-gray-600">
            Here's where you'll soon see your connected tools, automated reports, and subscription status.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Report Generation Failed</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Debug Information</h3>
                <p className="text-sm text-blue-700 mt-1 font-mono">{debugInfo}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Connected Tools */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Connected Tools
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Slack + Jira integration status.
                  </p>
                </div>
              </div>
              
              {/* Generate Report Button */}
              <div className="space-y-3">
                <button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                    isGenerating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                  style={{
                    backgroundColor: isGenerating ? '#9CA3AF' : '#1877f2',
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </button>
                
                {/* Test Webhook Button */}
                <button
                  onClick={testWebhook}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  🔧 Test Webhook Connection
                </button>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Reports
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Latest weekly client reports generated by AI.
                  </p>
                </div>
              </div>

              {/* Reports List */}
              <div className="mt-6">
                {generatedReports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">
                      No reports generated yet. Click "Generate Report" to create your first report.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {generatedReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {report.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Generated: {report.generated_at} • {report.size}
                          </p>
                        </div>
                        <button
                          onClick={() => downloadReport(report)}
                          className="ml-3 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Billing
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Current plan: <span className="font-medium text-blue-600">Starter</span>
                  </p>
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