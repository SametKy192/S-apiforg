import api from './api';

// ── Auth servisi ─────────────────────────────────────────────────
// Backend AuthController ile iletişim kurar

// Kayıt ol
export const register = async (name, email, password) => {
  const response = await api.post('/Auth/register', { name, email, password });
  return response.data;
};

// Giriş yap
export const login = async (email, password) => {
  const response = await api.post('/Auth/login', { email, password });
  return response.data;
};

// Token'ı localStorage'a kaydet
export const saveToken = (token) => {
  localStorage.setItem('sapiforge_token', token);
};

// Token'ı getir
export const getToken = () => {
  return localStorage.getItem('sapiforge_token');
};

// Çıkış yap — token'ı sil
export const logout = () => {
  localStorage.removeItem('sapiforge_token');
};

// Giriş yapılmış mı kontrol et
export const isAuthenticated = () => {
  return !!getToken();
};