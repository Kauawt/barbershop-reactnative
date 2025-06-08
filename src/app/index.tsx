
import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from 'expo-router';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import BarberCard from "../components/BarberCard";
import { services, barbers } from "../data/mockData";
import { Scissors, Calendar, Award } from "lucide-react-native";

const Index = () => {
  const router = useRouter();
  const featuredServices = services.slice(0, 3);
  const featuredBarbers = barbers.slice(0, 3);

  return (
    <View className="flex-1">
      <Header />
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="relative bg-barber-dark text-white w-full">
          <Image 
            source={require('../assets/capa.jpg')}
            style={{ width: '100%', height: 250 }} 
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
            <Text className="text-3xl font-bold text-white text-center">Seu Estilo, Nossa Especialidade</Text>
            <Text className="text-lg mt-2 text-white text-center">
              Agende seu horário em uma das melhores barbearias, com os melhores profissionais.
            </Text>
            <View className="flex flex-row justify-center mt-4 space-x-4">
              <TouchableOpacity 
                onPress={() => router.replace("/agendamento")}
                className="bg-yellow-500 hover:bg-yellow-400 rounded-lg px-6 py-2 mx-auto w-40"
            >
              <Text className="text-black font-semibold text-base text-center">Agendar Agora</Text>
            </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => router.replace("/services")}
                className="border-2 hover:bg-yellow-400 border-white rounded-lg px-6 py-3" 
              >
                <Text className="text-white text-lg">Ver Serviços</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="mx-auto w-full max-w-4xl px-4">
          <View className="py-8 bg-white rounded-lg my-4">
            <Text className="text-center text-xl font-bold mb-8">Por que escolher a BarberAgendaPro?</Text>
            <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FeatureCard 
                title="Profissionais Qualificados"
                description="Nossa equipe é formada por barbeiros experientes e certificados."
                icon={<Scissors className="h-8 w-8 bg-yellow-500 hover:bg-yellow-600" />}

              />
              <FeatureCard 
                title="Agendamento Fácil"
                description="Agende seu horário online em poucos passos."
                icon={<Calendar className="h-8 w-8 bg-yellow-500 hover:bg-yellow-600" />}
              />
              <FeatureCard 
                title="Experiência Premium"
                description="Ambiente sofisticado e atendimento personalizado."
                icon={<Award className="h-8 w-8 bg-yellow-500 hover:bg-yellow-600" />}
              />
            </View>
          </View>
          <View className="py-8 bg-gray-50 rounded-lg my-4">
            <View className="flex justify-between items-center mb-8">
              <Text className="text-2xl font-bold">Nossos Serviços</Text>
              <TouchableOpacity 
                onPress={() => router.replace("/services")}
                className="border border-barber-gold bg-white text-barber-gold px-4 py-2 rounded-lg"
              >
                <Text>Ver Todos</Text>
              </TouchableOpacity>
            </View>
            <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </View>
          </View>
          <View className="py-8 bg-white rounded-lg my-4">
            <View className="flex justify-between items-center mb-8">
              <Text className="text-2xl font-bold">Nossos Barbeiros</Text>
              <TouchableOpacity 
                onPress={() => router.replace("/barbers")}
                className="border border-barber-gold bg-white text-barber-gold px-4 py-2 rounded-lg"
              >
                <Text>Ver Todos</Text>
              </TouchableOpacity>
            </View>
            <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredBarbers.map(barber => (
                <BarberCard key={barber.id} barber={barber} />
              ))}
            </View>
          </View>
        </View>
        <View className="w-full bg-black py-8 my-8">
          <View className="mx-auto max-w-2xl px-4 text-center">
            <Text className="text-3xl font-bold text-yellow-500 mb-6 text-center">Pronto para mudar seu visual?</Text>
            <Text className="text-lg text-gray-300 mb-8 text-center">
              Não espere mais para ter a experiência de uma barbearia premium com os melhores profissionais. Agende seu horário agora!
            </Text>
            <TouchableOpacity 
              onPress={() => router.replace("/agendamento")}
              className="bg-yellow-500 hover:bg-yellow-400 rounded-lg px-6 py-2 mx-auto w-40"
            >
              <Text className="text-black font-semibold text-base text-center">Agendar Agora</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <View className="text-center p-4">
    <View className="mx-auto w-14 h-14 bg-barber-gold/10 rounded-full flex items-center justify-center mb-3">
      {icon}
    </View>
    <Text className="text-lg font-medium mb-2">{title}</Text>
    <Text className="text-gray-600 text-sm">{description}</Text>
  </View>
);


export default Index;