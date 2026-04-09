import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import RequestPage from './pages/RequestPage';
import MockPage from './pages/MockPage';
import CollectionsPage from './pages/CollectionsPage';
import HistoryPage from './pages/HistoryPage';
import EnvironmentPage from './pages/EnvironmentPage';
import DocsPage from './pages/DocsPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-950 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<RequestPage />} />
            <Route path="/mock" element={<MockPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/environments" element={<EnvironmentPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;