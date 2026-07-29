import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../modules/auth/services/authService";

// The companion only exists for a signed-in person — without a token there is
// no memory, no analytics, no presence. Gate the app pages behind login.
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
