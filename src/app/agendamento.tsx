import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, Alert, ScrollView, Platform, ActivityIndicator, StyleSheet
} from "react-native";
import { useRouter } from 'expo-router';
import Header from "../components/Header";
import Footer from "../components/Footer";
import APIService from "../services/APIService";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';
import { Scissors, Calendar } from 'lucide-react-native';
import { useAuth } from '../context/auth';

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
        maxWidth: 300,
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
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      const [servicesData, barbersData] = await Promise.all([
        APIService.servico.getAll(),
        APIService.usuario.getBarbeiros()
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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedBarber || !selectedDate) {
      Alert.alert("Erro", "Por favor, selecione todos os campos necessários");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = auth.user;
      if (!user) throw new Error("Usuário não autenticado");

      const agendamentoData = {
        cliente: user.uid,
        usuario: selectedBarber._id,
        dataAgendamento: selectedDate,
        servicos: [{
          servico: selectedService.id,
          quantidade: 1
        }],
        total: selectedService.price
      };

      await APIService.agendamento.create(agendamentoData);

      const confirmationMessage = `Serviço: ${selectedService.name}\nBarbeiro: ${selectedBarber.name}\nData: ${selectedDate.toLocaleDateString('pt-BR')}\nValor: R$ ${selectedService.price.toFixed(2)}`;

      if (Platform.OS === 'web') {
        alert(`Agendamento confirmado!\n\n${confirmationMessage}\n\nVocê será redirecionado em 3 segundos...`);
      } else {
        Alert.alert("Agendamento confirmado!", `${confirmationMessage}\n\nVocê será redirecionado em 3 segundos...`);
      }

      setRedirectCountdown(3);
      setTimeout(() => {
        router.replace("/");
      }, 3000);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      Alert.alert("Erro", "Não foi possível criar o agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b58900" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
      >
        {redirectCountdown !== null && (
          <View style={styles.redirectContainer}>
            <Text style={styles.redirectText}>
              Redirecionando para a página inicial em {redirectCountdown} segundos...
            </Text>
          </View>
        )}

        <View style={styles.stepsContainer}>
          {stepTitles.map((title, index) => {
            const isCurrent = step === index + 1;
            const isCompleted = step > index + 1;

            return (
              <View key={index} style={styles.stepItem}>
                <View style={[
                  styles.stepCircle,
                  isCurrent ? styles.stepCircleCurrent :
                    isCompleted ? styles.stepCircleCompleted : styles.stepCirclePending
                ]}>
                  <Text style={[
                    styles.stepNumber,
                    isCurrent ? styles.stepNumberCurrent :
                      isCompleted ? styles.stepNumberCompleted : styles.stepNumberPending
                  ]}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={[
                  styles.stepTitle,
                  isCurrent ? styles.stepTitleCurrent : styles.stepTitlePending
                ]}>
                  {title}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.stepContent}>
          <Text style={styles.stepHeader}>{stepTitles[step - 1]}</Text>

          {step === 1 && (
            <>
              <Text style={styles.sectionTitle}>Selecione um Serviço:</Text>
              <View style={styles.optionsContainer}>
                {services.map(service => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <TouchableOpacity
                      key={service.id}
                      style={[
                        styles.optionBox,
                        isSelected ? styles.optionBoxSelected : styles.optionBoxDefault
                      ]}
                      onPress={() => handleServiceSelect(service)}
                    >
                      <Text style={[
                        styles.optionText,
                        isSelected ? styles.optionTextSelected : styles.optionTextDefault
                      ]}>
                        {service.name}
                      </Text>
                      <Text style={[
                        styles.optionSubText,
                        isSelected ? styles.optionSubTextSelected : styles.optionSubTextDefault
                      ]}>
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
              <Text style={styles.sectionTitle}>Escolha o Barbeiro:</Text>
              <View style={styles.optionsContainer}>
                {barbers.map(barber => {
                  const isSelected = selectedBarber?._id === barber._id;
                  return (
                    <TouchableOpacity
                      key={barber._id}
                      style={[
                        styles.optionBox,
                        isSelected ? styles.optionBoxSelected : styles.optionBoxDefault
                      ]}
                      onPress={() => handleBarberSelect(barber)}
                    >
                      <Text style={[
                        styles.optionText,
                        isSelected ? styles.optionTextSelected : styles.optionTextDefault
                      ]}>
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
              <Text style={styles.sectionTitle}>Selecione uma Data:</Text>
              {Platform.OS === 'web' ? (
                <WebDatePicker
                  value={selectedDate || new Date()}
                  onChange={(_, date) => handleDateSelect(date)}
                  minimumDate={new Date()}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.datePickerTouchable}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.datePickerText}>
                      {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : "Selecione uma data"}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display="default"
                      minimumDate={new Date()}
                      onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) handleDateSelect(date);
                      }}
                    />
                  )}
                </>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <Text style={styles.sectionTitle}>Confirme o Agendamento</Text>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Resumo do Agendamento</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Serviço:</Text>
                  <Text style={styles.summaryValue}>{selectedService?.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Barbeiro:</Text>
                  <Text style={styles.summaryValue}>{selectedBarber?.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Data:</Text>
                  <Text style={styles.summaryValue}>{selectedDate?.toLocaleDateString('pt-BR')}</Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.summaryLabel}>Valor:</Text>
                  <Text style={styles.summaryTotalValue}>
                    R$ {selectedService?.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            </>
          )}

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              onPress={handleBack}
              style={[styles.button, step === 1 ? styles.buttonDisabled : null]}
              disabled={step === 1}
            >
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={step === 4 ? handleSubmit : () => setStep(step + 1)}
              style={[
                styles.button,
                styles.buttonPrimary,
                ((step === 1 && !selectedService) ||
                  (step === 2 && !selectedBarber) ||
                  (step === 3 && !selectedDate) ||
                  (step === 4 && isSubmitting)) ? styles.buttonDisabled : null
              ]}
              disabled={
                (step === 1 && !selectedService) ||
                (step === 2 && !selectedBarber) ||
                (step === 3 && !selectedDate) ||
                (step === 4 && isSubmitting)
              }
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingBottom: 100,
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
  },
  redirectContainer: {
    backgroundColor: '#d1fae5', // green-100
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    alignSelf: 'center',
    maxWidth: 400
  },
  redirectText: {
    color: '#065f46', // green-800
    textAlign: 'center',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    maxWidth: '100%',
    alignSelf: 'center',
  },
  stepItem: {
    alignItems: 'center',
    marginHorizontal: 4,
    minWidth: 70
  },
  stepCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#d1d5db', // gray-300
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleCurrent: {
    backgroundColor: 'black',
    borderColor: 'black'
  },
  stepCircleCompleted: {
    backgroundColor: '#f59e0b', // yellow-500
    borderColor: '#f59e0b',
  },
  stepCirclePending: {
    backgroundColor: 'transparent',
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  stepNumberCurrent: {
    color: 'white'
  },
  stepNumberCompleted: {
    color: 'white'
  },
  stepNumberPending: {
    color: '#9ca3af', // gray-400
  },
  stepTitle: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  stepTitleCurrent: {
    color: 'black',
    fontWeight: '700',
  },
  stepTitlePending: {
    color: '#6b7280', // gray-500
  },
  stepContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    maxWidth: 800,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  stepHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151', // gray-800
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  optionBox: {
    width: 112,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionBoxDefault: {
    backgroundColor: '#f3f4f6', // gray-100
  },
  optionBoxSelected: {
    backgroundColor: '#f59e0b', // yellow-500
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionTextDefault: {
    color: '#374151', // gray-700
  },
  optionTextSelected: {
    color: 'white',
  },
  optionSubText: {
    fontSize: 14,
    marginTop: 4,
  },
  optionSubTextDefault: {
    color: '#6b7280', // gray-500
  },
  optionSubTextSelected: {
    color: 'white',
  },
  datePickerTouchable: {
    backgroundColor: '#f3f4f6', // gray-100
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'center',
    maxWidth: 300,
    marginBottom: 24,
  },
  datePickerText: {
    color: '#374151',
    fontSize: 16,
    textAlign: 'center',
  },
  summaryBox: {
    marginTop: 16,
    backgroundColor: '#f9fafb', // gray-50
    borderRadius: 8,
    padding: 16,
  },
  summaryTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    color: '#4b5563', // gray-600
    fontSize: 16,
  },
  summaryValue: {
    fontWeight: '600',
    fontSize: 16,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // gray-200
    paddingTop: 8,
    marginTop: 8,
  },
  summaryTotalValue: {
    fontWeight: '700',
    fontSize: 16,
    color: '#f59e0b', // yellow-500
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPrimary: {
    backgroundColor: '#f59e0b', // yellow-500
    borderColor: '#f59e0b',
    marginLeft: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#374151', // gray-700
  },
  buttonTextPrimary: {
    color: 'white',
  }
});
