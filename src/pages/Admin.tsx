import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../components/glass-card";
import { StatCard } from "../components/stat-card";
import {
  Users, DollarSign, Server, HardDrive, CreditCard,
  Search, Lock, CheckCircle, XCircle, Clock, RefreshCw
} from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";

const statusColor: Record<string, string> = {
  PAID: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
  PENDING: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
  CANCELLED: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  FAILED: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
};

import type { ReactElement } from "react";

const statusIcon: Record<string, ReactElement> = {
  PAID: <CheckCircle className="h-3.5 w-3.5" />,
  PENDING: <Clock className="h-3.5 w-3.5" />,
  CANCELLED: <XCircle className="h-3.5 w-3.5" />,
  FAILED: <XCircle className="h-3.5 w-3.5" />,
};

export function AdminPage() {
  const { stats, subscriptions, subMeta, loading, fetchStats, fetchSubscriptions, updateSubscription } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSubscriptions({ page, limit: 10, search: search || undefined, status: statusFilter || undefined });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSubscriptions({ page: 1, limit: 10, search: search || undefined, status: statusFilter || undefined });
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateSubscription(id, { status });
      toast.success(`Subscription status updated to ${status}`);
    } catch {
      toast.error("Failed to update subscription");
    }
  };

  const storageGB = ((stats.totalStorageUsed || 0) / (1024 * 1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#7C3AED] mb-2 font-bold text-xs uppercase tracking-widest">
            <Lock className="h-4 w-4" /> Admin
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Platform Control</h1>
          <p className="text-[#94A3B8] font-medium mt-1">System overview and subscription management.</p>
        </div>
        <div className="px-4 py-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          <span className="text-[#EF4444] text-[10px] font-black uppercase tracking-widest">Admin Access</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          change="Registered accounts"
          trend="up"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue}`}
          change="From paid subscriptions"
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          label="Total Files"
          value={stats.totalFiles}
          change="Across all users"
          trend="neutral"
          icon={<Server className="h-6 w-6" />}
        />
        <StatCard
          label="Storage Used"
          value={`${storageGB} GB`}
          change={`${stats.activeSubscriptions} active subs`}
          trend="neutral"
          icon={<HardDrive className="h-6 w-6" />}
        />
      </div>

      {/* Subscriptions Management */}
      <GlassCard className="border-[#1E293B]/60 p-0 overflow-hidden">
        <div className="p-6 border-b border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#7C3AED]/10 rounded-xl">
              <CreditCard className="h-5 w-5 text-[#7C3AED]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Subscriptions</h3>
              <p className="text-[10px] font-bold text-[#4A5568] uppercase tracking-widest">
                {subMeta?.total ?? 0} total records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5568] group-focus-within:text-[#7C3AED] transition-colors" />
              <input
                type="text"
                placeholder="Search by user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#0F172A] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:border-[#7C3AED]/50 outline-none w-52 transition-all"
              />
            </form>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-[#0F172A] border border-[#1E293B] text-xs font-bold text-[#E2E8F0] rounded-xl px-3 py-2 outline-none focus:border-[#7C3AED]/50"
            >
              <option value="">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="FAILED">Failed</option>
            </select>
            <button
              onClick={() => fetchSubscriptions({ page, limit: 10, search: search || undefined, status: statusFilter || undefined })}
              className="p-2 text-[#4A5568] hover:text-white hover:bg-[#1E293B] rounded-xl transition-all"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0F172A]/50 border-b border-[#1E293B]">
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">User</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Plan</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Price</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Cycle</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Storage</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Date</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/30">
              {loading && subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-sm text-[#4A5568] font-bold">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub, index) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-[#7C3AED]/5 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-bold text-white">{sub.user?.name || "—"}</p>
                        <p className="text-[10px] text-[#4A5568]">{sub.user?.email || "—"}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-[#E2E8F0]">{sub.plan?.name || "—"}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-[#22C55E]">
                        ${sub.pricing?.price ?? "—"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-black text-[#94A3B8] uppercase">
                        {sub.pricing?.billingCycle || sub.billingCycle || "—"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                        statusColor[sub.status] || "bg-[#1E293B] text-[#4A5568] border-[#2D3748]"
                      )}>
                        {statusIcon[sub.status]}
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs text-[#94A3B8]">
                        <p>{((sub.storageUsed || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB used</p>
                        <p className="text-[#4A5568]">of {((sub.storageLimit || 0) / (1024 * 1024 * 1024)).toFixed(0)} GB</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-[#4A5568]">
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        {sub.status !== "PAID" && (
                          <button
                            onClick={() => handleStatusUpdate(sub.id, "PAID")}
                            className="px-2.5 py-1 text-[10px] font-black text-[#22C55E] bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/20 rounded-lg transition-all uppercase"
                          >
                            Activate
                          </button>
                        )}
                        {sub.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleStatusUpdate(sub.id, "CANCELLED")}
                            className="px-2.5 py-1 text-[10px] font-black text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/20 rounded-lg transition-all uppercase"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {subMeta && subMeta.totalPages > 1 && (
          <div className="p-4 border-t border-[#1E293B] flex items-center justify-between">
            <p className="text-xs text-[#4A5568]">
              Page {subMeta.page} of {subMeta.totalPages} — {subMeta.total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-bold text-[#94A3B8] bg-[#0F172A] border border-[#1E293B] rounded-lg hover:border-[#7C3AED]/50 disabled:opacity-40 transition-all"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(subMeta.totalPages, p + 1))}
                disabled={page === subMeta.totalPages}
                className="px-3 py-1.5 text-xs font-bold text-[#94A3B8] bg-[#0F172A] border border-[#1E293B] rounded-lg hover:border-[#7C3AED]/50 disabled:opacity-40 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
