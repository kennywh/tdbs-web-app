'use client';

import { useState, useEffect } from 'react';

export default function NetworkTest() {
  const [apiResults, setApiResults] = useState({});
  const [loading, setLoading] = useState({});
  const [customUrl, setCustomUrl] = useState('');
  const [customResult, setCustomResult] = useState(null);

  // Test APIs
  const testApis = [
    {
      name: 'JSONPlaceholder Posts',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      description: 'Test JSON API with sample post data'
    },
    {
      name: 'Random User API',
      url: 'https://randomuser.me/api/',
      description: 'Generate random user profile data'
    },
    {
      name: 'Cat Facts API',
      url: 'https://catfact.ninja/fact',
      description: 'Get random cat facts'
    },
    {
      name: 'IP Address API',
      url: 'https://api.ipify.org?format=json',
      description: 'Get current public IP address'
    },
    {
      name: 'Time API',
      url: 'https://worldtimeapi.org/api/timezone/UTC',
      description: 'Get current UTC time'
    }
  ];

  const fetchApi = async (apiName, url) => {
    setLoading(prev => ({ ...prev, [apiName]: true }));
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      setApiResults(prev => ({
        ...prev,
        [apiName]: {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          status: response.status
        }
      }));
    } catch (error) {
      setApiResults(prev => ({
        ...prev,
        [apiName]: {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [apiName]: false }));
    }
  };

  const testCustomUrl = async () => {
    if (!customUrl) return;
    
    setLoading(prev => ({ ...prev, custom: true }));
    
    try {
      const response = await fetch(customUrl);
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      setCustomResult({
        success: true,
        data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setCustomResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(prev => ({ ...prev, custom: false }));
    }
  };

  const performNetworkTests = async () => {
    // Test all APIs simultaneously
    const promises = testApis.map(api => fetchApi(api.name, api.url));
    await Promise.all(promises);
  };

  const formatJsonDisplay = (data) => {
    if (typeof data === 'string') return data;
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-green-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Network Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Testing external API connections and network functionality
          </p>
          
          <button
            onClick={performNetworkTests}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Run All Network Tests
          </button>
        </header>

        {/* Custom URL Test */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Custom URL Test
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Enter any API URL to test..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={testCustomUrl}
              disabled={!customUrl || loading.custom}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading.custom ? 'Testing...' : 'Test URL'}
            </button>
          </div>

          {customResult && (
            <div className="mt-4">
              <div className={`p-4 rounded-lg border ${
                customResult.success 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-medium ${
                    customResult.success ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                  }`}>
                    {customResult.success ? '✅ Success' : '❌ Error'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(customResult.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {customResult.success && (
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Status: {customResult.status}
                  </div>
                )}
                
                <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-64">
                  {customResult.success 
                    ? formatJsonDisplay(customResult.data)
                    : customResult.error
                  }
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* API Tests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testApis.map((api) => (
            <div key={api.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                {api.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {api.description}
              </p>
              
              <button
                onClick={() => fetchApi(api.name, api.url)}
                disabled={loading[api.name]}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors mb-4"
              >
                {loading[api.name] ? 'Loading...' : 'Test API'}
              </button>

              {apiResults[api.name] && (
                <div className={`p-3 rounded-lg border text-sm ${
                  apiResults[api.name].success 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${
                      apiResults[api.name].success 
                        ? 'text-green-800 dark:text-green-300' 
                        : 'text-red-800 dark:text-red-300'
                    }`}>
                      {apiResults[api.name].success ? '✅' : '❌'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(apiResults[api.name].timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {apiResults[api.name].success && (
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                      Status: {apiResults[api.name].status}
                    </div>
                  )}
                  
                  <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto max-h-32">
                    {apiResults[api.name].success 
                      ? formatJsonDisplay(apiResults[api.name].data)
                      : apiResults[api.name].error
                    }
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Network Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Network Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-gray-700 dark:text-gray-300">User Agent:</strong>
              <div className="text-gray-600 dark:text-gray-400 mt-1 break-all">
                {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}
              </div>
            </div>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Online Status:</strong>
              <div className="text-gray-600 dark:text-gray-400 mt-1">
                {typeof window !== 'undefined' ? (navigator.onLine ? '🟢 Online' : '🔴 Offline') : 'N/A'}
              </div>
            </div>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Connection:</strong>
              <div className="text-gray-600 dark:text-gray-400 mt-1">
                {typeof window !== 'undefined' && navigator.connection 
                  ? `${navigator.connection.effectiveType} (${navigator.connection.downlink} Mbps)`
                  : 'Connection info not available'
                }
              </div>
            </div>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Language:</strong>
              <div className="text-gray-600 dark:text-gray-400 mt-1">
                {typeof window !== 'undefined' ? navigator.language : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <a
            href="/"
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Home
          </a>
          <a
            href="/test1"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Test Page 1
          </a>
          <a
            href="/test2"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Test Page 2
          </a>
        </div>
      </div>
    </div>
  );
} 