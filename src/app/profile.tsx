import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { User as UserIcon, Loader2 } from "lucide-react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from '../context/auth';
import APIService from "../services/APIService";

export default function Profile() {
  const router = useRouter();
  const auth = useAuth();
  const [user, setUser] = useState(auth.user);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [tab, setTab] = useState<"personal" | "address">("personal");
  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({ street: "", number: "", city: "", state: "", zipCode: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const response = await APIService.cliente.getByFirebaseUid(user.uid);
          if (response) {
            setUserData(response);
            setPersonalInfo({ name: response.name || "", email: response.email || "", phone: response.phone || "" });
            setAddress({
              street: response.address?.street || "",
              number: response.address?.number || "",
              city: response.address?.city || "",
              state: response.address?.state || "",
              zipCode: response.address?.zipCode || "",
            });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
        }
      } else {
        router.replace("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChangePersonal = (field: keyof typeof personalInfo, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeAddress = (field: keyof typeof address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePersonal = async () => {
    setIsSaving(true);
    try {
      if (userData) {
        await APIService.cliente.update(userData._id, personalInfo);
        Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      Alert.alert("Erro", "Não foi possível atualizar as informações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    setIsSaving(true);
    try {
      if (userData) {
        await APIService.cliente.update(userData._id, { address });
        Alert.alert("Sucesso", "Endereço atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      Alert.alert("Erro", "Não foi possível atualizar o endereço.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#b58900" /></View>;
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.profileIcon}><UserIcon size={48} color="#b58900" /></View>
          <Text style={styles.name}>{userData?.name || ""}</Text>
          <Text style={styles.email}>{userData?.email || ""}</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, tab === "personal" && styles.activeTab]} onPress={() => setTab("personal")}>
            <Text style={[styles.tabText, tab === "personal" && styles.activeTabText]}>Informações Pessoais</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === "address" && styles.activeTab]} onPress={() => setTab("address")}>
            <Text style={[styles.tabText, tab === "address" && styles.activeTabText]}>Endereço</Text>
          </TouchableOpacity>
        </View>

        {tab === "personal" && (
          <View style={styles.formSection}>
            {['name', 'email', 'phone'].map((field, idx) => (
              <View key={idx} style={styles.formGroup}>
                <Text style={styles.label}>{field === 'name' ? 'Nome Completo' : field === 'email' ? 'Email' : 'Telefone'}</Text>
                <TextInput
                  value={personalInfo[field as keyof typeof personalInfo]}
                  onChangeText={(v) => handleChangePersonal(field as keyof typeof personalInfo, v)}
                  style={styles.input}
                  placeholder={field === 'email' ? 'seu@email.com' : ''}
                />
              </View>
            ))}
            <TouchableOpacity onPress={handleSavePersonal} style={styles.saveButton} disabled={isSaving}>
              {isSaving ? <Text style={styles.saveText}>Salvando...</Text> : <Text style={styles.saveText}>Salvar Alterações</Text>}
            </TouchableOpacity>
          </View>
        )}

        {tab === "address" && (
          <View style={styles.formSection}>
            {['street', 'number', 'zipCode', 'city', 'state'].map((field, idx) => (
              <View key={idx} style={styles.formGroup}>
                <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                <TextInput
                  value={address[field as keyof typeof address]}
                  onChangeText={(v) => handleChangeAddress(field as keyof typeof address, v)}
                  style={styles.input}
                  placeholder={field}
                />
              </View>
            ))}
            <TouchableOpacity onPress={handleSaveAddress} style={styles.saveButton} disabled={isSaving}>
              {isSaving ? <Text style={styles.saveText}>Salvando...</Text> : <Text style={styles.saveText}>Salvar Alterações</Text>}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 60 },
  profileHeader: { alignItems: "center", backgroundColor: "#1f2937", padding: 32 },
  profileIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#facc15", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  name: { fontSize: 20, fontWeight: "600", color: "#facc15" },
  email: { color: "#d1d5db" },
  tabContainer: { flexDirection: "row", marginTop: 24, marginHorizontal: 16, borderBottomWidth: 1, borderColor: "#d1d5db" },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2, borderColor: "transparent" },
  activeTab: { borderColor: "#facc15" },
  tabText: { fontWeight: "600", color: "#6b7280" },
  activeTabText: { color: "#facc15" },
  formSection: { marginHorizontal: 24, marginTop: 24 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, backgroundColor: "white" },
  saveButton: { backgroundColor: "#facc15", borderRadius: 8, paddingVertical: 12, alignItems: "center", marginTop: 16 },
  saveText: { color: "#000", fontWeight: "600" },
});
