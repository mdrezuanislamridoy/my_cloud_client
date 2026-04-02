import { useEffect, useState } from "react";
import { Users, DollarSign, Server, HardDrive, CreditCard, Lock, Unlock } from "lucide-react";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { adminService } from "@/features/admin/services/admin.service";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from "recharts";
import { cn } from "@/components/ui/utils";
import { toast } from "sonner";

export function AdminOverviewPage() {
  const { stats, fetchStats, loading } = useAdminStore();
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    Promise.all([adminService.getAnalytics(), adminService.getRecentUsers()])
      .then(([a, u]) => { setAnalytics(a); setRecentUsers(u); })
      .catch(() => {})
      .finally(() => setAnalyticsLoading(false));
  }, []);

  const handleToggleBlock = async (id: string, name: string, isBlocked: boolean) => {
    try {
      await adminService.toggleBlockStatus(id);
      setRecentUsers(prev => prev.map(u => u.id === id ? { ...u, isBlocked: !isBlocked } : u));
      toast.success(`${name} ${isBlocked ? "unblocked" : "blocked"}`);
    } catch {
      toast.error("Failed to update");
    }
  };

  const storageGB = ((stats.totalStorageUsed || 0) / (1024 * 1024 * 1024)).toFixed(2);

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: <Users className="h-5 w-5 text-[#7C3AED]" />, color: "text-[#7C3AED]" },
    { label: "Total Revenue", value: `$${stats.totalRevenue}`, icon: <DollarSign className="h-5 w-5 text-[#22C55E]" />, color: "text-[#22C55E]" },
    { label: "Total Files", value: stats.totalFiles, icon: <Server className="h-5 w-5 text-[#22D3EE]" />, color: "text-[#22D3EE]" },
    { label: "Storage Used", value: `${storageGB} GB`, icon: <HardDrive className="h-5 w-5 text-[#F59E0B]" />, color: "text-[#F59E0B]" },
    { label: "Active Subscriptions", value: stats.activeSubscriptions, icon: <CreditCard className="h-5 w-5 text-[#EF4444]" />, color: "text-[#EF4444]" },
  ];

  const tooltipStyle = { backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '10px' };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Platform Overview</h1>
        <p className="text-[#94A3B8] mt-1">Real-time platform statistics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-[#4A5568] uppercase tracking-widest">{card.label}</span>
              {card.icon}
            </div>
            <p className={`text-2xl font-black ${card.color}`}>
              {loading ? <span className="text-[#1E293B] animate-pulse">——</span> : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-[#7C3AED]/10 rounded-xl">
              <Users className="h-4 w-4 text-[#7C3AED]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">User Growth</h3>
              <p className="text-[10px] text-[#4A5568] uppercase tracking-widest">Last 6 months</p>
            </div>
          </div>
          {analyticsLoading ? (
            <div className="h-[220px] bg-[#1E293B]/20 animate-pulse rounded-xl" />
          ) : (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="month" stroke="#4A5568" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4A5568" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#E2E8F0', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="users" name="New Users" stroke="#7C3AED" strokeWidth={2} fill="url(#userGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Subscription Growth */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-[#22C55E]/10 rounded-xl">
              <CreditCard className="h-4 w-4 text-[#22C55E]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">New Subscriptions</h3>
              <p className="text-[10px] text-[#4A5568] uppercase tracking-widest">Last 6 months</p>
            </div>
          </div>
          {analyticsLoading ? (
            <div className="h-[220px] bg-[#1E293B]/20 animate-pulse rounded-xl" />
          ) : (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="month" stroke="#4A5568" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4A5568" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#1E293B', opacity: 0.4 }} contentStyle={tooltipStyle} itemStyle={{ color: '#E2E8F0', fontSize: '11px' }} />
                  <Bar dataKey="subscriptions" name="New Subscriptions" fill="#22C55E" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[#1E293B]">
          <h3 className="text-base font-black text-white">Recent Users</h3>
          <p className="text-[10px] text-[#4A5568] uppercase tracking-widest mt-0.5">Last 5 registered accounts</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0B1220]/50">
                {["User", "Role", "Account", "Verified", "Joined", "Action"].map(h => (
                  <th key={h} className="py-3 px-5 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/30">
              {analyticsLoading ? (
                <tr><td colSpan={6} className="py-10 text-center"><div className="flex justify-center"><div className="w-6 h-6 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" /></div></td></tr>
              ) : recentUsers.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-sm text-[#4A5568]">No users yet</td></tr>
              ) : recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#7C3AED]/5 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#1E293B] flex items-center justify-center text-sm font-bold text-[#E2E8F0]">
                        {user.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-[10px] text-[#4A5568]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase border",
                      user.role === "ADMIN" ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20" : "bg-[#1E293B] text-[#94A3B8] border-[#2D3748]"
                    )}>{user.role}</span>
                  </td>
                  <td className="py-3 px-5 text-xs text-[#94A3B8] uppercase font-bold">{user.accountType || "EMAIL"}</td>
                  <td className="py-3 px-5">
                    <span className={cn("text-xs font-bold", user.isEmailVerified ? "text-[#22C55E]" : "text-[#EF4444]")}>
                      {user.isEmailVerified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-xs text-[#4A5568]">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => handleToggleBlock(user.id, user.name, user.isBlocked)}
                      className={cn(
                        "p-1.5 rounded-lg transition-all",
                        user.isBlocked ? "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20" : "bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20"
                      )}
                      title={user.isBlocked ? "Unblock" : "Block"}
                    >
                      {user.isBlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
