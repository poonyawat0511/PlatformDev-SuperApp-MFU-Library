// contexts/AuthContext.tsx
import React, { useContext, createContext, PropsWithChildren, useState } from 'react';
import { useStorageState } from "@/hooks/useStorageState";
import { AuthResponse } from "@/types/auth";
import { $API } from "@/utils/api/api";
import { ApiService } from "@/utils/api/apiServiceTypes";

const AuthContext = createContext<{
  logIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  logIn: async () => {},
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const logIn = async (email: string, password: string) => {
    try {
      const response = await $API<AuthResponse>(
        ApiService.AUTH,
        "/login",
        "POST",
        { email, password }
      );
      setSession(response.data.token); // Save the token to the session state
    } catch (error) {
      console.error("Sign-in error:", error);
      // Handle sign-in error (e.g., show an alert or message)
    }
  };

  const signOut = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        logIn,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
