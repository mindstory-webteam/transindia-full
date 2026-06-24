import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMe, changePassword as apiChangePassword } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Loader2, User, Lock, Save, Mail, ShieldCheck } from "lucide-react";

const styles = `
  .settings-page {
    max-width: 768px;
    margin: 0 auto;
    padding: 24px 16px;
  }

  @media (min-width: 640px) {
    .settings-page { padding: 24px; }
  }

  @media (min-width: 1024px) {
    .settings-page { padding: 32px; }
  }

  .settings-header {
    margin-bottom: 24px;
  }

  .settings-header h1 {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #0f172a;
    margin: 0 0 4px 0;
  }

  .settings-header p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }

  .settings-stack {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Card */
  .settings-card {
    border-radius: 16px;
    border: 1px solid #e8edf3;
    background: #ffffff;
    padding: 24px;
    box-shadow: 0 1px 2px rgba(15,23,42,0.04);
  }

  .card-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    color: #F15A3E;
  }

  .card-heading h2 {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  /* Loading */
  .loading-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #94a3b8;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spin { animation: spin 0.8s linear infinite; }

  /* Account grid */
  .account-grid {
    display: grid;
    gap: 16px;
  }

  @media (min-width: 640px) {
    .account-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .account-field label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin-bottom: 6px;
  }

  .account-field p {
    font-size: 14px;
    color: #1e293b;
    margin: 0;
  }

  /* Password form */
  .password-grid {
    display: grid;
    gap: 16px;
  }

  @media (min-width: 640px) {
    .password-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .field-full { grid-column: 1 / -1; }

  .form-field label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
    margin-bottom: 6px;
  }

  .form-input {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #e8edf3;
    padding: 8px 12px;
    font-size: 14px;
    color: #1e293b;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .form-input:focus {
    border-color: #F8B4A4;
    box-shadow: 0 0 0 3px rgba(241,90,62,0.18);
  }

  /* Submit button */
  .save-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    border-radius: 10px;
    background: #F15A3E;
    color: #ffffff;
    padding: 9px 18px;
    font-size: 14px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(241,90,62,0.24);
    transition: background 0.15s;
  }

  .save-btn:hover:not(:disabled) { background: #DC4426; }
  .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export default function SettingsPage() {
  const { admin: adminFromContext, logout } = useAuth();
  const [admin, setAdmin] = useState(adminFromContext || null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [passwords, setPasswords] = useState({
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
    return () => { isMounted = false; };
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
      await apiChangePassword(passwords.newPassword);
      toast.success("Password changed successfully. Please log in again.");
      setPasswords({ newPassword: "", confirmPassword: "" });
      logout();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="settings-page">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your admin account.</p>
        </div>

        <div className="settings-stack">
          {/* Account Info */}
          <div className="settings-card">
            <div className="card-heading">
              <User size={17} />
              <h2>Account</h2>
            </div>

            {loadingMe ? (
              <div className="loading-row">
                <Loader2 size={15} className="spin" />
                Loading account info…
              </div>
            ) : (
              <div className="account-grid">
                <div className="account-field">
                  <label><User size={12} /> Name</label>
                  <p>{admin?.name || "—"}</p>
                </div>
                <div className="account-field">
                  <label><Mail size={12} /> Email</label>
                  <p>{admin?.email || "—"}</p>
                </div>
                {admin?.role && (
                  <div className="account-field">
                    <label><ShieldCheck size={12} /> Role</label>
                    <p style={{ textTransform: "capitalize" }}>{admin.role}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Change Password */}
          <form onSubmit={handlePasswordSubmit} className="settings-card">
            <div className="card-heading">
              <Lock size={17} />
              <h2>Change Password</h2>
            </div>

            <div className="password-grid">

              <div className="form-field">
                <label>New password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                  className="form-input"
                  required
                  minLength={6}
                />
              </div>
              <div className="form-field">
                <label>Confirm new password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className="form-input"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" disabled={savingPassword} className="save-btn">
              {savingPassword ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
              Update password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}