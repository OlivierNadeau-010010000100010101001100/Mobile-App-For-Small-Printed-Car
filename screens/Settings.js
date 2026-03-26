import { Text, View, Pressable, StyleSheet, Alert, Switch } from "react-native";
import { useAppStore } from "../stores/useAppStore";
import { useTranslation } from "../i18n";
import { useApi } from "../providers/ProviderUrl";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../hooks/useTheme";

export const Settings = () => {
  const language    = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const darkMode    = useAppStore((s) => s.darkMode);
  const setDarkMode = useAppStore((s) => s.setDarkMode);
  const { t } = useTranslation(language);
  const { user, logout } = useApi();
  const navigation = useNavigation();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace("Login");
    } catch {
      Alert.alert(t("settings.errorLogout"));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{t("settings.title")}</Text>

      {user && (
        <Text style={[styles.userInfo, { color: theme.subText }]}>
          {user.username}
        </Text>
      )}

      <Text style={[styles.label, { color: theme.subText }]}>{t("settings.language")}</Text>
      <Pressable style={styles.button} onPress={() => setLanguage(language === "fr" ? "en" : "fr")}>
        <Text style={styles.buttonText}>
          {(language ?? "en").toUpperCase()} → {(language === "fr" ? "en" : "fr").toUpperCase()}
        </Text>
      </Pressable>

      <Text style={[styles.label, { color: theme.subText }]}>{t("settings.darkmode")}</Text>
      <View style={styles.switchRow}>
        <Text style={{ color: theme.text }}>{t("settings.dark")}</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
        <Text style={{ color: theme.text }}>{t("settings.light")}</Text>
      </View>

      <Pressable style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>{t("settings.logout")}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container:    { flex: 1, padding: 16 },
  title:        { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  userInfo:     { fontSize: 14, marginBottom: 24 },
  label:        { fontSize: 16, marginBottom: 8 },
  switchRow:    { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  button:       { backgroundColor: "#007AFF", padding: 12, borderRadius: 10, alignItems: "center", width: "50%", marginBottom: 16 },
  logoutButton: { backgroundColor: "red", marginTop: 24 },
  buttonText:   { color: "#fff", fontSize: 16, fontWeight: "600" },
});
