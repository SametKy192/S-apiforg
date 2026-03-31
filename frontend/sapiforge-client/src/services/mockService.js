import api from './api';

// ── Mock servisi ────────────────────────────────────────────────
// Backend MockController ile iletişim kurar

// Tüm mock endpoint'leri getirir
export const getAllMocks = async () => {
  const response = await api.get('/Mock');
  return response.data;
};

// ID'ye göre mock endpoint getirir
export const getMockById = async (id) => {
  const response = await api.get(`/Mock/${id}`);
  return response.data;
};

// Yeni mock endpoint oluşturur
export const createMock = async (mockData) => {
  const response = await api.post('/Mock', mockData);
  return response.data;
};

// Mock endpoint günceller
export const updateMock = async (id, mockData) => {
  const response = await api.put(`/Mock/${id}`, mockData);
  return response.data;
};

// Mock endpoint siler
export const deleteMock = async (id) => {
  await api.delete(`/Mock/${id}`);
};