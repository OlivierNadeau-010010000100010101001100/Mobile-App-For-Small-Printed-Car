import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from "react-native";
import useRcStore from "../store/useRcStore";

export default function ControllerRoundButtonsSides() {
  const { send, connected } = useRcStore();
  const [timestamp, setTimestamp] = useState(Date.now());

  const [activeDirections, setActiveDirections] = useState({
    Avancer: false,
    Reculer: false,
    Gauche: false,
    Droite: false,
  });

  useEffect(() => {
    const interval = setInterval(() => setTimestamp(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);

  const COMMAND_MAP = {
    Avancer: { press: "forward",  release: "forwardStop"  },
    Reculer: { press: "backward", release: "backwardStop" },
    Gauche:  { press: "left",     release: "leftStop"     },
    Droite:  { press: "right",    release: "rightStop"    },
  };

  const handleTouchStart = (dir) => {
    setActiveDirections((prev) => {
      const newState = { ...prev };
      if (dir === "Avancer") newState.Reculer = false;
      if (dir === "Reculer") newState.Avancer = false;
      if (dir === "Gauche")  newState.Droite  = false;
      if (dir === "Droite")  newState.Gauche  = false;
      newState[dir] = true;
      return newState;
    });
    if (connected) send(COMMAND_MAP[dir].press);
  };

  const handleTouchEnd = (dir) => {
    setActiveDirections((prev) => ({ ...prev, [dir]: false }));
    if (connected) send(COMMAND_MAP[dir].release);
  };

  const BUTTON_SIZE = 80;

  const renderButton = (dir, triangleStyle) => (
    <Pressable
      style={[
        styles.roundButton,
        { width: BUTTON_SIZE, height: BUTTON_SIZE },
        activeDirections[dir] && { backgroundColor: "#ff7777" },
        !connected && styles.disabledButton,
      ]}
      onTouchStart={() => handleTouchStart(dir)}
      onTouchEnd={() => handleTouchEnd(dir)}
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    >
      <View style={[styles.triangle, triangleStyle]} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Contrôle Car</Text>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, connected ? styles.dotConnected : styles.dotDisconnected]} />
        <Text style={styles.statusText}>{connected ? "Connecté" : "Déconnecté"}</Text>
      </View>

      <View style={styles.controlRow}>

        {/* Avancer / Reculer */}
        <View style={styles.sideButtonsVertical}>
          {renderButton("Avancer", styles.upTriangle)}
          {renderButton("Reculer", styles.downTriangle)}
        </View>

        {/* Camera feed */}
        <View style={styles.cameraContainer}>
          <Image
            source={{ uri: `http://172.16.206.24:5000/snapshot?ts=${timestamp}` }}
            style={styles.camera}
            resizeMode="cover"
          />
        </View>

        {/* Gauche / Droite */}
        <View style={styles.sideButtonsHorizontal}>
          {renderButton("Gauche", styles.leftTriangle)}
          {renderButton("Droite", styles.rightTriangle)}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotConnected: {
    backgroundColor: "#44ff88",
  },
  dotDisconnected: {
    backgroundColor: "#ff4444",
  },
  statusText: {
    color: "#aaa",
    fontSize: 14,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  sideButtonsVertical: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  sideButtonsHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    width: 160,
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#333",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  roundButton: {
    borderRadius: 40,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: "#444",
    opacity: 0.5,
  },
  triangle: {
    width: 0,
    height: 0,
    borderStyle: "solid",
  },
  upTriangle: {
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 28,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
  },
  downTriangle: {
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderTopWidth: 28,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
  },
  leftTriangle: {
    borderTopWidth: 18,
    borderBottomWidth: 18,
    borderRightWidth: 28,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "white",
  },
  rightTriangle: {
    borderTopWidth: 18,
    borderBottomWidth: 18,
    borderLeftWidth: 28,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "white",
  },
});