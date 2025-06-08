
// src/app/Register.tsx
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getAuth, createUserWithEmailAndsenha, User } from 'firebase/auth';
import app from '../services/firebase';
import { Alert, Image, Platform, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Scissors } from 'lucide-react-native';
import CustomInput from '../components/inputs/CustomInput';
import CustomMaskInput from '../components/inputs/CustomMaskInput';
import Header from '../components/Header';
import Footer from '../components/Footer';
import APIService from '../services/APIService';

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setdataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [cep, setCep] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter();
  const auth = getAuth(app);

  function convertToISODate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  const handleNext = () => {
    if (step === 1) {
      if (!name || !cpf || !dataNascimento || !email) {
        Alert.alert("Preencha todos os campos obrigatórios.");
        console.log("Preencha todos os campos")
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        Alert.alert("E-mail inválido.");
        console.log("email inválido")
        return;
      }
      setStep(2);
    } else {
      if (!endereco || !number || !neighborhood || !cep || !senha) {
        Alert.alert("Preencha todos os campos obrigatórios.");
        return;
      }
      console.log({
        name,
        cpf,
        dataNascimento,
        email,
        endereco,
        number,
        neighborhood,
        cep,
        senha,
      });

      Alert.alert("Cadastro concluído! Redirecionando para o login...");
    }
  }
  const handleRegister = async () => {
    if (!endereco || !number || !neighborhood || !cep || !senha) {
      Alert.alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndsenha(auth, email, senha);
      setFirebaseUser(userCredential.user);

      console.log("Usuário criado:", userCredential.user.uid);

      await APIService.cliente.create({
        name,
        email,
        senha: senha,
        CPF: cpf,
        dataNascimento: convertToISODate(dataNascimento),
        chaveSeguraRecuperaSenha: securityKey,
        endereco: `${endereco}, ${number}, ${neighborhood}, ${cep}`,
        role: 'cliente',
      });

      Alert.alert("Cadastro concluído!", "Redirecionando para o login...");
      router.replace("/login");
      if (!response.ok) {
        throw new Error("Erro ao registrar no banco");
      }

      alert("Cadastro realizado com sucesso!");

      if (Platform.OS !== 'web') {
        if (firebaseUser) {
          await SecureStore.setItemAsync("token", userCredential.user.uid);
        }
      }
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.error("Erro ao registrar:", errorCode, errorMessage);
      console.error("Erro no registro:", error);
      Alert.alert("Erro", error.message || "Erro ao registrar.");

      switch (errorCode) {
        case "auth/email-already-in-use":
          Alert.alert("Erro", "Este e-mail já está em uso.");
          break;
        case "auth/invalid-email":
          Alert.alert("Erro", "E-mail inválido.");
          break;
        case "auth/weak-senha":
          Alert.alert("Erro", "A senha é muito fraca.");
          break;
        default:
          Alert.alert("Erro", "Erro ao registrar usuário.");
      }
    }
  };
  return (
    <View className="flex-1 bg-white">
      <Header />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <View className="flex-row items-center mb-4">
            <Scissors className="h-6 w-6 text-barber-gold" />
            <Text className="text-xl font-bold ml-2">JP Barbearia</Text>
          </View>

          <View className="space-y-4">
            {step === 1 ? (
              <>
                <CustomInput placeholder="Nome" value={name} onChangeText={setName} />
                <CustomMaskInput placeholder="CPF" value={cpf} onChangeText={setCpf} maskType="cpf" keyboardType="numeric" />
                <CustomMaskInput placeholder="Data de Nascimento (DD/MM/AAAA)" value={dataNascimento} onChangeText={setdataNascimento} maskType="date" keyboardType="numeric" />
                <CustomInput placeholder="E-mail" value={email} onChangeText={setEmail} />
              </>
            ) : (
              <>
                <CustomInput placeholder="Endereço (Rua)" value={endereco} onChangeText={setEndereco} />
                <CustomInput placeholder="Número" value={number} onChangeText={setNumber} />
                <CustomInput placeholder="Bairro" value={neighborhood} onChangeText={setNeighborhood} />
                <CustomInput placeholder="CEP" value={cep} onChangeText={setCep} />
                <CustomInput placeholder="Chave de Segurança" value={securityKey} onChangeText={setSecurityKey} />
                <CustomInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
              </>
            )}

            <TouchableOpacity
              onPress={handleNext}
              className="bg-yellow-500 hover:bg-yellow-400 rounded-lg px-6 py-2 mx-auto w-40"
            >
              <Text className="text-black font-semibold text-base text-center">
                {step === 1 ? 'Avançar' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>

            {step === 2 && (
              <TouchableOpacity
                onPress={() => router.replace('/login')}
                className="bg-yellow-500 hover:bg-yellow-400 rounded-lg px-6 py-2 mx-auto w-40"
              >
                <Text className="text-black font-semibold text-base text-center">
                  Ir para Login
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="h-10" />
        <Footer />
      </ScrollView>
    </View>
  );
}
