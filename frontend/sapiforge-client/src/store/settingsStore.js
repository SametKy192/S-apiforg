import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      language: 'tr',
      theme: 'dark',
      
      setLanguage: (lang) => set({ language: lang }),
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        return { theme: newTheme };
      }),
      
      initTheme: () => {
        const saved = localStorage.getItem('settings-storage');
        const theme = saved ? JSON.parse(saved).state?.theme : 'dark';
        document.documentElement.setAttribute('data-theme', theme || 'dark');
      }
    }),
    {
      name: 'settings-storage',
    }
  )
);

export default useSettingsStore;
