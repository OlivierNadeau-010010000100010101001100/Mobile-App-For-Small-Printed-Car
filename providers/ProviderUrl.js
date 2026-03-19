import React, { createContext, useContext } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const apiUrl = "http://172.16.84.112/server_car.php";

  // Fonction pour faire les requêtes vers ton serveur
  const request = async (route, method = "GET", body = null) => {
    try {
      const url = `${apiUrl}?route=${route}`;

      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API ERROR:", error);
      throw error;
    }
  };

  return (
    <ApiContext.Provider value={{ apiUrl, request }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi doit être utilisé dans ApiProvider");
  }
  return context;
};