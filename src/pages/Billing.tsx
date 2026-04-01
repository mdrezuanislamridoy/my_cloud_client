/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useSubscriptionStore } from "../store/useSubscriptionStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { CreditCard, CheckCircle, HardDrive, Files, ArrowRight, PackageX, ExternalLink } from "lucide-react";
import { cn } from "../components/ui/utils";

export function BillingPage() {
  const { plans, userSubscription, isLoading, fetchPlans, fetchUserSubscription, subscribe } = useSubscriptionStore();

  useEffect(() => {
    fetchPlans();
    fetchUserSubscription();
  }, []);

  const handleCheckout = async (planId: string) => {
    try {
      const url = await subscribe(planId);
      if (url) {
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = url;
      } else {
        toast.error("No redirect URL received. Please try again.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Failed to initiate checkout. Please try again.");
    }
  };

  // server returns: { id, status, isActive, storageUsed, storageLimit, fileUploaded, fileLimit, plan, package }
  const sub = (userSubscription && typeof userSubscription === 'object' && 'id' in (userSubscription as any))
    ? userSubscription as any
    : null;
  const storageUsedGB = sub ? (Number(sub.storageUsed || 0) / (1024 * 1024 * 1024)).toFixed(2) : "0";
  const storageLimitGB = sub ? (Number(sub.storageLimit || 0) / (1024 * 1024 * 1024)).toFixed(0) : "0";
  const storagePercent = sub && Number(sub.storageLimit) > 0
    ? Math.min(100, (Number(sub.storageUsed) / Number(sub.storageLimit)) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-[#94A3B8] text-sm mt-1">Manage your subscription and billing details.</p>
      </div>

      {/* Current Subscription */}
      {isLoading ? (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 animate-pulse h-40" />
      ) : sub ? (
        <div className="bg-[#0F172A] border border-[#7C3AED]/30 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Current Plan</h2>
            <span className={cn(
              "text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-widest",
              sub.status === "PAID" ? "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20" :
              sub.status === "PENDING" ? "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20" :
              "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
            )}>
              {sub.status}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{sub.plan?.name || "—"}</p>
              <p className="text-sm text-[#94A3B8]">{sub.plan?.description || ""}</p>
            </div>
          </div>

          {/* Storage + Files */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="h-4 w-4 text-[#7C3AED]" />
                <span className="text-xs text-[#94A3B8]">Storage</span>
              </div>
              <p className="text-sm font-bold text-white mb-2">{storageUsedGB} / {storageLimitGB} GB</p>
              <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED] rounded-full transition-all" style={{ width: `${storagePercent}%` }} />
              </div>
            </div>
            <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Files className="h-4 w-4 text-[#22D3EE]" />
                <span className="text-xs text-[#94A3B8]">Files</span>
              </div>
              <p className="text-sm font-bold text-white">{sub.fileUploaded || 0} / {sub.fileLimit || 0}</p>
            </div>
          </div>

          {/* Features */}
          {sub.plan?.planIncludes?.length > 0 && (
            <ul className="space-y-1.5">
              {sub.plan.planIncludes.map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <CheckCircle className="h-4 w-4 text-[#22C55E] shrink-0" />{f}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#1E293B] rounded-2xl flex items-center justify-center mb-4">
            <CreditCard className="h-7 w-7 text-[#4A5568]" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No active subscription</h2>
          <p className="text-sm text-[#94A3B8] mb-4 max-w-sm">
            You don't have an active subscription. Choose a plan below to get started.
          </p>
          <div className="flex items-center gap-2 text-[#7C3AED] text-sm font-medium">
            <ArrowRight className="h-4 w-4" /> Pick a plan from the list below
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Available Plans</h2>
          <Link to="/pricing" className="flex items-center gap-1 text-xs text-[#7C3AED] hover:underline">
            View full pricing <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {plans.length === 0 ? (
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-10 flex flex-col items-center text-center">
            <PackageX className="h-10 w-10 text-[#4A5568] mb-3" />
            <p className="text-sm font-semibold text-white mb-1">No plans available</p>
            <p className="text-xs text-[#4A5568]">No subscription plans configured yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan: any) => {
              const isCurrent = sub?.subscriptionPlanId === plan.id;
              const pricing = plan.pricings?.[0];
              return (
                <div key={plan.id} className={cn(
                  "bg-[#0F172A] border rounded-xl p-5 flex flex-col gap-4",
                  isCurrent ? "border-[#7C3AED]" : "border-[#1E293B]"
                )}>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-white">{plan.name}</p>
                      {isCurrent && <span className="text-[10px] font-bold text-[#7C3AED] bg-[#7C3AED]/10 px-2 py-0.5 rounded-full">Current</span>}
                      {plan.isPopular && !isCurrent && <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">Popular</span>}
                    </div>
                    {pricing && (
                      <p className="text-2xl font-bold text-white">
                        ${pricing.price}
                        <span className="text-sm font-normal text-[#94A3B8]"> / {pricing.billingCycle === "MONTHLY" ? "mo" : "yr"}</span>
                      </p>
                    )}
                    {plan.description && <p className="text-xs text-[#4A5568] mt-1">{plan.description}</p>}
                  </div>

                  {pricing && (
                    <div className="flex gap-3 text-xs text-[#94A3B8]">
                      <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" />{(Number(pricing.maxStorage) / (1024 * 1024 * 1024)).toFixed(0)} GB</span>
                      <span className="flex items-center gap-1"><Files className="h-3 w-3" />{pricing.maxFiles?.toLocaleString()} files</span>
                    </div>
                  )}

                  {plan.planIncludes?.length > 0 && (
                    <ul className="space-y-1.5 flex-1">
                      {plan.planIncludes.map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-[#94A3B8]">
                          <CheckCircle className="h-3.5 w-3.5 text-[#22C55E] shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={isCurrent}
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    {isCurrent ? "Current Plan" : pricing?.price === 0 ? "Get Started" : "Upgrade"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
