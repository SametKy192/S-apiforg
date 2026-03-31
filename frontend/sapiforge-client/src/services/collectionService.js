import api from './api';

// ── Koleksiyon servisi ──────────────────────────────────────────
// Backend CollectionController ile iletişim kurar

// Tüm koleksiyonları getirir
export const getAllCollections = async () => {
  const response = await api.get('/Collection');
  return response.data;
};

// ID'ye göre koleksiyonu getirir
export const getCollectionById = async (id) => {
  const response = await api.get(`/Collection/${id}`);
  return response.data;
};

// Yeni koleksiyon oluşturur
export const createCollection = async (collectionData) => {
  const response = await api.post('/Collection', collectionData);
  return response.data;
};

// Koleksiyona istek ekler
export const addItemToCollection = async (collectionId, requestId) => {
  await api.post(`/Collection/${collectionId}/items`, requestId);
};

// Koleksiyonu siler
export const deleteCollection = async (id) => {
  await api.delete(`/Collection/${id}`);
};