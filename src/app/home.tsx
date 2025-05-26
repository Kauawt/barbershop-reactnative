import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 bg-white relative">
      <Image
        source={require('../assets/barbershop.jpg')}
        className="absolute inset-0 w-full h-full opacity-50"
        resizeMode="cover"
      />
      
      <View className="flex-1 justify-center px-4 md:px-6">
        <Text className="text-2xl md:text-3xl font-bold text-gray-700 text-center mb-4">Bem-vindo à Barbearia JP Cortes!</Text>
        
        <Text className="text-base md:text-lg text-gray-700 text-center mb-4">
          Nossa barbearia foi fundada com a paixão por proporcionar cortes de cabelo de alta qualidade
          e um atendimento excepcional. Desde o início, nosso objetivo tem sido criar um espaço
          acolhedor e confortável, onde cada cliente possa relaxar e sair satisfeito.
        </Text>
        
        <Text className="text-lg font-bold text-gray-700 mt-4">Localização:</Text>
        <Text className="text-base md:text-lg text-gray-700 text-center mb-4">
          Avenida Getúlio Vargas, 123 - Centro, Indaiatuba - SP
        </Text>
         
        <View className="h-40 md:h-48 bg-gray-200 justify-center items-center mb-4">
          <Text className="text-gray-400">Imagem do Google Maps aqui</Text>
        </View>

        <Text className="text-lg font-bold text-gray-700 mt-4">Contato:</Text>
        <Text className="text-base md:text-lg text-gray-700 text-center mb-2">
          Telefone: (11) 98765-XXXX
        </Text>
        <Text className="text-base md:text-lg text-gray-700 text-center mb-4">
          E-mail: contato@jpcortes.com.br
        </Text>
        
        <TouchableOpacity className="bg-gray-100 rounded-lg py-2 items-center mb-4 w-full max-w-xs mx-auto">
          <Link href="/agendamento" asChild>
            <Text className="text-gray-700 text-center font-semibold">Agende seu corte agora!</Text>
          </Link>
        </TouchableOpacity>
        
        <View className="mt-4 items-center">
          <Text className="text-gray-700 text-center">© 2023 Barbearia JP Cortes. Todos os direitos reservados.</Text>
        </View>
      </View>
    </View>
  );
}