import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import { Service } from "../types";
import APIService from "../services/APIService";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { width } = useWindowDimensions();

  const getColumnWidth = () => {
    if (width >= 1024) return "31%"; 
    if (width >= 768) return "48%";
    return "100%";
  };

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
            description: srv.description ?? "Descrição não disponível",
          }));
        setServices(adaptedServices);
      } catch (err) {
        setError("Erro ao carregar os serviços.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.title}>Nossos Serviços</Text>
          <Text style={styles.subtitle}>
            Conheça nossa variedade de serviços de barbearia premium, executados por
            profissionais qualificados para proporcionar a melhor experiência.
          </Text>
        </View>

        <View style={styles.servicesSection}>
          {loading && <ActivityIndicator size="large" color="#facc15" />}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {!loading && !error && (
            <View style={styles.cardsContainer}>
              {services.map((service) => (
                <View
                  key={service.id}
                  style={[styles.cardWrapper, { width: getColumnWidth() }]}
                >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  hero: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#facc15",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: "#ffffff",
    textAlign: "center",
    maxWidth: 600,
    alignSelf: "center",
    fontSize: 16,
  },
  servicesSection: {
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#dc2626", 
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  cardWrapper: {
    marginBottom: 16,
  },
});
