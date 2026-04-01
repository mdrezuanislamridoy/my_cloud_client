import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useUserDashboardStore } from "../store/useUserDashboardStore";
import { useCloudStore } from "../store/useCloudStore";
import { useSecretsStore } from "../store/useSecretsStore";
import { HardDrive, Folder, Files, Package, FileText, Image as ImageIcon, Video, Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";

// server field helpers
const getName = (f: any) => f.name || f.fileName || "";
const getSize = (f: any) => f.fileSize || f.size || 0;
const getMime = (f: any) => f.fileType || f.mimeType || "";
const getDate = (f: any) => f.uploaded_at || f.createdAt || "";

export function DashboardPage() {
  const { user } = useAuthStore();
  const { overview, apps, folders, fetchOverview, fetchApps, fetchFolders } = useUserDashboardStore();
  const { files, fetchFiles } = useCloudStore();
  const { secretKey, apiKey, fetchSecretKey, fetchApiKey } = useSecretsStore();

  useEffect(() => {
    fetchOverview();
    fetchApps();
    fetchFolders();
    fetchFiles();
    fetchApiKey();
  }, []);

  const getFileIcon = (mime?: string) => {
    if (!mime) return <FileText className="h-4 w-4" />;
    if (mime.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (mime.startsWith("video/")) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const displayApiKey = apiKey?.apiKey || secretKey?.apiKey || "";
  const storageBytes = overview?.totalStorageUsed ?? 0;
  const storageUsedGB = (storageBytes / (1024 * 1024 * 1024)).toFixed(2);
  const [showKey, setShowKey] = useState(false);
  const masked = displayApiKey ? `${displayApiKey.slice(0, 8)}••••••••••••••••••••${displayApiKey.slice(-4)}` : "—";

  const copyKey = () => {
    if (!displayApiKey) return;
    navigator.clipboard.writeText(displayApiKey);
    toast.success("API Key copied!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome, {user?.name?.split(" ")[0] || "User"} 👋
        </h1>
        <p className="text-[#94A3B8] text-sm mt-1">Here's an overview of your cloud account.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Storage Used", value: `${storageUsedGB} GB`, icon: <HardDrive className="h-5 w-5 text-[#7C3AED]" /> },
          { label: "Total Files", value: overview?.totalFiles ?? 0, icon: <Files className="h-5 w-5 text-[#22D3EE]" /> },
          { label: "Folders", value: overview?.totalFolders ?? folders.length, icon: <Folder className="h-5 w-5 text-[#F59E0B]" /> },
          { label: "Apps", value: apps.length, icon: <Package className="h-5 w-5 text-[#22C55E]" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#94A3B8]">{stat.label}</span>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#94A3B8]">Your API Key</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKey((v) => !v)}
              className="flex items-center gap-1 text-[10px] font-bold text-[#4A5568] hover:text-white transition-colors uppercase tracking-widest"
            >
              {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showKey ? "Hide" : "Show"}
            </button>
            <button
              onClick={copyKey}
              className="flex items-center gap-1 text-[10px] font-bold text-[#7C3AED] hover:text-[#22D3EE] transition-colors uppercase tracking-widest"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
          </div>
        </div>
        <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl px-4 py-3">
          <code className="text-sm text-[#E2E8F0] font-mono break-all">
            {showKey ? (displayApiKey || "—") : masked}
          </code>
        </div>
      </div>

      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5">
        <h2 className="text-base font-semibold text-white mb-4">Recent Uploads</h2>
        {files.length === 0 ? (
          <p className="text-sm text-[#4A5568]">No files uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {files.slice(0, 5).map((file) => (
              <div key={file.id} className="flex items-center gap-3 py-2 border-b border-[#1E293B] last:border-0">
                <div className="text-[#7C3AED]">{getFileIcon(getMime(file))}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{getName(file)}</p>
                  <p className="text-xs text-[#4A5568]">{(getSize(file) / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <span className="text-xs text-[#4A5568]">
                  {getDate(file) ? new Date(getDate(file)).toLocaleDateString() : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
