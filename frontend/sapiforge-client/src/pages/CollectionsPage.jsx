import { useState, useEffect } from 'react';
import { getAllCollections, createCollection, deleteCollection } from '../services/collectionService';

// ── Koleksiyonlar sayfası ───────────────────────────────────────
// Kullanıcının API isteklerini grupladığı koleksiyonları listeler
const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });

  // Koleksiyonları getir
  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCollections();
      setCollections(data);
    } catch (err) {
      console.error('Koleksiyonlar getirilemedi:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Yeni koleksiyon oluştur
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCollection(newCollection);
      setNewCollection({ name: '', description: '' });
      setShowForm(false);
      fetchCollections();
    } catch (err) {
      console.error('Koleksiyon oluşturulamadı:', err);
    }
  };

  // Koleksiyon sil
  const handleDelete = async (id) => {
    try {
      await deleteCollection(id);
      setCollections(collections.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Koleksiyon silinemedi:', err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Başlık ve yeni koleksiyon butonu */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-white">Koleksiyonlar</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          + Yeni Koleksiyon
        </button>
      </div>

      {/* Koleksiyon oluşturma formu */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700"
        >
          <input
            type="text"
            placeholder="Koleksiyon adı"
            value={newCollection.name}
            onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
            className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Açıklama (opsiyonel)"
            value={newCollection.description}
            onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
            className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Oluştur
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {/* Koleksiyon listesi */}
      {isLoading ? (
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      ) : collections.length === 0 ? (
        <p className="text-gray-400 text-sm">Henüz koleksiyon oluşturulmadı.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div className="flex flex-col gap-1">
                <span className="text-white font-medium">{collection.name}</span>
                {collection.description && (
                  <span className="text-gray-400 text-xs">{collection.description}</span>
                )}
                <span className="text-gray-500 text-xs">
                  {collection.items?.length || 0} istek
                </span>
              </div>
              <button
                onClick={() => handleDelete(collection.id)}
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

export default CollectionsPage;