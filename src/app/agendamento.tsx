import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, Platform, ActivityIndicator, TextInput } from "react-native";
import { useRouter } from 'expo-router';
import Header from "../components/Header";
import Footer from "../components/Footer";
import APIService from "../services/APIService";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';
import { Scissors, Calendar, Search } from 'lucide-react-native';
import { getAuth } from "firebase/auth";
import app from "../services/firebase";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  image: string;
  description: string;
}

interface Barber {
  _id: string;
  name: string;
  email: string;
}

interface Cliente {
  _id: string;
  name: string;
  email: string;
}

interface WebDatePickerProps {
  value: Date;
  onChange: (event: { type: string }, date: Date) => void;
  minimumDate: Date;
}

const WebDatePicker: React.FC<WebDatePickerProps> = ({ value, onChange, minimumDate }) => {
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
  const auth = getAuth(app);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const stepTitles = [
    "Selecione um Serviço",
    "Escolha o Barbeiro",
    "Selecione uma Data",
    "Confirme o Agendamento"
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar o usuário pelo Firebase UID
      const userResponse = await APIService.usuario.getByFirebaseUid(user.uid);
      if (userResponse.success && userResponse.data) {
        setUserRole(userResponse.data.role);
        
        // Se for cliente, usar os dados do próprio usuário
        if (userResponse.data.role === 'cliente') {
          setSelectedCliente({
            _id: userResponse.data._id,
            name: userResponse.data.name,
            email: userResponse.data.email
          });
        }
      }

      const [servicesData, barbersData, clientesData] = await Promise.all([
        APIService.servico.getAll(),
        APIService.usuario.getBarbeiros(),
        APIService.usuario.getAll() // Buscar todos os usuários em vez de clientes
      ]);

      const adaptedServices = servicesData.data
        .filter((srv: any) => srv.isActive)
        .map((srv: any) => ({
          id: srv._id,
          name: srv.name,
          price: srv.price,
          duration: srv.duracao,
          image: srv.image,
          description: srv.description || "Descrição não disponível"
        }));

      setServices(adaptedServices);
      setBarbers(barbersData.data || []);
      // Filtrar apenas os usuários com role 'cliente'
      setClientes(clientesData.data.filter((cliente: any) => cliente.role === 'cliente') || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setStep(3);
  };

  const handleClienteSelect = (cliente: Cliente) => {
    setSelectedCliente(cliente);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedCliente) {
      Alert.alert("Erro", "Por favor, selecione todos os campos necessários");
      return;
    }

    setIsSubmitting(true);

    try {
      // Garantindo que os dados estão no formato exato do Postman
      const agendamentoData = {
        cliente: selectedCliente._id,
        usuario: selectedBarber._id,
        dataAgendamento: selectedDate.toISOString(),
        servicos: [
          {
            servico: selectedService.id,
            quantidade: 1
          }
        ]
      };

      console.log("Dados do agendamento a serem enviados:", JSON.stringify(agendamentoData, null, 2));

      const response = await APIService.agendamento.create(agendamentoData);
      console.log("Resposta do servidor:", response);
      
      const confirmationMessage = `Cliente: ${selectedCliente.name}\nServiço: ${selectedService.name}\nBarbeiro: ${selectedBarber.name}\nData: ${selectedDate.toLocaleDateString('pt-BR')}\nValor: R$ ${selectedService.price.toFixed(2)}`;

      if (Platform.OS === 'web') {
        alert(`Agendamento confirmado!\n\n${confirmationMessage}\n\nVocê será redirecionado em 3 segundos...`);
      } else {
        Alert.alert("Agendamento confirmado!", `${confirmationMessage}\n\nVocê será redirecionado em 3 segundos...`);
      }

      setRedirectCountdown(3);
      setTimeout(() => {
        router.replace("/");
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao criar agendamento:", error);
      console.error("Detalhes do erro:", error.response?.data);
      Alert.alert("Erro", "Não foi possível criar o agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#b58900" />
      </View>
    );
  }

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

        <View className="flex-row justify-between items-center mb-6">
          {stepTitles.map((title, index) => {
            const isCurrent = step === index + 1;
            const isCompleted = step > index + 1;

            return (
              <View key={index} className="flex items-center mx-1" style={{ minWidth: 70 }}>
                <View className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  isCurrent ? 'bg-black' :
                  isCompleted ? 'bg-yellow-500 border-yellow-500' :
                  'border-2 border-gray-300'
                }`}>
                  <Text className={`text-lg font-bold ${
                    isCurrent ? 'text-white' :
                    isCompleted ? 'text-white' :
                    'text-gray-400'
                  }`}>
                    {index + 1}
                  </Text>
                </View>
                <Text className={`text-xs md:text-sm text-center mt-2 ${
                  isCurrent ? 'text-black font-bold' : 'text-gray-500'
                }`}>
                  {title}
                </Text>
              </View>
            );
          })}
        </View>

        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-6">
            {stepTitles[step - 1]}
          </Text>

          {step === 1 && (
            <>
              <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Selecione um Serviço:
              </Text>
              <View className="flex flex-row flex-wrap justify-center gap-3 mb-6">
                {services.map(service => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <TouchableOpacity
                      key={service.id}
                      className={`rounded-lg p-4 w-28 items-center ${
                        isSelected ?
                        'bg-yellow-500 shadow-md' :
                        'bg-gray-100 hover:bg-gray-200'
                      } transition-colors`}
                      onPress={() => handleServiceSelect(service)}
                    >
                      <Text className={`text-center font-medium ${
                        isSelected ? 'text-white' : 'text-gray-700'
                      }`}>
                        {service.name}
                      </Text>
                      <Text className={`text-center text-sm mt-1 ${
                        isSelected ? 'text-white' : 'text-gray-500'
                      }`}>
                        R$ {service.price.toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Escolha o Barbeiro:
              </Text>
              <View className="flex flex-row flex-wrap justify-center gap-3 mb-6">
                {barbers.map(barber => {
                  const isSelected = selectedBarber?._id === barber._id;
                  return (
                    <TouchableOpacity
                      key={barber._id}
                      className={`rounded-lg p-4 w-28 items-center ${
                        isSelected ?
                        'bg-yellow-500 shadow-md' :
                        'bg-gray-100 hover:bg-gray-200'
                      } transition-colors`}
                      onPress={() => handleBarberSelect(barber)}
                    >
                      <Text className={`text-center font-medium ${
                        isSelected ? 'text-white' : 'text-gray-700'
                      }`}>
                        {barber.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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
                  value={selectedDate || new Date()}
                  onChange={(_, date) => handleDateSelect(date)}
                  minimumDate={new Date()}
                />
              ) : (
                <TouchableOpacity
                  className="bg-gray-100 rounded-lg p-3 mb-6 mx-auto max-w-xs"
                  onPress={() => {
                    // Implementar seleção de data para mobile
                    Alert.alert("Em desenvolvimento", "Seleção de data em desenvolvimento");
                  }}
                >
                  <Text className="text-gray-700 text-center">
                    {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : "Selecione uma data"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Confirme o Agendamento
              </Text>

              {/* Seleção de Cliente (apenas para barbeiros e admins) */}
              {userRole !== 'cliente' && (
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
                    Selecione o Cliente:
                  </Text>
                  <View className="relative mb-4">
                    <TextInput
                      className="bg-gray-100 rounded-lg p-3 pl-10"
                      placeholder="Buscar cliente por nome ou email..."
                      value={searchTerm}
                      onChangeText={setSearchTerm}
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  </View>
                  <ScrollView className="max-h-40">
                    {filteredClientes.map(cliente => (
                      <TouchableOpacity
                        key={cliente._id}
                        className={`p-3 rounded-lg mb-2 ${
                          selectedCliente?._id === cliente._id
                            ? 'bg-yellow-500'
                            : 'bg-gray-100'
                        }`}
                        onPress={() => handleClienteSelect(cliente)}
                      >
                        <Text className={`${
                          selectedCliente?._id === cliente._id
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}>
                          {cliente.name} - {cliente.email}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View className="mt-6 p-4 bg-gray-50 rounded-md">
                <Text className="font-medium text-lg mb-3 text-center">Resumo do Agendamento</Text>
                <View className="space-y-2 text-sm">
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-600">Cliente:</Text>
                    <Text className="font-medium">{selectedCliente?.name}</Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-600">Serviço:</Text>
                    <Text className="font-medium">{selectedService?.name}</Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-600">Barbeiro:</Text>
                    <Text className="font-medium">{selectedBarber?.name}</Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-600">Data:</Text>
                    <Text className="font-medium">{selectedDate?.toLocaleDateString('pt-BR')}</Text>
                  </View>
                  <View className="flex flex-row justify-between pt-2 border-t border-gray-200">
                    <Text className="text-gray-600">Valor:</Text>
                    <Text className="font-bold text-yellow-500">
                      R$ {selectedService?.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              onPress={handleBack}
              className={`border border-gray-300 rounded-lg px-4 py-2 ${step === 1 ? 'opacity-50' : 'hover:bg-gray-50'}`}
              disabled={step === 1}
            >
              <Text className="text-gray-700">Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={step === 4 ? handleSubmit : () => setStep(step + 1)}
              className="bg-yellow-500 rounded-lg px-6 py-2 ml-auto hover:bg-yellow-600 transition-colors"
              disabled={
                (step === 1 && !selectedService) ||
                (step === 2 && !selectedBarber) ||
                (step === 3 && !selectedDate) ||
                (step === 4 && (!selectedCliente || isSubmitting))
              }
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium">
                  {step === 4 ? "Confirmar Agendamento" : "Continuar"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}