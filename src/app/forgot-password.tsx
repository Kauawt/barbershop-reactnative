import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import CustomInput from '../components/inputs/CustomInput';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleNext = () => {
    if (step === 1) {
      if (securityKey === '123') {
        setStep(2);
      } else {
        Alert.alert("Chave de segurança incorreta.");
      }
    } else {
      Alert.alert("Senha redefinida com sucesso!");
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

        <View>
          {step === 1 && (
            <>
              <CustomInput
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                secureTextEntry={false}
              />
              <CustomInput
                placeholder="CPF"
                value={cpf}
                onChangeText={setCpf}
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
          
          {step === 2 && (
            <>
              <CustomInput
                placeholder="Nova Senha"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={true}
              />
            </>
          )}

          <TouchableOpacity className="bg-gray-100 rounded-lg py-2 items-center mb-4 w-full max-w-xs mx-auto" onPress={handleNext}>
            <Text className="text-gray-800 font-semibold text-base">
              {step === 1 ? 'Verificar' : 'Redefinir Senha'}
            </Text>
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
    </View>
  );
}