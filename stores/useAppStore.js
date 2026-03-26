import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAppStore = create(
  persist(
    (set) => ({
      language: null,
      setLanguage: (language) => set({ language }),
      darkMode: false,
      setDarkMode: (darkMode) => set({ darkMode }),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);