import { Pressable, Text } from "react-native";
import { useAppStore } from "../stores/useAppStore"

export function HeaderRight() {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const next = language === "fr" ? "en" : "fr";

  return (
    <Pressable
      onPress={() => setLanguage(next)}
      style={{ paddingHorizontal: 12, paddingVertical: 6 }}
    >
      <Text>
        {(language ?? "auto").toUpperCase()} → {next.toUpperCase()}
      </Text>
    </Pressable>
  );
}