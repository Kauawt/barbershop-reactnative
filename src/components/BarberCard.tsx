import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Barber } from "../types"; // Certifique-se de que a interface Barber está definida corretamente.
import { Star } from "lucide-react-native"; // Certifique-se de que o ícone está instalado.

interface BarberCardProps {
  barber: Barber;
}

const BarberCard = ({ barber }: BarberCardProps) => {
  return (
    <View className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
      {/* Imagem do Barbeiro */}
      <View className="h-52 overflow-hidden">
        <Image
          source={{ uri: barber.photo || 'https://dummyimage.com/600x400/000/fff' }} // Imagem de exemplo
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
          alt={barber.name}
        />
      </View>
      <View className="p-4">
        <Text className="text-xl font-heading text-barber-dark">{barber.name}</Text>
        <View className="flex flex-row items-center mb-2">
          <Star className="h-4 w-4 text-barber-gold mr-1" />
          <Text className="text-barber-gold">{barber.rating}</Text>
        </View>
        {barber.specialties && (
          <View className="flex flex-wrap gap-2">
            {barber.specialties.map((specialty, index) => (
              <View 
                key={index} 
                className="bg-barber-accent/10 text-barber-accent px-2 py-1 rounded-full"
              >
                <Text className="text-xs">{specialty}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity 
        onPress={() => console.log(`Agendando com ${barber.name}`)} // Aqui você pode adicionar a lógica de navegação
        className="bg-barber-dark text-white p-3 rounded-lg"
      >
        <Text className="text-center">Agendar com {barber.name.split(" ")[0]}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BarberCard;