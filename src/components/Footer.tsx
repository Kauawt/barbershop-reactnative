import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Scissors } from "lucide-react-native";

const Footer = () => {
  const router = useRouter();

  return (
    <View style={styles.footerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.topRow}>
          <View style={[styles.flex1, styles.alignStart]}>
            <View style={styles.logoRow}>
              <Scissors color="#FBBF24" size={20} />
              <Text style={styles.logoText}>Inova Barbearia</Text>
            </View>
          </View>

          <View style={styles.linksAndContactRow}>
            <View style={styles.linkSection}>
              <Text style={styles.sectionTitle}>Links</Text>
              <View>
                <TouchableOpacity onPress={() => router.push("/")}>
                  <Text style={styles.linkText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/services")}>
                  <Text style={styles.linkText}>Serviços</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/barbers")}>
                  <Text style={styles.linkText}>Barbeiros</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/agendamento")}>
                  <Text style={styles.linkText}>Agendar</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.linkSection}>
              <Text style={styles.sectionTitle}>Contato</Text>
              <View>
                <Text style={styles.linkText}>Rua Dom Pedro I, 65 - Centro</Text>
                <Text style={styles.linkText}>Indaiatuba - SP</Text>
                <Text style={styles.linkText}>(11) 99880-0206</Text>
                <Text style={styles.linkText}>inova_barber@gmail.com</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>
            &copy; {new Date().getFullYear()} InnovaTech Solutions. Todos os direitos reservados.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "black",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  innerContainer: {
    maxWidth: 960, // equivalente a max-w-6xl (aprox 960px)
    alignSelf: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
  },
  alignStart: {
    alignItems: "flex-start",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoText: {
    color: "white",
    fontSize: 18, // text-lg
    fontWeight: "700", // font-bold
    marginLeft: 8,
  },
  linksAndContactRow: {
    flexDirection: "row",
    gap: 32, // espaço entre as seções (equivale a space-x-8)
  },
  linkSection: {
    alignItems: "center",
  },
  sectionTitle: {
    color: "#FBBF24", // yellow-500
    fontWeight: "600", // font-semibold
    marginBottom: 8,
  },
  linkText: {
    color: "#D1D5DB", // gray-300
    marginBottom: 4,
  },
  bottomRow: {
    borderTopWidth: 1,
    borderTopColor: "#374151", // gray-700
    paddingTop: 12,
    marginTop: 12,
  },
  bottomText: {
    color: "#9CA3AF", // gray-400
    textAlign: "center",
  },
});

export default Footer;
