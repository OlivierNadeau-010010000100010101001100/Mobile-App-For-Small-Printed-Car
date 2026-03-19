import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const apiUrl = "http://172.16.84.112/server_car.php";

  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // ✅ déclarer setIsConnected

  // au démarrage, récupérer l'utilisateur si isConnected=true
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedConnected = await AsyncStorage.getItem("isConnected");
        if (storedUser && storedConnected === "true") {
          setUser(JSON.parse(storedUser));
          setIsConnected(true);
        }
      } catch (e) {
        console.error("Erreur récupération user AsyncStorage:", e);
      }
    };
    loadUser();
  }, []);

  // login avec option “stayConnected”
  const login = async (username, password, stayConnected = false) => {
    const users = await request("users");
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password.toLowerCase() === password.toLowerCase()
    );

    if (found) {
      setUser(found);
      setIsConnected(stayConnected);

      if (stayConnected) {
        await AsyncStorage.setItem("user", JSON.stringify(found));
        await AsyncStorage.setItem("isConnected", "true");
      } else {
        // supprimer tout ancien stockage si pas stayConnected
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("isConnected");
      }

      return true;
    }

    return false;
  };

  const logout = async () => {
    setUser(null);
    setIsConnected(false);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("isConnected");
  };

  // fonction générique pour requêtes API
  const request = async (route, method = "GET", body = null) => {
    try {
      const url = `${apiUrl}?route=${route}`;
      const options = { method, headers: { "Content-Type": "application/json" } };
      if (body) options.body = JSON.stringify(body);
      const response = await fetch(url, options);
      return await response.json();
    } catch (error) {
      console.error("API ERROR:", error);
      throw error;
    }
  };

  return (
    <ApiContext.Provider value={{ apiUrl, request, user, isConnected, login, logout }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error("useApi doit être utilisé dans ApiProvider");
  return context;
};