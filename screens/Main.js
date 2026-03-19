import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApi } from "../providers/ProviderUrl";

export default function Main() {
  const navigation = useNavigation();
  const { user, logout } = useApi(); // récupérer user et logout

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Déconnexion", "Vous êtes déconnecté(e)");
      navigation.replace("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de se déconnecter");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Screen</Text>

      {/* Afficher le username */}
      {user ? (
        <Text style={styles.username}>Connecté en tant que : {user.username}</Text>
      ) : (
        <Text style={styles.username}>Utilisateur non connecté</Text>
      )}

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("ControllerRC")}
      >
        <Text style={styles.buttonText}>Aller vers ControllerRC</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "red", marginTop: 20 }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Se Déconnecter</Text>
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