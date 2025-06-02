import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { Scissors, Loader2 } from "lucide-react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (isLoginTab) {
        if (password === "123") {
          router.replace("/");
        } else {
          Alert.alert("Erro", "Senha incorreta!");
        }
      } else {
        Alert.alert("Registro realizado com sucesso!");
        router.replace("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1">
      <Header />
      <View className="flex-1 items-center justify-start p-4 mt-4">
        <View className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <View className="flex-row items-center mb-4">
            <Scissors className="h-6 w-6 text-barber-gold" />
            <Text className="text-xl font-bold ml-2">BarberAgendaPro</Text>
          </View>
          
          {isLoginTab ? (
            <View className="space-y-4">
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                className="border border-gray-300 rounded-lg p-2"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="border border-gray-300 rounded-lg p-2"
              />
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-barber-dark text-white p-3 rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <View className="flex flex-row items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <Text>Entrando...</Text>
                  </View>
                ) : (
                  <Text>Entrar</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsLoginTab(false)}>
                <Text className="text-barber-gold text-center">Não tem uma conta? Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="space-y-4">
              <TextInput
                placeholder="Nome Completo"
                value={name}
                onChangeText={setName}
                className="border border-gray-300 rounded-lg p-2"
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                className="border border-gray-300 rounded-lg p-2"
              />
              <TextInput
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="border border-gray-300 rounded-lg p-2"
              />
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-barber-dark text-white p-3 rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <View className="flex flex-row items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <Text>Cadastrando...</Text>
                  </View>
                ) : (
                  <Text>Cadastrar</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsLoginTab(true)}>
                <Text className="text-barber-gold text-center">Já tem uma conta? Faça login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="h-16" />
      </View>

      <Footer />
    </View>
  );
}