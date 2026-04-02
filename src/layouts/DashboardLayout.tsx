import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Folder, BarChart3, CreditCard,
  Settings, Menu, X, LogOut, User, Package
} from "lucide-react";
import { cn } from "../components/ui/utils";
import { useAuthStore } from "../store/useAuthStore";

const navItems = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Apps", href: "/app/apps", icon: Package },
  { label: "Files", href: "/app/files", icon: Folder },
  { label: "Usage", href: "/app/usage", icon: BarChart3 },
  { label: "Billing", href: "/app/billing", icon: CreditCard },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

export function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E2E8F0] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed top-0 left-0 h-full w-60 bg-[#0F172A] border-r border-[#1E293B] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B]">
          <Link to="/" className="flex items-center gap-2">
            <img src="/rr_vault_logo.jpg" alt="RR Vault" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-bold text-white">RR Vault</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#94A3B8] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== "/app" && location.pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20"
                    : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          {/* No admin link - admin panel is not accessible from user dashboard */}
        </nav>

        <div className="p-3 border-t border-[#1E293B]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center">
              <User className="h-4 w-4 text-[#7C3AED]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-[#4A5568] truncate">{user?.email}</p>
            </div>
            <button onClick={() => logout()} title="Logout" className="text-[#4A5568] hover:text-[#EF4444] transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        <header className="sticky top-0 z-20 bg-[#0B1220]/90 backdrop-blur border-b border-[#1E293B] px-5 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#94A3B8] hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-[#94A3B8] capitalize">
            {location.pathname.split("/").pop() || "dashboard"}
          </span>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
