import { create } from 'zustand';

// ── Request store ───────────────────────────────────────────────
// Uygulama genelinde istek ve response verilerini yönetir
const useRequestStore = create((set) => ({
  // State
  currentRequest: {
    url: '',
    method: 'GET',
    headers: '',
    body: '',
  },
  currentResponse: null,
  history: [],
  isLoading: false,
  error: null,

  // Mevcut isteği günceller
  setCurrentRequest: (request) =>
    set({ currentRequest: request }),

  // Response'u günceller
  setCurrentResponse: (response) =>
    set({ currentResponse: response }),

  // Geçmişi günceller
  setHistory: (history) =>
    set({ history }),

  // Geçmişe yeni istek ekler
  addToHistory: (request) =>
    set((state) => ({ history: [request, ...state.history] })),

  // Geçmişten istek siler
  removeFromHistory: (id) =>
    set((state) => ({
      history: state.history.filter((r) => r.id !== id),
    })),

  // Loading durumunu günceller
  setLoading: (isLoading) =>
    set({ isLoading }),

  // Hata durumunu günceller
  setError: (error) =>
    set({ error }),

  // State'i sıfırlar
  reset: () =>
    set({
      currentRequest: { url: '', method: 'GET', headers: '', body: '' },
      currentResponse: null,
      error: null,
    }),
}));

export default useRequestStore;