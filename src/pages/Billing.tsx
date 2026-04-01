import { motion } from "framer-motion";
import { useEffect } from "react";
import { GlassCard } from "../components/glass-card";
import { GlowButton } from "../components/glow-button";
import { Check, CreditCard, Download, ShieldCheck, Zap, ArrowRight, Clock, Star, Crown } from "lucide-react";
import { cn } from "../components/ui/utils";
import { useSubscriptionStore } from "../store/useSubscriptionStore";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

export function BillingPage() {
  const { plans, isLoading, fetchPlans, subscribe } = useSubscriptionStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCheckout = async (planId: string) => {
    try {
      const url = await subscribe(planId);
      if (url) window.location.href = url;
    } catch {
      toast.error("Failed to initiate checkout");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[#7C3AED] mb-2 font-bold text-xs uppercase tracking-widest">
          <CreditCard className="h-4 w-4" />
          Subscription Center
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Billing & Plans</h1>
        <p className="text-[#94A3B8] font-medium mt-1">Manage your cloud tier and monitor your financial history.</p>
      </div>

      {/* Current Plan Overview */}
      <GlassCard className="border-[#7C3AED] bg-gradient-to-r from-[#7C3AED]/10 to-transparent p-8 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
           <ShieldCheck className="h-48 w-48 text-[#7C3AED]" />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <h3 className="text-3xl font-black text-white">Free Tier</h3>
                <span className="px-3 py-1 bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-black rounded-lg border border-[#22C55E]/30 uppercase tracking-widest">Active Plan</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Pricing</span>
                    <span className="text-lg font-bold text-white">$0/mo</span>
                </div>
                <div className="w-px h-10 bg-[#1E293B]" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Renewal Date</span>
                    <span className="text-lg font-bold text-white flex items-center gap-2">
                        Never
                        <Clock className="h-4 w-4 text-[#7C3AED]" />
                    </span>
                </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <GlowButton variant="ghost" className="px-8 py-3.5 rounded-xl border-[#1E293B] font-bold">Manage Billing</GlowButton>
            <GlowButton variant="primary" className="px-8 py-3.5 rounded-xl font-black shadow-2xl">Upgrade Features</GlowButton>
          </div>
        </div>
      </GlassCard>

      {/* Available Plans Section */}
      <div className="space-y-8 px-2">
        <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Available Subscription Tiers</h2>
            <p className="text-sm text-[#4A5568] font-bold uppercase tracking-widest mt-1">Scale your storage and API limits instantly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className={cn(
                "h-full relative p-8 flex flex-col group transition-all duration-500",
                "hover:border-[#7C3AED]/30"
              )}>
                <div className="mb-8">
                   <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-[#0B1220] border border-[#1E293B] rounded-2xl group-hover:border-[#7C3AED]/30 transition-colors">
                          {plan.name === 'Free' ? <Star className="h-6 w-6 text-[#94A3B8]" /> : 
                           plan.name === 'Pro' ? <Zap className="h-6 w-6 text-[#7C3AED]" /> : 
                           <Crown className="h-6 w-6 text-[#F59E0B]" />}
                      </div>
                      {plan.name === 'Pro' && (
                           <span className="text-[9px] font-black text-[#7C3AED] bg-[#7C3AED]/10 px-2 py-0.5 rounded uppercase tracking-tighter">Most Popular</span>
                      )}
                   </div>
                  <h3 className="text-3xl font-black text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-5xl font-black text-white">${plan.price}</span>
                    <span className="text-sm font-bold text-[#4A5568] uppercase tracking-widest">/ {plan.interval}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-10">
                  <div className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest border-b border-[#1E293B] pb-2">Includes</div>
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="bg-[#22C55E]/10 p-1 rounded-full"><Check className="h-3 w-3 text-[#22C55E]" /></div>
                        <span className="text-sm font-bold text-[#E2E8F0]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <GlowButton 
                  variant="primary"
                  className="w-full py-5 rounded-2xl text-base font-black shadow-xl"
                  onClick={() => handleCheckout(plan.id)}
                >
                  {plan.price > 0 ? "Upgrade Now" : "Get Started"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </GlowButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Invoice History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 border-[#1E293B]/60">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#7C3AED]" />
                    <h3 className="text-xl font-black text-white">Invoice History</h3>
                </div>
                <button className="text-[10px] font-black text-[#7C3AED] hover:text-white transition-colors uppercase tracking-widest border border-[#7C3AED]/30 px-3 py-1 rounded-lg">Download All</button>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-[#1E293B] bg-[#0F172A]/50">
                            <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Invoice</th>
                            <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Date</th>
                            <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Amount</th>
                            <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Status</th>
                            <th className="py-4 px-6 text-[10px] font-black text-[#4A5568] uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]/30">
                        <tr>
                            <td colSpan={5} className="py-12 text-center text-[#4A5568] font-bold text-sm">No billing history found</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </GlassCard>

        {/* Payment Methods */}
        <div className="flex flex-col gap-6">
            <GlassCard className="border-[#1E293B]/60 bg-gradient-to-br from-[#0F172A] to-[#0B1220] h-fit">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-[#7C3AED]" />
                        <h3 className="text-xl font-black text-white">Payment Method</h3>
                    </div>
                </div>
                
                <div className="bg-[#0B1220] border border-[#1E293B] rounded-2xl p-6 relative group hover:border-[#7C3AED]/40 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-[#7C3AED]/10 rounded-xl">
                            <CreditCard className="h-6 w-6 text-[#7C3AED]" />
                        </div>
                        <div>
                             <p className="text-base font-black text-white tracking-tight">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242</p>
                             <p className="text-[10px] font-bold text-[#4A5568] uppercase tracking-widest">Visa Platinum Card</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#1E293B]">
                        <span className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest">Expires 12/28</span>
                        <button className="text-[10px] font-black text-[#7C3AED] hover:text-white transition-colors uppercase tracking-widest">Update</button>
                    </div>
                </div>
                
                <div className="mt-8">
                    <GlowButton variant="ghost" className="w-full py-4 text-xs font-black uppercase tracking-widest rounded-xl border-[#1E293B]">
                        View Stripe Customer Portal
                    </GlowButton>
                </div>
            </GlassCard>
            
            <GlassCard className="border-[#1E293B]/60 p-6 flex flex-col justify-center items-center text-center bg-[#7C3AED]/5">
                <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-full flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-[#7C3AED] fill-[#7C3AED]/20" />
                </div>
                <h4 className="text-base font-black text-white mb-2 uppercase tracking-tight">Need a custom plan?</h4>
                <p className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-tight mb-6">Contact our infrastructure team for tailor-made resource allocation.</p>
                <GlowButton variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest border-[#1E293B]">Contact Sales</GlowButton>
            </GlassCard>
        </div>
      </div>
    </div>
  );
}
