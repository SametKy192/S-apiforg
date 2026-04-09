import { useState, useEffect } from 'react';
import { getAllCollections, addItemToCollection } from '../services/collectionService';

// ── Response Viewer ─────────────────────────────────────────────
// Backend'den dönen response'u görsel olarak gösterir
const ResponseViewer = ({ response, requestId }) => {
  const [copied, setCopied] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [saved, setSaved] = useState(false);
  const [showCollectionPanel, setShowCollectionPanel] = useState(false);

  // Koleksiyonları getir
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

  // Status koduna göre renk belirle
  const getStatusColor = (status) => {
    if (status < 300) return 'text-green-400 bg-green-900/30';
    if (status < 400) return 'text-yellow-400 bg-yellow-900/30';
    if (status < 500) return 'text-orange-400 bg-orange-900/10 border border-orange-500/20';
    return 'text-red-400 bg-red-900/20 border border-red-500/30';
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
    <div className="flex flex-col gap-4 bg-gray-900/50 rounded-xl border border-gray-800 p-5 shadow-inner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold font-mono ${getStatusColor(response.statusCode)}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            {response.statusCode}
          </div>
          <div className="flex items-center gap-3 text-gray-500 text-xs font-medium">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {response.durationMs}ms
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              {response.sizeBytes < 1024 ? `${response.sizeBytes} B` : `${(response.sizeBytes / 1024).toFixed(1)} KB`}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowCollectionPanel(!showCollectionPanel)}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/5 hover:bg-blue-500/10 transition-all px-3 py-1.5 rounded-lg border border-blue-500/20"
        >
          {saved ? 'Saved!' : 'Save to Collection'}
        </button>
      </div>

      {showCollectionPanel && (
        <div className="flex items-center gap-2 p-3 bg-gray-950 rounded-xl border border-gray-800">
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            {collections.length === 0 ? (
              <option>No collections yet</option>
            ) : (
              collections.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))
            )}
          </select>
          <button
            onClick={handleSaveToCollection}
            disabled={collections.length === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm disabled:opacity-50 transition-all"
          >
            Save
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Body</span>
              <div className="flex bg-gray-950 rounded-md p-0.5 border border-gray-800">
                <button 
                  onClick={() => setViewMode('pretty')}
                  className={`px-2 py-0.5 text-[10px] rounded transition-all ${viewMode === 'pretty' ? 'bg-gray-800 text-blue-400' : 'text-gray-600 hover:text-gray-400'}`}
                >
                  Pretty
                </button>
                <button 
                  onClick={() => setViewMode('raw')}
                  className={`px-2 py-0.5 text-[10px] rounded transition-all ${viewMode === 'raw' ? 'bg-gray-800 text-blue-400' : 'text-gray-600 hover:text-gray-400'}`}
                >
                  Raw
                </button>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="text-[10px] font-bold text-gray-400 hover:text-white transition-all px-2 py-1 rounded bg-gray-800 hover:bg-gray-700"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="relative group">
            <pre className="max-h-[500px] px-4 py-3 bg-gray-950 rounded-xl text-green-400/90 text-sm font-mono overflow-auto border border-gray-800 custom-scrollbar whitespace-pre-wrap">
              {formatBody(response.body, viewMode)}
            </pre>
          </div>
        </div>

        {response.headers && (
          <div className="flex flex-col gap-2 border-t border-gray-800 pt-4">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Headers</span>
            <pre className="max-h-[200px] px-4 py-3 bg-gray-950 rounded-xl text-gray-400 text-xs font-mono overflow-auto border border-gray-800 custom-scrollbar">
              {formatBody(response.headers, 'pretty')}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;