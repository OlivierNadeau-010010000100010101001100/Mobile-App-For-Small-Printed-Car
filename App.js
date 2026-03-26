import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import RootNavigator from "./navigations/RootNavigator";
import useMqtt from "./hooks/useMqtt";
import { ApiProvider } from "./providers/ProviderUrl";
import { useTheme } from "./hooks/useTheme";

function ThemedApp() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.background === "#ffffff" ? "dark" : "light"} />
      <RootNavigator />
    </View>
  );
}

export default function App() {
  useMqtt();
  return (
    <ApiProvider>
      <ThemedApp />
    </ApiProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});