"use client";

import { tAlert } from "@shared/utils/types/Alert";
import React, { createContext, useContext, useState } from "react";

interface GlobalContextType {
  alerts: tAlert[];
  setAlerts: (alerts: tAlert[]) => void;
  addAlert: (alert: Omit<tAlert, 'id'>) => void;
  removeAlert: (id: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<tAlert[]>([]);

  const addAlert = (alert: Omit<tAlert, 'id'>) => {
    const newAlert = { ...alert, id: Math.random().toString(36).substring(2, 9) };
    setAlerts((prev) => [...prev, newAlert]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter(alert => alert.id !== id));
  };

  return (
    <GlobalContext.Provider value={{ alerts, setAlerts, addAlert, removeAlert }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
};
