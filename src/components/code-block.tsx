import { cn } from "@/components/ui/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "javascript", className }: CodeBlockProps) {
  return (
    <div className={cn("bg-[#0B1220] border border-[#1E293B] rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-[#0F172A] border-b border-[#1E293B]">
        <span className="text-xs text-[#94A3B8] font-mono capitalize">{language}</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40" />
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-left custom-scrollbar">
        <code className="text-sm text-[#E2E8F0] font-mono leading-relaxed ">
          {code}
        </code>
      </pre>
    </div>
  );
}
