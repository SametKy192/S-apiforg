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

  // Status koduna göre renk belirle
  const getStatusColor = (status) => {
    if (status < 300) return 'text-green-400 bg-green-900/30';
    if (status < 400) return 'text-yellow-400 bg-yellow-900/30';
    if (status < 500) return 'text-orange-400 bg-orange-900/30';
    return 'text-red-400 bg-red-900/30';
  };

  // JSON'u güzel formatla
  const formatBody = (body) => {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  };

  // Response body'yi panoya kopyala
  const handleCopy = () => {
    navigator.clipboard.writeText(formatBody(response.body));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // İsteği seçili koleksiyona kaydet
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
    <div className="flex flex-col gap-4 bg-gray-800 rounded-xl border border-gray-700 p-4">
      {/* Response meta bilgileri */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Status kodu */}
          <span className={`px-3 py-1 rounded-lg text-sm font-medium font-mono ${getStatusColor(response.statusCode)}`}>
            {response.statusCode}
          </span>
          {/* Süre */}
          <span className="text-gray-400 text-sm">{response.durationMs} ms</span>
          {/* Boyut */}
          <span className="text-gray-400 text-sm">
            {response.sizeBytes < 1024
              ? `${response.sizeBytes} B`
              : `${(response.sizeBytes / 1024).toFixed(1)} KB`}
          </span>
        </div>

        {/* Koleksiyona kaydet butonu */}
        <button
          onClick={() => setShowCollectionPanel(!showCollectionPanel)}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded border border-blue-800 hover:border-blue-600"
        >
          {saved ? 'Kaydedildi!' : 'Koleksiyona Kaydet'}
        </button>
      </div>

      {/* Koleksiyon seçim paneli */}
      {showCollectionPanel && (
        <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            {collections.length === 0 ? (
              <option>Henüz koleksiyon yok</option>
            ) : (
              collections.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))
            )}
          </select>
          <button
            onClick={handleSaveToCollection}
            disabled={collections.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Kaydet
          </button>
        </div>
      )}

      {/* Response body */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs uppercase tracking-wider">Response</span>
          <button
            onClick={handleCopy}
            className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded border border-gray-700 hover:border-gray-500"
          >
            {copied ? 'Kopyalandı!' : 'Kopyala'}
          </button>
        </div>
        <pre className="px-4 py-3 bg-gray-900 rounded-lg text-green-300 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words">
          {formatBody(response.body)}
        </pre>
      </div>

      {/* Response headers */}
      {response.headers && (
        <div className="flex flex-col gap-2">
          <span className="text-gray-500 text-xs uppercase tracking-wider">Headers</span>
          <pre className="px-4 py-3 bg-gray-900 rounded-lg text-gray-300 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {formatBody(response.headers)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResponseViewer;