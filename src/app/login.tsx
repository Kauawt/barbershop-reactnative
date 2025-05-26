import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import CustomInput from '../components/inputs/CustomInput';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 bg-white relative">
      <Image
        source={require('../assets/barbershop.jpg')}
        className="absolute inset-0 w-full h-full opacity-50"
        resizeMode="cover"
      />

      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-white mb-2">Barbearia JP Cortes</Text>
        </View>

        <View>
          <CustomInput
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            secureTextEntry={false}
          />
          <CustomInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <TouchableOpacity className="bg-gray-100 rounded-lg py-2 items-center mb-4  w-full max-w-xs mx-auto">
            <Text className="text-gray-800 font-semibold text-base">Confirmar</Text>
          </TouchableOpacity>
          <View className="items-center justify-center">
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text className="text-gray-800">Registrar</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/forgot-password" asChild>
              <TouchableOpacity>
                <Text className="text-gray-800">Esqueci minha senha</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}