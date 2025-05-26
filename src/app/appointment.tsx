//import DateTimePicker from '@react-native-community/datetimepicker';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import CustomInput from '../components/inputs/CustomInput';

const services = ["Barba", "Cabelo", "Sobrancelha", "Pintura"];

export default function Appointment() {
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [barber, setBarber] = useState('');
  const [time, setTime] = useState('');

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleConfirm = () => {
    Alert.alert("Agendamento confirmado!", `Serviço: ${selectedService}\nData: ${date.toLocaleDateString()}\nBarbeiro: ${barber}\nHorário: ${time}`);
  };

  return (
    <View className="flex-1 bg-white relative">
      <View className="flex-1 justify-center px-6">
        <Text className="text-2xl font-bold text-gray-700 text-center mb-4">Agendamento</Text>
        <Text className="text-lg font-bold text-gray-700 mb-4">Selecione um Serviço:</Text>
        <View className="flex flex-row justify-center flex-wrap mb-4">
          {services.map(service => (
            <TouchableOpacity
              key={service}
              className="bg-gray-200 rounded-lg p-4 m-2 w-24 items-center"
              onPress={() => handleServiceSelect(service)}
            >
              <Text className="text-gray-700 font-semibold text-center">{service}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedService && (
          <>
            <CustomInput
              placeholder="Barbeiro"
              value={barber}
              onChangeText={setBarber}
              secureTextEntry={false}
            />
            
            <TouchableOpacity className="bg-gray-200 rounded-lg p-2 mb-4" onPress={() => setShowDatePicker(true)}>
              <Text className="text-gray-700 text-center">{date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || date;
                  setShowDatePicker(false);
                  setDate(currentDate);
                }}
              />
            )}

            <CustomInput
              placeholder="Horário"
              value={time}
              onChangeText={setTime}
              secureTextEntry={false}
            />

            <TouchableOpacity className="bg-green-600 rounded-lg py-2 mb-4" onPress={handleConfirm}>
              <Text className="text-white text-center font-semibold">Confirmar Agendamento</Text>
            </TouchableOpacity>
          </>
        )}

        <Link href="/" asChild>
          <TouchableOpacity>
            <Text className="text-gray-700 text-center mt-4">Voltar para a Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}