import { useState, useEffect } from 'react';
import MockForm from '../components/MockForm';
import { getAllMocks, deleteMock } from '../services/mockService';

// ── Mock sayfası ────────────────────────────────────────────────
// Kullanıcının mock endpoint oluşturup yönettiği sayfa
const MockPage = () => {
  const [mocks, setMocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Tüm mock endpoint'leri getir
  const fetchMocks = async () => {
    setIsLoading(true);
    try {
      const data = await getAllMocks();
      setMocks(data);
    } catch (err) {
      console.error('Mock endpoint\'ler getirilemedi:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMocks();
  }, []);

  // Mock endpoint sil
  const handleDelete = async (id) => {
    try {
      await deleteMock(id);
      setMocks(mocks.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Mock endpoint silinemedi:', err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Başlık ve yeni mock butonu */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-white">Mock Endpoint'ler</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          + Yeni Mock
        </button>
      </div>

      {/* Mock oluşturma formu */}
      {showForm && (
        <MockForm
          onSuccess={() => {
            setShowForm(false);
            fetchMocks();
          }}
        />
      )}

      {/* Mock listesi */}
      {isLoading ? (
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      ) : mocks.length === 0 ? (
        <p className="text-gray-400 text-sm">Henüz mock endpoint oluşturulmadı.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {mocks.map((mock) => (
            <div
              key={mock.id}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded font-mono">
                  {mock.method}
                </span>
                <span className="text-white font-mono text-sm">{mock.path}</span>
                <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                  {mock.statusCode}
                </span>
              </div>
              <button
                onClick={() => handleDelete(mock.id)}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockPage;