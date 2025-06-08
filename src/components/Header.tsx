import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { Scissors, Menu, X } from "lucide-react-native";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <View className="bg-black text-white py-4 sticky top-0 z-50">
      <View className="flex flex-row justify-between items-center px-4">
        <TouchableOpacity className="flex flex-row items-center" onPress={() => router.replace('/')}>
          <Scissors className="h-7 w-7 text-barber-gold" />
          <Text className="text-xl md:text-2xl font-heading font-bold ml-2">BarberAgendaPro</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu} className="p-2">
          {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </TouchableOpacity>
      </View>
      {isMenuOpen && (
        <View className="bg-black mt-2 px-4 py-2 rounded-lg shadow-md">
          <TouchableOpacity onPress={() => { router.replace('/services'); toggleMenu(); }} className="py-2">
            <Text className="text-white">Serviços</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.replace('/barbers'); toggleMenu(); }} className="py-2">
            <Text className="text-white">Barbeiros</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.replace('/agendamento'); toggleMenu(); }} className="py-2">
            <Text className="text-white">Agendar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { router.replace('/login'); toggleMenu(); }} className="py-2">
            <Text className="text-barber-gold">Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;