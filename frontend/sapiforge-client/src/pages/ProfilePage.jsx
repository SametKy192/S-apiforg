import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import api from '../services/api';

// ── Profil sayfası ──────────────────────────────────────────────
const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Profil bilgilerini getir
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/User/profile');
        setUser(res.data);
        setProfileForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error('Profil getirilemedi:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Profil güncelle
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/User/profile', profileForm);
      setProfileMsg({ type: 'success', text: 'Profil güncellendi.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Profil güncellenemedi.' });
    }
  };

  // Şifre değiştir
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
      return;
    }
    try {
      await api.put('/User/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg({ type: 'success', text: 'Şifre değiştirildi.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: 'Şifre değiştirilemedi.' });
    }
  };

  // Çıkış yap
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) return <div className="p-6 text-gray-400">Yükleniyor...</div>;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-xl">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-white">Profil</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-red-400 border border-red-800 rounded-lg hover:bg-red-900/20 transition-colors"
        >
          Çıkış Yap
        </button>
      </div>

      {/* Kullanıcı bilgisi */}
      <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-lg">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-medium">{user?.name}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Tab menüsü */}
      <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 text-sm rounded-md transition-colors ${
            activeTab === 'profile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Profil Düzenle
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex-1 py-2 text-sm rounded-md transition-colors ${
            activeTab === 'password' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Şifre Değiştir
        </button>
      </div>

      {/* Profil formu */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
          {profileMsg && (
            <p className={`text-sm ${profileMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {profileMsg.text}
            </p>
          )}
          <button
            type="submit"
            className="py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Güncelle
          </button>
        </form>
      )}

      {/* Şifre formu */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Mevcut şifre"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Yeni şifre"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Yeni şifre tekrar"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
          {passwordMsg && (
            <p className={`text-sm ${passwordMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {passwordMsg.text}
            </p>
          )}
          <button
            type="submit"
            className="py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Şifreyi Değiştir
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;