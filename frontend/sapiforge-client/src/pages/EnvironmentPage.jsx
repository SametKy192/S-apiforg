import { useState, useEffect } from 'react';
import { getAllEnvironments, updateEnvironment, deleteEnvironment, createEnvironment } from '../services/environmentService';

// ── Environment (Ortam) Sayfası ──────────────────────────────────
// Değişken setlerini yönetmek için kullanılır.
const EnvironmentPage = () => {
  const [environments, setEnvironments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEnv, setEditingEnv] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [variables, setVariables] = useState('{\n  "baseUrl": "https://api.example.com"\n}');

  const fetchEnvironments = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEnvironments();
      setEnvironments(data);
    } catch (err) {
      console.error('Ortamlar getirilemedi:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    
    // JSON doğrulama
    try {
      JSON.parse(variables);
    } catch (err) {
      alert('Değişkenler geçerli bir JSON olmalıdır!');
      return;
    }

    try {
      if (editingEnv) {
        await updateEnvironment(editingEnv.id, { ...editingEnv, name, variables });
      } else {
        await createEnvironment({ name, variables, isActive: false });
      }
      fetchEnvironments();
      resetForm();
    } catch (err) {
      console.error('Kaydedilemedi:', err);
    }
  };

  const handleSetActive = async (env) => {
    try {
      await updateEnvironment(env.id, { ...env, isActive: true });
      fetchEnvironments();
    } catch (err) {
      console.error('Aktif yapılamadı:', err);
    }
  };

  const handleSetPassive = async (env) => {
    try {
      await updateEnvironment(env.id, { ...env, isActive: false });
      fetchEnvironments();
    } catch (err) {
      console.error('Pasif yapılamadı:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ortamı silmek istediğinize emin misiniz?')) return;
    try {
      await deleteEnvironment(id);
      fetchEnvironments();
    } catch (err) {
      console.error('Silinemedi:', err);
    }
  };

  const resetForm = () => {
    setEditingEnv(null);
    setName('');
    setVariables('{\n  "baseUrl": "https://api.example.com"\n}');
  };

  const startEdit = (env) => {
    setEditingEnv(env);
    setName(env.name);
    setVariables(env.variables);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      <h1 className="text-xl font-medium text-white">Ortam Değişkenleri (Environments)</h1>

      {/* Kayıt/Düzenleme Formu */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h2 className="text-sm font-medium text-gray-400 mb-4">
          {editingEnv ? 'Ortamı Düzenle' : 'Yeni Ortam Oluştur'}
        </h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Ortam Adı (Örn: Production, Local)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">Değişkenler (JSON formatında)</label>
            <textarea
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
              rows={6}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              {editingEnv ? 'Güncelle' : 'Oluştur'}
            </button>
            {editingEnv && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <p className="text-gray-400 text-sm">Yükleniyor...</p>
        ) : environments.length === 0 ? (
          <p className="text-gray-400 text-sm">Henüz ortam tanımlanmadı.</p>
        ) : (
          environments.map((env) => (
            <div
              key={env.id}
              className={`flex items-center justify-between p-4 bg-gray-800 rounded-lg border ${
                env.isActive ? 'border-blue-500/50 shadow-lg shadow-blue-500/5' : 'border-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-white font-medium">{env.name}</span>
                  <span className="text-gray-500 text-xs">
                    {Object.keys(JSON.parse(env.variables)).length} değişken tanımlı
                  </span>
                </div>
                {env.isActive && (
                  <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 text-[10px] uppercase font-bold tracking-wider border border-blue-500/20 rounded">
                    Aktif
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {env.isActive ? (
                  <button
                    onClick={() => handleSetPassive(env)}
                    className="text-yellow-500 hover:text-yellow-400 text-sm transition-colors"
                  >
                    Pasif Yap
                  </button>
                ) : (
                  <button
                    onClick={() => handleSetActive(env)}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Aktif Yap
                  </button>
                )}
                <button
                  onClick={() => startEdit(env)}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(env.id)}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EnvironmentPage;
