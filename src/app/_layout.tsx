/* import { Slot, useSegments } from "expo-router";
import ProtectedRoute from "../components/ProtectedRoute";
import '../styles/global.css';

export default function Layout() {
  const segments = useSegments();
  const isPublicPage = segments[0] === "login" || segments[0] === "cadastro";

  if (isPublicPage) {
    return <Slot />;
  }

  return (
    <ProtectedRoute>
      <Slot />
    </ProtectedRoute>
  );
} */

import { Slot, useSegments } from "expo-router"
import { PaperProvider } from "react-native-paper"
import { AuthProvider } from "../context/auth"
import ProtectedRoute from "../components/ProtectedRoute";

export default function Layout() {

  return (
    <PaperProvider>
      <AuthProvider>
        <ProtectedRoute>
          <Slot />
        </ProtectedRoute>
      </AuthProvider>
    </PaperProvider>
  )
}