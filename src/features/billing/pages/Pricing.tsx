import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Check, Zap, Star, Crown, ArrowRight, HardDrive, Files } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { subscriptionService } from "@/features/billing/services/subscription.service";
import { PublicNavbar } from "@/components/PublicNavbar";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useSubscriptionStore } from "@/features/billing/store/useSubscriptionStore";
import { toast } from "sonner";

type BillingCycle = "MONTHLY" | "YEARLY";

interface Pricing {
  id: string;
  price: number;
  maxStorage: number;
  maxFiles: number;
  billingCycle: BillingCycle;
  stripePriceId: string;
}

interface Plan {
  id: string;
  name: string;
  description?: string;
  isPopular: boolean;
  planIncludes: string[];
  pricings: Pricing[];
}

const getPlanIcon = (name: string) => {
  const n = name?.toLowerCase();
  if (n?.includes("free") || n?.includes("starter")) return <Star className="h-6 w-6 text-[#94A3B8]" />;
  if (n?.includes("pro") || n?.includes("growth")) return <Zap className="h-6 w-6 text-[#7C3AED]" />;
  return <Crown className="h-6 w-6 text-[#F59E0B]" />;
};

export function PricingPage() {
  const [cycle, setCycle] = useState<BillingCycle>("MONTHLY");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const { accessToken } = useAuthStore();
  const { subscribe } = useSubscriptionStore();
  const navigate = useNavigate();

  useEffect(() => {
    subscriptionService.getAllPlans()
      .then((data) => setPlans(Array.isArray(data) ? (data as unknown as Plan[]) : []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  const getPricing = (plan: Plan) =>
    plan.pricings.find((p) => p.billingCycle === cycle) ?? plan.pricings[0];

  const handleCTA = async (plan: Plan) => {
    if (!accessToken) {
      navigate("/register");
      return;
    }
    const pricing = getPricing(plan);
    if (!pricing || pricing.price === 0) {
      navigate("/app/billing");
      return;
    }
    setSubscribing(plan.id);
    try {
      const url = await subscribe(plan.id);
      if (url) {
        window.location.href = url;
      } else {
        navigate("/app/billing");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Failed to initiate checkout");
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E2E8F0]">
      <PublicNavbar />

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full">
                <span className="text-[#7C3AED] text-xs font-bold uppercase tracking-wider">Simple Pricing</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                Choose Your <span className="bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] bg-clip-text text-transparent">Plan</span>
              </h1>
              <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
                Scale your storage and API limits. No hidden fees, cancel anytime.
              </p>
            </motion.div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <div className="flex bg-[#0F172A] border border-[#1E293B] p-1 rounded-xl">
                <button
                  onClick={() => setCycle("MONTHLY")}
                  className={cn(
                    "px-5 py-2 text-sm font-bold rounded-lg transition-all",
                    cycle === "MONTHLY" ? "bg-[#7C3AED] text-white" : "text-[#94A3B8] hover:text-white"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setCycle("YEARLY")}
                  className={cn(
                    "px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
                    cycle === "YEARLY" ? "bg-[#7C3AED] text-white" : "text-[#94A3B8] hover:text-white"
                  )}
                >
                  Yearly
                  <span className="text-[10px] font-black bg-[#22C55E]/20 text-[#22C55E] px-1.5 py-0.5 rounded">Save 20%</span>
                </button>
              </div>
            </div>
          </div>

          {/* Plans */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-[#1E293B]/20 animate-pulse rounded-2xl border border-[#1E293B]/40" />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#4A5568] text-lg font-bold">No plans available yet.</p>
              <Link to="/register" className="inline-block mt-6 bg-[#7C3AED] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#6D28D9] transition-colors">
                Get Started Free
              </Link>
            </div>
          ) : (
            <div className={cn(
              "grid gap-8",
              plans.length === 1 ? "grid-cols-1 max-w-sm mx-auto" :
              plans.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto" :
              "grid-cols-1 md:grid-cols-3"
            )}>
              {plans.map((plan, index) => {
                const pricing = getPricing(plan);
                const storageGB = pricing ? (pricing.maxStorage / (1024 * 1024 * 1024)).toFixed(0) : "—";
                const maxFiles = pricing?.maxFiles?.toLocaleString() ?? "—";

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <span className="bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className={cn(
                      "h-full bg-[#0F172A] border rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1",
                      plan.isPopular
                        ? "border-[#7C3AED]/60 shadow-[0_0_40px_rgba(124,58,237,0.15)]"
                        : "border-[#1E293B] hover:border-[#7C3AED]/30"
                    )}>
                      {/* Icon + Name */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className={cn(
                          "p-3 rounded-2xl border",
                          plan.isPopular ? "bg-[#7C3AED]/10 border-[#7C3AED]/30" : "bg-[#0B1220] border-[#1E293B]"
                        )}>
                          {getPlanIcon(plan.name)}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-white">{plan.name}</h3>
                          {plan.description && <p className="text-xs text-[#4A5568] mt-0.5">{plan.description}</p>}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        {pricing ? (
                          <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-white">${pricing.price}</span>
                            <span className="text-sm font-bold text-[#4A5568]">
                              / {pricing.billingCycle === "MONTHLY" ? "mo" : "yr"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-3xl font-black text-white">Custom</span>
                        )}
                      </div>

                      {/* Storage + Files */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <HardDrive className="h-3.5 w-3.5 text-[#7C3AED]" />
                            <span className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Storage</span>
                          </div>
                          <p className="text-base font-black text-white">{storageGB} GB</p>
                        </div>
                        <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Files className="h-3.5 w-3.5 text-[#22D3EE]" />
                            <span className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Files</span>
                          </div>
                          <p className="text-base font-black text-white">{maxFiles}</p>
                        </div>
                      </div>

                      {/* Features */}
                      {plan.planIncludes?.length > 0 && (
                        <div className="flex-1 mb-8">
                          <p className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest border-b border-[#1E293B] pb-2 mb-4">
                            What's included
                          </p>
                          <ul className="space-y-3">
                            {plan.planIncludes.map((feature, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="bg-[#22C55E]/10 p-1 rounded-full shrink-0 mt-0.5">
                                  <Check className="h-3 w-3 text-[#22C55E]" />
                                </div>
                                <span className="text-sm text-[#E2E8F0]">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CTA */}
                      <button
                        onClick={() => handleCTA(plan)}
                        disabled={subscribing === plan.id}
                        className={cn(
                          "w-full py-4 rounded-xl text-sm font-black text-center flex items-center justify-center gap-2 transition-all disabled:opacity-60",
                          plan.isPopular
                            ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-[#7C3AED]/20"
                            : "bg-[#1E293B] hover:bg-[#2D3748] text-white border border-[#2D3748]"
                        )}
                      >
                        {subscribing === plan.id ? "Redirecting..." : pricing?.price === 0 ? "Get Started Free" : accessToken ? "Subscribe Now" : "Start Now"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* FAQ / Note */}
          <div className="mt-20 text-center">
            <p className="text-[#4A5568] text-sm">
              All plans include SSL encryption, 99.9% uptime SLA, and 24/7 support.{" "}
              <Link to="/login" className="text-[#7C3AED] hover:underline">Already have an account?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
