import api from './api';

export const getTables = async () => {
  const response = await api.get('/Database/tables');
  return response.data;
};

export const executeQuery = async (sql) => {
  const response = await api.post('/Database/query', { sql });
  return response.data;
};
