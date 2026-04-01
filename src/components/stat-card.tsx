import { cn } from "./ui/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, change, trend = "neutral", icon, className }: StatCardProps) {
  const trendColors = {
    up: "text-[#22C55E]",
    down: "text-[#EF4444]",
    neutral: "text-[#94A3B8]",
  };

  return (
    <div className={cn(
      "bg-[#0F172A]/80 backdrop-blur-xl border border-[#1E293B] rounded-xl p-6",
      "hover:border-[#7C3AED]/30 transition-all duration-300",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#94A3B8] mb-1">{label}</p>
          <p className="text-3xl font-bold text-[#E2E8F0] mb-2">{value}</p>
          {change && (
            <p className={cn("text-sm", trendColors[trend])}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-[#7C3AED]/10 rounded-lg text-[#7C3AED]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
