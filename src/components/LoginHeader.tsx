import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { Scissors } from "lucide-react-native";

const LoginHeader = () => {
  const router = useRouter();

  return (
    <View className="bg-black py-4 px-4 w-full z-50">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.replace('/')}
        >
          <Scissors className="h-6 w-6 text-yellow-400" />
          <Text className="text-xl font-bold ml-2 text-white">Inova Barbearia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginHeader; 