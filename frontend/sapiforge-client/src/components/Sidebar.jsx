import { NavLink } from 'react-router-dom';
import useRequestStore from '../store/requestStore';

const Sidebar = () => {
  const { activeEnvironment } = useRequestStore();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <h1 className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Sapiforge
        </h1>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">API Sandbox Pro</p>
      </div>

      {/* Navigasyon */}
      <nav className="flex flex-col gap-1.5 p-4 flex-1">
        <NavLink to="/" end className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
          </svg>
          Send Request
        </NavLink>

        <NavLink to="/mock" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>
          </svg>
          Mock Engine
        </NavLink>

        <NavLink to="/collections" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12v8H4V4h10"/><path d="M16 2v4"/><path d="M21 7h-5"/><path d="m16 2 5 5"/>
          </svg>
          Collections
        </NavLink>

        <NavLink to="/history" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          History
        </NavLink>

        <NavLink to="/environments" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
          </svg>
          Environments
        </NavLink>

        <NavLink to="/docs" className={linkClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
          Documentation
        </NavLink>
      </nav>

      {/* Aktif Ortam Göstergesi */}
      {activeEnvironment && (
        <div className="px-5 py-4 m-4 bg-blue-900/10 border border-blue-500/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Live Environment</span>
          </div>
          <p className="text-white text-sm font-semibold truncate">{activeEnvironment.name}</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;