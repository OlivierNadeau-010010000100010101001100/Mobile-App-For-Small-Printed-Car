import { View, Text, Pressable, StyleSheet, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApi } from "../providers/ProviderUrl";
import { useState } from "react";

export default function Login() {
  const navigation = useNavigation();
  const { request } = useApi(); // ✅

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const ConnectionController = async () => {
    try {
      // 🔥 récupérer tous les users
      const users = await request("users");

      // 🔎 vérifier login en minuscules
      const user = users.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() &&
          u.password.toLowerCase() === password.toLowerCase()
      );

      if (user) {
        console.log("Connecté :", user);
        Alert.alert("Succès", "Connexion réussie");

        // navigation vers l'écran Main
        navigation.navigate("Main");
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

      {/* Username */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text.toLowerCase())} // forcer minuscule
        autoCapitalize="none"
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text.toLowerCase())} // forcer minuscule
        autoCapitalize="none"
      />

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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});