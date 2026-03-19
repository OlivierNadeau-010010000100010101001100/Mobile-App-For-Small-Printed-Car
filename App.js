import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import RootNavigator from "./navigations/RootNavigator";
import useMqtt from "./hooks/useMqtt";
import { ApiProvider } from "./providers/ProviderUrl";

export default function App() {
  useMqtt();
  return (
    <ApiProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <RootNavigator />
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