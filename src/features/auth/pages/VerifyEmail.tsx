import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Mail } from "lucide-react";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const { verificationToken } = useAuthStore();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (!verificationToken) {
      toast.error("Verification token missing. Please register again.");
      return;
    }
    setLoading(true);
    try {
      await authService.verifyEmail({ token: verificationToken, code: code.trim() });
      toast.success("Email verified! You can now log in.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = prompt("Enter your email to resend the code:");
    if (!email) return;
    setResending(true);
    try {
      await authService.resendVerification({ email });
      toast.success("Verification code resent!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] rounded-lg" />
          <span className="text-xl font-bold text-white">MyCloud</span>
        </Link>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="h-7 w-7 text-[#7C3AED]" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-[#94A3B8] text-sm mb-8">
            We sent a verification code to your email. Enter it below to activate your account.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
              required
              className="w-full bg-[#0B1220] border border-[#1E293B] text-white text-center text-lg tracking-widest rounded-xl px-4 py-3 outline-none focus:border-[#7C3AED]/60 transition-colors"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#94A3B8]">
            Didn't receive a code?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[#7C3AED] hover:underline font-medium disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend"}
            </button>
          </p>

          <Link to="/login" className="block mt-4 text-sm text-[#4A5568] hover:text-[#94A3B8] transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
