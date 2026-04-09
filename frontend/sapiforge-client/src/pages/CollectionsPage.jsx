import { useState, useEffect } from 'react';
import { getAllCollections, createCollection, deleteCollection } from '../services/collectionService';
import CollectionRunnerModal from '../components/CollectionRunnerModal';
import ImportPostmanModal from '../components/ImportPostmanModal';

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });
  
  const [runnerCollection, setRunnerCollection] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Bu koleksiyonu silmek istediğinize emin misiniz?')) return;
    try {
      await deleteCollection(id);
      setCollections(collections.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Koleksiyon silinemedi:', err);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Collections</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and test your API groupings</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all border border-gray-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/30 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Collection
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-4 p-6 bg-gray-900 rounded-2xl border border-gray-800 shadow-xl animate-in fade-in slide-in-from-top-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Collection Name"
              value={newCollection.name}
              onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
              className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newCollection.description}
              onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-all"
            >
              Create Collection
            </button>
          </div>
        </form>
      )}

      {/* Grid List */}
      {isLoading ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm mt-4">Loading collections...</p>
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-dashed border-gray-800">
          <p className="text-gray-500 font-medium">No collections yet. Start by creating one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="group flex flex-col p-6 bg-gray-900 hover:bg-gray-800/80 rounded-2xl border border-gray-800 transition-all hover:shadow-2xl hover:border-blue-500/30 relative overflow-hidden"
            >
              <div className="flex flex-col gap-1 mb-6">
                <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                  {collection.name}
                </span>
                <span className="text-gray-500 text-sm line-clamp-2 h-10">
                  {collection.description || 'No description provided.'}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest bg-gray-800 px-2 py-1 rounded">
                  {collection.items?.length || 0} Requests
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setRunnerCollection(collection)}
                    disabled={!collection.items || collection.items.length === 0}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all disabled:opacity-30"
                    title="Run Collection"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete Collection"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CollectionRunnerModal 
        isOpen={!!runnerCollection} 
        onClose={() => setRunnerCollection(null)} 
        collection={runnerCollection}
      />
      
      <ImportPostmanModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImportSuccess={fetchCollections}
      />
    </div>
  );
};

export default CollectionsPage;