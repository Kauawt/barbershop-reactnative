import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Scissors, Menu, X, User } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../context/auth";
import APIService from "../services/APIService";
import { getAuth, signOut } from "firebase/auth";
import app from "../services/firebase";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const isLargeScreen = width >= 768;
  const userName = user?.displayName || user?.email || "Perfil";

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        let uid = "";
        if (Platform.OS === "web") {
          uid = localStorage.getItem("uid") || "";
        } else {
          uid = await SecureStore.getItemAsync("uid") || "";
        }

        if (uid) {
          try {
            const userResponse = await APIService.usuario.getByFirebaseUid(uid);
            setUserRole(userResponse.role);
          } catch {
            const clienteResponse = await APIService.cliente.getByFirebaseUid(uid);
            setUserRole(clienteResponse.role);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar role:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      const firebaseAuth = getAuth(app);
      await signOut(firebaseAuth);

      if (Platform.OS === "web") {
        localStorage.removeItem("token");
        localStorage.removeItem("uid");
      } else {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("uid");
      }

      router.replace("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        {/* Logo */}
        <TouchableOpacity
          style={styles.logoRow}
          onPress={() => router.replace("/")}
        >
          <Scissors color="#FBBF24" size={24} />
          <Text style={styles.logoText}>Inova Barbearia</Text>
        </TouchableOpacity>

        {isLargeScreen ? (
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => router.replace("/services")}
            >
              <Text style={styles.navText}>Serviços</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => router.replace("/barbers")}
            >
              <Text style={styles.navText}>Barbeiros</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => router.replace("/agendamento")}
            >
              <Text style={styles.navText}>Agendar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.replace("/profile")}
            >
              <User color="black" size={16} style={{ marginRight: 8 }} />
              <Text style={styles.profileText}>{userName}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X color="white" size={24} />
            ) : (
              <Menu color="white" size={24} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Mobile Menu */}
      {!isLargeScreen && isMenuOpen && (
        <View style={styles.mobileMenu}>
          <TouchableOpacity
            style={styles.mobileMenuItem}
            onPress={() => {
              router.replace("/services");
              setIsMenuOpen(false);
            }}
          >
            <Text style={styles.mobileMenuText}>Serviços</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mobileMenuItem}
            onPress={() => {
              router.replace("/barbers");
              setIsMenuOpen(false);
            }}
          >
            <Text style={styles.mobileMenuText}>Barbeiros</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mobileMenuItem}
            onPress={() => {
              router.replace("/agendamento");
              setIsMenuOpen(false);
            }}
          >
            <Text style={styles.mobileMenuText}>Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mobileMenuItem}
            onPress={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
          >
            <Text style={styles.mobileLogoutText}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mobileMenuItem}
            onPress={() => {
              router.replace("/profile");
              setIsMenuOpen(false);
            }}
          >
            <Text style={styles.mobileProfileText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      )}
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
  topRow: {
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
  navRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  navItem: {
    marginLeft: 24,
  },
  navText: {
    color: "white",
  },
  logoutButton: {
    marginLeft: 24,
  },
  logoutText: {
    color: "white",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#FBBF24",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 24,
  },
  profileText: {
    color: "black",
    fontWeight: "600",
    fontSize: 14,
  },
  menuButton: {
    padding: 8,
  },
  mobileMenu: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "black",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  mobileMenuItem: {
    paddingVertical: 8,
  },
  mobileMenuText: {
    color: "white",
  },
  mobileLogoutText: {
    color: "#F87171",
  },
  mobileProfileText: {
    color: "#FBBF24",
  },
});

export default Header;
