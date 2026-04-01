import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface GuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: GuardProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
  const accessToken = useAuthStore((s) => s.accessToken);

  if (accessToken) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
