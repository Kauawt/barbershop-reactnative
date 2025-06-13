import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../services/firebase";
import LoginHeader from "../components/LoginHeader";
import Footer from "../components/Footer";
import APIService from "../services/APIService";
import { Eye, EyeOff } from "lucide-react-native";

export default function Cadastro() {
  const router = useRouter();
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    salario: ""
  });

  const handleSubmit = async () => {
    if (!formData.nome || !formData.email || !formData.senha || !formData.telefone) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.senha
      );

      const user = userCredential.user;

      const userData = {
        name: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone,
        role: "cliente",
        firebase_uid: user.uid
      };

      await APIService.usuario.create(userData);

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      router.replace("/login");
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      let mensagem = "Erro ao realizar cadastro. Tente novamente.";

      if (error.code === "auth/email-already-in-use") {
        mensagem = "Este email já está em uso";
      } else if (error.code === "auth/weak-password") {
        mensagem = "A senha deve ter pelo menos 6 caracteres";
      }

      Alert.alert("Erro", mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <LoginHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-4 py-8">
          <View className="max-w-md w-full mx-auto">
            <Text className="text-2xl font-bold mb-6 text-center">Cadastro</Text>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 mb-2">Nome Completo</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChangeText={(text) => setFormData({ ...formData, nome: text })}
                />
              </View>

              <View>
                <Text className="text-gray-700 mb-2">Email</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Seu email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
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
                    value={formData.senha}
                    onChangeText={(text) => setFormData({ ...formData, senha: text })}
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

              <View>
                <Text className="text-gray-700 mb-2">Telefone</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Seu telefone"
                  value={formData.telefone}
                  onChangeText={(text) => setFormData({ ...formData, telefone: text })}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="bg-[#b58900] p-4 rounded-lg mt-6"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-medium">Cadastrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/login")}
                className="mt-4"
              >
                <Text className="text-[#b58900] text-center">
                  Já tem uma conta? Faça login
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