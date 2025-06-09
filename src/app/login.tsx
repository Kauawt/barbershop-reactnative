import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View, ScrollView , Platform } from 'react-native';
import { Scissors, Loader2  } from 'lucide-react-native';
import CustomInput from '../components/inputs/CustomInput';
import Header from '../components/Header';
import Footer from '../components/Footer';
import APIService from '../services/APIService';
import app from '../services/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';

export default function Login() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

        if (Platform.OS !== 'web') {
          await SecureStore.setItemAsync('token', userCredential.user.uid);
        }
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="items-center justify-start p-4 mt-4">
          <View className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <View className="flex-row items-center mb-4">
              <Scissors className="h-6 w-6 text-barber-gold" />
              <Text className="text-xl font-bold ml-2">Inova Barbearia</Text>
            </View>

            <View className="space-y-4">
              <CustomInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <CustomInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-yellow-500 hover:bg-yellow-400 rounded-lg px-6 py-2 mx-auto w-40"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <View className="flex-row items-center justify-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <Text className="text-black font-semibold text-base">Entrando...</Text>
                  </View>
                ) : (
                  <Text className="text-black font-semibold text-base text-center">Entrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.replace("/register")}>
                <Text className="text-barber-gold text-center">Não tem uma conta? Cadastre-se</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/forgot-password')}>
              <Text className="text-gray-800 text-center mt-4">Esqueci minha senha</Text>
            </TouchableOpacity>
            </View>
          </View>
          <View className="h-16" />
        </View>
       
     <Footer />
       </ScrollView>
        
    </View>
    
  );
}
