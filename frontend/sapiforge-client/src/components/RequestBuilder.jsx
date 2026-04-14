import { useState, useEffect } from 'react';
import useRequestStore from '../store/requestStore';
import { getAllEnvironments, updateEnvironment } from '../services/environmentService';
import CodeSnippetModal from './CodeSnippetModal';
import { executeScript } from '../services/scriptService';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';

const METHODS = [
  { value: 'GET', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { value: 'POST', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { value: 'PUT', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { value: 'DELETE', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { value: 'PATCH', color: 'text-violet-400', bg: 'bg-violet-500/10' },
];

const RequestBuilder = ({ onSend, isLoading, initialData }) => {
  const { setActiveEnvironment, activeEnvironment, setCurrentRequest } = useRequestStore();
  const { language } = useSettingsStore();
  const common = translations[language].common;

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

    if (preRequestScript && activeEnvironment) {
        currentEnv = executeScript(preRequestScript, { environment: currentEnv });
        if (JSON.stringify(currentEnv) !== JSON.stringify(activeEnvVars)) {
            await handleEnvChange(activeEnvironment.id, currentEnv);
        }
    }

    const substitutedUrl = replaceVariables(url, currentEnv);
    const substitutedHeaders = replaceVariables(headers, currentEnv);
    const substitutedBody = replaceVariables(body, currentEnv);

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
  const t = translations[language].request;

  return (
    <div className="glass-card rounded-[2rem] p-6 lg:p-8 flex flex-col gap-8">
      {/* Search & Action Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex gap-3 p-1.5 glass-item rounded-2xl items-center focus-within:ring-2 ring-blue-500/20 transition-all">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`w-28 pl-4 pr-2 py-2 bg-transparent border-none rounded-xl text-xs font-bold tracking-widest focus:ring-0 cursor-pointer ${selectedMethod.color}`}
          >
            {METHODS.map((m) => (
              <option key={m.value} value={m.value} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">
                {m.value}
              </option>
            ))}
          </select>

          <div className="w-px h-6 bg-[var(--border-glass)]"></div>

          <input
            type="text"
            placeholder={t.urlPlaceholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent border-none text-[var(--text-primary)] text-sm font-mono placeholder-[var(--text-secondary)] focus:ring-0 ml-2"
          />

          <div className="hidden lg:flex items-center gap-2 pr-2">
            <div className="relative group">
              <div className="flex items-center gap-2 px-3 py-2 glass-item rounded-xl cursor-pointer">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <select
                  value={activeEnvironment?.id || ''}
                  onChange={(e) => handleEnvChange(e.target.value)}
                  className="bg-transparent text-[10px] font-bold text-[var(--text-secondary)] border-none p-0 focus:ring-0 uppercase tracking-wider"
                >
                  <option value="" className="bg-[var(--bg-sidebar)]">NO ENV</option>
                  {environments.map((env) => (
                    <option key={env.id} value={env.id} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">
                      {env.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {activeEnvVars && Object.keys(activeEnvVars).length > 0 && (
                <div className="absolute top-full mt-3 right-0 z-20 w-64 glass-card p-4 rounded-2xl invisible group-hover:visible animate-in fade-in slide-in-from-top-2 duration-200">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Live Variables</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {Object.entries(activeEnvVars).map(([key, value]) => (
                      <div key={key} className="p-2 glass-item rounded-lg">
                        <div className="text-[10px] text-blue-400 font-mono mb-1">{`{{${key}}}`}</div>
                        <div className="text-[10px] text-slate-400 truncate">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="btn-ghost flex items-center gap-2 px-5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">Code</span>
          </button>

          <button
            onClick={handleSend}
            disabled={isLoading || !url}
            className="btn-primary min-w-[120px] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider">{common.send}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Configuration Tabs */}
      <div className="flex flex-col gap-6">
        <div className="flex gap-1.5 p-1 glass-item rounded-2xl self-start">
          {['headers', 'body', 'scripts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t[tab]}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="glass-item rounded-3xl p-4 min-h-[220px] flex flex-col focus-within:ring-1 ring-white/10 transition-all">
          {activeTab === 'headers' && (
            <textarea
              placeholder={'{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'}
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              className="flex-1 bg-transparent border-none text-[var(--text-primary)] text-xs font-mono placeholder-[var(--text-secondary)] resize-none focus:ring-0 leading-relaxed"
            />
          )}
          {activeTab === 'body' && (
            <textarea
              placeholder={'{\n  "key": "value"\n}'}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="flex-1 bg-transparent border-none text-[var(--text-primary)] text-xs font-mono placeholder-[var(--text-secondary)] resize-none focus:ring-0 leading-relaxed"
            />
          )}
          {activeTab === 'scripts' && (
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex gap-2">
                <button 
                  onClick={() => setScriptTab('pre')}
                  className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg transition-all ${scriptTab === 'pre' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500'}`}
                >
                  {t.preRequest}
                </button>
                <button 
                  onClick={() => setScriptTab('test')}
                  className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg transition-all ${scriptTab === 'test' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500'}`}
                >
                  {t.postTests}
                </button>
              </div>
              <textarea
                placeholder={scriptTab === 'pre' ? '// pm.environment.set("key", "value");' : '// const data = pm.response.json();'}
                value={scriptTab === 'pre' ? preRequestScript : testScript}
                onChange={(e) => scriptTab === 'pre' ? setPreRequestScript(e.target.value) : setTestScript(e.target.value)}
                className={`flex-1 bg-transparent border-none text-xs font-mono resize-none focus:ring-0 leading-relaxed ${scriptTab === 'pre' ? 'text-blue-300' : 'text-indigo-300'}`}
              />
            </div>
          )}
        </div>
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