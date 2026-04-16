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
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-[var(--accent)] text-white shadow-xl shadow-indigo-500/10'
        : 'text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'
    }`;

  return (
    <aside className="w-60 h-screen bg-[var(--bg-sidebar)] border-r border-[var(--border)] flex flex-col flex-shrink-0 z-50">
      
      {/* Signature Logo Section */}
      <div className="px-6 py-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center rotate-3 group">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
               </svg>
            </div>
            <h1 className="text-[var(--text-primary)] font-black text-xl tracking-tighter font-space">
              SAPI<span className="text-[var(--accent)]">FORG</span>
            </h1>
          </div>
          <div className="h-[2px] w-full bg-gradient-to-r from-[var(--accent)] to-transparent opacity-20"></div>
          <p className="text-[var(--text-secondary)] text-[9px] font-black uppercase tracking-[0.3em] mt-2 opacity-50">Core Automation</p>
        </div>
      </div>

      {/* Navigation - More spaced and technical */}
      <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto font-outfit">
        <NavLink to="/" end className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
          {language === 'tr' ? 'Analiz' : 'Analytics'}
        </NavLink>

        <NavLink to="/request" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7Z"/>
          </svg>
          {t.requests}
        </NavLink>

        <NavLink to="/mock" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
          </svg>
          {t.mock}
        </NavLink>

        <NavLink to="/history" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {t.history}
        </NavLink>

        <div className="h-px bg-[var(--border)] my-4 mx-2"></div>

        <NavLink to="/collections" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
          </svg>
          {t.collections}
        </NavLink>

        <NavLink to="/workflow" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          {t.workflow}
        </NavLink>

        <NavLink to="/environments" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect width="20" height="12" x="2" y="6" rx="2"/><path d="M6 12h.01"/><path d="M10 12h.01"/><path d="M14 12h.01"/>
          </svg>
          {t.environments}
        </NavLink>

        <div className="h-px bg-[var(--border)] my-4 mx-2"></div>

        <button 
          onClick={() => setIsBackupOpen(true)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-all w-full text-left"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
          </svg>
          {t.backup}
        </button>

        <NavLink to="/database" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>
          </svg>
          {t.database}
        </NavLink>
      </nav>

      {/* Modern Settings Section */}
      <div className="p-4 bg-[var(--bg-main)]/50 border-t border-[var(--border)]">
        <div className="flex gap-2 mb-4">
            <button 
                onClick={toggleTheme}
                className="flex-1 p-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg flex items-center justify-center hover:border-[var(--accent)] transition-all"
            >
                {theme === 'dark' ? (
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
                     </svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    </svg>
                )}
            </button>
            <button 
                onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                className="flex-1 p-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-[var(--accent)]"
            >
                {language === 'en' ? 'TR' : 'EN'}
            </button>
        </div>

        {activeEnvironment && (
          <div className="p-3 bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-xl">
            <p className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest mb-1 opacity-60">{t.activeEnv}</p>
            <p className="text-[var(--text-primary)] text-xs font-bold truncate">{activeEnvironment.name}</p>
          </div>
        )}
      </div>
      
      <BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />
    </aside>
  );
};

export default Sidebar;