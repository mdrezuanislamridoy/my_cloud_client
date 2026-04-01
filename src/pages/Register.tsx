import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      toast.success("Account created! Please verify your email.");
      navigate("/auth/verify-email");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img src="/rr_vault_logo.jpg" alt="RR Vault" className="w-8 h-8 rounded-lg object-cover" />
          <span className="text-xl font-bold text-white">RR Vault</span>
        </Link>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-[#94A3B8] text-sm mb-8">Start using RR Vault for free</p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full bg-[#0B1220] border border-[#1E293B] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7C3AED]/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#0B1220] border border-[#1E293B] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7C3AED]/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                className="w-full bg-[#0B1220] border border-[#1E293B] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7C3AED]/60 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#94A3B8]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#7C3AED] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
