import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Appointment, Service, Barber } from "../types";
import { Calendar, Clock, User } from "lucide-react-native";

// Variáveis simuladas (deverão ser passadas via props/contexto/estado)
const services: Service[] = [];
const barbers: Barber[] = [];

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const { serviceId, barberId, date, status, totalPrice } = appointment;

  const service = services.find((s) => s.id === serviceId);
  const barber = barbers.find((b) => b.id === barberId);

  const getStatusText = () => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "completed":
        return "Concluído";
      case "canceled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.serviceName}>{service?.name || "Serviço"}</Text>
        <Text style={styles.status}>{getStatusText()}</Text>
      </View>
      <Text style={styles.price}>R$ {totalPrice.toFixed(2)}</Text>

      <View style={styles.infoGroup}>
        <View style={styles.infoRow}>
          <Calendar size={16} color="#facc15" style={styles.icon} />
          <Text>{new Date(date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={16} color="#facc15" style={styles.icon} />
          <Text>{appointment.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <User size={16} color="#facc15" style={styles.icon} />
          <Text>{barber?.name || "Barbeiro"}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => console.log(`Cancelando agendamento: ${appointment.id}`)}
        style={styles.cancelButton}
      >
        <Text style={styles.cancelText}>Cancelar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    color: "#374151",
  },
  price: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 8,
  },
  infoGroup: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "white",
    fontWeight: "600",
  },
});

export default AppointmentCard;
