import { useState, useEffect } from 'react';
import { getAllMocks } from '../services/mockService';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';

const DocsPage = () => {
  const { language } = useSettingsStore();
  const t = translations[language].docs;
  const common = translations[language].common;

  const [mocks, setMocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMocks = async () => {
      setIsLoading(true);
      try {
        const data = await getAllMocks();
        setMocks(data || []);
      } catch (err) {
        console.error('Mocks getirilemedi:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMocks();
  }, []);

  return (
    <div className="flex flex-col gap-10 p-8 lg:p-12 max-w-5xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="border-b border-[var(--border-glass)] pb-10">
        <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight uppercase">
            {t.title}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">{t.subtitle}</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-20">
           <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
           <p className="mt-4 text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest">{common.loading}</p>
        </div>
      ) : mocks.length === 0 ? (
        <div className="p-16 text-center glass-card rounded-[2.5rem] border-dashed border-white/5 opacity-50">
          <p className="text-[var(--text-secondary)] font-medium italic">{t.noEndpoints}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          {mocks.filter(m => m.isActive).map((mock) => (
            <div key={mock.id} className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1.5 text-[10px] font-black rounded-xl border uppercase tracking-widest ${
                  mock.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                  mock.method === 'POST' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                  'bg-orange-500/10 text-orange-500 border-orange-500/20'
                }`}>
                  {mock.method}
                </span>
                <code className="text-xl text-[var(--text-primary)] font-mono font-bold tracking-tight">
                  /api/mock/serve{mock.path}
                </code>
              </div>

              <div className="glass-card rounded-3xl border-[var(--border-glass)] overflow-hidden">
                <div className="px-5 py-3 bg-black/10 dark:bg-white/5 border-b border-[var(--border-glass)] text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                  {t.exampleResponse}
                </div>
                <div className="p-6 bg-transparent overflow-x-auto">
                  <pre className="text-sm font-mono text-blue-400 whitespace-pre custom-scrollbar">
                    {mock.responseBody || '{}'}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 glass-card rounded-2xl border-[var(--border-glass)]">
                  <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-1 opacity-50">{t.statusCode}</span>
                  <span className="text-[var(--text-primary)] font-bold text-lg">{mock.statusCode}</span>
                </div>
                <div className="p-5 glass-card rounded-2xl border-[var(--border-glass)]">
                  <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-1 opacity-50">{t.responseType}</span>
                  <span className="text-[var(--text-primary)] font-bold text-lg">application/json</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocsPage;
