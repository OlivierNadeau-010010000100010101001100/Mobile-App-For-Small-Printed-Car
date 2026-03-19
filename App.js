import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import NavigationMain from "./navigations/navigation";
import useMqtt from "./hooks/useMqtt";
import { ApiProvider } from "./providers/ProviderUrl";

export default function App() {
  useMqtt();

  return (
    <ApiProvider>
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationMain />
    </View>
    </ApiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});