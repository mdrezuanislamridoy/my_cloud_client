import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { VerifyEmailPage } from './pages/VerifyEmail';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { DashboardPage } from './pages/Dashboard';
import { FilesPage } from './pages/Files';
import { AppsPage } from './pages/Apps';
import { UsagePage } from './pages/Usage';
import { BillingPage } from './pages/Billing';
import { SettingsPage } from './pages/Settings';
import { AdminOverviewPage } from './pages/admin/Overview';
import { AdminUsersPage } from './pages/admin/Users';
import { AdminSubscriptionsPage } from './pages/admin/Subscriptions';
import { AdminPlansPage } from './pages/admin/Plans';
import { AdminAppsPage } from './pages/admin/Apps';
import { AuthGuard, GuestGuard, AdminGuard } from './components/AuthGuard';
import { OAuthCallbackPage } from './pages/OAuthCallback';
import { PricingPage } from './pages/Pricing';
import { SubscriptionSuccessPage } from './pages/SubscriptionSuccess';
import { SubscriptionCancelPage } from './pages/SubscriptionCancel';
import { DocsPage } from './pages/Docs';
import './App.css';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        theme="dark"
        toastOptions={{
          style: {
            background: '#0F172A',
            border: '1px solid #1E293B',
            color: '#E2E8F0',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
          <Route path="/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancelPage />} />
          <Route path="/docs" element={<DocsPage />} />

          {/* User Dashboard */}
          <Route path="/app" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
            <Route index element={<DashboardPage />} />
            <Route path="files" element={<FilesPage />} />
            <Route path="apps" element={<AppsPage />} />
            <Route path="usage" element={<UsagePage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
            <Route path="plans" element={<AdminPlansPage />} />
            <Route path="apps" element={<AdminAppsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
