import React, { useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../services/firebase";
import { Scissors } from "lucide-react-native";
import CustomInput from "../components/inputs/CustomInput";
import CustomMaskInput from "../components/inputs/CustomMaskInput";
import Header from "../components/Header";
import Footer from "../components/Footer";
import APIService from "../services/APIService";

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setdataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [cep, setCep] = useState("");
  const [senha, setSenha] = useState("");

  const router = useRouter();
  const auth = getAuth(app);

  function convertToISODate(dateStr: string): string {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }

  const handleNext = async () => {
    if (step === 1) {
      if (!name || !cpf || !dataNascimento || !email) {
        Alert.alert("Preencha todos os campos obrigatórios.");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        Alert.alert("E-mail inválido.");
        return;
      }

      setStep(2);
    } else {
      if (!endereco || !number || !neighborhood || !cep || !senha) {
        Alert.alert("Preencha todos os campos obrigatórios.");
        return;
      }

      await handleRegister();
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

      console.log("Usuário criado:", userCredential.user.uid);

      // Salva o cliente no backend
      await APIService.cliente.create({
        firebase_uid: userCredential.user.uid,
        name,
        email,
        senha,
        CPF: cpf,
        dataNascimento: convertToISODate(dataNascimento),
        endereco: `${endereco}, ${number}, ${neighborhood}, ${cep}`,
        role: "cliente",
      });

      // Pega o token JWT do Firebase e salva
      if (Platform.OS !== "web") {
        const token = await userCredential.user.getIdToken();
        await SecureStore.setItemAsync("token", token);
      }

      Alert.alert("Cadastro concluído!", "Seja bem-vindo!");
      router.replace("/");
    } catch (error: any) {
      const errorCode = error.code;

      switch (errorCode) {
        case "auth/email-already-in-use":
          Alert.alert("Erro", "Este e-mail já está em uso.");
          break;
        case "auth/invalid-email":
          Alert.alert("Erro", "E-mail inválido.");
          break;
        case "auth/weak-password":
          Alert.alert("Erro", "A senha é muito fraca.");
          break;
        default:
          Alert.alert("Erro", error.message || "Erro ao registrar usuário.");
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.logoRow}>
              <Scissors color="#FBBF24" size={24} />
              <Text style={styles.logoText}>Inova Barbearia</Text>
            </View>

            <View>
              {step === 1 ? (
                <>
                  <CustomInput
                    style={styles.inputMargin}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                  />
                  <CustomMaskInput
                    placeholder="CPF"
                    value={cpf}
                    onChangeText={(masked, unmasked) => setCpf(masked)}
                    maskType="cpf"
                    keyboardType="numeric"
                  />
                  <CustomMaskInput
                    placeholder="Data de Nascimento (DD/MM/AAAA)"
                    value={dataNascimento}
                    onChangeText={(masked, unmasked) => setdataNascimento(masked)}
                    maskType="date"
                    keyboardType="numeric"
                  />
                  <CustomInput
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </>
              ) : (
                <>
                  <CustomInput
                    style={styles.inputMargin}
                    placeholder="Endereço (Rua)"
                    value={endereco}
                    onChangeText={setEndereco}
                  />
                  <CustomInput
                    style={styles.inputMargin}
                    placeholder="Número"
                    value={number}
                    onChangeText={setNumber}
                    keyboardType="numeric"
                  />
                  <CustomInput
                    style={styles.inputMargin}
                    placeholder="Bairro"
                    value={neighborhood}
                    onChangeText={setNeighborhood}
                  />
                  <CustomInput
                    style={styles.inputMargin}
                    placeholder="CEP"
                    value={cep}
                    onChangeText={setCep}
                    keyboardType="numeric"
                  />
                  <CustomInput
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </>
              )}

              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>{step === 1 ? "Avançar" : "Cadastrar"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.loginLink}>Já possui conta? Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ height: 40 }} />
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
    color: "#000",
  },
  inputMargin: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#FBBF24",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
    marginTop: 24,
    width: 160,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    color: "black",
  },
  loginLink: {
    marginTop: 16,
    textAlign: "center",
    color: "#374151",
    fontSize: 16,
  },
});
