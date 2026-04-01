import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "./ui/utils";

interface ApiKeyDisplayProps {
  apiKey: string;
  label?: string;
  masked?: boolean;
}

export function ApiKeyDisplay({ apiKey, label = "API Key", masked = true }: ApiKeyDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(!masked);

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const displayKey = isRevealed ? apiKey : `${apiKey.slice(0, 8)}${"•".repeat(24)}${apiKey.slice(-4)}`;

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest ml-1">{label}</label>
      <div className="flex items-center gap-3 bg-[#0B1220] border border-[#1E293B] rounded-xl p-4 group hover:border-[#7C3AED]/30 transition-all shadow-inner">
        <code className="flex-1 text-[#E2E8F0] text-sm font-mono overflow-x-auto whitespace-nowrap scrollbar-hide">
          {displayKey}
        </code>
        
        <div className="flex items-center gap-1 border-l border-[#1E293B] pl-3">
          {masked && (
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="p-2 text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1E293B] rounded-lg transition-all active:scale-95"
              title={isRevealed ? "Hide Key" : "Show Key"}
            >
              {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={handleCopy}
            className={cn(
              "p-2 rounded-lg transition-all active:scale-95",
              copied 
                ? "bg-[#22C55E]/10 text-[#22C55E]" 
                : "hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#E2E8F0]"
            )}
            title="Copy Key"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
