import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { VerifyEmailPage } from './pages/VerifyEmail';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/Dashboard';
import { FilesPage } from './pages/Files';
import { AppsPage } from './pages/Apps';
import { UsagePage } from './pages/Usage';
import { BillingPage } from './pages/Billing';
import { SettingsPage } from './pages/Settings';
import { AdminPage } from './pages/Admin';
import { AuthGuard, AdminGuard, GuestGuard } from './components/AuthGuard';
import { OAuthCallbackPage } from './pages/OAuthCallback';
import { PricingPage } from './pages/Pricing';
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
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Guest Routes */}
          <Route path="/login" element={
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          } />
          <Route path="/register" element={
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          } />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Protected Dashboard Routes */}
          <Route path="/app" element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="files" element={<FilesPage />} />
            <Route path="apps" element={<AppsPage />} />
            <Route path="usage" element={<UsagePage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="admin" element={
              <AdminGuard>
                <AdminPage />
              </AdminGuard>
            } />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
