import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const apiUrl = "http://172.16.84.112/server_car.php";

  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

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

  // =========================
  // REQUEST UTILE
  // =========================
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

  // =========================
  // LOGIN / LOGOUT
  // =========================
  const login = async (username, password, stayConnected = false) => {


     const fakeUser = { user_id: 1, username: "dev" };
      setUser(fakeUser);
      return true;




    const users = await request("users");
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (found) {
      setUser(found);
      setIsConnected(stayConnected);

      if (stayConnected) {
        await AsyncStorage.setItem("user", JSON.stringify(found));
        await AsyncStorage.setItem("isConnected", "true");
        await AsyncStorage.setItem("userId", found.user_id.toString());
      } else {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("isConnected");
        await AsyncStorage.removeItem("userId");
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
    await AsyncStorage.removeItem("userId");
  };

  // =========================
  // USERS
  // =========================
  const create_user = async (username, password) => {
    const body = { username, password };
    return await request("users", "POST", body);
  };

  // =========================
  // BEER SCHEDULES
  // =========================
  const get_beer_schedule = async (userId) => {
    return await request(`users/${userId}/schedules`);
  };

  const create_beer_schedule = async (userId, time_departure, distance_to_dropzone) => {
    const body = { time_departure, distance_to_dropzone };
    return await request(`users/${userId}/schedules`, "POST", body);
  };

  const delete_beer_schedule = async (userId, scheduleId) => {
    return await request(`users/${userId}/schedules/${scheduleId}`, "DELETE");
  };

  return (
    <ApiContext.Provider
      value={{
        apiUrl,
        request,
        user,
        isConnected,
        login,
        logout,
        create_user,
        get_beer_schedule,
        create_beer_schedule,
        delete_beer_schedule,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error("useApi doit être utilisé dans ApiProvider");
  return context;
};