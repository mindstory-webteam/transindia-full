import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMe, changePassword as apiChangePassword } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Loader2, User, Lock, Save, Mail, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const { admin: adminFromContext } = useAuth();
  const [admin, setAdmin] = useState(adminFromContext || null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await getMe();
        const meData = data?.admin ?? data?.data ?? data;
        if (isMounted) setAdmin(meData);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load account info");
      } finally {
        if (isMounted) setLoadingMe(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      await apiChangePassword(passwords.currentPassword, passwords.newPassword);
      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your admin account.</p>
      </div>

      <div className="space-y-6">
        {/* Account info (read-only — no edit-profile endpoint exists yet) */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <User size={17} className="text-indigo-600" />
            <h2 className="text-base font-semibold text-slate-900">Account</h2>
          </div>

          {loadingMe ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 size={15} className="animate-spin" />
              Loading account info…
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <User size={12} />
                  Name
                </label>
                <p className="text-sm text-slate-800">{admin?.name || "—"}</p>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <Mail size={12} />
                  Email
                </label>
                <p className="text-sm text-slate-800">{admin?.email || "—"}</p>
              </div>
              {admin?.role && (
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <ShieldCheck size={12} />
                    Role
                  </label>
                  <p className="text-sm capitalize text-slate-800">{admin.role}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Password */}
        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2">
            <Lock size={17} className="text-indigo-600" />
            <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Current password
              </label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                New password
              </label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Confirm new password
              </label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {savingPassword ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}