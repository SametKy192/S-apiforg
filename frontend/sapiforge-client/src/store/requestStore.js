import { create } from 'zustand';

// ── Request store ───────────────────────────────────────────────
// Uygulama genelinde istek ve response verilerini yönetir
const useRequestStore = create((set, get) => ({
  // State
  tabs: [
    {
      id: 'default',
      name: 'New Request',
      request: { url: '', method: 'GET', headers: '', body: '', preRequestScript: '', testScript: '' },
      response: null,
      isLoading: false,
      error: null
    }
  ],
  activeTabId: 'default',
  history: [],
  activeEnvironment: null,

  // Getters
  getActiveTab: () => {
    const state = get();
    return state.tabs.find(t => t.id === state.activeTabId) || state.tabs[0];
  },

  // Actions
  setActiveTab: (id) => set({ activeTabId: id }),

  addTab: () => {
    const newId = Date.now().toString();
    set((state) => ({
      tabs: [
        ...state.tabs,
        {
          id: newId,
          name: 'New Request',
          request: { url: '', method: 'GET', headers: '', body: '', preRequestScript: '', testScript: '' },
          response: null,
          isLoading: false,
          error: null
        }
      ],
      activeTabId: newId
    }));
  },

  closeTab: (id) => {
    set((state) => {
      if (state.tabs.length === 1) return state; // Don't close the last tab
      
      const newTabs = state.tabs.filter(t => t.id !== id);
      let newActiveId = state.activeTabId;
      if (state.activeTabId === id) {
        newActiveId = newTabs[newTabs.length - 1].id;
      }
      return { tabs: newTabs, activeTabId: newActiveId };
    });
  },

  // Update current tab's request
  setCurrentRequest: (request) => {
    set((state) => ({
      tabs: state.tabs.map(t => 
        t.id === state.activeTabId ? { ...t, request } : t
      )
    }));
  },

  // Update current tab's response
  setCurrentResponse: (response) => {
    set((state) => ({
      tabs: state.tabs.map(t => 
        t.id === state.activeTabId ? { ...t, response, error: null } : t
      )
    }));
  },

  setLoading: (isLoading) => {
    set((state) => ({
      tabs: state.tabs.map(t => 
        t.id === state.activeTabId ? { ...t, isLoading } : t
      )
    }));
  },

  setError: (error) => {
    set((state) => ({
      tabs: state.tabs.map(t => 
        t.id === state.activeTabId ? { ...t, error, response: null } : t
      )
    }));
  },

  setHistory: (history) => set({ history }),

  addToHistory: (request) =>
    set((state) => ({ history: [request, ...state.history] })),

  removeFromHistory: (id) =>
    set((state) => ({
      history: state.history.filter((r) => r.id !== id),
    })),

  setActiveEnvironment: (env) => set({ activeEnvironment: env }),

  reset: () => {
    set((state) => ({
      tabs: state.tabs.map(t => 
        t.id === state.activeTabId 
          ? { ...t, request: { url: '', method: 'GET', headers: '', body: '' }, response: null, error: null }
          : t
      )
    }));
  },

  loadRequest: (request) => {
    set((state) => ({
      tabs: state.tabs.map(t => 
        t.id === state.activeTabId 
          ? { 
              ...t, 
              name: request.name || t.name,
              request: {
                url: request.url || '',
                method: request.method || 'GET',
                headers: request.headers || '',
                body: request.body || '',
              } 
            } 
          : t
      )
    }));
  },
}));

export default useRequestStore;