import { cn } from "@/components/ui/utils";

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
}

export function GlowButton({
  variant = "primary",
  className,
  children,
  ...props
}: GlowButtonProps) {
  const variants = {
    primary: "bg-[#7C3AED] text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-[#7C3AED]/20",
    secondary: "bg-[#22D3EE] text-[#0B1220] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] border border-[#22D3EE]/20",
    ghost: "bg-transparent text-[#E2E8F0] hover:bg-[#1E293B] border border-[#1E293B]",
  };

  return (
    <button
      className={cn(
        "px-6 py-3 rounded-lg transition-all duration-300 font-medium flex items-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
