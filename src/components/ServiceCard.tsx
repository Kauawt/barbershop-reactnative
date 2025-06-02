import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { Service } from "../types";

interface ServiceCardProps {
  service: Service;
  showBookButton?: boolean;
}

const ServiceCard = ({ service, showBookButton = true }: ServiceCardProps) => {
  
  const handleBooking = () => {
    console.log(`Agendando serviço: ${service.id}`);
  };

  return (
    <View className="bg-white rounded-lg shadow-lg overflow-hidden">
      <View className="h-40 overflow-hidden bg-barber-dark">
        <Image 
          source={{ uri: service.image || 'https://dummyimage.com/600x400/000/fff' }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      <View className="p-4">
        <Text className="text-xl font-heading text-barber-dark">{service.name}</Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-barber-accent">{service.duration} min</Text>
          <Text className="text-barber-gold font-bold">R$ {service.price.toFixed(2)}</Text>
        </View>
        <Text className="text-gray-600">{service.description}</Text>
      </View>
      {showBookButton && (
        <TouchableOpacity 
          onPress={handleBooking}
          className="bg-barber-dark text-white p-3 rounded-lg mt-2"
        >
          <Text className="text-center">Agendar Agora</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ServiceCard;