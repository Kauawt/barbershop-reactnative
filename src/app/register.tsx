// src/app/Register.tsx
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Platform, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getAuth, createUserWithEmailAndPassword, User } from 'firebase/auth';
import app from '../services/firebase';
import { Scissors } from 'lucide-react-native';
import CustomInput from '../components/inputs/CustomInput';
import CustomMaskInput from '../components/inputs/CustomMaskInput';
import Header from '../components/Header';
import Footer from '../components/Footer';
import APIService from '../services/APIService';

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setdataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [cep, setCep] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter();
  const auth = getAuth(app);

  function convertToISODate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  const handleNext = async () => {
    if (step === 1) {
      if (!name || !cpf || !dataNascimento || !email) {
        Alert.alert("Preencha todos os campos obrigatórios.");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        Alert.alert("E-mail inválido.");
        return;
      }

      setStep(2);
    } else {
      if (!endereco || !number || !neighborhood || !cep || !senha) {
        Alert.alert("Preencha todos os campos obrigatórios.");
        return;
      }

      await handleRegister();
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

      console.log("Usuário criado:", userCredential.user.uid);

      await APIService.cliente.create({
        firebase_uid: userCredential.user.uid,
        name,
        email,
        senha,
        CPF: cpf,
        dataNascimento: convertToISODate(dataNascimento),
        endereco: `${endereco}, ${number}, ${neighborhood}, ${cep}`,
        role: 'cliente',
      });

      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync("token", userCredential.user.uid);
      }

      Alert.alert("Cadastro concluído!", "Redirecionando para o login...");
      router.replace("/login");
    } catch (error: any) {
      const errorCode = error.code;

      switch (errorCode) {
        case "auth/email-already-in-use":
          Alert.alert("Erro", "Este e-mail já está em uso.");
          break;
        case "auth/invalid-email":
          Alert.alert("Erro", "E-mail inválido.");
          break;
        case "auth/weak-password":
          Alert.alert("Erro", "A senha é muito fraca.");
          break;
        default:
          Alert.alert("Erro", error.message || "Erro ao registrar usuário.");
          break;
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView className="flex-1">
        <View className="flex-1 items-center justify-center p-4">
          <View className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <View className="flex-row items-center mb-4">
              <Scissors className="h-6 w-6 text-yellow-400" />
              <Text className="text-xl font-bold">Inova Barbearia</Text>
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

              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className="text-gray-800 text-center mt-4">Já possui conta? Faça login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
        <View className="h-10" />
        <Footer />
      </ScrollView>
    </View>
  );
}
