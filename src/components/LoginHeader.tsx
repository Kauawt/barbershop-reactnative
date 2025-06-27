import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
import { Scissors } from "lucide-react-native";

const LoginHeader = () => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.innerRow}>
        <TouchableOpacity
          style={styles.logoRow}
          onPress={() => router.replace('/')}
        >
          <Scissors color="#FBBF24" size={24} />
          <Text style={styles.logoText}>Inova Barbearia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "black",
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: "100%",
    zIndex: 50,
  },
  innerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
});

export default LoginHeader;
