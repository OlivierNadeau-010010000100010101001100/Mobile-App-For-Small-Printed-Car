import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import useRcStore from "../store/useRcStore";

export default function ControllerRoundButtonsSides() {
  const { send, connected } = useRcStore();

  const [activeDirections, setActiveDirections] = useState({
    Avancer: false,
    Reculer: false,
    Gauche: false,
    Droite: false,
  });

  // Maps French button names to MQTT command strings
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

      {/* Connection status indicator */}
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, connected ? styles.dotConnected : styles.dotDisconnected]} />
        <Text style={styles.statusText}>{connected ? "Connecté" : "Déconnecté"}</Text>
      </View>

      {/* Avancer / Reculer à gauche */}
      <View style={[styles.sideButtonsVertical, { height: BUTTON_SIZE * 2 + 20, left: 20 }]}>
        {renderButton("Avancer", styles.upTriangle)}
        {renderButton("Reculer", styles.downTriangle)}
      </View>

      {/* Gauche / Droite à droite */}
      <View style={[styles.sideButtonsHorizontal, { width: BUTTON_SIZE * 2 + 20, right: 20 }]}>
        {renderButton("Gauche", styles.leftTriangle)}
        {renderButton("Droite", styles.rightTriangle)}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
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
    marginBottom: 30,
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
  sideButtonsVertical: {
    position: "absolute",
    bottom: 80,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  sideButtonsHorizontal: {
    position: "absolute",
    bottom: 20,
    justifyContent: "space-between",
    flexDirection: "row",
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