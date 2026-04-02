import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export function SubscriptionCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4">
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-[#EF4444]" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Payment Cancelled</h1>
        <p className="text-[#94A3B8] mb-8">
          Your payment was cancelled. No charges were made. You can try again anytime.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/app/billing")}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/app")}
            className="w-full border border-[#1E293B] hover:border-[#7C3AED]/50 text-[#94A3B8] hover:text-white font-bold py-3 rounded-xl transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
