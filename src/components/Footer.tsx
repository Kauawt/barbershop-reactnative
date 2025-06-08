import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Scissors } from "lucide-react-native";

const Footer = () => {
  const router = useRouter();


const Footer = () => {
  return (
    <View className="bg-black py-8 px-4">
      <View className="max-w-6xl mx-auto">
        <View className="flex flex-col md:flex-row justify-between items-start mb-8 space-y-10 md:space-y-0 md:space-x-8">
          <View className="flex-1 items-center md:items-start">
            <View className="flex flex-row items-center mb-4">
              <Scissors className="h-6 w-6 text-yellow-500" />
              <Text className="text-white text-xl font-bold ml-2">Inova Barbearia</Text>

            </View>
            <Text className="text-gray-300 text-center md:text-left max-w-xs">
              A melhor experiência em barbearia com agendamento online fácil e rápido.
            </Text>
          </View>

          <View className="flex-1 flex-row justify-around w-full">
            <View className="items-center md:items-start">
              <Text className="text-yellow-500 font-semibold mb-3">Links</Text>
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
              <Text className="text-yellow-500 font-semibold mb-3">Contato</Text>
              <View className="space-y-3">
                <Text className="text-gray-300">Rua Dom Pedro I, 65 - Centro</Text>
                <Text className="text-gray-300">Indaiatuba - SP</Text>
                <Text className="text-gray-300">(11) 99880-0206</Text>
                <Text className="text-gray-300">inova_barber@gmail.com</Text>

              </View>
            </View>
          </View>
        </View>
        <View className="border-t border-gray-700 pt-6">
          <Text className="text-gray-400 text-center">
            &copy; {new Date().getFullYear()} InnovaTech Solutions. Todos os direitos reservados.
          </Text>
        </View>
      </View>
    </View>
  );
};
}
export default Footer;
