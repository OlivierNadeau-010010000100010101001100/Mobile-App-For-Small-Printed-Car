import { Text, View, Pressable, StyleSheet, Alert } from "react-native";
import { useAppStore } from "../stores/useAppStore";
import { useTranslation } from "../i18n";
import { useApi } from "../providers/ProviderUrl";
import { useNavigation } from "@react-navigation/native";

export const Settings = () => {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const { t } = useTranslation(language);
  const { user, logout } = useApi();
  const navigation = useNavigation();

  const next = language === "fr" ? "en" : "fr";

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de se déconnecter");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("settings.title")}</Text>

      {/* User info */}
      {user && (
        <Text style={styles.userInfo}>
          Connecté : {user.username}
        </Text>
      )}

      {/* Language toggle */}
      <Text style={styles.label}>{t("settings.language")}</Text>
      <Pressable style={styles.button} onPress={() => setLanguage(next)}>
        <Text style={styles.buttonText}>
          {(language ?? "en").toUpperCase()} → {next.toUpperCase()}
        </Text>
      </Pressable>

      {/* Logout */}
      <Pressable style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>
          {language === "fr" ? "Se déconnecter" : "Logout"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  userInfo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "50%",
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: "red",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});