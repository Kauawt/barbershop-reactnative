// src/app/Register.tsx
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import CustomInput from '../components/inputs/CustomInput';
import CustomMaskInput from '../components/inputs/CustomMaskInput';
import * as SecureStore from 'expo-secure-store';
import { getAuth, createUserWithEmailAndPassword, User } from 'firebase/auth';
import app from '../services/firebase';

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setdataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setendereco] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [cep, setCep] = useState('');
  const [senha, setsenha] = useState('');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  const auth = getAuth(app);

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      setFirebaseUser(userCredential.user);

      console.log("Usuário criado:", userCredential.user.uid);

      const response = await fetch("http://localhost:5000/api/clientes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firebase_uid: userCredential.user.uid,
          name,
          cpf,
          dataNascimento,
          email,
          endereco,
          number,
          neighborhood,
          cep,
          senha,
          role: "client"
        })
      });
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
        case "auth/weak-password":
          Alert.alert("Erro", "A senha é muito fraca.");
          break;
        default:
          Alert.alert("Erro", "Erro ao registrar usuário.");
      }
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
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Registrar
          </Text>
        </View>

        <View className="w-full max-w-xs mx-auto">
          {step === 1 && (
            <>
              <CustomInput
                placeholder="Nome"
                value={name}
                onChangeText={setName}
                secureTextEntry={false}
              />
              <CustomMaskInput
                placeholder="CPF"
                value={cpf}
                onChangeText={(masked) => setCpf(masked)}
                maskType="cpf"
                keyboardType="numeric"
              />
              <CustomMaskInput
                placeholder="Data de Nascimento (DD/MM/AAAA)"
                value={dataNascimento}
                onChangeText={(masked) => setdataNascimento(masked)}
                maskType="date"
                keyboardType="numeric"
              />
              <CustomInput
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                secureTextEntry={false}
              />
            </>
          )}

          {step === 2 && (
            <>
              <CustomInput
                placeholder="Endereço (Rua)"
                value={endereco}
                onChangeText={setendereco}
                secureTextEntry={false}
              />
              <CustomInput
                placeholder="Número"
                value={number}
                onChangeText={setNumber}
                secureTextEntry={false}
              />
              <CustomInput
                placeholder="Bairro"
                value={neighborhood}
                onChangeText={setNeighborhood}
                secureTextEntry={false}
              />
              <CustomInput
                placeholder="CEP"
                value={cep}
                onChangeText={setCep}
                secureTextEntry={false}
              />
              <CustomInput
                placeholder="senha"
                value={senha}
                onChangeText={setsenha}
                secureTextEntry={false}
              />
            </>
          )}

          <TouchableOpacity
            className="bg-gray-100 rounded-lg py-2 items-center mb-4"
            onPress={step === 1 ? handleNext : handleRegister}
          >
            <Text className="text-gray-800 font-semibold text-base">
              {step === 1 ? 'Avançar' : 'Finalizar Cadastro'}
            </Text>
          </TouchableOpacity>

          {step === 2 && (
            <Link href="/login" asChild>
              <TouchableOpacity className="bg-blue-600 rounded-lg py-2 items-center mb-4">
                <Text className="text-white font-semibold text-base">Ir para Login</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </View>
    </View>
  );
}