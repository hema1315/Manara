import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router";

export default function RecoveryRoute({ children }) {
  const { isRecovery, loading } = useAuth();

  if (loading) return null;

  if (!isRecovery) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
