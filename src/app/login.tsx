import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from '../context/auth';
import LoginHeader from "../components/LoginHeader";
import Footer from "../components/Footer";
import { Eye, EyeOff } from "lucide-react-native";

export default function Login() {
  const router = useRouter();
  const { user, handleLogin, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <LoginHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Login</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu email"
              onChangeText={text => setUser({ ...user, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.inputPassword]}
                placeholder="Sua senha"
                onChangeText={text => setUser({ ...user, password: text })}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff color="#6B7280" size={20} />
                ) : (
                  <Eye color="#6B7280" size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão “Esqueci minha senha” separado e alinhado à direita */}
          <TouchableOpacity
            onPress={() => router.push("/forgot-password")}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/register")}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>
              Não tem uma conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#374151",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  inputPassword: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  forgotPasswordButton: {
    marginTop: 8,
    alignSelf: "flex-end", // alinhado à direita
  },
  forgotPasswordText: {
    color: "#b58900",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#b58900",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  registerLink: {
    marginTop: 16,
  },
  registerText: {
    color: "#b58900",
    textAlign: "center",
    fontSize: 16,
  },
});