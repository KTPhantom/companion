import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LandingPage from "../../modules/auth/pages/LandingPage";
import LoginPage from "../../modules/auth/pages/LoginPage";
import SignupPage from "../../modules/auth/pages/SignupPage";
import DashboardPage from "../../modules/dashboard/pages/DashboardPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}