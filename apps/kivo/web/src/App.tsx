import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import AuthGuard from '@/layouts/AuthGuard';
import AdvancedPage from '@/pages/AdvancedPage';
import ApiKeysPage from '@/pages/ApiKeysPage';
import CheckoutPage from '@/pages/CheckoutPage';
import CreateFlowPage from '@/pages/CreateFlowPage';
import DashboardPage from '@/pages/DashboardPage';
import DeployPage from '@/pages/DeployPage';
import DeviceDetailPage from '@/pages/DeviceDetailPage';
import DevicesPage from '@/pages/DevicesPage';
import FinancePage from '@/pages/FinancePage';
import FlowDetailPage from '@/pages/FlowDetailPage';
import FlowsPage from '@/pages/FlowsPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import HealthPage from '@/pages/HealthPage';
import IntegrationsPage from '@/pages/IntegrationsPage';
import LoginPage from '@/pages/LoginPage';
import McpConsolePage from '@/pages/McpConsolePage';
import NotFoundPage from '@/pages/NotFoundPage';
import OperationsPage from '@/pages/OperationsPage';
import PaymentDetailPage from '@/pages/PaymentDetailPage';
import PaymentsPage from '@/pages/PaymentsPage';
import RegisterPage from '@/pages/RegisterPage';
import SettingsPage from '@/pages/SettingsPage';
import StatusPage from '@/pages/StatusPage';
import TeamPage from '@/pages/TeamPage';
import TemplatesPage from '@/pages/TemplatesPage';
import WebhooksPage from '@/pages/WebhooksPage';
import WorkspaceHomePage from '@/pages/WorkspaceHomePage';
import WorkflowsPage from '@/pages/WorkflowsPage';
import X402Page from '@/pages/X402Page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<AppLayout />}>
          <Route element={<AuthGuard />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<WorkspaceHomePage />} />
            <Route path="create-flow" element={<CreateFlowPage />} />
            <Route path="flows" element={<FlowsPage />} />
            <Route path="flows/:id" element={<FlowDetailPage />} />
            <Route path="advanced" element={<AdvancedPage />} />
            <Route path="operations" element={<OperationsPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="status" element={<StatusPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="ops-dashboard" element={<DashboardPage />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="devices/:id" element={<DeviceDetailPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="payments/:id" element={<PaymentDetailPage />} />
            <Route path="webhooks" element={<WebhooksPage />} />
            <Route path="api-keys" element={<ApiKeysPage />} />
            <Route path="mcp" element={<McpConsolePage />} />
            <Route path="x402" element={<X402Page />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="workflows" element={<WorkflowsPage />} />
            <Route path="deploy" element={<DeployPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
