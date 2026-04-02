import { useEffect, useState, type JSX } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { toast } from "sonner";
import { cn } from "../../components/ui/utils";

const statusColor: Record<string, string> = {
  PAID: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
  PENDING: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
  CANCELLED: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  FAILED: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
};

const statusIcon: Record<string, JSX.Element> = {
  PAID: <CheckCircle className="h-3 w-3" />,
  PENDING: <Clock className="h-3 w-3" />,
  CANCELLED: <XCircle className="h-3 w-3" />,
  FAILED: <XCircle className="h-3 w-3" />,
};

export function AdminSubscriptionsPage() {
  const {
    subscriptions,
    subMeta,
    loading,
    fetchSubscriptions,
    updateSubscription,
  } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const load = (p = page) =>
    fetchSubscriptions({
      page: p,
      limit: 10,
      search: search || undefined,
      status: statusFilter || undefined,
    });

  useEffect(() => {
    load();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateSubscription(id, { status });
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update");
    }
  };

  // const handleToggleActive = async (id: string, isActive: boolean) => {
  //   try {
  //     await updateSubscription(id, { isActive: !isActive });
  //     toast.success(`Subscription ${isActive ? "deactivated" : "activated"}`);
  //   } catch {
  //     toast.error("Failed to update");
  //   }
  // };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Subscriptions</h1>
        <p className="text-[#94A3B8] mt-1">Manage all user subscriptions.</p>
      </div>

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <form
          onSubmit={handleSearch}
          className="relative group flex-1 w-full md:min-w-[200px]"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5568] group-focus-within:text-[#7C3AED] transition-colors" />
          <input
            type="text"
            placeholder="Search by user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-[#7C3AED]/50 outline-none"
          />
        </form>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-[#0B1220] border border-[#1E293B] text-sm text-[#E2E8F0] rounded-xl px-3 py-2 outline-none focus:border-[#7C3AED]/50 w-full md:w-auto"
        >
          <option value="">All Status</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="FAILED">Failed</option>
        </select>
        <button
          onClick={() => load()}
          className="p-2 text-[#4A5568] hover:text-white hover:bg-[#1E293B] rounded-xl transition-all"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0B1220]/50">
                {[
                  "User",
                  "Plan",
                  "Price",
                  "Cycle",
                  "Status",
                  "Active",
                  "Storage",
                  "Files",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="py-4 px-4 text-[10px] font-black text-[#4A5568] uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/30">
              {loading && subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-16 text-center text-sm text-[#4A5568] font-bold"
                  >
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub, i) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="group hover:bg-[#7C3AED]/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-white whitespace-nowrap">
                        {sub.user?.name || "—"}
                      </p>
                      <p className="text-[10px] text-[#4A5568]">
                        {sub.user?.email || "—"}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-[#E2E8F0] whitespace-nowrap">
                      {sub.plan?.name || "—"}
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-[#22C55E]">
                      ${sub.pricing?.price ?? "—"}
                    </td>
                    <td className="py-4 px-4 text-[10px] font-black text-[#94A3B8] uppercase">
                      {sub.pricing?.billingCycle || sub.billingCycle || "—"}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase border",
                          statusColor[sub.status] ||
                            "bg-[#1E293B] text-[#4A5568] border-[#2D3748]",
                        )}
                      >
                        {statusIcon[sub.status]}
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "text-xs font-bold",
                          sub.isActive ? "text-[#22C55E]" : "text-[#EF4444]",
                        )}
                      >
                        {sub.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-[#94A3B8] whitespace-nowrap">
                      {((sub.storageUsed || 0) / (1024 * 1024 * 1024)).toFixed(
                        2,
                      )}{" "}
                      /{" "}
                      {((sub.storageLimit || 0) / (1024 * 1024 * 1024)).toFixed(
                        0,
                      )}{" "}
                      GB
                    </td>
                    <td className="py-4 px-4 text-xs text-[#94A3B8]">
                      {sub.fileUploaded || 0} / {sub.fileLimit || 0}
                    </td>
                    <td className="py-4 px-4 text-xs text-[#4A5568] whitespace-nowrap">
                      {sub.createdAt
                        ? new Date(sub.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        {sub.status !== "PAID" && (
                          <button
                            onClick={() => handleStatusUpdate(sub.id, "PAID")}
                            className="px-2 py-1 text-[10px] font-black text-[#22C55E] bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/20 rounded-lg transition-all uppercase whitespace-nowrap"
                          >
                            Activate
                          </button>
                        )}
                        {sub.status !== "CANCELLED" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(sub.id, "CANCELLED")
                            }
                            className="px-2 py-1 text-[10px] font-black text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/20 rounded-lg transition-all uppercase whitespace-nowrap"
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

        {subMeta && subMeta.totalPages > 1 && (
          <div className="p-4 border-t border-[#1E293B] flex items-center justify-between">
            <p className="text-xs text-[#4A5568]">
              Page {subMeta.page} of {subMeta.totalPages} — {subMeta.total}{" "}
              total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-bold text-[#94A3B8] bg-[#0B1220] border border-[#1E293B] rounded-lg hover:border-[#7C3AED]/50 disabled:opacity-40 transition-all"
              >
                Prev
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(subMeta.totalPages, p + 1))
                }
                disabled={page === subMeta.totalPages}
                className="px-3 py-1.5 text-xs font-bold text-[#94A3B8] bg-[#0B1220] border border-[#1E293B] rounded-lg hover:border-[#7C3AED]/50 disabled:opacity-40 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
