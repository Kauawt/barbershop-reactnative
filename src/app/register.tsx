// src/app/Register.tsx
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import CustomInput from '../components/inputs/CustomInput';
import CustomMaskInput from '../components/inputs/CustomMaskInput';

export default function Register() {
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

  const handleNext = () => {
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
      if (!address || !number || !neighborhood || !cep || !securityKey) {
        Alert.alert("Preencha todos os campos obrigatórios.");
        return;
      }
      console.log({
        name,
        cpf,
        birthdate,
        email,
        address,
        number,
        neighborhood,
        cep,
        securityKey,
      });
      Alert.alert("Cadastro concluído! Redirecionando para o login...");
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
                value={birthdate}
                onChangeText={(masked) => setBirthdate(masked)}
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
                value={address}
                onChangeText={setAddress}
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
                placeholder="Chave de Segurança"
                value={securityKey}
                onChangeText={setSecurityKey}
                secureTextEntry={false}
              />
            </>
          )}

          <TouchableOpacity 
            className="bg-gray-100 rounded-lg py-2 items-center mb-4"
            onPress={handleNext}
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