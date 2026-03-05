import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Main() {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Screen</Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("ControllerRC")}
      >
        <Text style={styles.buttonText}>Aller vers ControllerRC</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 15,
  },
  buttonText: { color: "#fff", fontSize: 16 },
});