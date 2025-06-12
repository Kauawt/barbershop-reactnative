import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, Platform } from "react-native";
import { useRouter } from 'expo-router';
import Header from "../components/Header";
import Footer from "../components/Footer";
import APIService from "../services/APIService";
import DateTimePicker from '@react-native-community/datetimepicker';

const WebDatePicker = ({ value, onChange, minimumDate }) => {
  return (
    <input
      type="date"
      value={value.toISOString().split('T')[0]}
      min={minimumDate.toISOString().split('T')[0]}
      onChange={(e) => {
        const selectedDate = new Date(e.target.value);
        onChange({ type: 'set' }, selectedDate);
      }}
      style={{
        padding: 10,
        borderRadius: 8,
        border: '1px solid #ccc',
        width: '100%',
        maxWidth: '300px',
        marginBottom: 16,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block'
      }}
    />
  );
};

export default function Agendamento() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState('');
  const [step, setStep] = useState(1);
  const [redirectCountdown, setRedirectCountdown] = useState(null);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);


  const getToken = async () => {
    const token = await SecureStore.getItemAsync('token');
    console.log("Token recuperado:", token);
    return token;
  };

  const getSelectedServiceDetails = () => {
    return services.find(service => service.id === selectedService);
  };

  const getSelectedBarberDetails = () => {
    return barbers.find(barber => barber.id === selectedBarber);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await APIService.servico.getAll();
        const barbersData = await APIService.usuario.getAll();
        console.log('servicesData:', servicesData);
        console.log('barbersData:', barbersData);
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setBarbers(Array.isArray(barbersData) ? barbersData : []);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao carregar serviços ou barbeiros.');
      }
    };

    fetchData();
  }, []);

  const handleConfirm = async () => {
    try {
      const service = getSelectedServiceDetails();
      const barber = getSelectedBarberDetails();

      const agendamentoPayload = {
        cliente: userId,
        usuario: selectedBarber,
        dataAgendamento: new Date(`${date.toISOString().split('T')[0]}T${time}:00`),
        total: getSelectedServiceDetails()?.price || 0,
      };
    };

    await APIService.agendamento.create(agendamentoPayload);

    const confirmationMessage = `Serviço: Corte\nBarbeiro: João\nData: ${formatDate(date)}\nHorário: ${time}\nValor: R$ 50,00`;

    if (Platform.OS === 'web') {
      alert(`Agendamento confirmado!\n\n${confirmationMessage}\n\nVocê será redirecionado em 3 segundos...`);
    } else {
      Alert.alert("Agendamento confirmado!", `${confirmationMessage}\n\nVocê será redirecionado em 3 segundos...`);
    }

    setRedirectCountdown(3);
  } catch (error) {
    Alert.alert("Erro", "Não foi possível confirmar o agendamento.");
  }
};

const handleContinue = () => {
  if (step < 4) setStep(step + 1);
  else handleConfirm();
};

const handleBack = () => {
  if (step > 1) setStep(step - 1);
};

const stepTitles = [
  "Selecione um Serviço",
  "Escolha o Barbeiro",
  "Selecione uma Data",
  "Escolha o Horário",
];

const onChangeDate = (event, selectedDate) => {
  if (Platform.OS !== 'web') setShowDatePicker(false);
  if (selectedDate) {
    setDate(selectedDate);
    if (Platform.OS === 'web') setTimeout(() => handleContinue(), 300);
  }
};

return (
  <View className="flex-1 bg-white relative">
    <Header />

    <ScrollView
      className="flex-1 p-4 md:p-6"
      contentContainerStyle={{
        paddingBottom: 100,
        maxWidth: 800,
        marginHorizontal: 'auto',
        width: '100%'
      }}
    >
      {redirectCountdown !== null && (
        <View className="bg-green-100 p-2 mb-4 rounded mx-auto max-w-md">
          <Text className="text-green-800 text-center">
            Redirecionando para a página inicial em {redirectCountdown} segundos...
          </Text>
        </View>
      )}

      <View className="flex flex-row justify-around mb-6 mx-auto max-w-2xl w-full">
        {stepTitles.map((title, index) => {
          const isCurrent = step === index + 1;
          const isCompleted = step > index + 1;

          return (
            <View key={index} className="flex items-center mx-1" style={{ minWidth: 70 }}>
              <View className={`h-10 w-10 rounded-full flex items-center justify-center ${isCurrent ? 'bg-black' :
                isCompleted ? 'bg-yellow-500 border-yellow-500' :
                  'border-2 border-gray-300'
                }`}>
                <Text className={`text-lg font-bold ${isCurrent ? 'text-white' :
                  isCompleted ? 'text-white' :
                    'text-gray-400'
                  }`}>
                  {index + 1}
                </Text>
              </View>
              <Text className={`text-xs md:text-sm text-center mt-2 ${isCurrent ? 'text-black font-bold' : 'text-gray-500'
                }`}>
                {title}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="bg-white rounded-lg shadow-sm p-6 mx-auto w-full max-w-2xl mb-8">
        <Text className="text-2xl font-bold text-gray-800 text-center mb-6">
          {stepTitles[step - 1]}
        </Text>

        {step === 1 && (
          <>
            <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Selecione um Serviço:
            </Text>
            <View className="flex flex-row flex-wrap justify-center gap-3 mb-6">
              {services.map(service => (
                <TouchableOpacity
                  key={service.id}
                  className={`rounded-lg p-4 w-28 items-center ${selectedService === service.id ?
                    'bg-yellow-500 shadow-md' :
                    'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  onPress={() => {
                    setSelectedService(service.id);
                    handleContinue();
                  }}
                >
                  <Text className={`text-center font-medium ${selectedService === service.id ? 'text-white' : 'text-gray-700'
                    }`}>
                    {service.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Escolha o Barbeiro:
            </Text>
            <View className="flex flex-row flex-wrap justify-center gap-3 mb-6">
              {barbers.map(barber => (
                <TouchableOpacity
                  key={barber.id}
                  className={`rounded-lg p-4 w-28 items-center ${selectedBarber === barber.id ?
                    'bg-yellow-500 shadow-md' :
                    'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  onPress={() => {
                    setSelectedBarber(barber.id);
                    handleContinue();
                  }}
                >
                  <Text className={`text-center font-medium ${selectedBarber === barber.id ? 'text-white' : 'text-gray-700'
                    }`}>
                    {barber.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Selecione uma Data:
            </Text>
            {Platform.OS === 'web' ? (
              <WebDatePicker
                value={date}
                onChange={onChangeDate}
                minimumDate={new Date()}
              />
            ) : (
              <>
                <TouchableOpacity
                  className="bg-gray-100 rounded-lg p-3 mb-6 mx-auto max-w-xs"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-gray-700 text-center">
                    {formatDate(date)}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    minimumDate={new Date()}
                  />
                )}
              </>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Escolha o Horário:
            </Text>
            <View className="flex flex-row flex-wrap justify-center gap-3 mb-6">
              {['14:00', '15:00', '15:30'].map(hour => (
                <TouchableOpacity
                  key={hour}
                  className={`rounded-lg p-3 w-24 items-center ${time === hour ?
                    'bg-yellow-500 shadow-md' :
                    'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  onPress={() => setTime(hour)}
                >
                  <Text className={`font-medium ${time === hour ? 'text-white' : 'text-gray-700'
                    }`}>
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {time && (
              <View className="mt-6 p-4 bg-gray-50 rounded-md">
                <Text className="font-medium text-lg mb-3 text-center">Resumo do Agendamento</Text>
                <View className="space-y-2 text-sm">
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-600">Serviço:</Text>
                    <Text className="font-medium">{getSelectedServiceDetails()?.name}</Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-600">Barbeiro:</Text>
                    <Text className="font-medium">{getSelectedBarberDetails()?.name}</Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-600">Data:</Text>
                    <Text className="font-medium">{formatDate(date)}</Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-600">Horário:</Text>
                    <Text className="font-medium">{time}</Text>
                  </View>
                  <View className="flex flex-row justify-between pt-2 border-t border-gray-200">
                    <Text className="text-gray-600">Valor:</Text>
                    <Text className="font-bold text-yellow-500">
                      R$ {getSelectedServiceDetails()?.price?.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}

        <View className="flex-row justify-between mt-8">
          <TouchableOpacity
            onPress={handleBack}
            className={`border border-gray-300 rounded-lg px-4 py-2 ${step === 1 ? 'opacity-50' : 'hover:bg-gray-50'}`}
            disabled={step === 1}
          >
            <Text className="text-gray-700">Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={step === 4 ? handleConfirm : handleContinue}
            className="bg-yellow-500 rounded-lg px-6 py-2 ml-auto hover:bg-yellow-600 transition-colors"
            disabled={
              (step === 1 && !selectedService) ||
              (step === 2 && !selectedBarber) ||
              (step === 3 && !date) ||
              (step === 4 && !time)
            }
          >
            <Text className="text-white font-medium">
              {step === 4 ? "Confirmar Agendamento" : "Continuar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </ScrollView>

  </View>
);
};