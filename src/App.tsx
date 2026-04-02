import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from '@/features/marketing/pages/Landing';
import { LoginPage } from '@/features/auth/pages/Login';
import { RegisterPage } from '@/features/auth/pages/Register';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmail';
import { AuthCallbackPage } from '@/features/auth/pages/AuthCallback';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { DashboardPage } from '@/features/cloud/pages/Dashboard';
import { FilesPage } from '@/features/cloud/pages/Files';
import { AppsPage } from '@/features/cloud/pages/Apps';
import { UsagePage } from '@/features/marketing/pages/Usage';
import { BillingPage } from '@/features/billing/pages/Billing';
import { SettingsPage } from '@/features/auth/pages/Settings';
import { AdminOverviewPage } from '@/features/admin/pages/Overview';
import { AdminUsersPage } from '@/features/admin/pages/Users';
import { AdminSubscriptionsPage } from '@/features/admin/pages/Subscriptions';
import { AdminPlansPage } from '@/features/admin/pages/Plans';
import { AdminAppsPage } from '@/features/admin/pages/Apps';
import { AuthGuard, GuestGuard, AdminGuard } from '@/components/AuthGuard';
import { PricingPage } from '@/features/billing/pages/Pricing';
import { SubscriptionSuccessPage } from '@/features/billing/pages/SubscriptionSuccess';
import { SubscriptionCancelPage } from '@/features/billing/pages/SubscriptionCancel';
import { DocsPage } from '@/features/marketing/pages/Docs';
import '@/App.css';

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
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
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
