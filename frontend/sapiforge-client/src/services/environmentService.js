import api from './api';

// Ortam değişkenleri ile ilgili API işlemlerini yürütür
export const getAllEnvironments = async () => {
  const response = await api.get('/Environment');
  return response.data;
};

export const getActiveEnvironment = async () => {
  const response = await api.get('/Environment/active');
  return response.data;
};

export const createEnvironment = async (environment) => {
  const response = await api.post('/Environment', environment);
  return response.data;
};

export const updateEnvironment = async (id, environment) => {
  const response = await api.put(`/Environment/${id}`, environment);
  return response.data;
};

export const deleteEnvironment = async (id) => {
  await api.delete(`/Environment/${id}`);
};