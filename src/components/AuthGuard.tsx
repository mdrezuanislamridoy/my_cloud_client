import { type ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface GuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: GuardProps) {
  const { accessToken, user, fetchProfile } = useAuthStore();
  const location = useLocation();
  const [checking, setChecking] = useState(!user && !!accessToken);

  useEffect(() => {
    if (!user && accessToken) {
      fetchProfile().finally(() => setChecking(false));
    }
  }, [user, accessToken, fetchProfile]);

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (checking) return null;

  if (user?.role === "ADMIN" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

export function AdminGuard({ children }: GuardProps) {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: GuardProps) {
  const { accessToken, user } = useAuthStore();

  if (accessToken) {
    return <Navigate to={user?.role === "ADMIN" ? "/admin" : "/app"} replace />;
  }

  return <>{children}</>;
}
