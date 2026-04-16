import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import api from '../services/api';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { language } = useSettingsStore();
  const t = translations[language].profile;
  const common = translations[language].common;

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);

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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/User/profile', profileForm);
      setProfileMsg({ type: 'success', text: t.updateSuccess });
    } catch (err) {
      setProfileMsg({ type: 'error', text: t.updateError });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: t.passwordMismatch });
      return;
    }
    try {
      await api.put('/User/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg({ type: 'success', text: t.passwordSuccess });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: t.passwordError });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest">{common.loading}</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 p-8 lg:p-12 max-w-4xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[var(--border-glass)] pb-10">
        <div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight uppercase">
            {t.title}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-8 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-rose-500/20 active:scale-95"
        >
          {t.logout}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: User Card & Tabs */}
          <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-blue-500/20 mb-6 border-4 border-white/10">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{user?.name}</h2>
                    <p className="text-[var(--text-secondary)] text-sm font-medium mt-1">{user?.email}</p>
                  </div>
              </div>

              <div className="flex flex-col gap-1 p-2 glass-card rounded-3xl">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-3 ${
                    activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-[var(--text-secondary)] hover:bg-white/5'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  {t.editProfile}
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-3 ${
                    activeTab === 'password' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-[var(--text-secondary)] hover:bg-white/5'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  {t.changePassword}
                </button>
              </div>
          </div>

          {/* Right: Forms */}
          <div className="lg:col-span-2">
            <div className="glass-card p-10 rounded-[3rem] border-[var(--border-glass)]">
                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileUpdate} className="flex flex-col gap-8 animate-in slide-in-from-right-4 duration-500">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">{t.nameLabel}</label>
                            <input
                                type="text"
                                placeholder={t.nameLabel}
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                className="px-6 py-4 glass-item rounded-2xl text-[var(--text-primary)] text-sm font-bold focus:ring-2 ring-blue-500/10 border-none outline-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">{t.emailLabel}</label>
                            <input
                                type="email"
                                placeholder={t.emailLabel}
                                value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                className="px-6 py-4 glass-item rounded-2xl text-[var(--text-primary)] text-sm font-bold focus:ring-2 ring-blue-500/10 border-none outline-none"
                            />
                        </div>
                        
                        {profileMsg && (
                            <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${profileMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                <div className={`w-2 h-2 rounded-full ${profileMsg.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                {profileMsg.text}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            className="btn-primary py-4 text-xs tracking-widest uppercase mt-4"
                        >
                            {common.save}
                        </button>
                    </form>
                )}

                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordChange} className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">{t.currentPassword}</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                className="px-6 py-4 glass-item rounded-2xl text-[var(--text-primary)] text-sm font-bold focus:ring-2 ring-blue-500/10 border-none outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">{t.newPassword}</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="px-6 py-4 glass-item rounded-2xl text-[var(--text-primary)] text-sm font-bold focus:ring-2 ring-blue-500/10 border-none outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">{t.confirmPassword}</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="px-6 py-4 glass-item rounded-2xl text-[var(--text-primary)] text-sm font-bold focus:ring-2 ring-blue-500/10 border-none outline-none"
                                />
                            </div>
                        </div>

                        {passwordMsg && (
                            <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${passwordMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                <div className={`w-2 h-2 rounded-full ${passwordMsg.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                {passwordMsg.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary py-4 text-xs tracking-widest uppercase mt-4"
                        >
                            {t.changePassword}
                        </button>
                    </form>
                )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ProfilePage;