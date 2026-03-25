import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApi } from "../providers/ProviderUrl";
import { useState, useEffect } from "react";

export default function Login() {
  const navigation = useNavigation();
  const { login, create_user, user } = useApi();

  // LOGIN
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [stayConnected, setStayConnected] = useState(false);

  // REGISTER
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => {
    if (user) navigation.replace("Tabs");
  }, [user]);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      Alert.alert("Erreur", "Remplis tous les champs (login)");
      return;
    }

    try {
      const success = await login(
        loginUsername,
        loginPassword,
        stayConnected
      );

      if (success) {
        navigation.replace("Tabs");
      } else {
        Alert.alert("Erreur", "Identifiants invalides");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur serveur");
    }
  };

  // =========================
  // REGISTER
  // =========================
  const handleRegister = async () => {
    if (!registerUsername || !registerPassword) {
      Alert.alert("Erreur", "Remplis tous les champs (register)");
      return;
    }

    try {
      await create_user(registerUsername, registerPassword);

      Alert.alert("Succès", "Compte créé !");

      setRegisterUsername("");
      setRegisterPassword("");
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur création compte");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <View style={styles.container}>
      {/* LOGIN (gauche) */}
      <View style={styles.column}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={loginUsername}
          onChangeText={(t) => setLoginUsername(t.toLowerCase())}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={loginPassword}
          onChangeText={(t) => setLoginPassword(t.toLowerCase())}
        />

        <View style={styles.switchRow}>
          <Switch value={stayConnected} onValueChange={setStayConnected} />
          <Text style={styles.switchText}>Stay connected</Text>
        </View>

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>

      {/* BARRE CENTRALE */}
      <View style={styles.divider} />

      {/* REGISTER (droite) */}
      <View style={styles.column}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={registerUsername}
          onChangeText={(t) => setRegisterUsername(t.toLowerCase())}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={registerPassword}
          onChangeText={(t) => setRegisterPassword(t.toLowerCase())}
        />

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // ✅ SPLIT HORIZONTAL
    backgroundColor: "#fff",
  },

  column: {
    flex: 1, // ✅ 50%
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },

  divider: {
    width: 1,
    backgroundColor: "#ccc",
    marginVertical: 40,
  },

  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  switchText: {
    marginLeft: 8,
  },
});