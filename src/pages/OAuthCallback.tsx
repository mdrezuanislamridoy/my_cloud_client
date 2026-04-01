import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens, fetchProfile } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken) {
      toast.error("Google login failed");
      navigate("/login", { replace: true });
      return;
    }

    setTokens(accessToken, refreshToken ?? "");

    fetchProfile()
      .then(() => {
        toast.success("Logged in with Google!");
        navigate("/app", { replace: true });
      })
      .catch(() => {
        toast.error("Failed to load profile");
        navigate("/login", { replace: true });
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
      <p className="text-white text-sm">Signing you in...</p>
    </div>
  );
}
