import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";

export default function ControllerRC() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.title}>Controller RC</Text>

      <View style={styles.cameraContainer}>
        <WebView
          source={{ uri: "http://172.16.206.24:5000" }}
          style={styles.camera}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Main")}
      >
        <Text style={styles.buttonText}>Exit</Text>
      </Pressable>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    color: "white",
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },

  cameraContainer: {
    width: "95%",
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "black",
  },

  camera: {
    flex: 1,
  },

  button: {
    marginTop: 30,
    backgroundColor: "#ff4444",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});