import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import RequestPage from './pages/RequestPage';
import MockPage from './pages/MockPage';
import CollectionsPage from './pages/CollectionsPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import { isAuthenticated } from './services/authService';
import ProfilePage from './pages/ProfilePage';
import EnvironmentPage from './pages/EnvironmentPage';
import DocsPage from './pages/DocsPage';

// ── Korumalı route — token yoksa login'e yönlendir ──────────────
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// ── App ─────────────────────────────────────────────────────────
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
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
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;