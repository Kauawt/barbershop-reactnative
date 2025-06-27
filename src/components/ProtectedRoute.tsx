import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from '../context/auth';

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
  const auth = useAuth();

  // Defina aqui as rotas que NÃO precisam de autenticação
  const publicRoutes = ["register", "cadastro"];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let token = null;
        let uid = null;

        if (Platform.OS === "web") {
          token = localStorage.getItem("token");
          uid = localStorage.getItem("uid");
        } else {
          token = await SecureStore.getItemAsync("token");
          uid = await SecureStore.getItemAsync("uid");
        }

        // Autenticação baseada apenas na presença do token e uid
        const isAuth = !!(token && uid);
        setIsAuthenticated(isAuth);

        const currentRoute = segments[0] ?? ""; // pega a primeira parte da rota
        const isPublicPage = publicRoutes.includes(currentRoute.toLowerCase());

        if (!isAuth && !isPublicPage) {
          // Usuário não autenticado tentando acessar rota protegida
          router.replace("/login");
        }

        if (isAuth && isPublicPage) {
          // Usuário autenticado tentando acessar página pública (login, cadastro)
          router.replace("/");
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#b58900" />
      </View>
    );
  }

  return <>{children}</>;
}
