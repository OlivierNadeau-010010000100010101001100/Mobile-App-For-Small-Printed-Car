import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "../stores/useAppStore";
import { useTranslation } from "../i18n";
import { useTheme } from "../hooks/useTheme";
import useRcStore from "../stores/useRcStore";

export default function ControllerText() {
  const navigation = useNavigation();
  const language = useAppStore((s) => s.language);
  const { t } = useTranslation(language);
  const { send, connected } = useRcStore();
  const theme = useTheme();
  const [timestamp, setTimestamp] = useState(Date.now());

  const [activeDirections, setActiveDirections] = useState({
    Avancer: false, Reculer: false, Gauche: false, Droite: false,
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
      const next = { ...prev };
      if (dir === "Avancer") next.Reculer = false;
      if (dir === "Reculer") next.Avancer = false;
      if (dir === "Gauche")  next.Droite  = false;
      if (dir === "Droite")  next.Gauche  = false;
      next[dir] = true;
      return next;
    });
    if (connected) send(COMMAND_MAP[dir].press);
  };

  const handleTouchEnd = (dir) => {
    setActiveDirections((prev) => ({ ...prev, [dir]: false }));
    if (connected) send(COMMAND_MAP[dir].release);
  };

  const BUTTON_SIZE = 95;

  const renderButton = (dir, triangleStyle) => (
    <Pressable
      style={[
        styles.roundButton,
        { width: BUTTON_SIZE, height: BUTTON_SIZE },
        activeDirections[dir] && styles.activeButton,
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{t("controller.back")}</Text>
      </Pressable>

      <Text style={[styles.title, { color: theme.text }]}>{t("controller.title")}</Text>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, connected ? styles.dotConnected : styles.dotDisconnected]} />
        <Text style={[styles.statusText, { color: theme.subText }]}>
          {connected ? t("controller.connected") : t("controller.disconnected")}
        </Text>
      </View>

      <View style={styles.controlRow}>
        <View style={styles.sideButtonsVertical}>
          {renderButton("Avancer", styles.upTriangle)}
          {renderButton("Reculer", styles.downTriangle)}
        </View>

        <View style={styles.cameraContainer}>
          <Image
            source={{ uri: `http://172.16.206.24:5000/snapshot?ts=${timestamp}` }}
            style={styles.camera}
            resizeMode="cover"
          />
        </View>

        <View style={styles.sideButtonsHorizontal}>
          {renderButton("Gauche", styles.leftTriangle)}
          {renderButton("Droite", styles.rightTriangle)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:             { flex: 1, alignItems: "center", paddingTop: 40 },
  backButton:            { backgroundColor: "#ff4444", paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10, marginBottom: 12 },
  backButtonText:        { color: "white", fontSize: 16, fontWeight: "bold" },
  title:                 { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  statusRow:             { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  statusDot:             { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  dotConnected:          { backgroundColor: "green" },
  dotDisconnected:       { backgroundColor: "red" },
  statusText:            { fontSize: 14 },
  controlRow:            { flexDirection: "row", alignItems: "center", gap: 16 },
  sideButtonsVertical:   { flexDirection: "column", gap: 12, alignItems: "center" },
  sideButtonsHorizontal: { flexDirection: "row", gap: 12, alignItems: "center" },
  cameraContainer:       { width: 280, height: 210, borderRadius: 10, overflow: "hidden", backgroundColor: "black", borderWidth: 2 },
  camera:                { width: 280, height: 210 },
  roundButton:           { backgroundColor: "#007AFF", borderRadius: 40, justifyContent: "center", alignItems: "center" },
  activeButton:          { backgroundColor: "#ff7777" },
  disabledButton:        { opacity: 0.4 },
  triangle:              { width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid" },
  upTriangle:            { borderLeftWidth: 14, borderRightWidth: 14, borderBottomWidth: 24, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "white" },
  downTriangle:          { borderLeftWidth: 14, borderRightWidth: 14, borderTopWidth: 24, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "white" },
  leftTriangle:          { borderTopWidth: 14, borderBottomWidth: 14, borderRightWidth: 24, borderTopColor: "transparent", borderBottomColor: "transparent", borderRightColor: "white" },
  rightTriangle:         { borderTopWidth: 14, borderBottomWidth: 14, borderLeftWidth: 24, borderTopColor: "transparent", borderBottomColor: "transparent", borderLeftColor: "white" },
});
