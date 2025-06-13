import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Scissors } from "lucide-react-native";

const Footer = () => {
  const router = useRouter();

  return (
    <View className="bg-black py-8 px-4">
      <View className="max-w-6xl mx-auto">
        <View className="flex flex-row justify-between items-center mb-6">
          <View className="flex-1 items-center md:items-start">
            <View className="flex flex-row items-center mb-4">
              <Scissors className="h-6 w-6 text-yellow-500" />
              <Text className="text-white text-xl font-bold ml-2">Inova Barbearia</Text>
            </View>
          </View>

          <View className="flex-row space-x-12">
            <View className="items-center md:items-start">
              <Text className="text-yellow-500 font-semibold mb-3 text-lg">Links</Text>
              <View className="space-y-3">
                <TouchableOpacity onPress={() => router.push("/")}>
                  <Text className="text-gray-300">Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/services")}>
                  <Text className="text-gray-300">Serviços</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/barbers")}>
                  <Text className="text-gray-300">Barbeiros</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/agendamento")}>
                  <Text className="text-gray-300">Agendar</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="items-center md:items-start">
              <Text className="text-yellow-500 font-semibold mb-3 text-lg">Contato</Text>
              <View className="space-y-3">
                <Text className="text-gray-300">Rua Dom Pedro I, 65 - Centro</Text>
                <Text className="text-gray-300">Indaiatuba - SP</Text>
                <Text className="text-gray-300">(11) 99880-0206</Text>
                <Text className="text-gray-300">inova_barber@gmail.com</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="border-t border-gray-700 pt-4 mt-4">
          <Text className="text-gray-400 text-center">
            &copy; {new Date().getFullYear()} InnovaTech Solutions. Todos os direitos reservados.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Footer;
