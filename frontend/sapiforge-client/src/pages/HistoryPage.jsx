import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteRequest } from '../services/requestService';
import useRequestStore from '../store/requestStore';

// ── Geçmiş sayfası ──────────────────────────────────────────────
// Kullanıcının gönderdiği tüm isteklerin geçmişini listeler.
// URL'ye göre arama ve method'a göre filtreleme desteklenir.
const HistoryPage = () => {
  const navigate = useNavigate();
  const { loadRequest } = useRequestStore();

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Arama ve filtreleme state'leri
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  // Geçmişi backend'den getir
  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Geçmiş getirilemedi:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Geçmiş kaydını sil
  const handleDelete = async (id) => {
    try {
      await deleteRequest(id);
      setHistory(history.filter((r) => r.id !== id));
    } catch (err) {
      console.error('İstek silinemedi:', err);
    }
  };

  // Geçmişteki isteği store'a yükle ve ana sayfaya git
  const handleReuse = (request) => {
    loadRequest(request);
    navigate('/');
  };

  // Arama ve filtreleme uygulanmış liste
  const filteredHistory = history.filter((request) => {
    // URL araması
    const matchesSearch = request.url
      .toLowerCase()
      .includes(search.toLowerCase());

    // Method filtresi
    const matchesMethod =
      methodFilter === 'ALL' || request.method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  // Method badge rengi
  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-green-900 text-green-300';
      case 'POST': return 'bg-blue-900 text-blue-300';
      case 'PUT': return 'bg-yellow-900 text-yellow-300';
      case 'DELETE': return 'bg-red-900 text-red-300';
      case 'PATCH': return 'bg-purple-900 text-purple-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Başlık */}
      <h1 className="text-xl font-medium text-white">İstek Geçmişi</h1>

      {/* Arama ve filtre satırı */}
      <div className="flex gap-3">
        {/* URL arama */}
        <input
          type="text"
          placeholder="URL'de ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
        />

        {/* Method filtresi */}
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">Tüm Metodlar</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      {/* Sonuç sayısı */}
      {!isLoading && (
        <p className="text-gray-500 text-xs">
          {filteredHistory.length} istek gösteriliyor
        </p>
      )}

      {/* Liste */}
      {isLoading ? (
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      ) : filteredHistory.length === 0 ? (
        <p className="text-gray-400 text-sm">
          {history.length === 0 ? 'Henüz istek gönderilmedi.' : 'Arama kriterine uygun istek bulunamadı.'}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredHistory.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              {/* Sol taraf: method, URL, status kodu */}
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded font-mono ${getMethodColor(request.method)}`}>
                  {request.method}
                </span>
                <span className="text-white font-mono text-sm truncate max-w-md">
                  {request.url}
                </span>
                {request.response && (
                  <span className={`px-2 py-1 text-xs rounded ${
                    request.response.statusCode < 300
                      ? 'bg-green-900 text-green-300'
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {request.response.statusCode}
                  </span>
                )}
              </div>

              {/* Sağ taraf: tarih, tekrar gönder, sil */}
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs">
                  {new Date(request.createdAt).toLocaleString('tr-TR')}
                </span>
                <button
                  onClick={() => handleReuse(request)}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Tekrar Gönder
                </button>
                <button
                  onClick={() => handleDelete(request.id)}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;