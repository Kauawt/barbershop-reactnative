import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { User as UserIcon, Loader2 } from "lucide-react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from '../context/auth'
import APIService from "../services/APIService";

export default function Profile() {
  const router = useRouter();
  const auth = useAuth();
  const [user, setUser] = useState(auth.user);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const [tab, setTab] = useState<"personal" | "address">("personal");

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState({
    street: "",
    number: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const response = await APIService.cliente.getByFirebaseUid(user.uid);
          if (response) {
            setUserData(response);
            setPersonalInfo({
              name: response.name || "",
              email: response.email || "",
              phone: response.phone || "",
            });
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
        await APIService.cliente.update(userData._id, {
          name: personalInfo.name,
          email: personalInfo.email,
          phone: personalInfo.phone,
        });
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
        await APIService.cliente.update(userData._id, {
          address: address,
        });
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
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#b58900" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View className="bg-barber-dark p-8 items-center">
          <View className="w-24 h-24 rounded-full bg-barber-gold/20 flex items-center justify-center mb-4">
            <UserIcon size={48} color="#b58900" />
          </View>
          <Text className="text-2xl font-semibold text-barber-gold">{userData?.name || ""}</Text>
          <Text className="text-gray-300">{userData?.email || ""}</Text>
        </View>

        {/* Tabs */}
        <View className="flex-row mt-6 mx-4 border-b border-gray-300">
          <TouchableOpacity
            className={`flex-1 py-3 items-center border-b-2 ${
              tab === "personal" ? "border-barber-gold" : "border-transparent"
            }`}
            onPress={() => setTab("personal")}
          >
            <Text className={`font-semibold ${tab === "personal" ? "text-barber-gold" : "text-gray-500"}`}>
              Informações Pessoais
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 items-center border-b-2 ${
              tab === "address" ? "border-barber-gold" : "border-transparent"
            }`}
            onPress={() => setTab("address")}
          >
            <Text className={`font-semibold ${tab === "address" ? "text-barber-gold" : "text-gray-500"}`}>
              Endereço
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {tab === "personal" && (
          <View className="mx-6 mt-6 space-y-6">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Nome Completo</Text>
              <TextInput
                value={personalInfo.name}
                onChangeText={(v) => handleChangePersonal("name", v)}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Seu nome completo"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
              <TextInput
                value={personalInfo.email}
                onChangeText={(v) => handleChangePersonal("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="seu@email.com"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Telefone</Text>
              <TextInput
                value={personalInfo.phone}
                onChangeText={(v) => handleChangePersonal("phone", v)}
                keyboardType="phone-pad"
                placeholder="(00) 00000-0000"
                className="border border-gray-300 rounded px-3 py-2"
              />
            </View>
            <TouchableOpacity
              onPress={handleSavePersonal}
              className="bg-barber-gold rounded py-3 items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <View className="flex-row items-center">
                  <Loader2 size={20} color="#000" className="mr-2" />
                  <Text className="text-black font-semibold">Salvando...</Text>
                </View>
              ) : (
                <Text className="text-black font-semibold">Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {tab === "address" && (
          <View className="mx-6 mt-6 space-y-6">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Rua</Text>
              <TextInput
                value={address.street}
                onChangeText={(v) => handleChangeAddress("street", v)}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Rua"
              />
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">Número</Text>
                <TextInput
                  value={address.number}
                  onChangeText={(v) => handleChangeAddress("number", v)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Número"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">CEP</Text>
                <TextInput
                  value={address.zipCode}
                  onChangeText={(v) => handleChangeAddress("zipCode", v)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="00000-000"
                />
              </View>
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">Cidade</Text>
                <TextInput
                  value={address.city}
                  onChangeText={(v) => handleChangeAddress("city", v)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Cidade"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">Estado</Text>
                <TextInput
                  value={address.state}
                  onChangeText={(v) => handleChangeAddress("state", v)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Estado"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSaveAddress}
              className="bg-barber-gold rounded py-3 items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <View className="flex-row items-center">
                  <Loader2 size={20} color="#000" className="mr-2" />
                  <Text className="text-black font-semibold">Salvando...</Text>
                </View>
              ) : (
                <Text className="text-black font-semibold">Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}
