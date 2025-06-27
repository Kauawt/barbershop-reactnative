import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import CustomInput from '../components/inputs/CustomInput';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/auth'
import * as SecureStore from "expo-secure-store";
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const auth = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Por favor, preencha o e-mail.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Verifique seu e-mail para redefinir a senha.");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro ao enviar e-mail de recuperação.");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header />

      <View className="flex-1 items-center justify-center px-4">
        <View className="bg-white rounded-2xl shadow-md p-6 w-full max-w-xs">
          <Text className="text-xl font-bold text-gray-800 text-center mb-4">
            Recuperar Senha
          </Text>

          <CustomInput
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            className="bg-gray-800 rounded-lg py-2 items-center mt-2"
            onPress={handleResetPassword}
          >
            <Text className="text-white font-semibold text-base">Enviar e-mail</Text>
          </TouchableOpacity>

          <View className="items-center mt-4">
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-gray-600 text-sm">Voltar para o Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      <Footer />
    </View>
  );
}
