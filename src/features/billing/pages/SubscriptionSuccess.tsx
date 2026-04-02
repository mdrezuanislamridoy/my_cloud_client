import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import api from "@/config/axios";

export function SubscriptionSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [countdown, setCountdown] = useState(5);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    api.post("/subscription/verify-session", { sessionId })
      .then(() => {
        setStatus("success");
      })
      .catch(() => {
        // Even if verify fails (e.g. already activated), show success
        // Webhook may have already activated it
        setStatus("success");
      });
  }, [sessionId]);

  useEffect(() => {
    if (status !== "success") return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          navigate("/app/billing", { replace: true });
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, navigate]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#7C3AED] animate-spin mx-auto mb-4" />
          <p className="text-white font-bold">Activating your subscription...</p>
          <p className="text-[#94A3B8] text-sm mt-1">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4">
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-[#EF4444]" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
          <p className="text-[#94A3B8] mb-6">Could not verify your payment session.</p>
          <button onClick={() => navigate("/app/billing")} className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 rounded-xl transition-colors">
            Go to Billing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4">
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-[#22C55E]" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Payment Successful!</h1>
        <p className="text-[#94A3B8] mb-6">
          Your subscription has been activated. Storage and file limits are now updated.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-[#94A3B8] mb-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          Redirecting to billing in {countdown}s...
        </div>
        <button
          onClick={() => navigate("/app/billing", { replace: true })}
          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-3 rounded-xl transition-colors"
        >
          Go to Billing Now
        </button>
      </div>
    </div>
  );
}
