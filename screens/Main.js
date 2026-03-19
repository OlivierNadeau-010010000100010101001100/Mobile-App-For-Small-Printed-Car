import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApi } from "../providers/ProviderUrl";
import { useAppStore } from "../stores/useAppStore";
import { useTranslation } from "../i18n";

export default function Main() {
  const navigation = useNavigation();
  const { user } = useApi();
  const language = useAppStore((s) => s.language);
  const { t } = useTranslation(language);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("home.title")}</Text>

      {user ? (
        <Text style={styles.username}>
          {t("home.loggedIn")} : {user.username}
        </Text>
      ) : (
        <Text style={styles.username}>{t("home.notLoggedIn")}</Text>
      )}

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("ControllerRC")}
      >
        <Text style={styles.buttonText}>{t("home.goToController")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  username: { fontSize: 18, marginBottom: 20, color: "#333" },
  button: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});