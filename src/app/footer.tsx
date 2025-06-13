import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

const Footer = () => {
  return (
    <View className="bg-[#1a1a1a] w-full py-6 px-4 fixed bottom-0 left-0 right-0 z-50">
      <View className="items-center space-y-6">
        <Text className="text-white text-lg font-bold mb-4">
          Inova Barbearia
        </Text>
        <View className="flex-row justify-center space-x-8">
          <Link href="/" className="text-white text-base font-bold">
            Início
          </Link>
          <Link href="/agendamento" className="text-white text-base font-bold">
            Agendamento
          </Link>
          <Link href="/login" className="text-white text-base font-bold">
            Login
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Footer; 