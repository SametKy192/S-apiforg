import { useState, useEffect } from 'react';
import { getAllMocks } from '../services/mockService';

// ── Docs (Dokümantasyon) Sayfası ──────────────────────────────────
// Mock endpoint'leri temiz bir şekilde listeler.
const DocsPage = () => {
  const [mocks, setMocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMocks = async () => {
      setIsLoading(true);
      try {
        const data = await getAllMocks();
        setMocks(data);
      } catch (err) {
        console.error('Mocks getirilemedi:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMocks();
  }, []);

  return (
    <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">API Dokümantasyonu</h1>
        <p className="text-gray-400">Geliştiriciler için mevcut olan mock endpoint'lerin listesi.</p>
      </div>

      {isLoading ? (
        <p className="text-gray-400">Yükleniyor...</p>
      ) : mocks.length === 0 ? (
        <div className="p-12 text-center bg-gray-900 border border-gray-800 rounded-2xl">
          <p className="text-gray-500 italic">Henüz bir endpoint dökümante edilmedi.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {mocks.filter(m => m.isActive).map((mock) => (
            <div key={mock.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-bold rounded-md uppercase tracking-wider ${
                  mock.method === 'GET' ? 'bg-green-900/50 text-green-400 border border-green-500/20' :
                  mock.method === 'POST' ? 'bg-blue-900/50 text-blue-400 border border-blue-500/20' :
                  'bg-yellow-900/50 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {mock.method}
                </span>
                <code className="text-xl text-gray-200 font-mono">
                  /api/mock/serve{mock.path}
                </code>
              </div>

              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="px-4 py-2 bg-gray-800 border-b border-gray-800 text-xs font-medium text-gray-400 uppercase tracking-widest">
                  Örnek Cevap (JSON)
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-blue-300 whitespace-pre">
                    {mock.responseBody || '{}'}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-500 block mb-1">Durum Kodu</span>
                  <span className="text-white font-medium">{mock.statusCode}</span>
                </div>
                <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-500 block mb-1">Cevap Tipi</span>
                  <span className="text-white font-medium">application/json</span>
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
