import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { GlassCard } from "../components/glass-card";
import { StatCard } from "../components/stat-card";
import {
  Users,
  DollarSign,
  Server,
  Activity,
  ShieldAlert,
  MoreVertical,
  Search,
  Lock,
  Unlock,
  Package
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useAdminStore } from "../store/useAdminStore";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";

export function AdminPage() {
  const {
    users,
    stats,
    loading,
    fetchAllUsers,
    fetchAdminStats,
    toggleUserBlock,
    updateUserSubscription
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");

  useEffect(() => {
    fetchAllUsers();
    fetchAdminStats();
  }, []);

  const handleToggleBlock = async (userId: string, isBlocked: boolean) => {
    await toggleUserBlock(userId, !isBlocked);
    toast.success(isBlocked ? "User unblocked successfully" : "User blocked successfully");
  };

  const handleUpdatePlan = async (userId: string, planName: string) => {
    await updateUserSubscription(userId, { plan: { name: planName } });
    toast.success(`Plan updated to ${planName}`);
  };

  const getPlanBadgeColor = (plan?: string) => {
    switch (plan?.toUpperCase()) {
      case "FREE": return "bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/20";
      case "PRO": return "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20";
      case "ENTERPRISE": return "bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/20";
      default: return "bg-[#1E293B] text-[#4A5568] border-[#2D3748]";
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     user.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterRole === "ALL" || user.role === filterRole)
  );

  const revenueData = [
    { month: "Jan", rev: 12000 },
    { month: "Feb", rev: 18000 },
    { month: "Mar", rev: 15000 },
    { month: "Apr", rev: 24000 },
    { month: "May", rev: 21000 },
    { month: "Jun", rev: 32000 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#7C3AED] mb-2 font-bold text-xs uppercase tracking-widest">
            <Lock className="h-4 w-4" />
            Internal Governance
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Platform Control</h1>
          <p className="text-[#94A3B8] font-medium mt-1">High-level overview of system integrity, revenue, and user compliance.</p>
        </div>
        
        <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                 <span className="text-[#EF4444] text-[10px] font-black uppercase tracking-widest">Master Admin Auth</span>
             </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Global Population"
          value={stats.totalUsers || 0}
          change="+142 this week"
          trend="up"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          label="Projected Revenue"
          value={`$${stats.totalRevenue || 0}`}
          change="+18.4% MRR Growth"
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          label="Network Objects"
          value={stats.totalFiles || 0}
          change="S3 Compatible"
          trend="neutral"
          icon={<Server className="h-6 w-6" />}
        />
        <StatCard
          label="Active Session Rate"
          value="94.2%"
          change="Healthy Latency"
          trend="up"
          icon={<Activity className="h-6 w-6" />}
        />
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="border-[#1E293B]/60">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white tracking-tight">Financial Trajectory</h3>
            <div className="p-2 bg-[#22C55E]/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-[#22C55E]" />
            </div>
          </div>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                    <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="month" stroke="#4A5568" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4A5568" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v/1000}k`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="rev" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="border-[#1E293B]/60">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white tracking-tight">Population Growth</h3>
             <div className="p-2 bg-[#7C3AED]/10 rounded-lg">
                <Users className="h-4 w-4 text-[#7C3AED]" />
            </div>
          </div>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="month" stroke="#4A5568" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4A5568" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                        cursor={{fill: '#1E293B', opacity: 0.4}}
                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                    />
                    <Bar dataKey="rev" fill="#7C3AED" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Identity Management Table */}
      <GlassCard className="border-[#1E293B]/60 p-0 overflow-hidden">
        <div className="p-6 border-b border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h3 className="text-xl font-black text-white">Identity Registry</h3>
                <p className="text-[10px] font-bold text-[#4A5568] uppercase tracking-widest mt-1">Full access to verified and guest accounts</p>
            </div>
            
            <div className="flex items-center gap-3">
                 <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5568] group-focus-within:text-[#7C3AED] transition-colors" />
                    <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#0F172A] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:border-[#7C3AED]/50 outline-none w-64 transition-all"
                    />
                </div>
                <select 
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="bg-[#0F172A] border border-[#1E293B] text-[10px] font-black uppercase tracking-widest text-[#E2E8F0] rounded-xl px-4 py-2 outline-none focus:border-[#7C3AED]/50"
                >
                    <option value="ALL">All Roles</option>
                    <option value="USER">Standard Users</option>
                    <option value="ADMIN">Administrators</option>
                </select>
            </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0F172A]/50 border-b border-[#1E293B]">
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">User Entity</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Cloud Assets</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Subscription Tier</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Registry Date</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest text-right">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/30">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-[#7C3AED]/5 transition-colors"
                >
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#2D3748] flex items-center justify-center font-bold text-[#E2E8F0]">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-[#7C3AED] transition-colors">{user.name}</span>
                        <span className="text-[10px] font-medium text-[#4A5568] lowercase truncate max-w-[150px]">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-[#4A5568]" />
                        <span className="text-xs font-bold text-[#E2E8F0]">{user._count?.files || 0} Objects</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        getPlanBadgeColor(user.subscription?.plan?.name)
                    )}>
                      {user.subscription?.plan?.name || "No Plan"}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-[11px] font-bold text-[#4A5568]">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                        className={cn(
                            "p-2 rounded-lg transition-all active:scale-95",
                            user.isBlocked 
                            ? "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20" 
                            : "bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20"
                        )}
                        title={user.isBlocked ? "Unblock Entity" : "Sanction Entity"}
                      >
                        {user.isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {loading && (
              <div className="py-20 flex justify-center items-center">
                  <div className="w-8 h-8 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" />
              </div>
          )}
          
          {!loading && filteredUsers.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                  <ShieldAlert className="h-10 w-10 text-[#4A5568] mb-4" />
                  <p className="text-sm font-bold text-[#4A5568] uppercase tracking-widest">No matching security entities found</p>
              </div>
          )}
        </div>
      </GlassCard>

      {/* Server & Uptime Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="border-[#1E293B]/60 p-6 bg-[#0B1220]/40">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Edge Response Avg.</span>
              <span className="text-[#22C55E] text-[10px] font-black uppercase">Optimal</span>
           </div>
           <p className="text-3xl font-black text-white tracking-widest">38ms</p>
        </GlassCard>
        
        <GlassCard className="border-[#1E293B]/60 p-6 bg-[#0B1220]/40">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Operational Uptime</span>
              <span className="text-[#22C55E] text-[10px] font-black uppercase">100% Verified</span>
           </div>
           <p className="text-3xl font-black text-white tracking-widest">99.998%</p>
        </GlassCard>
        
        <GlassCard className="border-[#1E293B]/60 p-6 bg-[#0B1220]/40">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Pending Support</span>
              <span className="text-[#F59E0B] text-[10px] font-black uppercase">0 Tickets</span>
           </div>
           <p className="text-3xl font-black text-white tracking-widest">0</p>
        </GlassCard>
      </div>
    </div>
  );
}
