import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/glass-card";
import { GlowButton } from "../components/glow-button";
import {
  Plus,
  Copy,
  Trash2,
  Settings,
  Layers,
  Calendar,
  Search,
  Zap,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useSecretsStore } from "../store/useSecretsStore";

function AppCard({
  app,
  onDelete,
}: {
  app: { id: string; appId: string; name: string; createdAt: string };
  secretKey: string;
  onDelete: (id: string, name: string) => void;
}) {
  const [showAppId, setShowAppId] = useState(false);

  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`);
  };

  const maskedAppId = app.appId
    ? `${app.appId.slice(0, 8)}••••••••${app.appId.slice(-4)}`
    : "—";

  return (
    <GlassCard className="h-full border-[#1E293B]/60 hover:border-[#7C3AED]/40 transition-all group overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
        <Zap className="h-24 w-24 text-[#7C3AED]" />
      </div>

      {/* Name */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-black text-white truncate">
            {app.name}
          </h3>
        </div>
      </div>

      {/* App ID */}
      <div className="mb-4 space-y-1.5 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="h-3 w-3" /> App ID
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAppId((v) => !v)}
              className="text-[10px] font-bold text-[#4A5568] hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              {showAppId ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
              {showAppId ? "Hide" : "Show"}
            </button>
            <button
              onClick={() => copy(app.appId, "App ID")}
              className="text-[10px] font-bold text-[#7C3AED] hover:text-[#22D3EE] transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
        </div>
        <div className="p-3 bg-[#0B1220] border border-[#1E293B] rounded-xl">
          <code className="text-xs text-[#E2E8F0] font-mono block truncate tracking-tight">
            {showAppId ? app.appId : maskedAppId}
          </code>
        </div>
      </div>

      {/* Status + Created */}
      <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
        <div className="bg-[#0B1220]/50 border border-[#1E293B] rounded-xl p-3">
          <span className="text-[9px] font-black text-[#4A5568] uppercase tracking-widest mb-1 block">
            Status
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
            <span className="text-xs font-bold text-white">Active</span>
          </div>
        </div>
        <div className="bg-[#0B1220]/50 border border-[#1E293B] rounded-xl p-3">
          <span className="text-[9px] font-black text-[#4A5568] uppercase tracking-widest mb-1 block">
            Created
          </span>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-[#4A5568]" />
            <span className="text-xs font-bold text-white">
              {new Date(app.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 mt-auto relative z-10">
        <button className="flex-1 px-4 py-3 bg-[#1E293B] hover:bg-[#2D3748] border border-[#2D3748] rounded-xl text-white transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
          <Settings className="h-3.5 w-3.5" /> Settings
        </button>
        <button
          onClick={() => onDelete(app.id, app.name)}
          className="px-4 py-3 bg-[#EF4444]/5 hover:bg-[#EF4444]/20 border border-[#EF4444]/20 rounded-xl text-[#EF4444] transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </GlassCard>
  );
}

export function AppsPage() {
  const {
    apiKey,
    appIds,
    isLoading,
    fetchApiKey,
    fetchAppIds,
    generateAppId,
    deleteAppId,
  } = useSecretsStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchApiKey();
    fetchAppIds();
  }, [fetchApiKey, fetchAppIds]);

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;
    await generateAppId(newAppName);
    toast.success(`App "${newAppName}" created successfully!`);
    setNewAppName("");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteApp = async (id: string, name: string) => {
    if (
      confirm(`Delete "${name}"? All associated files may become inaccessible.`)
    ) {
      await deleteAppId(id);
      toast.success(`App "${name}" deleted`);
    }
  };

  const filteredApps = appIds.filter(
    (app) =>
      app?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app?.appId?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const apiKeyValue = apiKey?.apiKey || "";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#7C3AED] mb-2 font-bold text-xs uppercase tracking-widest">
            <Layers className="h-4 w-4" /> Infrastructure
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Applications
          </h1>
          <p className="text-[#94A3B8] font-medium mt-1">
            Manage your environments and unique access credentials.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-4">
          <div className="relative group w-full sm:w-auto mt-4 sm:mt-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5568] group-focus-within:text-[#7C3AED] transition-colors" />
            <input
              type="text"
              placeholder="Filter apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0F172A] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#7C3AED]/50 outline-none w-full sm:w-56 transition-all"
            />
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <GlowButton
                variant="primary"
                className="px-6 py-3 rounded-xl font-bold shadow-2xl"
              >
                <Plus className="h-5 w-5 mr-2" /> Create New App
              </GlowButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Application</DialogTitle>
                <DialogDescription>
                  Give your app a name. We'll generate a unique ID and API Key.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateApp} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="appName"
                    className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest ml-1"
                  >
                    App Name
                  </Label>
                  <Input
                    id="appName"
                    placeholder="e.g. My Mobile App"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    className="bg-[#0F172A] border-[#1E293B] text-white h-12 rounded-xl focus:border-[#7C3AED]/50"
                    required
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <GlowButton
                    type="submit"
                    variant="primary"
                    className="w-full py-4 text-base font-black"
                  >
                    Initialize Infrastructure
                  </GlowButton>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading && appIds.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-[#1E293B]/20 animate-pulse rounded-2xl border border-[#1E293B]/40"
            />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <GlassCard className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-[#1E293B]/50 rounded-full flex items-center justify-center mb-6">
            <Globe className="h-10 w-10 text-[#4A5568]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No Applications Found
          </h3>
          <p className="text-[#94A3B8] mb-8 max-w-sm">
            Apps allow you to group files and keys for different platforms or
            environments.
          </p>
          <GlowButton
            variant="primary"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Create Your First App
          </GlowButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <AppCard
                  app={app}
                  secretKey={apiKeyValue}
                  onDelete={handleDeleteApp}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
