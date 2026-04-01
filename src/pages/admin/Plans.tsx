import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Star,
  Zap,
  Crown,
  HardDrive,
  Files,
} from "lucide-react";
import { subscriptionService } from "../../services/subscription.service";
import { toast } from "sonner";
import { cn } from "../../components/ui/utils";
import api from "../../config/axios";

interface Pricing {
  id?: string;
  price: number;
  maxStorage: number;
  maxFiles: number;
  billingCycle: "MONTHLY" | "YEARLY";
}
interface Plan {
  id: string;
  name: string;
  description: string;
  isPopular: boolean;
  planIncludes: string[];
  autoRenew: boolean;
  pricings: Pricing[];
}

type FormState = {
  name: string;
  description: string;
  isPopular: boolean;
  planIncludes: string[];
  autoRenew: boolean;
  pricings: Pricing[];
};

const emptyPlan: FormState = {
  name: "",
  description: "",
  isPopular: false,
  planIncludes: [""],
  autoRenew: true,
  pricings: [{ price: 0, maxStorage: 10, maxFiles: 100, billingCycle: "MONTHLY" }],
};

const getPlanIcon = (name: string) => {
  const n = name?.toLowerCase();
  if (n?.includes("free") || n?.includes("starter"))
    return <Star className="h-5 w-5 text-[#94A3B8]" />;
  if (n?.includes("pro")) return <Zap className="h-5 w-5 text-[#7C3AED]" />;
  return <Crown className="h-5 w-5 text-[#F59E0B]" />;
};

export function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...emptyPlan });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await subscriptionService.getAllPlans();
      setPlans(Array.isArray(data) ? (data as unknown as Plan[]) : []);
    } catch {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      ...emptyPlan,
      planIncludes: [""],
      pricings: [{ price: 0, maxStorage: 10, maxFiles: 100, billingCycle: "MONTHLY" as "MONTHLY" | "YEARLY" }],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (plan: Plan) => {
    setForm({
      name: plan.name,
      description: plan.description,
      isPopular: plan.isPopular,
      planIncludes: plan.planIncludes?.length ? plan.planIncludes : [""],
      autoRenew: plan.autoRenew,
      pricings: plan.pricings?.length
        ? plan.pricings.map((p) => ({
            id: p.id,
            price: p.price,
            maxStorage: p.maxStorage / (1024 * 1024 * 1024),
            maxFiles: p.maxFiles,
            billingCycle: p.billingCycle as "MONTHLY" | "YEARLY",
          }))
        : [
            {
              price: 0,
              maxStorage: 10,
              maxFiles: 100,
              billingCycle: "MONTHLY" as const,
            },
          ],
    });
    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete plan "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/subscription/${id}`);
      toast.success(`Plan "${name}" deleted`);
      load();
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to delete");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        planIncludes: form.planIncludes.filter(Boolean),
        pricings: form.pricings.map((p) => ({
          ...p,
          maxStorage: Math.round(p.maxStorage * 1024 * 1024 * 1024),
        })),
      };
      if (editingId) {
        await api.put(`/subscription/${editingId}`, payload);
        toast.success("Plan updated");
      } else {
        await api.post("/subscription", payload);
        toast.success("Plan created");
      }
      resetForm();
      load();
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateFeature = (i: number, val: string) =>
    setForm((f) => ({
      ...f,
      planIncludes: f.planIncludes.map((v, idx) => (idx === i ? val : v)),
    }));
  const addFeature = () =>
    setForm((f) => ({ ...f, planIncludes: [...f.planIncludes, ""] }));
  const removeFeature = (i: number) =>
    setForm((f) => ({
      ...f,
      planIncludes: f.planIncludes.filter((_, idx) => idx !== i),
    }));
  const updatePricing = (i: number, key: string, val: string | number) =>
    setForm((f) => ({
      ...f,
      pricings: f.pricings.map((p, idx) =>
        idx === i ? { ...p, [key]: val } : p,
      ),
    }));
  const addPricing = () =>
    setForm((f) => ({
      ...f,
      pricings: [
        ...f.pricings,
        {
          price: 0,
          maxStorage: 10,
          maxFiles: 100,
          billingCycle: "YEARLY" as const,
        },
      ],
    }));
  const removePricing = (i: number) =>
    setForm((f) => ({
      ...f,
      pricings: f.pricings.filter((_, idx) => idx !== i),
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Subscription Plans</h1>
          <p className="text-[#94A3B8] mt-1">
            Create and manage pricing plans.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="h-4 w-4" /> New Plan
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0F172A] border border-[#7C3AED]/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-white">
                {editingId ? "Edit Plan" : "Create Plan"}
              </h2>
              <button
                onClick={resetForm}
                className="text-[#4A5568] hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-2">
                    Plan Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Pro"
                    className="w-full bg-[#0B1220] border border-[#1E293B] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7C3AED]/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-2">
                    Description *
                  </label>
                  <input
                    required
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    placeholder="Perfect for professionals"
                    className="w-full bg-[#0B1220] border border-[#1E293B] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7C3AED]/60"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isPopular: e.target.checked }))
                    }
                    className="w-4 h-4 accent-[#7C3AED]"
                  />
                  <span className="text-sm text-[#94A3B8]">
                    Mark as Popular
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.autoRenew}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, autoRenew: e.target.checked }))
                    }
                    className="w-4 h-4 accent-[#7C3AED]"
                  />
                  <span className="text-sm text-[#94A3B8]">Auto Renew</span>
                </label>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">
                    Features
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-xs text-[#7C3AED] hover:text-white transition-colors"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.planIncludes.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={f}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        placeholder="e.g. 50GB Storage"
                        className="flex-1 bg-[#0B1220] border border-[#1E293B] text-white rounded-xl px-4 py-2 text-sm outline-none focus:border-[#7C3AED]/60"
                      />
                      {form.planIncludes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="text-[#EF4444] hover:text-red-400 p-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricings */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">
                    Pricing Tiers
                  </label>
                  {form.pricings.length < 2 && (
                    <button
                      type="button"
                      onClick={addPricing}
                      className="text-xs text-[#7C3AED] hover:text-white transition-colors"
                    >
                      + Add Tier
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {form.pricings.map((p, i) => (
                    <div
                      key={i}
                      className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={p.price}
                          onChange={(e) =>
                            updatePricing(
                              i,
                              "price",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full bg-[#0F172A] border border-[#1E293B] text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7C3AED]/60"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1">
                          Storage (GB)
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={p.maxStorage}
                          onChange={(e) =>
                            updatePricing(
                              i,
                              "maxStorage",
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-full bg-[#0F172A] border border-[#1E293B] text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7C3AED]/60"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1">
                          Max Files
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={p.maxFiles}
                          onChange={(e) =>
                            updatePricing(
                              i,
                              "maxFiles",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full bg-[#0F172A] border border-[#1E293B] text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7C3AED]/60"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1">
                          Cycle
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={p.billingCycle}
                            onChange={(e) =>
                              updatePricing(i, "billingCycle", e.target.value)
                            }
                            className="flex-1 bg-[#0F172A] border border-[#1E293B] text-white rounded-lg px-2 py-2 text-sm outline-none focus:border-[#7C3AED]/60"
                          >
                            <option value="MONTHLY">Monthly</option>
                            <option value="YEARLY">Yearly</option>
                          </select>
                          {form.pricings.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePricing(i)}
                              className="text-[#EF4444] p-2"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
                >
                  <Check className="h-4 w-4" />{" "}
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Plan"
                      : "Create Plan"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[#94A3B8] hover:text-white text-sm font-bold px-6 py-2.5 rounded-xl border border-[#1E293B] hover:border-[#7C3AED]/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plans Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-[#1E293B]/20 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl py-20 text-center">
          <p className="text-[#4A5568] font-bold">
            No plans yet. Create your first plan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "bg-[#0F172A] border rounded-2xl p-6 relative",
                plan.isPopular ? "border-[#7C3AED]/50" : "border-[#1E293B]",
              )}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-4 bg-[#7C3AED] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Popular
                </span>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getPlanIcon(plan.name)}
                  <h3 className="text-lg font-black text-white">{plan.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-1.5 text-[#4A5568] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 rounded-lg transition-all"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id, plan.name)}
                    className="p-1.5 text-[#4A5568] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#4A5568] mb-4">{plan.description}</p>

              {plan.pricings?.map((p, pi) => (
                <div
                  key={pi}
                  className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-3 mb-2"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-black text-white">
                      ${p.price}
                      <span className="text-xs text-[#4A5568] font-normal">
                        /{p.billingCycle === "MONTHLY" ? "mo" : "yr"}
                      </span>
                    </span>
                    <span className="text-[10px] font-black text-[#7C3AED] uppercase">
                      {p.billingCycle}
                    </span>
                  </div>
                  <div className="flex gap-3 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      {(p.maxStorage / (1024 * 1024 * 1024)).toFixed(0)} GB
                    </span>
                    <span className="flex items-center gap-1">
                      <Files className="h-3 w-3" />
                      {p.maxFiles?.toLocaleString()} files
                    </span>
                  </div>
                </div>
              ))}

              {plan.planIncludes?.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {plan.planIncludes.slice(0, 3).map((f, fi) => (
                    <li
                      key={fi}
                      className="flex items-center gap-2 text-xs text-[#94A3B8]"
                    >
                      <Check className="h-3 w-3 text-[#22C55E] shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.planIncludes.length > 3 && (
                    <li className="text-xs text-[#4A5568]">
                      +{plan.planIncludes.length - 3} more
                    </li>
                  )}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
