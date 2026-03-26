import { useAppStore } from "../stores/useAppStore";

const lightTheme = {
  background:     "#ffffff",
  card:           "#f9f9f9",
  border:         "#cccccc",
  text:           "#000000",
  subText:        "#555555",
  inputBg:        "#ffffff",
  tabBar:         "#ffffff",
  tabBarBorder:   "#e0e0e0",
};

const darkTheme = {
  background:     "#111111",
  card:           "#1e1e1e",
  border:         "#333333",
  text:           "#ffffff",
  subText:        "#aaaaaa",
  inputBg:        "#2a2a2a",
  tabBar:         "#1a1a1a",
  tabBarBorder:   "#333333",
};

export function useTheme() {
  const darkMode = useAppStore((s) => s.darkMode);
  return darkMode ? darkTheme : lightTheme;
}