import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import NavigationMain from "./navigations/navigation";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationMain />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
