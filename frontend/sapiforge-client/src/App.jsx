import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import useSettingsStore from './store/settingsStore';
import { useEffect } from 'react';
import RequestPage from './pages/RequestPage';
import MockPage from './pages/MockPage';
import CollectionsPage from './pages/CollectionsPage';
import HistoryPage from './pages/HistoryPage';
import EnvironmentPage from './pages/EnvironmentPage';
import DocsPage from './pages/DocsPage';
import DatabasePage from './pages/DatabasePage';
import WorkflowDesignerPage from './pages/WorkflowDesignerPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  const { initTheme } = useSettingsStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden text-[var(--text-primary)] transition-colors duration-500">
        <Sidebar />
        <main className="flex-1 min-w-0 relative bg-[var(--bg-main)] overflow-hidden">
          {/* Main Content Background Blur */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[5%] w-[30%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
          </div>
          
          <div className="h-full overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/request" element={<RequestPage />} />
              <Route path="/mock" element={<MockPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/environments" element={<EnvironmentPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/database" element={<DatabasePage />} />
              <Route path="/workflow" element={<WorkflowDesignerPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;