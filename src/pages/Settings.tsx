import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { authService } from "../services/auth.service";
import { User, Lock, Trash2, Settings as SettingsIcon } from "lucide-react";

export function SettingsPage() {
  const { user, fetchProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    fetchProfile();
  }, []);

  // sync name after profile fetch
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);
  const [saving, setSaving] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  
  const isGoogleLogin = user?.accountType === "GOOGLE";

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success("Profile updated!");
      setSaving(false);
    }, 600);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setChangingPw(true);
    try {
      await authService.changePassword({ oldPassword, newPassword });
      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPw(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure? This cannot be undone.")) {
      toast.error("Account deletion request submitted.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <div className="flex items-center gap-2 text-[#7C3AED] mb-2 font-bold text-xs uppercase tracking-widest">
          <SettingsIcon className="h-4 w-4" /> Account
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-[#94A3B8] font-medium mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#7C3AED]/10 rounded-xl">
              <User className="h-5 w-5 text-[#7C3AED]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Profile</h2>
              <p className="text-xs text-[#4A5568]">Update your display name</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0B1220] border border-[#1E293B] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7C3AED]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-[#0B1220] border border-[#1E293B] text-[#4A5568] rounded-xl px-4 py-3 text-sm outline-none cursor-not-allowed"
              />
              <p className="text-xs text-[#4A5568] mt-1.5">Email cannot be changed</p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${user?.isEmailVerified ? "bg-[#22C55E]" : "bg-[#EF4444]"}`} />
                <span className="text-xs text-[#94A3B8]">{user?.isEmailVerified ? "Email verified" : "Email not verified"}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-sm font-bold py-3 rounded-xl transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#22D3EE]/10 rounded-xl">
              <Lock className="h-5 w-5 text-[#22D3EE]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Security</h2>
              <p className="text-xs text-[#4A5568]">Change your password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {isGoogleLogin && (
              <div className="bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-xl p-3 mb-4">
                <p className="text-xs text-[#22D3EE] font-bold">Password change is disabled for Google accounts.</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isGoogleLogin}
                className="w-full bg-[#0B1220] border border-[#1E293B] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7C3AED]/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isGoogleLogin}
                className="w-full bg-[#0B1220] border border-[#1E293B] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7C3AED]/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isGoogleLogin}
                className="w-full bg-[#0B1220] border border-[#1E293B] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7C3AED]/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              disabled={changingPw || isGoogleLogin}
              className="w-full border border-[#1E293B] hover:border-[#22D3EE]/50 hover:bg-[#22D3EE]/5 text-[#94A3B8] hover:text-white text-sm font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changingPw ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6">
        <h2 className="text-base font-black text-white mb-4">Account Info</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Account Type", value: user?.accountType || "EMAIL" },
            { label: "Role", value: user?.role || "USER" },
            { label: "Member Since", value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—" },
            { label: "Status", value: user?.isEmailVerified ? "Verified" : "Unverified" },
          ].map((item) => (
            <div key={item.label} className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-4">
              <p className="text-[10px] font-black text-[#4A5568] uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-sm font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#0F172A] border border-[#EF4444]/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#EF4444]/10 rounded-xl">
            <Trash2 className="h-5 w-5 text-[#EF4444]" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#EF4444]">Danger Zone</h2>
            <p className="text-xs text-[#4A5568]">Irreversible actions</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-xl p-4">
          <div>
            <p className="text-sm font-bold text-white">Delete Account</p>
            <p className="text-xs text-[#4A5568] mt-0.5">Permanently delete your account and all associated data.</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="shrink-0 bg-[#EF4444] hover:bg-[#DC2626] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors ml-4"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
