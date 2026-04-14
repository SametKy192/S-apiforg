import { useState, useEffect } from 'react';
import MockForm from '../components/MockForm';
import { getAllMocks, deleteMock } from '../services/mockService';
import api from '../services/api';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';

const MockPage = () => {
  const { language } = useSettingsStore();
  const t = translations[language].mock;
  const common = translations[language].common;

  const [mocks, setMocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [testResults, setTestResults] = useState({});

  const fetchMocks = async () => {
    setIsLoading(true);
    try {
      const data = await getAllMocks();
      setMocks(data);
    } catch (err) {
      console.error('Failed to fetch mocks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMocks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(common.delete + '?')) return;
    try {
      await deleteMock(id);
      setMocks(mocks.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete mock:', err);
    }
  };

  const handleTest = async (mock) => {
    setTestResults((prev) => ({ ...prev, [mock.id]: { loading: true } }));
    try {
      const response = await api.post('/Request/send', {
        url: `http://localhost:5089/api/Mock/serve${mock.path}`,
        method: mock.method,
        headers: '',
        body: '',
      });
      setTestResults((prev) => ({
        ...prev,
        [mock.id]: {
          loading: false,
          status: response.data.statusCode,
          body: response.data.body,
        },
      }));
    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        [mock.id]: {
          loading: false,
          error: 'Test Failed.',
        },
      }));
    }
  };

  return (
    <div className="flex flex-col gap-12 p-8 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight uppercase">
            {t.title}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">{t.subtitle}</p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-blue-500/25"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-wider">{t.new}</span>
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-8 rounded-[2rem] border-white/10 animate-in slide-in-from-top-4 duration-300">
             <MockForm
                onSuccess={() => {
                   setShowForm(false);
                   fetchMocks();
                }}
             />
        </div>
      )}

      {/* Grid Content */}
      {isLoading ? (
        <div className="flex flex-col items-center py-32">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-[0.2em] mt-6">{common.loading}</p>
        </div>
      ) : mocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 glass-card rounded-[3rem] border-dashed border-white/5 opacity-50">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600">
               <path d="M12 2v20M2 12h20"/>
            </svg>
          </div>
          <p className="text-slate-400 font-medium text-lg">{t.noMocks}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {mocks.map((mock) => (
            <div
              key={mock.id}
              className="group glass-card hover:bg-white/5 rounded-[2rem] p-6 border-white/5 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${
                    mock.method === 'GET' ? 'bg-emerald-500/10 text-emerald-400' :
                    mock.method === 'POST' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {mock.method}
                  </div>
                  <span className="text-white font-mono text-sm tracking-tight">/api/mock/serve{mock.path}</span>
                  <div className="px-3 py-1 bg-slate-800/50 text-slate-400 text-[10px] font-bold rounded-lg border border-white/5">
                    {mock.statusCode}
                  </div>
                  {!mock.isActive && (
                    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[9px] font-black uppercase tracking-widest rounded-md">
                      {t.passive}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTest(mock)}
                    disabled={!mock.isActive || testResults[mock.id]?.loading}
                    className="btn-ghost px-4 py-2 text-emerald-400 hover:text-emerald-300 disabled:opacity-40"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                       {testResults[mock.id]?.loading ? t.testing : t.test}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(mock.id)}
                    className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                       <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>

              {testResults[mock.id] && !testResults[mock.id].loading && (
                <div className={`p-4 rounded-2xl border text-xs font-mono animate-in slide-in-from-top-2 duration-300 ${
                  testResults[mock.id].error
                    ? 'bg-rose-900/10 border-rose-500/20 text-rose-400'
                    : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                }`}>
                  {testResults[mock.id].error ? (
                    testResults[mock.id].error
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Response Body</span>
                      </div>
                      <pre className="whitespace-pre-wrap break-words leading-relaxed pl-3 border-l border-emerald-500/20">
                        {testResults[mock.id].body}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default MockPage;