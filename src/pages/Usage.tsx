import { useEffect } from "react";
import { GlassCard } from "../components/glass-card";
import { StatCard } from "../components/stat-card";
import {
  HardDrive,
  Files,
  Folder,
  TrendingUp,
  Activity,
  BarChart3,
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
  Area,
} from "recharts";
import { useUserDashboardStore } from "../store/useUserDashboardStore";

export function UsagePage() {
  const { overview, analytics, fetchOverview, fetchAnalytics } =
    useUserDashboardStore();

  useEffect(() => {
    fetchOverview();
    fetchAnalytics();
  }, []);

  const storageBytes = overview?.totalStorageUsed ?? 0;
  const storageGB = (storageBytes / (1024 * 1024 * 1024)).toFixed(2);

  // server returns: { monthlyData: [{months, count}], monthlyStorageUses: [{months, used}] }
  const uploadData =
    analytics?.monthlyData?.map((d: any) => ({
      month: d.months,
      uploads: d.count,
    })) ?? [];

  const storageData =
    analytics?.monthlyStorageUses?.map((d: any) => ({
      month: d.months,
      usedMB: parseFloat((d.used / (1024 * 1024)).toFixed(2)),
    })) ?? [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <div className="flex items-center gap-2 text-[#7C3AED] mb-2 font-bold text-xs uppercase tracking-widest">
          <Activity className="h-4 w-4" /> Analytics
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Usage Statistics
        </h1>
        <p className="text-[#94A3B8] font-medium mt-1">
          Your cloud storage and upload activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Storage Used"
          value={`${storageGB} GB`}
          change="Total uploaded"
          trend="up"
          icon={<HardDrive className="h-6 w-6" />}
        />
        <StatCard
          label="Total Files"
          value={overview?.totalFiles ?? 0}
          change="All time"
          trend="neutral"
          icon={<Files className="h-6 w-6" />}
        />
        <StatCard
          label="Folders"
          value={overview?.totalFolders ?? 0}
          change="Created"
          trend="neutral"
          icon={<Folder className="h-6 w-6" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Uploads */}
        <GlassCard className="border-[#1E293B]/60">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-[#7C3AED]/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-[#7C3AED]" />
            </div>
            <h3 className="text-lg font-black text-white">Monthly Uploads</h3>
          </div>
          {uploadData.length === 0 ? (
            <p className="text-sm text-[#4A5568] py-16 text-center">
              No upload data yet.
            </p>
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={uploadData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E293B"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#4A5568"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                  />
                  <YAxis
                    stroke="#4A5568"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#1E293B", opacity: 0.4 }}
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "1px solid #1E293B",
                      borderRadius: "10px",
                    }}
                    itemStyle={{ color: "#E2E8F0", fontSize: "11px" }}
                  />
                  <Bar
                    dataKey="uploads"
                    fill="#7C3AED"
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        {/* Monthly Storage Usage */}
        <GlassCard className="border-[#1E293B]/60">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-[#22D3EE]/10 rounded-lg">
              <BarChart3 className="h-4 w-4 text-[#22D3EE]" />
            </div>
            <h3 className="text-lg font-black text-white">
              Storage Growth (MB)
            </h3>
          </div>
          {storageData.length === 0 ? (
            <p className="text-sm text-[#4A5568] py-16 text-center">
              No storage data yet.
            </p>
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={storageData}>
                  <defs>
                    <linearGradient
                      id="storageGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E293B"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#4A5568"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                  />
                  <YAxis
                    stroke="#4A5568"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}MB`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "1px solid #1E293B",
                      borderRadius: "10px",
                    }}
                    itemStyle={{ color: "#E2E8F0", fontSize: "11px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="usedMB"
                    stroke="#22D3EE"
                    strokeWidth={2}
                    fill="url(#storageGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
