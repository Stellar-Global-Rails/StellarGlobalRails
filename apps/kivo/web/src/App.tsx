import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import AuthGuard from '@/layouts/AuthGuard';
import CheckoutPage from '@/pages/CheckoutPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import GatewayPage from '@/pages/GatewayPage';
import LaunchPage from '@/pages/LaunchPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PowerTotemDetailPage from '@/pages/PowerTotemDetailPage';
import PowerTotemStudioPage from '@/pages/PowerTotemStudioPage';
import RegisterPage from '@/pages/RegisterPage';
import SettingsPage from '@/pages/SettingsPage';
import SdkPage from '@/pages/SdkPage';
import StatusPage from '@/pages/StatusPage';
import TotemDisplayPage from '@/pages/TotemDisplayPage';
import TotemSimulatorPage from '@/pages/TotemSimulatorPage';
import ValidationPage from '@/pages/ValidationPage';
import WorkspaceHomePage from '@/pages/WorkspaceHomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/totem/:id/display" element={<TotemDisplayPage />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route element={<AuthGuard />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<WorkspaceHomePage />} />
            <Route path="studio" element={<PowerTotemStudioPage />} />
            <Route path="gateway" element={<GatewayPage />} />
            <Route path="sdk" element={<SdkPage />} />
            <Route path="validation" element={<ValidationPage />} />
            <Route path="launch" element={<LaunchPage />} />
            <Route path="totems/:id" element={<PowerTotemDetailPage />} />
            <Route path="totem-simulator" element={<TotemSimulatorPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="status" element={<StatusPage />} />
            <Route path="settings" element={<SettingsPage />} />

            <Route path="create-flow" element={<Navigate to="/studio" replace />} />
            <Route path="flows" element={<Navigate to="/studio" replace />} />
            <Route path="flows/:id" element={<Navigate to="/studio" replace />} />
            <Route path="templates" element={<Navigate to="/studio" replace />} />
            <Route path="mcp" element={<Navigate to="/studio" replace />} />
            <Route path="x402" element={<Navigate to="/validation" replace />} />
            <Route path="integrations" element={<Navigate to="/sdk" replace />} />
            <Route path="api-keys" element={<Navigate to="/sdk" replace />} />
            <Route path="finance" element={<Navigate to="/launch" replace />} />
            <Route path="payments" element={<Navigate to="/checkout" replace />} />
            <Route path="payments/:id" element={<Navigate to="/checkout" replace />} />
            <Route path="health" element={<Navigate to="/status" replace />} />
            <Route path="workflows" element={<Navigate to="/launch" replace />} />
            <Route path="deploy" element={<Navigate to="/status" replace />} />
            <Route path="team" element={<Navigate to="/settings" replace />} />
            <Route path="advanced" element={<Navigate to="/settings" replace />} />
            <Route path="operations" element={<Navigate to="/gateway" replace />} />
            <Route path="ops-dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="devices" element={<Navigate to="/gateway" replace />} />
            <Route path="devices/:id" element={<Navigate to="/gateway" replace />} />
            <Route path="webhooks" element={<Navigate to="/settings" replace />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
