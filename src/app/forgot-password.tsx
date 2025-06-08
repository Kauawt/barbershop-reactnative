import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import CustomInput from '../components/inputs/CustomInput';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import app from "../services/firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const auth = getAuth(app);

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
    <View className="flex-1 bg-white relative">
      <Image
        source={require('../assets/barbershop.jpg')}
        className="absolute inset-0 w-full h-full opacity-50"
        resizeMode="cover"
      />

      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-white mb-2">Recuperar Senha</Text>
        </View>

        <CustomInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          secureTextEntry={false}
        />

        <TouchableOpacity
          className="bg-gray-100 rounded-lg py-2 items-center mb-4 w-full max-w-xs mx-auto"
          onPress={handleResetPassword}
        >
          <Text className="text-gray-800 font-semibold text-base">Enviar e-mail</Text>
        </TouchableOpacity>

        <View className="items-center justify-center">
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text className="text-gray-800">Voltar para o Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
