import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from '../context/auth'
import LoginHeader from "../components/LoginHeader";
import Footer from "../components/Footer";
import { Eye, EyeOff } from "lucide-react-native";

export default function Login() {
  const router = useRouter();
  const { user, handleLogin, setUser } = useAuth()
  console.log('Auth context:', user, setUser, handleLogin)
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <LoginHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-4 py-8">
          <View className="max-w-md w-full mx-auto">
            <Text className="text-2xl font-bold mb-6 text-center">Login</Text>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 mb-2">Email</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Seu email"
                  onChangeText={text => setUser({ ...user, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-gray-700 mb-2">Senha</Text>
                <View className="relative">
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 pr-10"
                    placeholder="Sua senha"
                    onChangeText={text => setUser({ ...user, password: text })}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className="bg-[#b58900] p-4 rounded-lg mt-6"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-medium">Entrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/cadastro")}
                className="mt-4"
              >
                <Text className="text-[#b58900] text-center">
                  Não tem uma conta? Cadastre-se
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}
