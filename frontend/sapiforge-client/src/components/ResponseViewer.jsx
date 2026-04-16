import React, { useState, useEffect } from 'react';
import { getAllCollections, addItemToCollection } from '../services/collectionService';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';

const ResponseViewer = ({ response, requestId }) => {
  const { language } = useSettingsStore();
  const common = translations[language].common;
  
  const [copied, setCopied] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [saved, setSaved] = useState(false);
  const [showCollectionPanel, setShowCollectionPanel] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getAllCollections();
        setCollections(data);
        if (data.length > 0) setSelectedCollection(data[0].id);
      } catch (err) {
        console.error('Koleksiyonlar getirilemedi:', err);
      }
    };
    fetchCollections();
  }, []);

  const [viewMode, setViewMode] = useState('pretty'); // 'pretty' or 'raw'

  const getStatusColor = (status) => {
    if (status < 300) return 'text-emerald-400 bg-emerald-500/10 shadow-emerald-500/20';
    if (status < 400) return 'text-amber-400 bg-amber-500/10 shadow-amber-500/20';
    if (status < 500) return 'text-rose-400 bg-rose-500/10 shadow-rose-500/20';
    return 'text-red-400 bg-red-900/20 border-red-500/30 shadow-red-500/20';
  };

  const formatBody = (body, mode) => {
    if (mode === 'raw') return body;
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatBody(response.body, viewMode));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToCollection = async () => {
    if (!selectedCollection || !requestId) return;
    try {
      await addItemToCollection(selectedCollection, requestId);
      setSaved(true);
      setShowCollectionPanel(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Koleksiyona eklenemedi:', err);
    }
  };

  return (
    <div className="glass-card rounded-[2rem] p-6 lg:p-8 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Response Metadata Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-black font-mono shadow-lg ${getStatusColor(response.statusCode)}`}>
            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
            {response.statusCode}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">{language === 'tr' ? 'SÜRE' : 'TIME'}</span>
              <span className="text-xs font-semibold text-[var(--text-primary)] tracking-tight">{response.durationMs}ms</span>
            </div>
            <div className="w-px h-6 bg-[var(--border-glass)]"></div>
            <div className="flex flex-col">
              <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">{language === 'tr' ? 'BOYUT' : 'SIZE'}</span>
              <span className="text-xs font-semibold text-[var(--text-primary)] tracking-tight">
                {response.sizeBytes < 1024 ? `${response.sizeBytes} B` : `${(response.sizeBytes / 1024).toFixed(1)} KB`}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCollectionPanel(!showCollectionPanel)}
          className={`btn-ghost text-[10px] font-bold uppercase tracking-wider px-4 py-2 ${saved ? 'text-emerald-400' : ''}`}
        >
          {saved ? (language === 'tr' ? 'BAŞARIYLA KAYDEDİLDİ' : 'SAVED SUCCESSFULLY') : (language === 'tr' ? 'KOLEKSİYONA KAYDET' : 'SAVE TO COLLECTION')}
        </button>
      </div>

      {showCollectionPanel && (
        <div className="p-4 glass-item rounded-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] border-none focus:ring-0"
          >
            {collections.length === 0 ? (
              <option className="bg-[var(--bg-sidebar)]">{language === 'tr' ? 'Koleksiyon yok' : 'No collections yet'}</option>
            ) : (
              collections.map((c) => (
                <option key={c.id} value={c.id} className="bg-[var(--bg-sidebar)]">{c.name}</option>
              ))
            )}
          </select>
          <button
            onClick={handleSaveToCollection}
            disabled={collections.length === 0}
            className="btn-primary text-xs px-4 py-1.5"
          >
            {common.save}
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col gap-6">
        {/* Toggle & Export Controls */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mr-2">Body</span>
            <div className="flex p-1 glass-item rounded-xl">
              <button 
                onClick={() => setViewMode('pretty')}
                className={`px-4 py-1 text-[10px] font-bold rounded-lg transition-all ${viewMode === 'pretty' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                PRETTY
              </button>
              <button 
                onClick={() => setViewMode('raw')}
                className={`px-4 py-1 text-[10px] font-bold rounded-lg transition-all ${viewMode === 'raw' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                RAW
              </button>
            </div>
          </div>
          
          <button
            onClick={handleCopy}
            className="btn-ghost px-3 py-1.5 flex items-center gap-2 group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:scale-110 transition-transform">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">{copied ? (language === 'tr' ? 'KOPYALANDI' : 'COPIED') : (language === 'tr' ? 'KOPYALA' : 'COPY')}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="relative group w-full overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <pre className="max-h-[600px] p-6 glass-item rounded-[1.5rem] text-[var(--code-json)] text-[13px] font-mono overflow-auto leading-relaxed custom-scrollbar whitespace-pre-wrap break-all relative z-10 w-full">
            {formatBody(response.body, viewMode)}
          </pre>
        </div>

        {/* Headers Section */}
        {response.headers && (
          <div className="flex flex-col gap-4 mt-4">
            <span className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest">{language === 'tr' ? 'CEVAP HEADERLARI' : 'RESPONSE HEADERS'}</span>
            <pre className="max-h-[250px] p-4 glass-item rounded-2xl text-[var(--text-secondary)] text-[11px] font-mono overflow-auto border-none">
              {formatBody(response.headers, 'pretty')}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;