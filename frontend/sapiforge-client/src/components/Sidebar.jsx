import { NavLink } from 'react-router-dom';
import useRequestStore from '../store/requestStore';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';
import { useState } from 'react';
import BackupModal from './BackupModal';

const Sidebar = () => {
  const { activeEnvironment } = useRequestStore();
  const { language, setLanguage, theme, toggleTheme } = useSettingsStore();
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  
  const t = translations[language].sidebar;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'bg-blue-600 shadow-lg shadow-blue-500/25 text-white'
        : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-primary)]'
    }`;

  return (
    <aside className="w-64 h-screen bg-[var(--bg-sidebar)] border-r border-[var(--border-glass)] flex flex-col flex-shrink-0 relative overflow-hidden transition-colors duration-500">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/5 blur-[80px] -z-10"></div>

      {/* Logo Section */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-slate-950 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight leading-none">Sapiforge</h1>
            <p className="text-blue-500/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">v1.0.0 PRO</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
        <NavLink to="/" end className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
          Dashboard
        </NavLink>

        <NavLink to="/request" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
          </svg>
          {t.requests}
        </NavLink>

        <NavLink to="/mock" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>
          </svg>
          {t.mock}
        </NavLink>

        <NavLink to="/history" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {t.history}
        </NavLink>

        <NavLink to="/collections" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12v8H4V4h10"/><path d="M16 2v4"/><path d="M21 7h-5"/><path d="m16 2 5 5"/>
          </svg>
          {t.collections}
        </NavLink>

        <NavLink to="/workflow" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          {t.workflow}
        </NavLink>

        <NavLink to="/environments" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
          </svg>
          {t.environments}
        </NavLink>

        <div className="h-px bg-white/5 my-3 mx-2"></div>

        <button 
          onClick={() => setIsBackupOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-current transition-all duration-300 w-full text-left"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
          </svg>
          {t.backup}
        </button>

        <NavLink to="/docs" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
          {t.docs}
        </NavLink>

        <NavLink to="/database" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/>
          </svg>
          {t.database}
        </NavLink>
      </nav>

      {/* Settings & Environment Section */}
      <div className="p-4 mt-auto border-t border-[var(--border-glass)] space-y-3">
        {/* Toggle Theme & Language */}
        <div className="flex gap-2">
            <button 
                onClick={toggleTheme}
                className="flex-1 p-2.5 glass-item rounded-xl flex items-center justify-center"
                title="Toggle Theme"
            >
                {theme === 'dark' ? (
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
                     </svg>
                ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    </svg>
                )}
            </button>
            <button 
                onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                className="flex-1 p-2.5 glass-item rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest"
                title="Swith Language"
            >
                {language === 'en' ? 'TR' : 'EN'}
            </button>
        </div>

        {activeEnvironment ? (
          <div className="glass-card p-4 rounded-2xl border-blue-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{t.activeEnv}</span>
            </div>
            <p className="text-current text-sm font-semibold truncate">{activeEnvironment.name}</p>
          </div>
        ) : (
          <div className="glass-card p-4 rounded-2xl border-white/5 opacity-50">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider text-center">{t.noActiveEnv}</p>
          </div>
        )}
      </div>
      
      <BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />
    </aside>
  );
};

export default Sidebar;