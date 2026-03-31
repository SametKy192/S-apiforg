import axios from 'axios';

// Axios instance — tüm istekler bu üzerinden gider
// Base URL .env dosyasından okunur
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ─────────────────────────────────────────
// Her istekten önce çalışır — loglama, token ekleme gibi işlemler burada yapılır
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ────────────────────────────────────────
// Her response'tan sonra çalışır — hata yönetimi burada yapılır
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Hatası:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;