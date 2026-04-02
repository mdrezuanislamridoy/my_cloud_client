import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Layers, RefreshCw } from "lucide-react";
import { adminService } from "../../services/admin.service";
import { toast } from "sonner";

export function AdminAppsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res: any = await adminService.getAllApps();
      let appsList = res;
      if (!Array.isArray(res)) {
        if (Array.isArray(res?.data)) appsList = res.data;
        else if (Array.isArray(res?.apps)) appsList = res.apps;
      }
      setApps(Array.isArray(appsList) ? appsList : []);
    } catch { toast.error("Failed to load apps"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = apps.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.appId?.toLowerCase().includes(search.toLowerCase()) ||
    a.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">All Applications</h1>
        <p className="text-sm sm:text-base text-[#94A3B8] mt-1">View all apps created by users across the platform.</p>
      </div>

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative group w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5568] group-focus-within:text-[#7C3AED] transition-colors" />
          <input type="text" placeholder="Search by app name, ID, or user..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-[#7C3AED]/50 outline-none" />
        </div>
        <div className="flex items-center gap-4 justify-between sm:justify-end">
          <span className="text-xs text-[#4A5568] font-bold whitespace-nowrap">{filtered.length} apps</span>
          <button onClick={load} className="p-2 text-[#4A5568] hover:text-white hover:bg-[#1E293B] rounded-xl transition-all">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0B1220]/50">
                {["App Name", "App ID", "Owner", "Created"].map(h => (
                  <th key={h} className="py-3 px-4 sm:py-4 sm:px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/30">
              {loading ? (
                <tr><td colSpan={4} className="py-16 text-center"><div className="flex justify-center"><div className="w-8 h-8 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" /></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="py-16 text-center text-sm text-[#4A5568] font-bold">No apps found</td></tr>
              ) : filtered.map((app, i) => (
                <motion.tr key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="group hover:bg-[#7C3AED]/5 transition-colors">
                  <td className="py-3 px-4 sm:py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#7C3AED]/10 rounded-xl shrink-0">
                        <Layers className="h-4 w-4 text-[#7C3AED]" />
                      </div>
                      <span className="text-sm font-bold text-white min-w-[120px]">{app.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">
                    <code className="text-xs text-[#7C3AED] font-mono bg-[#7C3AED]/5 px-2 py-1 rounded inline-block min-w-[100px]">{app.appId}</code>
                  </td>
                  <td className="py-3 px-4 sm:py-4 sm:px-6">
                    <div className="min-w-[140px]">
                      <p className="text-sm font-bold text-white truncate max-w-[150px]">{app.user?.name || "—"}</p>
                      <p className="text-[10px] text-[#4A5568] truncate max-w-[150px]">{app.user?.email || "—"}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:py-4 sm:px-6 text-xs text-[#4A5568] min-w-[100px]">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
