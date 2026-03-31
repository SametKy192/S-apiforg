import { useState, useEffect } from 'react';
import { getHistory, deleteRequest } from '../services/requestService';

// ── Geçmiş sayfası ──────────────────────────────────────────────
// Kullanıcının gönderdiği tüm isteklerin geçmişini listeler
const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Geçmişi getir
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

  // Geçmişten sil
  const handleDelete = async (id) => {
    try {
      await deleteRequest(id);
      setHistory(history.filter((r) => r.id !== id));
    } catch (err) {
      console.error('İstek silinemedi:', err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-medium text-white">İstek Geçmişi</h1>

      {isLoading ? (
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-400 text-sm">Henüz istek gönderilmedi.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded font-mono">
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
              <div className="flex items-center gap-4">
                <span className="text-gray-500 text-xs">
                  {new Date(request.createdAt).toLocaleString('tr-TR')}
                </span>
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