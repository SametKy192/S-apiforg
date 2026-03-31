import { NavLink } from 'react-router-dom';

// ── Sidebar ─────────────────────────────────────────────────────
// Sol taraftaki navigasyon menüsü
const Sidebar = () => {
  // Aktif link stili
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <aside className="w-56 h-screen bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <h1 className="text-white font-semibold text-lg tracking-tight">
          S<span className="text-blue-400">'</span>apiforge
        </h1>
        <p className="text-gray-500 text-xs mt-0.5">API Sandbox</p>
      </div>

      {/* Navigasyon */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        <NavLink to="/" end className={linkClass}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M2 8l4-4M2 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          İstek Gönder
        </NavLink>

        <NavLink to="/mock" className={linkClass}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 8h6M5 5.5h6M5 10.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Mock Engine
        </NavLink>

        <NavLink to="/collections" className={linkClass}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Koleksiyonlar
        </NavLink>

        <NavLink to="/history" className={linkClass}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Geçmiş
        </NavLink>
      </nav>

      {/* Alt bilgi */}
      <div className="px-4 py-3 border-t border-gray-800">
        <p className="text-gray-600 text-xs">v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;