import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { Scissors, Loader2 } from "lucide-react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import app from '../app/services/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';

export default function Login() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const auth = getAuth(app);

const handleSubmit = async () => {
  if (!email || !password) {
    Alert.alert("Erro", "Preencha todos os campos.");
    return;
  }

  setIsSubmitting(true);

  try {
    if (isLoginTab) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuário logado:", userCredential.user);

      await SecureStore.setItemAsync('token', userCredential.user.uid);

      router.replace("/");
    } else {
      const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuário cadastrado:", newUserCredential.user);

      await SecureStore.setItemAsync('token', newUserCredential.user.uid);

      Alert.alert("Cadastro realizado com sucesso!");
      router.replace("/");
    }
  } catch (error: any) {
    console.error(error);
    Alert.alert("Erro", error.message || "Erro ao autenticar.");
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
                  <View className="flex flex-row items-center justify-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <Text>Entrando...</Text>
                  </View>
                ) : (
                  <Text className="text-white text-center">Entrar</Text>
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
                  <View className="flex flex-row items-center justify-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <Text>Cadastrando...</Text>
                  </View>
                ) : (
                  <Text className="text-white text-center">Cadastrar</Text>
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
