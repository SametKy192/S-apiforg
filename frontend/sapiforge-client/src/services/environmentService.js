import api from './api';

// ── Environment servisi ─────────────────────────────────────────
// Backend EnvironmentController ile iletişim kurar

// Tüm ortamları getirir
export const getAllEnvironments = async () => {
  const response = await api.get('/Environment');
  return response.data;
};

// Aktif ortamı getirir
export const getActiveEnvironment = async () => {
  const response = await api.get('/Environment/active');
  return response.data;
};

// Yeni ortam oluşturur
export const createEnvironment = async (environmentData) => {
  const response = await api.post('/Environment', environmentData);
  return response.data;
};

// Ortamı günceller
export const updateEnvironment = async (id, environmentData) => {
  const response = await api.put(`/Environment/${id}`, environmentData);
  return response.data;
};

// Ortamı siler
export const deleteEnvironment = async (id) => {
  await api.delete(`/Environment/${id}`);
};