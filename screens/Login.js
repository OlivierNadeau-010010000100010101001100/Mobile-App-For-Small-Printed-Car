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
  const { login, user } = useApi();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [stayConnected, setStayConnected] = useState(false);

  useEffect(() => {
    if (user) navigation.replace("Tabs")
  }, [user]);

  const ConnectionController = async () => {
    if (!username || !password) {
      Alert.alert("Erreur", "Veuillez entrer votre username et password");
      return;
    }

    try {
      const success = await login(username, password, stayConnected);
      if (success) {
        // Alert.alert("Succès", "Connexion réussie");
        navigation.replace("Tabs");
      } else {
        Alert.alert("Erreur", "Identifiants invalides");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Problème serveur");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text.toLowerCase())}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text.toLowerCase())}
        autoCapitalize="none"
      />

      {/* Switch pour rester connecté */}
      <View style={styles.stayConnectedRow}>
        <Switch value={stayConnected} onValueChange={setStayConnected} />
        <Text style={styles.stayConnectedText}>Rester connecté</Text>
      </View>

      <Pressable style={styles.button} onPress={ConnectionController}>
        <Text style={styles.buttonText}>Se Connecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  stayConnectedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stayConnectedText: { marginLeft: 8, fontSize: 16 },
  button: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
