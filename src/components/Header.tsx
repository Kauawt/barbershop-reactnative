import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
import { useRouter } from 'expo-router';
import { Scissors, Menu, X, User } from "lucide-react-native";
import { getAuth, signOut } from "firebase/auth";
import firebaseApp from '../services/firebase';
import APIService from "../services/APIService";
import * as SecureStore from "expo-secure-store";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width } = useWindowDimensions();
  const auth = getAuth(firebaseApp);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  const currentUser = auth.currentUser;
  const isLargeScreen = width >= 768;

  useEffect(() => {
    const fetchUserNameAndRole = async () => {
      try {
        let id = "";
        if (Platform.OS === "web") {
          id = localStorage.getItem("uid") || "";
        } else {
          id = await SecureStore.getItemAsync("uid") || "";
        }

        if (id) {
          try {
            const userResponse = await APIService.usuario.getById(id);
            setUserRole(userResponse.role);
            setUserName(userResponse.name || userResponse.email || "Perfil");
          } catch {
            try {
              const clienteResponse = await APIService.cliente.getById(id);
              setUserRole(clienteResponse.role);
              setUserName(clienteResponse.name || clienteResponse.email || "Perfil");
            } catch (clienteError) {
              console.error("Erro ao verificar role:", clienteError);
              setUserRole("");
              setUserName("Perfil");
            }
          }
        } else {
          setUserName("Perfil");
        }
      } catch (error) {
        console.error("Erro ao verificar role:", error);
        setUserRole("");
        setUserName("Perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserNameAndRole();
  }, []);

  const primeiroNome = userName?.split(' ')[0] || userName;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (Platform.OS === "web") {
        localStorage.removeItem("token");
        localStorage.removeItem("uid");
      } else {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("uid");
      }
      router.replace('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <View className="bg-black py-4 px-4 w-full z-50">
      <View className="flex-row items-center">
        {/* LOGO com flex-1 para separar do conteúdo da direita */}
        <View className="flex-1">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => router.replace('/')}>
            <Scissors className="h-6 w-6 text-yellow-400" />
            <Text className="text-xl font-bold ml-2 py-2 text-white">Inova Barbearia</Text>
          </TouchableOpacity>
        </View>

        {/* Navegação para telas grandes */}
        {isLargeScreen ? (
          <View className="flex-row items-center space-x-6">
            <TouchableOpacity onPress={() => router.replace('/services')}>
              <Text className="text-white">Serviços</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/agendamento')}>
              <Text className="text-white">Agendar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text className="text-white">Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center bg-white border border-yellow-400 rounded-md px-3 py-1"
              onPress={() => router.replace('/profile')}
            >
              <User className="h-4 w-4 text-black mr-2" />
              <Text className="text-black font-semibold text-sm">{primeiroNome}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Botão do menu hamburguer
          <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Menu para mobile */}
      {!isLargeScreen && isMenuOpen && (
        <View className="mt-2 px-4 py-2 bg-black rounded-lg shadow-md">
          <TouchableOpacity
            onPress={() => { router.replace('/services'); setIsMenuOpen(false); }}
            className="py-2"
          >
            <Text className="text-white">Serviços</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { router.replace('/agendamento'); setIsMenuOpen(false); }}
            className="py-2"
          >
            <Text className="text-white">Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { handleLogout(); setIsMenuOpen(false); }}
            className="py-2"
          >
            <Text className="text-red-400">Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { router.replace('/profile'); setIsMenuOpen(false); }}
            className="py-2"
          >
            <Text className="text-barber-gold">Perfil</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;
