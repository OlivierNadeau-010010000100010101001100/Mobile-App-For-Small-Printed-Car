import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";

export default function ControllerRoundButtonsSides() {
  const [activeDirections, setActiveDirections] = useState({
    Avancer: false,
    Reculer: false,
    Gauche: false,
    Droite: false,
  });

  const handleTouchStart = (dir) => {
    setActiveDirections((prev) => {
      // Commence par copier l'état actuel
      const newState = { ...prev };

      // Si on active Avancer ou Reculer, désactive l'opposé
      if (dir === "Avancer") newState.Reculer = false;
      if (dir === "Reculer") newState.Avancer = false;

      // Si on active Gauche ou Droite, désactive l'opposé
      if (dir === "Gauche") newState.Droite = false;
      if (dir === "Droite") newState.Gauche = false;

      // Active le bouton appuyé
      newState[dir] = true;

      return newState;
    });
    console.log("Début :", dir);
  };

  const handleTouchEnd = (dir) => {
    setActiveDirections((prev) => ({ ...prev, [dir]: false }));
    console.log("Fin :", dir);
  };

  const BUTTON_SIZE = 80;

  const renderButton = (dir, triangleStyle) => (
    <Pressable
      style={[
        styles.roundButton,
        { width: BUTTON_SIZE, height: BUTTON_SIZE },
        activeDirections[dir] && { backgroundColor: "#ff7777" }, // visuel actif
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
    marginBottom: 40,
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