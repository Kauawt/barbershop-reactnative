import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Scissors } from 'lucide-react-native';
import CustomInput from '../components/inputs/CustomInput';
import CustomMaskInput from '../components/inputs/CustomMaskInput';
import Header from '../components/Header';
import Footer from '../components/Footer';
import APIService from '../services/APIService';
import app from '../services/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';

export default function Login() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [cep, setCep] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [password, setPassword] = useState('');

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

  const router = useRouter();

  function convertToISODate(dateStr: string): string {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
  }

  const handleNext = async () => {
    if (step === 1) {
      if (!name || !cpf || !birthdate || !email) {
        Alert.alert("Preencha todos os campos obrigatórios.");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        Alert.alert("E-mail inválido.");
        return;
      }

      setStep(2);
    } else {
      if (!address || !number || !neighborhood || !cep || !securityKey || !password) {
        Alert.alert("Preencha todos os campos obrigatórios.");
        return;
      }

      try {
        await APIService.cliente.create({
          name,
          email,
          senha: password,
          CPF: cpf,
          dataNascimento: convertToISODate(birthdate),
          chaveSeguraRecuperaSenha: securityKey,
          endereco: `${address}, ${number}, ${neighborhood}, ${cep}`,
          role: 'cliente',
        });

        Alert.alert("Cadastro concluído!", "Redirecionando para o login...");
        router.replace("/login");
      } catch (error) {
        Alert.alert("Erro ao cadastrar", "Tente novamente mais tarde.");
        console.error("Erro no cadastro:", error);
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
                <CustomMaskInput placeholder="Data de Nascimento (DD/MM/AAAA)" value={birthdate} onChangeText={setBirthdate} maskType="date" keyboardType="numeric" />
                <CustomInput placeholder="E-mail" value={email} onChangeText={setEmail} />
              </>
            ) : (
              <>
                <CustomInput placeholder="Endereço (Rua)" value={address} onChangeText={setAddress} />
                <CustomInput placeholder="Número" value={number} onChangeText={setNumber} />
                <CustomInput placeholder="Bairro" value={neighborhood} onChangeText={setNeighborhood} />
                <CustomInput placeholder="CEP" value={cep} onChangeText={setCep} />
                <CustomInput placeholder="Chave de Segurança" value={securityKey} onChangeText={setSecurityKey} />
                <CustomInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
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
