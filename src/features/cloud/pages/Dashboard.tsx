/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useUserDashboardStore } from "@/features/cloud/store/useUserDashboardStore";
import { useCloudStore } from "@/features/cloud/store/useCloudStore";
import { useSecretsStore } from "@/features/cloud/store/useSecretsStore";
import { HardDrive, Folder, Files, Package, FileText, Image as ImageIcon, Video, Eye, EyeOff, Copy, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";

const getName = (f: any) => f.name || f.fileName || "";
const getSize = (f: any) => f.fileSize || f.size || 0;
const getMime = (f: any) => f.fileType || f.mimeType || "";
const getDate = (f: any) => f.uploaded_at || f.createdAt || "";

function KeyCard({
  label,
  value,
  onCopy,
  onAction,
  actionLabel,
  actionIcon,
  actionLoading,
  color = "#7C3AED",
}: {
  label: string;
  value: string;
  onCopy: () => void;
  onAction?: () => void;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionLoading?: boolean;
  color?: string;
}) {
  const [show, setShow] = useState(false);
  const masked = value ? `${value.slice(0, 8)}••••••••••••••••••••${value.slice(-4)}` : "—";

  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#94A3B8]">{label}</h2>
        <div className="flex items-center gap-2">
          {onAction && (
            <button
              onClick={onAction}
              disabled={actionLoading}
              className="flex items-center gap-1 text-[10px] font-bold text-[#4A5568] hover:text-white transition-colors uppercase tracking-widest disabled:opacity-50"
              title={actionLabel}
            >
              {actionLoading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                actionIcon
              )}
              {actionLabel}
            </button>
          )}
          <button
            onClick={() => setShow((v) => !v)}
            className="flex items-center gap-1 text-[10px] font-bold text-[#4A5568] hover:text-white transition-colors uppercase tracking-widest"
          >
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {show ? "Hide" : "Show"}
          </button>
          <button
            onClick={onCopy}
            disabled={!value}
            className="flex items-center gap-1 text-[10px] font-bold hover:text-[#22D3EE] transition-colors uppercase tracking-widest disabled:opacity-40"
            style={{ color }}
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
        </div>
      </div>
      <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl px-4 py-3">
        <code className="text-sm text-[#E2E8F0] font-mono break-all">
          {show ? (value || "—") : masked}
        </code>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const { overview, apps, folders, fetchOverview, fetchApps, fetchFolders } = useUserDashboardStore();
  const { files, fetchFiles } = useCloudStore();
  const { secretKey, apiKey, fetchSecretKey, fetchApiKey, generateSecretKey, updateSecretKey } = useSecretsStore();
  const [secretLoading, setSecretLoading] = useState(false);

  useEffect(() => {
    fetchOverview();
    fetchApps();
    fetchFolders();
    fetchFiles();
    fetchApiKey();
    fetchSecretKey();
  }, []);

  const getFileIcon = (mime?: string) => {
    if (!mime) return <FileText className="h-4 w-4" />;
    if (mime.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (mime.startsWith("video/")) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const displayApiKey = apiKey?.apiKey || "";
  const displaySecretKey = secretKey?.secretKey || "";
  const storageBytes = overview?.totalStorageUsed ?? 0;
  const storageUsedGB = (storageBytes / (1024 * 1024 * 1024)).toFixed(2);

  const handleSecretAction = async () => {
    setSecretLoading(true);
    try {
      if (displaySecretKey) {
        await updateSecretKey();
        toast.success("API Secret regenerated!");
      } else {
        await generateSecretKey();
        toast.success("API Secret generated!");
      }
    } catch {
      toast.error("Failed to update API Secret");
    } finally {
      setSecretLoading(false);
    }
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

      {/* API Keys */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KeyCard
          label="Your API Key"
          value={displayApiKey}
          onCopy={() => { if (displayApiKey) { navigator.clipboard.writeText(displayApiKey); toast.success("API Key copied!"); } }}
          color="#7C3AED"
        />
        <KeyCard
          label="Your API Secret"
          value={displaySecretKey}
          onCopy={() => { if (displaySecretKey) { navigator.clipboard.writeText(displaySecretKey); toast.success("API Secret copied!"); } }}
          onAction={handleSecretAction}
          actionLabel={displaySecretKey ? "Regenerate" : "Generate"}
          actionIcon={displaySecretKey ? <RefreshCw className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          actionLoading={secretLoading}
          color="#22D3EE"
        />
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
