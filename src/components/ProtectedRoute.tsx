import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { getAuth } from "firebase/auth";
import app from "../services/firebase";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        let token = null;
        let uid = null;

        if (Platform.OS === "web") {
          token = localStorage.getItem("token");
          uid = localStorage.getItem("uid");
        } else {
          token = await SecureStore.getItemAsync("token");
          uid = await SecureStore.getItemAsync("uid");
        }

        const isAuth = !!(user && token && uid);
        setIsAuthenticated(isAuth);


        if (!isAuth) {
          const isPublicPage = segments[0] === "login" || segments[0] === "cadastro";
          if (!isPublicPage) {
            router.replace("/login");
          }
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [segments]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#b58900" />
      </View>
    );
  }

  return <>{children}</>;
} 