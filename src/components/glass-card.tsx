import { motion } from "framer-motion";
import { cn } from "@/components/ui/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-[#0F172A]/80 backdrop-blur-xl border border-[#1E293B] rounded-xl p-6",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
