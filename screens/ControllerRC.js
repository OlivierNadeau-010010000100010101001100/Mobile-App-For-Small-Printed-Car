import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../hooks/useTheme";

export default function ControllerRC() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTimestamp(Date.now()), 200);
    return () => clearInterval(interval);
  }, []);

  const videoUrl = `http://172.16.206.24:5000/video?ts=${timestamp}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Controller RC</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Main")}>
        <Text style={styles.buttonText}>Exit</Text>
      </Pressable>

      <View style={styles.cameraContainer}>
        <Image source={{ uri: videoUrl }} style={styles.camera} resizeMode="cover" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // backgroundColor removed — now uses theme inline
  },
  title: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
    // color removed — now uses theme inline
  },
  cameraContainer: {
    width: "95%",
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "black", // camera bg stays black always
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: 320,
    height: 240,
    resizeMode: "contain",
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