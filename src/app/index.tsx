import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
import Header from "../components/Header";
import Footer from "../components/Footer";
import APIService from "../services/APIService";

import { Scissors, Calendar, Award } from "lucide-react-native";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface Barber {
  id: string;
  name: string;
  email: string;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Index = () => {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await APIService.servico.getAll();
        const barbersData = await APIService.usuario.getAll();

        const adaptedServices = servicesData.data
          .filter((srv: any) => srv.isActive)
          .map((srv: any) => ({
            id: srv._id,
            name: srv.name,
            price: srv.price,
            duration: srv.duracao,
            description: srv.description ?? 'Descrição não disponível',
          }));

        const adaptedBarbers = barbersData.data
          .filter((barber: any) => barber.role === 'barbeiro')
          .map((barber: any) => ({
            id: barber._id,
            name: barber.name,
            email: barber.email,
          }));

        setServices(adaptedServices);
        setBarbers(adaptedBarbers);
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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const featuredServices = services.slice(0, 4);
  const featuredBarbers = barbers.slice(0, 3);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.heroSection}>
          <Image
            source={require('../assets/capa.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Seu Estilo, Nossa Especialidade</Text>
            <Text style={styles.heroSubtitle}>
              Agende seu horário em uma das melhores barbearias, com os melhores profissionais.
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity onPress={() => router.replace("/agendamento")}
                style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Agendar Agora</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace("/services")}
                style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Ver Serviços</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Por que escolher a Inova Barbearia?</Text>
          <View style={styles.featuresContainer}>
            <FeatureCard
              title="Profissionais Qualificados"
              description="Nossa equipe é formada por barbeiros experientes e certificados."
              icon={<Scissors size={32} color="#facc15" />} />
            <FeatureCard
              title="Agendamento Fácil"
              description="Agende seu horário online em poucos passos."
              icon={<Calendar size={32} color="#facc15" />} />
            <FeatureCard
              title="Experiência Premium"
              description="Ambiente sofisticado e atendimento personalizado."
              icon={<Award size={32} color="#facc15" />} />
          </View>
        </View>

        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nossos Serviços</Text>
            <TouchableOpacity onPress={() => router.replace("/services")} style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>Ver Todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardGrid}>
            {featuredServices.map((service) => (
              <View key={service.id} style={styles.card}>
                <Text style={styles.cardTitle}>{service.name}</Text>
                <Text style={styles.cardSubtitle}>R$ {service.price.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => router.push("/agendamento")}
                  style={styles.cardButton}>
                  <Text style={styles.cardButtonText}>Agendar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.barbersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nossos Barbeiros</Text>
          </View>
          <View style={styles.cardGrid}>
            {featuredBarbers.map((barber) => (
              <View key={barber.id} style={styles.card}>
                <Text style={styles.cardTitle}>{barber.name}</Text>
                <TouchableOpacity onPress={() => router.push("/agendamento")}
                  style={styles.cardButton}>
                  <Text style={styles.cardButtonText}>Agendar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctaSection}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Pronto para mudar seu visual?</Text>
            <Text style={styles.ctaText}>
              Não espere mais para ter a experiência de uma barbearia premium com os melhores profissionais. Agende seu horário agora!
            </Text>
            <TouchableOpacity onPress={() => router.replace("/agendamento")} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Agendar Agora</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 32, backgroundColor: "white" }} />
        <Footer />
      </ScrollView>
    </View>
  );
};

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <View style={styles.featureCard}>
    <View style={styles.featureIcon}>{icon}</View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureText}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  loadingText: { fontSize: 18, color: '#4B5563' },
  heroSection: { position: 'relative', width: '100%' },
  heroImage: { width: '100%', height: 250 },
  heroOverlay: {
    position: 'absolute', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16
  },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  heroSubtitle: { fontSize: 16, color: 'white', marginTop: 8, textAlign: 'center' },
  heroButtons: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 8 },
  primaryButton: { backgroundColor: '#FBBF24', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24 },
  primaryButtonText: { color: 'black', fontWeight: '600', fontSize: 16, textAlign: 'center' },
  secondaryButton: { borderWidth: 2, borderColor: 'white', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24 },
  secondaryButtonText: { color: 'white', fontSize: 16, textAlign: 'center' },
  featuresSection: { paddingHorizontal: 16, paddingVertical: 32 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  featuresContainer: { flexDirection: 'column', gap: 24 },
  featureCard: { alignItems: 'center', padding: 16, flex: 1 },
  featureIcon: { width: 56, height: 56, backgroundColor: '#FEF3C7', borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  featureTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  featureText: { fontSize: 14, color: '#4B5563', textAlign: 'center' },
  servicesSection: { backgroundColor: '#F9FAFB', paddingHorizontal: 16, paddingVertical: 32 },
  barbersSection: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 32 },
  sectionHeader: { alignItems: 'center', marginBottom: 24 },
  outlineButton: { borderWidth: 1, borderColor: '#FBBF24', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, marginTop: 12 },
  outlineButtonText: { color: '#FBBF24', fontSize: 14 },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  card: { backgroundColor: 'white', padding: 8, borderRadius: 8, width: '45%', maxWidth: 220, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  cardSubtitle: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  cardButton: { backgroundColor: '#FBBF24', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginTop: 8 },
  cardButtonText: { color: 'black', fontWeight: '600', fontSize: 12, textAlign: 'center' },
  ctaSection: { backgroundColor: 'black', paddingVertical: 40, paddingHorizontal: 16 },
  ctaContent: { maxWidth: 600, alignSelf: 'center', textAlign: 'center' },
  ctaTitle: { fontSize: 24, fontWeight: 'bold', color: '#FBBF24', marginBottom: 16, textAlign: 'center' },
  ctaText: { fontSize: 16, color: '#D1D5DB', marginBottom: 24, textAlign: 'center' },
});

export default Index;
