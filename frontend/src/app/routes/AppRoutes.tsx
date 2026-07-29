import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LandingPage from "../../modules/auth/pages/LandingPage";
import LoginPage from "../../modules/auth/pages/LoginPage";
import SignupPage from "../../modules/auth/pages/SignupPage";
import VerifyMagicLinkPage from "../../modules/auth/pages/VerifyMagicLinkPage";
import DashboardPage from "../../modules/dashboard/pages/DashboardPage";
import CompanionPage from "../../modules/companion/pages/CompanionPage";
import ProtectedRoute from "../../shared/components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/verify" element={<VerifyMagicLinkPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companion"
          element={
            <ProtectedRoute>
              <CompanionPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
