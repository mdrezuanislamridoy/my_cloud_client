/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { GlowButton } from "@/components/glow-button";
import {
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Trash2,
  Copy,
  Grid3x3,
  List,
  Search,
  Upload,
  X,
  ExternalLink,
  MoreVertical,
  Database,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/components/ui/utils";
import { useCloudStore } from "@/features/cloud/store/useCloudStore";
import { cloudService } from "@/features/cloud/services/cloud.service";

type ViewMode = "grid" | "list";

// Server returns: { id, name, data (url), publicKey, fileSize, fileType, uploaded_at }
const getUrl = (f: any): string => f.data || f.url || "";
const getName = (f: any): string => f.name || f.fileName || "";
const getSize = (f: any): number => f.fileSize || f.size || 0;
const getMime = (f: any): string => f.fileType || f.mimeType || "";
const getDate = (f: any): string => {
  const d = f.uploaded_at || f.createdAt || f.updatedAt || "";
  if (!d) return "";
  const date = new Date(d);
  return isNaN(date.getTime()) ? "" : d;
};

export function FilesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files, isLoading, fetchFiles, deleteFile, uploadFile } =
    useCloudStore();

  useEffect(() => {
    fetchFiles();
  }, []);

  const getFileIcon = (mime?: string) => {
    if (!mime) return <FileText className="h-5 w-5" />;
    if (mime.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    if (mime.startsWith("video/")) return <Video className="h-5 w-5" />;
    if (mime.startsWith("audio/")) return <Music className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const getFileColor = (mime?: string) => {
    if (!mime) return "text-[#F59E0B]";
    if (mime.startsWith("image/")) return "text-[#22D3EE]";
    if (mime.startsWith("video/")) return "text-[#7C3AED]";
    if (mime.startsWith("audio/")) return "text-[#22C55E]";
    return "text-[#F59E0B]";
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied!");
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete "${name}"?`)) {
      await deleteFile(id);
      toast.success(`"${name}" deleted`);
    }
  };

  const handleDownload = async (id: string, name: string) => {
    try {
      await cloudService.downloadFile(id, name);
    } catch {
      toast.error('Download failed');
    }
  };

  const handleUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) return;
    setUploading(true);
    let success = 0;
    for (const file of Array.from(selectedFiles)) {
      try {
        await uploadFile(file);
        success++;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          `Failed to upload ${file.name}`;
        toast.error(msg);
      }
    }
    setUploading(false);
    if (success > 0) {
      toast.success(`${success} file${success > 1 ? "s" : ""} uploaded!`);
      setUploadOpen(false);
    }
  };

  const filteredFiles = files.filter((f) =>
    getName(f).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#7C3AED] mb-2 font-bold text-xs uppercase tracking-widest">
            <Database className="h-4 w-4" /> Cloud Storage
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Your Assets
          </h1>
          <p className="text-[#94A3B8] font-medium mt-1">
            Manage and organize your synchronized files.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5568] group-focus-within:text-[#7C3AED] transition-colors" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0F172A] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#7C3AED]/50 outline-none w-56 transition-all"
            />
          </div>

          <GlowButton
            variant="primary"
            className="px-5 py-2.5 rounded-xl"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" /> Upload
          </GlowButton>

          <div className="flex bg-[#0F172A] border border-[#1E293B] p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "grid"
                  ? "bg-[#7C3AED] text-white"
                  : "text-[#4A5568] hover:text-[#94A3B8]",
              )}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "list"
                  ? "bg-[#7C3AED] text-white"
                  : "text-[#4A5568] hover:text-[#94A3B8]",
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-white">Upload Files</h2>
              <button
                onClick={() => setUploadOpen(false)}
                className="text-[#4A5568] hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleUpload(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all",
                dragOver
                  ? "border-[#7C3AED] bg-[#7C3AED]/10"
                  : "border-[#1E293B] hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/5",
              )}
            >
              <Upload className="h-10 w-10 text-[#4A5568] mb-3" />
              <p className="text-sm font-bold text-white mb-1">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-[#4A5568]">Any file type supported</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
            </div>

            {uploading && (
              <div className="mt-4 flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-[#1E293B] rounded-full overflow-hidden">
                  <div className="h-full bg-[#7C3AED] rounded-full animate-pulse w-2/3" />
                </div>
                <span className="text-xs text-[#94A3B8] font-bold">
                  Uploading...
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {isLoading && files.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-[#1E293B]/20 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : filteredFiles.length === 0 ? (
        <GlassCard className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-[#1E293B]/50 rounded-full flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-[#4A5568]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No files found</h3>
          <p className="text-[#94A3B8] mb-8 max-w-sm">
            Your cloud is empty or no files match your search.
          </p>
          <GlowButton variant="primary" onClick={() => setUploadOpen(true)}>
            Upload Your First File
          </GlowButton>
        </GlassCard>
      ) : (
        <>
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <GlassCard className="hover:border-[#7C3AED]/40 transition-all group p-4 bg-gradient-to-br from-[#0F172A] to-[#0B1220]">
                      <div className="relative mb-5 h-44 bg-[#0B1220] rounded-xl flex items-center justify-center overflow-hidden border border-[#1E293B]/50 group-hover:scale-[1.02] transition-transform duration-500">
                        {getMime(file).startsWith("image/") ? (
                          <img
                            src={getUrl(file)}
                            alt={getName(file)}
                            className="w-full h-full object-cover transition-opacity"
                          />
                        ) : (
                          <div
                            className={cn(
                              "opacity-20",
                              getFileColor(getMime(file)),
                            )}
                          >
                            {getFileIcon(getMime(file))}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2.5 backdrop-blur-[2px]">
                          <button
                            onClick={() => handleCopyUrl(getUrl(file))}
                            className="p-2.5 bg-white/10 hover:bg-[#7C3AED] rounded-xl text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                            title="Copy URL"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDownload(file.id, getName(file))
                            }
                            className="p-2.5 bg-white/10 hover:bg-[#22C55E] rounded-xl text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-[50ms]"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <a
                            href={getUrl(file)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 bg-white/10 hover:bg-[#22D3EE] rounded-xl text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-[100ms]"
                            title="Open"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(file.id, getName(file))}
                            className="p-2.5 bg-white/10 hover:bg-[#EF4444] rounded-xl text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-[150ms]"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "p-2 bg-[#1E293B]/50 rounded-lg shrink-0",
                            getFileColor(getMime(file)),
                          )}
                        >
                          {getFileIcon(getMime(file))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#E2E8F0] truncate group-hover:text-[#7C3AED] transition-colors">
                            {getName(file)}
                          </p>
                          <p className="text-[11px] font-bold text-[#4A5568] uppercase tracking-tighter mt-0.5">
                            {(getSize(file) / (1024 * 1024)).toFixed(2)} MB
                            &bull;{" "}
                            {new Date(getDate(file)).toLocaleDateString()}
                          </p>
                        </div>
                        <button className="text-[#4A5568] hover:text-white pt-1">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {viewMode === "list" && (
            <GlassCard className="p-0 overflow-hidden border-[#1E293B]/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-[#1E293B] bg-[#0F172A]/50">
                      <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">
                        Name
                      </th>
                      <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">
                        Type
                      </th>
                      <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">
                        Size
                      </th>
                      <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">
                        Uploaded
                      </th>
                      <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]/30">
                    {filteredFiles.map((file, index) => (
                      <motion.tr
                        key={file.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-[#7C3AED]/5 group transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "p-2 bg-[#1E293B]/30 rounded-lg",
                                getFileColor(getMime(file)),
                              )}
                            >
                              {getFileIcon(getMime(file))}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-[#E2E8F0] block group-hover:text-white transition-colors">
                                {getName(file)}
                              </span>
                              <span className="text-[10px] font-bold text-[#4A5568] font-mono truncate max-w-[200px] block">
                                {file.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 bg-[#1E293B] text-[10px] font-black text-[#94A3B8] rounded uppercase tracking-tighter">
                            {getMime(file)?.split("/")[1] || "FILE"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-[#94A3B8]">
                          {(getSize(file) / (1024 * 1024)).toFixed(2)} MB
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-[#4A5568]">
                          {new Date(getDate(file)).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleCopyUrl(getUrl(file))}
                              className="p-2 text-[#4A5568] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-lg transition-all"
                              title="Copy URL"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(file.id, getName(file))}
                              className="p-2 text-[#4A5568] hover:text-[#22C55E] hover:bg-[#22C55E]/10 rounded-lg transition-all"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <a
                              href={getUrl(file)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-[#4A5568] hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 rounded-lg transition-all"
                              title="Open"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() =>
                                handleDelete(file.id, getName(file))
                              }
                              className="p-2 text-[#4A5568] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}
