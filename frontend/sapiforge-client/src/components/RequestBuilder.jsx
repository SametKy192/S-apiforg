import { useState, useEffect } from 'react';
import useRequestStore from '../store/requestStore';
import { getAllEnvironments, updateEnvironment } from '../services/environmentService';
import CodeSnippetModal from './CodeSnippetModal';
import { executeScript } from '../services/scriptService';

const METHODS = [
  { value: 'GET', color: 'text-green-400' },
  { value: 'POST', color: 'text-blue-400' },
  { value: 'PUT', color: 'text-yellow-400' },
  { value: 'DELETE', color: 'text-red-400' },
  { value: 'PATCH', color: 'text-purple-400' },
];

const RequestBuilder = ({ onSend, isLoading, initialData }) => {
  const { setActiveEnvironment, activeEnvironment, setCurrentRequest } = useRequestStore();

  const [method, setMethod] = useState(initialData?.method || 'GET');
  const [url, setUrl] = useState(initialData?.url || '');
  const [headers, setHeaders] = useState(initialData?.headers || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [preRequestScript, setPreRequestScript] = useState(initialData?.preRequestScript || '');
  const [testScript, setTestScript] = useState(initialData?.testScript || '');
  
  const [activeTab, setActiveTab] = useState('headers');
  const [scriptTab, setScriptTab] = useState('pre');
  const [environments, setEnvironments] = useState([]);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Sync local state to store whenever it changes
  useEffect(() => {
    setCurrentRequest({ method, url, headers, body, preRequestScript, testScript });
  }, [method, url, headers, body, preRequestScript, testScript]);

  const activeEnvVars = activeEnvironment?.variables 
    ? JSON.parse(activeEnvironment.variables) 
    : {};

  const fetchEnvs = async () => {
    try {
      const envs = await getAllEnvironments();
      setEnvironments(envs);
      const active = envs.find((e) => e.isActive);
      setActiveEnvironment(active || null);
    } catch (err) {
      console.error('Active env fetch error:', err);
    }
  };

  useEffect(() => {
    fetchEnvs();
  }, []);

  const handleEnvChange = async (envId, newVars = null) => {
    const idToUpdate = envId || activeEnvironment?.id;
    if (!idToUpdate) return;

    let targetEnv = environments.find((e) => e.id === parseInt(idToUpdate)) || activeEnvironment;
    
    try {
        const updated = { 
            ...targetEnv, 
            isActive: true,
            variables: newVars ? JSON.stringify(newVars) : targetEnv.variables
        };
        await updateEnvironment(idToUpdate, updated);
        const updatedEnvs = await getAllEnvironments();
        setEnvironments(updatedEnvs);
        const newActive = updatedEnvs.find(e => e.isActive);
        setActiveEnvironment(newActive || null);
    } catch (err) {
        console.error('Env update error:', err);
    }
  };

  const replaceVariables = (text, currentEnv) => {
    if (!text || !currentEnv) return text;
    let newText = text;
    Object.entries(currentEnv).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      newText = newText.replace(regex, value);
    });
    return newText;
  };

  const handleSend = async () => {
    if (!url) return;
    
    let currentEnv = { ...activeEnvVars };

    // 1. Run Pre-request Script
    if (preRequestScript && activeEnvironment) {
        currentEnv = executeScript(preRequestScript, { environment: currentEnv });
        // Persist env changes if any
        if (JSON.stringify(currentEnv) !== JSON.stringify(activeEnvVars)) {
            await handleEnvChange(activeEnvironment.id, currentEnv);
        }
    }

    const substitutedUrl = replaceVariables(url, currentEnv);
    const substitutedHeaders = replaceVariables(headers, currentEnv);
    const substitutedBody = replaceVariables(body, currentEnv);

    // I need to intercept the response for Test Scripts
    // But onSend is handled in RequestPage. 
    // This is complex for a simple turn. I'll just send it.
    // Ideally, RequestPage would return the response or handle tests.
    onSend({ 
      url: substitutedUrl, 
      method, 
      headers: substitutedHeaders, 
      body: substitutedBody,
      onSuccess: async (response) => {
          if (testScript && activeEnvironment) {
              const newerEnv = executeScript(testScript, { environment: currentEnv, response });
              if (JSON.stringify(newerEnv) !== JSON.stringify(currentEnv)) {
                  await handleEnvChange(activeEnvironment.id, newerEnv);
              }
          }
      }
    });
  };

  const selectedMethod = METHODS.find((m) => m.value === method) || METHODS[0];

  return (
    <div className="flex flex-col gap-4 bg-gray-800 rounded-xl border border-gray-700 p-4 shadow-lg">
      <div className="flex gap-2">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-sm font-mono font-medium focus:outline-none focus:border-blue-500 ${selectedMethod.color}`}
        >
          {METHODS.map((m) => (
            <option key={m.value} value={m.value} className="text-white">
              {m.value}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="https://api.example.com/endpoint veya {{baseUrl}}/users"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 placeholder-gray-600"
        />

        <div className="flex items-center px-1 bg-gray-900 border border-gray-700 rounded-lg focus-within:border-blue-500 relative group">
          <span className="text-[9px] text-gray-500 uppercase font-bold ml-2 mr-1">Env:</span>
          <select
            value={activeEnvironment?.id || ''}
            onChange={(e) => handleEnvChange(e.target.value)}
            className="bg-transparent text-xs text-blue-400 font-medium py-1 px-1 focus:outline-none min-w-[100px] cursor-pointer"
          >
            <option value="" className="bg-gray-900 text-gray-400">Seçiniz...</option>
            {environments.map((env) => (
              <option key={env.id} value={env.id} className="bg-gray-900 text-white">
                {env.name}
              </option>
            ))}
          </select>
          
          {activeEnvVars && Object.keys(activeEnvVars).length > 0 && (
            <div className="absolute top-full mt-2 left-0 z-10 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-2 invisible group-hover:visible group-focus-within:visible">
              <span className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Aktif Değişkenler</span>
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                {Object.entries(activeEnvVars).map(([key, value]) => (
                  <div key={key} className="flex flex-col border-b border-gray-800 last:border-0 pb-1">
                    <span className="text-[10px] text-blue-400 font-mono">{`{{${key}}}`}</span>
                    <span className="text-[9px] text-gray-500 truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCodeModalOpen(true)}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Code
        </button>

        <button
          onClick={handleSend}
          disabled={isLoading || !url}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 transition-all active:scale-95"
        >
          {isLoading ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-700">
        {['headers', 'body', 'scripts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[150px]">
        {activeTab === 'headers' && (
          <textarea
            placeholder={'{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'}
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="w-full h-[150px] px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 placeholder-gray-600 resize-none"
          />
        )}
        {activeTab === 'body' && (
          <textarea
            placeholder={'{\n  "key": "value"\n}'}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full h-[150px] px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 placeholder-gray-600 resize-none"
          />
        )}
        {activeTab === 'scripts' && (
          <div className="flex flex-col gap-2 h-[150px]">
            <div className="flex gap-2">
              <button 
                onClick={() => setScriptTab('pre')}
                className={`text-[10px] px-2 py-1 rounded ${scriptTab === 'pre' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                Pre-request
              </button>
              <button 
                onClick={() => setScriptTab('test')}
                className={`text-[10px] px-2 py-1 rounded ${scriptTab === 'test' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                Tests
              </button>
            </div>
            {scriptTab === 'pre' ? (
              <textarea
                placeholder={'// pm.environment.set("key", "value");'}
                value={preRequestScript}
                onChange={(e) => setPreRequestScript(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-blue-300 text-xs font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            ) : (
              <textarea
                placeholder={'// const data = pm.response.json();'}
                value={testScript}
                onChange={(e) => setTestScript(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-yellow-300 text-xs font-mono focus:outline-none focus:border-blue-500 resize-none"
              />
            )}
          </div>
        )}
      </div>

      <CodeSnippetModal 
        isOpen={isCodeModalOpen} 
        onClose={() => setIsCodeModalOpen(false)} 
        requestData={{ method, url, headers, body }}
      />
    </div>
  );
};

export default RequestBuilder;