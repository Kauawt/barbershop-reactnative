import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { Service } from '../types';
import APIService from '../services/APIService';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await APIService.servico.getAll();
        const adaptedServices: Service[] = response.data
          .filter((srv: any) => srv.isActive)
          .map((srv: any) => ({
            id: srv._id,
            name: srv.name,
            price: srv.price,
            duration: srv.duracao,
            image: srv.image,
            description: srv.description ?? 'Descrição não disponível',
          }));
        setServices(adaptedServices);
      } catch (err) {
        setError('Erro ao carregar os serviços.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="bg-black/30 py-12 px-4">
          <Text className="text-3xl font-bold text-yellow-500 text-center mb-4">
            Nossos Serviços
          </Text>
          <Text className="text-white text-center max-w-[90%] mx-auto">
            Conheça nossa variedade de serviços de barbearia premium, executados por profissionais qualificados para proporcionar a melhor experiência.
          </Text>
        </View>
        <View className="py-10 px-4">
          {loading && <ActivityIndicator size="large" color="#facc15" />}
          {error && <Text className="text-red-600 text-center">{error}</Text>}

          {!loading && !error && (
            <View className="flex flex-row flex-wrap justify-between gap-4">
              {services.map(service => (
                <View key={service.id} className="w-full md:w-[48%] lg:w-[31%]">
                  <ServiceCard service={service} />
                </View>
              ))}
            </View>
          )}
        </View>
        <Footer />
      </ScrollView>

      
    </View>
  );
}
