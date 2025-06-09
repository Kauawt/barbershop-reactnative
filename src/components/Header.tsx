import React, { useState } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter } from 'expo-router';
import { Scissors, Menu, X, User } from "lucide-react-native";
import { getAuth } from "firebase/auth";
import firebaseApp from '../services/firebase';

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width } = useWindowDimensions();

  const auth = getAuth(firebaseApp);
  const currentUser = auth.currentUser;
  const userName = currentUser?.displayName || currentUser?.email || "Perfil";

  const isLargeScreen = width >= 768;

  return (
    <View className="bg-black py-4 px-4 w-full z-50">
      <View className="flex-row justify-between items-center">
        {/* Logo */}
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.replace('/')}
        >
          <Scissors className="h-6 w-6 text-yellow-400" />
          <Text className="text-xl font-bold ml-2 text-white">Inova Barbearia</Text>
        </TouchableOpacity>

        {isLargeScreen ? (
          <View className="flex-row items-center space-x-6">
            <TouchableOpacity onPress={() => router.replace('/services')}>
              <Text className="text-white">Serviços</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/barbers')}>
              <Text className="text-white">Barbeiros</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/agendamento')}>
              <Text className="text-white">Agendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center bg-white border border-yellow-400 rounded-md px-3 py-1 ml-4"
              onPress={() => router.replace('/profile')}
            >
              <User className="h-4 w-4 text-black mr-2" />
              <Text className="text-black font-semibold text-sm">{userName}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {!isLargeScreen && isMenuOpen && (
        <View className="mt-2 px-4 py-2 bg-black rounded-lg shadow-md">
          <TouchableOpacity onPress={() => { router.replace('/services'); setIsMenuOpen(false); }} className="py-2">
            <Text className="text-white">Serviços</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.replace('/barbers'); setIsMenuOpen(false); }} className="py-2">
            <Text className="text-white">Barbeiros</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.replace('/agendamento'); setIsMenuOpen(false); }} className="py-2">
            <Text className="text-white">Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.replace('/profile'); setIsMenuOpen(false); }} className="py-2">
            <Text className="text-barber-gold">Perfil</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;
