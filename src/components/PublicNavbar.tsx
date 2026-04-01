import { Link } from "react-router-dom";
import { GlowButton } from "./glow-button";
import { useAuthStore } from "../store/useAuthStore";

export function PublicNavbar() {
  const { accessToken } = useAuthStore();

  return (
    <nav className="border-b border-[#1E293B] backdrop-blur-xl bg-[#0B1220]/60 fixed w-full z-50 transition-all duration-300">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.4)] group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold tracking-tight text-white">MyCloud</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {[
            { label: "Features", href: "/#features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Docs", href: "#" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {accessToken ? (
            <>
              <Link to="/app">
                <GlowButton variant="ghost">Dashboard</GlowButton>
              </Link>
              <Link to="/app/settings">
                <GlowButton variant="primary">Profile</GlowButton>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <GlowButton variant="ghost">Login</GlowButton>
              </Link>
              <Link to="/register">
                <GlowButton variant="primary">Start Free</GlowButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
