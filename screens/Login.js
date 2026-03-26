import {
  View, Text, Pressable, StyleSheet,
  TextInput, Alert, Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApi } from "../providers/ProviderUrl";
import { useAppStore } from "../stores/useAppStore";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "../i18n";
import { useState, useEffect } from "react";

export default function Login() {
  const navigation = useNavigation();
  const { login, create_user, user } = useApi();
  const language = useAppStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useTheme();

  const [loginUsername,    setLoginUsername]    = useState("");
  const [loginPassword,    setLoginPassword]    = useState("");
  const [stayConnected,    setStayConnected]    = useState(false);
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => { if (user) navigation.replace("Tabs"); }, [user]);

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) { Alert.alert(t("login.errorFields")); return; }
    try {
      const success = await login(loginUsername, loginPassword, stayConnected);
      if (success) navigation.replace("Tabs");
      else Alert.alert(t("login.errorCredentials"));
    } catch { Alert.alert(t("login.errorServer")); }
  };

  const handleRegister = async () => {
    if (!registerUsername || !registerPassword) { Alert.alert(t("login.errorFields")); return; }
    try {
      await create_user(registerUsername, registerPassword);
      Alert.alert(t("login.successRegister"));
      setRegisterUsername(""); setRegisterPassword("");
    } catch { Alert.alert(t("login.errorCreateAccount")); }
  };

  const inputStyle = [styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.column}>
        <Text style={[styles.title, { color: theme.text }]}>{t("login.title")}</Text>
        <TextInput style={inputStyle} placeholder={t("login.username")} placeholderTextColor={theme.subText}
          value={loginUsername} onChangeText={(v) => setLoginUsername(v.toLowerCase())} />
        <TextInput style={inputStyle} placeholder={t("login.password")} placeholderTextColor={theme.subText}
          secureTextEntry value={loginPassword} onChangeText={(v) => setLoginPassword(v.toLowerCase())} />
        <View style={styles.switchRow}>
          <Switch value={stayConnected} onValueChange={setStayConnected} />
          <Text style={[styles.switchLabel, { color: theme.text }]}>{t("login.stayConnected")}</Text>
        </View>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{t("login.title")}</Text>
        </Pressable>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.column}>
        <Text style={[styles.title, { color: theme.text }]}>{t("login.register")}</Text>
        <TextInput style={inputStyle} placeholder={t("login.username")} placeholderTextColor={theme.subText}
          value={registerUsername} onChangeText={(v) => setRegisterUsername(v.toLowerCase())} />
        <TextInput style={inputStyle} placeholder={t("login.password")} placeholderTextColor={theme.subText}
          secureTextEntry value={registerPassword} onChangeText={(v) => setRegisterPassword(v.toLowerCase())} />
        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>{t("login.register")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, flexDirection: "row" },
  column:      { flex: 1, justifyContent: "flex-start", alignItems: "center", paddingHorizontal: 50, paddingTop: 120 },
  divider:     { width: 1, marginVertical: 40 },
  title:       { fontSize: 22, marginBottom: 20, fontWeight: "bold" },
  input:       { width: "100%", borderWidth: 1, padding: 10, borderRadius: 10, marginBottom: 10 },
  button:      { backgroundColor: "blue", padding: 12, borderRadius: 15, width: "100%", alignItems: "center", marginTop: 10 },
  buttonText:  { color: "#fff", fontSize: 16 },
  switchRow:   { flexDirection: "row", alignItems: "center", marginTop: 10 },
  switchLabel: { marginLeft: 8 },
});
