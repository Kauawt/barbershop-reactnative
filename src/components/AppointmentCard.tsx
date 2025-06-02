import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Appointment } from "../types";
import { Calendar, Clock, User } from "lucide-react-native"; // Importe apenas os ícones que você usa.

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const { serviceId, barberId, date, status, totalPrice } = appointment;

  // Simulação da busca de serviço e barbeiro baseada em códigos anteriores
  const service = services.find(s => s.id === serviceId);
  const barber = barbers.find(b => b.id === barberId);

  const getStatusText = () => {
    switch (status) {
      case "confirmed": return "Confirmado";
      case "pending": return "Pendente";
      case "completed": return "Concluído";
      case "canceled": return "Cancelado";
      default: return status;
    }
  };

  return (
    <View className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-heading text-barber-dark">{service?.name || "Serviço"}</Text>
        <Text className={`px-2 py-1 rounded-full text-xs font-medium`}>
          {getStatusText()}
        </Text>
      </View>
      <Text>R$ {totalPrice.toFixed(2)}</Text>
      <View className="space-y-2">
        <View className="flex flex-row items-center">
          <Calendar className="h-4 w-4 text-barber-accent mr-2" />
          <Text>{new Date(date).toLocaleDateString()}</Text>
        </View>
        <View className="flex flex-row items-center">
          <Clock className="h-4 w-4 text-barber-accent mr-2" />
          <Text>{appointment.time}</Text>
        </View>
        <View className="flex flex-row items-center">
          <User className="h-4 w-4 text-barber-accent mr-2" />
          <Text>{barber?.name || "Barbeiro"}</Text>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => console.log(`Cancelando agendamento: ${appointment.id}`)} // A lógica aqui deve ser de cancelamento
        className="bg-red-500 text-white text-center p-2 rounded-lg mt-2"
      >
        <Text>Cancelar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppointmentCard;