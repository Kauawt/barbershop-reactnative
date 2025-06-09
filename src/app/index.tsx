import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from 'expo-router';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import BarberCard from "../components/BarberCard";
import APIService from "../services/APIService";

import { Scissors, Calendar, Award } from "lucide-react-native";

const Index = () => {
  const router = useRouter();

  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await APIService.servico.getAll();
        const barbersData = await APIService.usuario.getAll();

        const adaptedServices = servicesData.data
          .filter((srv) => srv.isActive)
          .map((srv) => ({
            id: srv._id,
            name: srv.name,
            price: srv.price,
            duration: srv.duracao,
            image: srv.image,
            description: srv.description ?? 'Descrição não disponível',
          }));

        setServices(adaptedServices);
        setBarbers(barbersData.data ?? []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-700">Carregando...</Text>
      </View>
    );
  }

  const featuredServices = services.slice(0, 3);
  const featuredBarbers = barbers.slice(0, 3);

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="relative w-full">
          <Image
            source={require('../assets/capa.jpg')}
            style={{ width: '100%', height: 250 }}
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30 flex items-center justify-center px-4">
            <Text className="text-3xl font-bold text-white text-center">
              Seu Estilo, Nossa Especialidade
            </Text>
            <Text className="text-lg mt-2 text-white text-center">
              Agende seu horário em uma das melhores barbearias, com os melhores profissionais.
            </Text>
            <View className="flex-row justify-center mt-4 space-x-4">
              <TouchableOpacity
                onPress={() => router.replace("/agendamento")}
                className="bg-yellow-500 rounded-lg px-6 py-2 w-40"
              >
                <Text className="text-black font-semibold text-base text-center">Agendar Agora</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.replace("/services")}
                className="border-2 border-white rounded-lg px-6 py-2"
              >
                <Text className="text-white text-base text-center">Ver Serviços</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View className="w-full px-4 py-8">
          <Text className="text-center text-xl font-bold mb-8">
            Por que escolher a BarberAgendaPro?
          </Text>
          <View className="flex flex-col md:flex-row gap-6">
            <FeatureCard
              title="Profissionais Qualificados"
              description="Nossa equipe é formada por barbeiros experientes e certificados."
              icon={<Scissors size={32} color="#facc15" />}
            />
            <FeatureCard
              title="Agendamento Fácil"
              description="Agende seu horário online em poucos passos."
              icon={<Calendar size={32} color="#facc15" />}
            />
            <FeatureCard
              title="Experiência Premium"
              description="Ambiente sofisticado e atendimento personalizado."
              icon={<Award size={32} color="#facc15" />}
            />
          </View>
        </View>

        {/* Services Section */}
        <View className="bg-gray-50 px-4 py-8">
          <View className="items-center mb-6">
            <Text className="text-2xl font-bold text-center">Nossos Serviços</Text>
            <TouchableOpacity
              onPress={() => router.replace("/services")}
              className="border border-yellow-500 rounded-lg px-4 py-2 mt-4"
            >
              <Text className="text-yellow-500">Ver Todos</Text>
            </TouchableOpacity>
          </View>
          <View className="flex flex-row flex-wrap justify-center gap-4">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        </View>

        {/* Barbers Section */}
        <View className="bg-white px-4 py-8">
          <View className="items-center mb-6">
            <Text className="text-2xl font-bold text-center">Nossos Barbeiros</Text>
            <TouchableOpacity
              onPress={() => router.replace("/barbers")}
              className="border border-yellow-500 rounded-lg px-4 py-2 mt-4"
            >
              <Text className="text-yellow-500">Ver Todos</Text>
            </TouchableOpacity>
          </View>
          <View className="flex flex-row flex-wrap justify-center gap-4">
            {featuredBarbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} />
            ))}
          </View>
        </View>

        {/* Call to Action */}
        <View className="w-full bg-black py-10 px-4">
          <View className="max-w-2xl mx-auto text-center">
            <Text className="text-3xl font-bold text-yellow-500 mb-4">
              Pronto para mudar seu visual?
            </Text>
            <Text className="text-lg text-gray-300 mb-6">
              Não espere mais para ter a experiência de uma barbearia premium com os melhores profissionais. Agende seu horário agora!
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/agendamento")}
              className="bg-yellow-500 rounded-lg px-6 py-2 w-40 mx-auto"
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
  <View className="items-center text-center p-4 flex-1">
    <View className="w-14 h-14 bg-yellow-100 rounded-full items-center justify-center mb-3">
      {icon}
    </View>
    <Text className="text-lg font-medium mb-1">{title}</Text>
    <Text className="text-gray-600 text-sm text-center">{description}</Text>
  </View>
);

export default Index;
