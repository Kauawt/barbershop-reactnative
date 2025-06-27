import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { Service } from "../types";
import { useRouter } from "expo-router";

interface ServiceCardProps {
  service: Service;
  showBookButton?: boolean;
}

const ServiceCard = ({ service, showBookButton = true }: ServiceCardProps) => {
  const router = useRouter();

  const handleBooking = () => {
    router.push({ pathname: "/agendamento", params: { serviceId: service.id } });
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/cabelo_simples.jpg")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{service.name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.duration}>{service.duration} min</Text>
          <Text style={styles.price}>R$ {service.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.description}>{service.description}</Text>
      </View>
      {showBookButton && (
        <TouchableOpacity onPress={handleBooking} style={styles.button}>
          <Text style={styles.buttonText}>Agendar Agora</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  imageContainer: {
    height: 160,
    backgroundColor: "#1f2937",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  duration: {
    color: "#b45309",
  },
  price: {
    color: "#facc15",
    fontWeight: "bold",
  },
  description: {
    color: "#4b5563",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#1f2937",
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
});

export default ServiceCard;
