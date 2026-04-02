import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Lock, Unlock, RefreshCw, Shield, User } from "lucide-react";
import { adminService } from "@/features/admin/services/admin.service";
import { toast } from "sonner";
import { cn } from "@/components/ui/utils";

export function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [blockedFilter, setBlockedFilter] = useState("");
  const [page, setPage] = useState(1);

  const load = async (params?: any) => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ page, limit: 10, ...params });
      setUsers(res?.data ?? []);
      setMeta(res?.meta ?? null);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({
      page,
      search: search || undefined,
      role: roleFilter || undefined,
      isBlocked: blockedFilter !== "" ? blockedFilter === "true" : undefined,
    });
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load({ page: 1, search: search || undefined, role: roleFilter || undefined, isBlocked: blockedFilter !== "" ? blockedFilter === "true" : undefined });
  };

  const handleToggleBlock = async (id: string, name: string, isBlocked: boolean) => {
    try {
      const updated = await adminService.toggleBlockStatus(id);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isBlocked: updated?.isBlocked ?? !isBlocked } : u));
      toast.success(`${name} ${isBlocked ? "unblocked" : "blocked"}`);
    } catch {
      toast.error("Failed to update block status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">User Management</h1>
        <p className="text-[#94A3B8] mt-1">Manage all registered users.</p>
      </div>

      {/* Filters */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <form onSubmit={handleSearch} className="relative group flex-1 w-full md:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5568] group-focus-within:text-[#7C3AED] transition-colors" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-[#7C3AED]/50 outline-none"
          />
        </form>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); load({ page: 1, search: search || undefined, role: e.target.value || undefined }); }}
          className="bg-[#0B1220] border border-[#1E293B] text-sm text-[#E2E8F0] rounded-xl px-3 py-2 outline-none focus:border-[#7C3AED]/50 w-full sm:w-auto"
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={blockedFilter}
          onChange={(e) => { setBlockedFilter(e.target.value); setPage(1); load({ page: 1, search: search || undefined, isBlocked: e.target.value !== "" ? e.target.value === "true" : undefined }); }}
          className="bg-[#0B1220] border border-[#1E293B] text-sm text-[#E2E8F0] rounded-xl px-3 py-2 outline-none focus:border-[#7C3AED]/50 w-full sm:w-auto"
        >
          <option value="">All Status</option>
          <option value="false">Active</option>
          <option value="true">Blocked</option>
        </select>
        <button onClick={() => load({ page, search: search || undefined })} className="p-2 text-[#4A5568] hover:text-white hover:bg-[#1E293B] rounded-xl transition-all">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0B1220]/50">
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">User</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Role</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Account</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Verified</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Joined</th>
                <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/30">
              {loading ? (
                <tr><td colSpan={6} className="py-16 text-center"><div className="flex justify-center"><div className="w-8 h-8 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" /></div></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-sm text-[#4A5568] font-bold">No users found</td></tr>
              ) : users.map((user, i) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="group hover:bg-[#7C3AED]/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1E293B] flex items-center justify-center font-bold text-[#E2E8F0] text-sm">
                        {user.name?.charAt(0) || <User className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-[10px] text-[#4A5568]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border",
                      user.role === "ADMIN"
                        ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                        : "bg-[#1E293B] text-[#94A3B8] border-[#2D3748]"
                    )}>
                      {user.role === "ADMIN" ? <Shield className="h-3 w-3 inline mr-1" /> : null}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs text-[#94A3B8] uppercase font-bold">{user.accountType || "EMAIL"}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn("text-xs font-bold", user.isEmailVerified ? "text-[#22C55E]" : "text-[#EF4444]")}>
                      {user.isEmailVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-[#4A5568]">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleToggleBlock(user.id, user.name, user.isBlocked)}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          user.isBlocked
                            ? "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20"
                            : "bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20"
                        )}
                        title={user.isBlocked ? "Unblock" : "Block"}
                      >
                        {user.isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-[#1E293B] flex items-center justify-between">
            <p className="text-xs text-[#4A5568]">Page {meta.page} of {meta.totalPages} — {meta.total} total</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs font-bold text-[#94A3B8] bg-[#0B1220] border border-[#1E293B] rounded-lg hover:border-[#7C3AED]/50 disabled:opacity-40 transition-all">Prev</button>
              <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="px-3 py-1.5 text-xs font-bold text-[#94A3B8] bg-[#0B1220] border border-[#1E293B] rounded-lg hover:border-[#7C3AED]/50 disabled:opacity-40 transition-all">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
