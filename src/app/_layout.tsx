import { Slot, useSegments } from "expo-router";
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
}