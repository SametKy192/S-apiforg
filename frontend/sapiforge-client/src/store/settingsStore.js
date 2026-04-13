import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      language: 'en',
      theme: 'dark',
      
      setLanguage: (lang) => set({ language: lang }),
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (newTheme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
        return { theme: newTheme };
      }),
      
      // Initialize theme on store load
      initTheme: () => {
        const theme = localStorage.getItem('settings-storage') 
          ? JSON.parse(localStorage.getItem('settings-storage')).state.theme 
          : 'dark';
        if (theme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      }
    }),
    {
      name: 'settings-storage',
    }
  )
);

export default useSettingsStore;
