import { useState, useEffect } from 'react';
import { getAllEnvironments, updateEnvironment, deleteEnvironment, createEnvironment } from '../services/environmentService';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';

const EnvironmentPage = () => {
  const { language } = useSettingsStore();
  const t = translations[language].environments;
  const common = translations[language].common;

  const [environments, setEnvironments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEnv, setEditingEnv] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [variables, setVariables] = useState('{\n  "baseUrl": "https://api.example.com"\n}');

  const fetchEnvironments = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEnvironments();
      setEnvironments(data);
    } catch (err) {
      console.error('Failed to fetch environments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
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
      console.error('Failed to save:', err);
    }
  };

  const handleToggleActive = async (env) => {
    try {
      await updateEnvironment(env.id, { ...env, isActive: !env.isActive });
      fetchEnvironments();
    } catch (err) {
      console.error('Failed to toggle active state:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(common.delete + '?')) return;
    try {
      await deleteEnvironment(id);
      fetchEnvironments();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const resetForm = () => {
    setEditingEnv(null);
    setName('');
    setVariables('{\n  "baseUrl": "https://api.example.com"\n}');
    setShowForm(false);
  };

  const startEdit = (env) => {
    setEditingEnv(env);
    setName(env.name);
    setVariables(env.variables);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-12 p-8 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight uppercase">
            {t.title}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">{t.subtitle}</p>
        </div>
        
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-blue-500/25"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-wider">{t.new}</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="glass-card p-8 rounded-[2rem] border-white/10 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{common.name || 'Name'}</label>
                <input
                  type="text"
                  placeholder={t.placeholderName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-5 py-3 glass-item rounded-xl text-white text-sm focus:ring-2 ring-blue-500/20 border-none placeholder-slate-600 font-bold"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.variablesLabel}</label>
                <textarea
                  value={variables}
                  onChange={(e) => setVariables(e.target.value)}
                  rows={8}
                  className="px-5 py-4 glass-item rounded-2xl text-blue-300 text-xs font-mono focus:ring-2 ring-blue-500/20 border-none placeholder-slate-600 resize-none leading-relaxed"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4 justify-end mt-2">
              <button
                type="button"
                onClick={resetForm}
                className="btn-ghost text-[11px] font-bold uppercase tracking-widest"
              >
                {common.cancel}
              </button>
              <button
                type="submit"
                className="btn-primary text-[11px] font-bold uppercase tracking-widest px-10"
              >
                {editingEnv ? common.save : common.create}
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
      ) : environments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 glass-card rounded-[3rem] border-dashed border-white/5 opacity-50">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600">
               <path d="M12 2v20M2 12h20"/>
            </svg>
          </div>
          <p className="text-slate-400 font-medium text-lg">No environments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {environments.map((env) => (
            <div
              key={env.id}
              className={`group glass-card hover:bg-white/5 rounded-[2.5rem] p-8 border-white/5 transition-all duration-500 relative flex flex-col ${env.isActive ? 'ring-2 ring-blue-500/30' : ''}`}
            >
              <div className="flex items-start justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all border border-white/5 ${env.isActive ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800/50 text-slate-500'}`}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                   </svg>
                </div>
                
                <div className="flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleActive(env)}
                    className={`p-2.5 rounded-xl transition-all ${env.isActive ? 'text-amber-400 hover:bg-amber-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'}`}
                    title={env.isActive ? t.setPassive : t.setActive}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                       {env.isActive ? <path d="M18.36 6.64L6.64 18.36M6.64 6.64l11.72 11.72"/> : <polyline points="20 6 9 17 4 12"/>}
                    </svg>
                  </button>
                  <button
                    onClick={() => startEdit(env)}
                    className="p-2.5 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                       <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(env.id)}
                    className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                       <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>

              <h2 className={`text-xl font-bold group-hover:text-blue-400 transition-colors truncate mb-2 ${env.isActive ? 'text-blue-400' : 'text-white'}`}>
                {env.name}
              </h2>
              
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${env.isActive ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-600'}`}></span>
                  <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                    {Object.keys(JSON.parse(env.variables)).length} {t.varsCount}
                  </span>
                </div>
                {env.isActive && (
                  <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md">
                    {t.active}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnvironmentPage;
