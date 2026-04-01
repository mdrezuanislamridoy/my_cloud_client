import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, CreditCard, Package, Layers,
  Menu, X, LogOut, Shield
} from "lucide-react";
import { cn } from "../components/ui/utils";
import { useAuthStore } from "../store/useAuthStore";

const adminNav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "Plans", href: "/admin/plans", icon: Package },
  { label: "Apps", href: "/admin/apps", icon: Layers },
];

export function AdminLayout() {
  const location = useLocation();
  const { user, accessToken, logout, fetchProfile } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(!user && !!accessToken);

  useEffect(() => {
    if (!user && accessToken) {
      fetchProfile().finally(() => setChecking(false));
    }
  }, []);

  if (!accessToken) return <Navigate to="/login" replace />;
  if (checking) return null;
  if (user?.role !== "ADMIN") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E2E8F0] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed top-0 left-0 h-full w-60 bg-[#0F172A] border-r border-[#1E293B] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <img src="/rr_vault_logo.jpg" alt="RR Vault" className="w-7 h-7 rounded-lg object-cover" />
            <div>
              <span className="font-bold text-white text-sm">RR Vault</span>
              <p className="text-[10px] text-[#EF4444] font-black uppercase tracking-widest">Admin</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#94A3B8] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminNav.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== "/admin" && location.pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20"
                    : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[#1E293B]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#EF4444]/20 flex items-center justify-center">
              <Shield className="h-4 w-4 text-[#EF4444]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-[#EF4444] font-bold uppercase tracking-widest">Admin</p>
            </div>
            <button onClick={() => logout()} title="Logout" className="text-[#4A5568] hover:text-[#EF4444] transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-60">
        <header className="sticky top-0 z-20 bg-[#0B1220]/90 backdrop-blur border-b border-[#1E293B] px-5 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#94A3B8] hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#EF4444]" />
            <span className="text-sm font-bold text-[#EF4444] uppercase tracking-widest">
              {adminNav.find(n => location.pathname === n.href || (n.href !== "/admin" && location.pathname.startsWith(n.href)))?.label || "Admin"}
            </span>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
