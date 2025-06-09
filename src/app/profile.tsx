import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { User as UserIcon, Loader2 } from "lucide-react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
//import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const router = useRouter();
  //const { user, updateUser } = useAuth();

  const [tab, setTab] = useState<"personal" | "address">("personal");

 /* const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    number: user?.address?.number || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  const handleChangePersonal = (field: keyof typeof personalInfo, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeAddress = (field: keyof typeof address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePersonal = () => {
    setIsSaving(true);
    // Simula salvar via API e atualizar contexto
    setTimeout(() => {
      updateUser({ ...user, ...personalInfo });
      setIsSaving(false);
    }, 1000);
  };

  const handleSaveAddress = () => {
    setIsSaving(true);
    // Simula salvar via API e atualizar contexto
    setTimeout(() => {
      updateUser({ ...user, address });
      setIsSaving(false);
    }, 1000);
  };*/

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View className="bg-barber-dark p-8 items-center">
          <View className="w-24 h-24 rounded-full bg-barber-gold/20 flex items-center justify-center mb-4">
            <UserIcon size={48} color="#b58900" />
          </View>
          <Text className="text-2xl font-semibold text-barber-gold">{user?.name || ""}</Text>
          <Text className="text-gray-300">{user?.email || ""}</Text>
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
