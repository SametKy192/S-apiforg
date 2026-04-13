import { getCollectionById, getAllCollections, createCollection, deleteCollection } from '../services/collectionService';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';
import { useState, useEffect } from 'react';

const CollectionsPage = () => {
  const { language } = useSettingsStore();
  const t = translations[language].collections;
  const common = translations[language].common;
  
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });
  
  const [runnerCollection, setRunnerCollection] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [docCollection, setDocCollection] = useState(null);
  const [isDocLoading, setIsDocLoading] = useState(false);

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

  const handleExport = async (id) => {
    setIsDocLoading(true);
    try {
      const fullCollection = await getCollectionById(id);
      setDocCollection(fullCollection);
    } catch (err) {
      console.error('Dökümantasyon hazırlanamadı:', err);
      alert('Koleksiyon detayları alınamadı.');
    } finally {
      setIsDocLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 p-8 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">
            {t.title}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">{t.subtitle}</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn-ghost flex items-center gap-2 px-6 py-2.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.import}</span>
          </button>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-blue-500/25"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.new}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="glass-card p-8 rounded-[2rem] border-white/10 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Identity Service"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  className="px-5 py-3 glass-item rounded-xl text-white text-sm focus:ring-2 ring-blue-500/20 border-none placeholder-slate-600"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                <input
                  type="text"
                  placeholder="Optional context about these APIs..."
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  className="px-5 py-3 glass-item rounded-xl text-white text-sm focus:ring-2 ring-blue-500/20 border-none placeholder-slate-600"
                />
              </div>
            </div>
            <div className="flex gap-4 justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost text-xs"
              >
                {common.cancel}
              </button>
              <button
                type="submit"
                className="btn-primary text-xs px-8"
              >
                {common.create}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Grid Content */}
      {isLoading ? (
        <div className="flex flex-col items-center py-32">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-[0.2em] mt-6">{common.loading}</p>
        </div>
      ) : collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 glass-card rounded-[3rem] border-dashed border-white/5 opacity-50">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600">
              <path d="M20 12v8H4V4h10"/><path d="M16 2v4"/><path d="M21 7h-5"/><path d="m16 2 5 5"/>
            </svg>
          </div>
          <p className="text-slate-400 font-medium text-lg">Your collection shelf is empty.</p>
          <p className="text-slate-600 text-sm mt-2">Create a collection to start grouping your API calls.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="group glass-card hover:bg-white/5 rounded-[2.5rem] p-8 border-white/5 hover:border-blue-500/20 transition-all duration-500 relative flex flex-col"
            >
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full -z-10 group-hover:bg-blue-500/10 transition-all"></div>
              
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-blue-500/10 transition-all border border-white/5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setRunnerCollection(collection)}
                    disabled={!collection.items || collection.items.length === 0}
                    className="p-2.5 text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all disabled:opacity-30"
                    title="Fire Collection Runner"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleExport(collection.id)}
                    className="p-2.5 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                    title="Export Documentation"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                    title="Destroy Collection"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>

              <h2 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-blue-400 transition-colors truncate mb-2">
                {collection.name}
              </h2>
              <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed h-10 mb-8 font-medium">
                {collection.description || "No metadata provided for this workspace."}
              </p>
              
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                    {collection.items?.length || 0} {t.endpoints}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-slate-600 italic">v1.2</div>
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

      <DocumentationModal
        isOpen={!!docCollection}
        onClose={() => setDocCollection(null)}
        collection={docCollection}
      />

      {isDocLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gray-900/80 p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
             <p className="text-white text-xs font-bold uppercase tracking-widest">Compiling Docs...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;