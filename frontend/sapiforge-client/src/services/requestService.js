import api from './api';

// ── Request servisi ─────────────────────────────────────────────
// Backend RequestController ile iletişim kurar

// Dış API'ye istek gönderir
export const sendRequest = async (requestData) => {
  const response = await api.post('/Request/send', requestData);
  return response.data;
};

// Tüm istek geçmişini getirir
export const getHistory = async () => {
  const response = await api.get('/Request/history');
  return response.data;
};

// ID'ye göre tek istek getirir
export const getRequestById = async (id) => {
  const response = await api.get(`/Request/${id}`);
  return response.data;
};

// Geçmişten istek siler
export const deleteRequest = async (id) => {
  await api.delete(`/Request/${id}`);
};