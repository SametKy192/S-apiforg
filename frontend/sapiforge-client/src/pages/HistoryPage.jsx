import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteRequest } from '../services/requestService';
import useRequestStore from '../store/requestStore';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { loadRequest } = useRequestStore();
  const { language } = useSettingsStore();
  const t = translations[language].history;
  const common = translations[language].common;

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getHistory();
      setHistory(data || []);
    } catch (err) {
      console.error('Geçmiş getirilemedi:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(common.delete + '?')) return;
    try {
      await deleteRequest(id);
      setHistory(history.filter((r) => r.id !== id));
    } catch (err) {
      console.error('İstek silinemedi:', err);
    }
  };

  const handleReuse = (request) => {
    loadRequest(request);
    navigate('/request');
  };

  const filteredHistory = history.filter((request) => {
    const matchesSearch = request.url.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === 'ALL' || request.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const getMethodStyle = (method) => {
    switch (method) {
      case 'GET': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'POST': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PUT': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'DELETE': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'PATCH': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-10 p-8 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight uppercase">
            {t.title}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">{t.subtitle}</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:min-w-[300px]">
             <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-5 py-3 glass-item rounded-2xl text-[var(--text-primary)] text-xs font-bold focus:ring-2 ring-blue-500/10 border-none outline-none placeholder-[var(--text-secondary)]/30"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]/50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-3 glass-item rounded-2xl text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest focus:ring-2 ring-blue-500/10 border-none outline-none cursor-pointer appearance-none pr-10"
          >
            <option value="ALL">{t.allMethods}</option>
            {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
                <option key={m} value={m} className="bg-[var(--bg-main)]">{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="flex flex-col gap-4">
        {!isLoading && (
          <div className="flex items-center gap-2 mb-2 ml-2">
             <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
             <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em]">
                {t.showing} {filteredHistory.length} {t.requests}
             </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest">{common.loading}</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] py-32 flex flex-col items-center justify-center border-dashed border-white/5 opacity-50">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/>
                </svg>
             </div>
             <p className="text-[var(--text-primary)] font-bold text-lg">{history.length === 0 ? t.noHistory : t.noResults}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredHistory.map((request) => (
              <div
                key={request.id}
                className="group glass-card hover:bg-[var(--border-glass)] rounded-3xl p-5 border-[var(--border-glass)] transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-6 overflow-hidden">
                   <div className={`px-3 py-1.5 rounded-xl border text-[10px] font-black font-mono w-20 text-center ${getMethodStyle(request.method)}`}>
                      {request.method}
                   </div>
                   <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[var(--text-primary)] font-mono text-sm font-bold truncate max-w-xl">
                          {request.url}
                        </span>
                        {request.response && (
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded-lg ${
                            request.response.statusCode < 400
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {request.response.statusCode}
                          </span>
                        )}
                      </div>
                      <span className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest opacity-40">
                         {new Date(request.createdAt).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}
                      </span>
                   </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleReuse(request)}
                    className="p-3 text-blue-400 hover:bg-blue-400/10 rounded-2xl transition-all"
                    title={t.reuse}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                       <path d="m21 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="p-3 text-rose-400 hover:bg-rose-400/10 rounded-2xl transition-all"
                    title={t.delete}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                       <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;