import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

const LOGIN_STYLES = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .login-container {
    display: flex;
    min-height: 100vh;
    background: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  /* ── LEFT SIDE: Image/Video Background ── */
  .login-left {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Background Image */
  .login-left-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }

  /* Video Background */
  .login-left-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }

  /* Gradient Overlay */
  .login-left-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(7,23,74,0.92) 0%, rgba(15,40,71,0.88) 100%);
    z-index: 2;
  }

  .login-left-content {
    position: relative;
    z-index: 3;
    text-align: center;
    max-width: 420px;
    padding: 40px;
  }

  .login-logo {
    display: inline-block;
    margin-bottom: 30px;
  }

  .login-logo img {
    height: 60px;
    width: auto;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }

  .login-left h1 {
    color: #fff;
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 16px;
    line-height: 1.2;
  }

  .login-left p {
    color: rgba(255,255,255,0.78);
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 36px;
  }

  .login-benefits {
    display: flex;
    flex-direction: column;
    gap: 14px;
    text-align: left;
  }

  .benefit-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    color: rgba(255,255,255,0.85);
    font-size: 13px;
  }

  .benefit-icon {
    flex-shrink: 0;
    color: #38BDF8;
    margin-top: 2px;
  }

  /* ── RIGHT SIDE: Form Section ── */
  .login-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 40px;
    background: linear-gradient(180deg, #F8FAFC 0%, #fff 100%);
  }

  .login-form-wrapper {
    max-width: 420px;
    margin: 0 auto;
    width: 100%;
  }

  .login-form-header {
    margin-bottom: 32px;
  }

  .login-form-header h2 {
    color: #0F172A;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }

  .login-form-header p {
    color: #64748B;
    font-size: 14px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .form-label {
    color: #334155;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .form-input-wrapper {
    position: relative;
  }

  .form-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #E2E8F0;
    border-radius: 10px;
    background: #fff;
    color: #0F172A;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    transition: all 0.3s ease;
  }

  .form-input::placeholder {
    color: #CBD5E1;
  }

  .form-input:focus {
    border-color: #F15A3E;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(241,90,62,0.08);
  }

  .form-input-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #94A3B8;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
  }

  .form-input-icon:hover {
    color: #64748B;
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    margin-top: 4px;
  }

  .form-remember {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #475569;
    cursor: pointer;
    user-select: none;
  }

  .form-remember input {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #F15A3E;
    border-radius: 4px;
  }

  .form-forgot {
    color: #F15A3E;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
  }

  .form-forgot:hover {
    color: #DC4426;
  }

  .form-submit {
    padding: 13px 24px;
    background: linear-gradient(135deg, #F15A3E 0%, #FB7E54 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 10px 24px rgba(241,90,62,0.3);
    margin-top: 6px;
  }

  .form-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 32px rgba(241,90,62,0.4);
    background: linear-gradient(135deg, #DC4426 0%, #F15A3E 100%);
  }

  .form-submit:active:not(:disabled) {
    transform: translateY(0);
  }

  .form-submit:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }

  .form-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .login-footer {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #E2E8F0;
    text-align: center;
    color: #64748B;
    font-size: 12px;
  }

  .login-footer-title {
    color: #334155;
    font-weight: 700;
    margin-bottom: 6px;
    display: block;
  }

  .login-footer-creds {
    color: #64748B;
    font-size: 12px;
    font-family: 'Monaco', 'Courier New', monospace;
    line-height: 1.5;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .login-left { padding: 40px 30px; }
    .login-right { padding: 40px 30px; }
    .login-left h1 { font-size: 32px; }
  }

  @media (max-width: 768px) {
    .login-container { flex-direction: column; }
    
    .login-left {
      min-height: 280px;
      padding: 40px 24px;
      justify-content: center;
    }
    
    .login-left-content {
      max-width: 100%;
    }
    
    .login-left h1 { font-size: 26px; }
    .login-left p { font-size: 14px; margin-bottom: 24px; }
    
    .login-right { padding: 40px 24px; }
    .login-form-wrapper { max-width: 100%; }
    
    .login-benefits {
      gap: 12px;
      text-align: center;
    }
    
    .benefit-item {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .login-left {
      min-height: 220px;
      padding: 30px 16px;
    }
    
    .login-right { padding: 30px 16px; }
    
    .login-left h1 { 
      font-size: 22px; 
      margin-bottom: 12px; 
    }
    
    .login-left p { 
      font-size: 13px; 
      margin-bottom: 20px; 
    }
    
    .login-logo img { height: 50px; }
    
    .login-form-header h2 { font-size: 24px; }
    .login-form { gap: 16px; }
    .form-options { font-size: 12px; }
    .login-footer { font-size: 11px; }
  }

  /* ── REDUCED MOTION ── */
  @media (prefers-reduced-motion: reduce) {
    * { 
      animation: none !important; 
      transition: none !important; 
    }
  }
`;

export default function LoginPageWithVideo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style>{LOGIN_STYLES}</style>

      {/* ── LEFT SIDE: Background Image/Video ── */}
      <div className="login-left">
        {/* Option 1: Background Image */}
        <img
          className="login-left-bg"
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=1200&fit=crop"
          alt="Insurance office"
        />

        {/* Option 2: Video Background (uncomment to use)
        <video
          className="login-left-video"
          autoPlay
          muted
          loop
          src="https://your-video-url.mp4"
        />
        */}

        {/* Overlay */}
        <div className="login-left-overlay"></div>

        {/* Content */}
        <div className="login-left-content">
          <div className="login-logo">
            <img
              src="/logo/transindia.png"
              alt="TransIndia Insurance"
            />
          </div>

          <h1>TransIndia Insurance Admin</h1>
          <p>Modern solution for managing your insurance services and policies</p>

          <div className="login-benefits">
            <div className="benefit-item">
              <CheckCircle2 className="benefit-icon" size={18} />
              <span>Secure and encrypted authentication</span>
            </div>
            <div className="benefit-item">
              <CheckCircle2 className="benefit-icon" size={18} />
              <span>Real-time policy management dashboard</span>
            </div>
            <div className="benefit-item">
              <CheckCircle2 className="benefit-icon" size={18} />
              <span>Advanced analytics and reporting tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: Login Form ── */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <h2>Sign In</h2>
            <p>Access your admin dashboard securely</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrapper">
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@transindia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  className="form-input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="form-options">
              <label className="form-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                Remember me
              </label>
              <a href="/forgot-password" className="form-forgot">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="form-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="form-loading">
                  <span className="spinner"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <span className="login-footer-title">Demo Credentials</span>
            <div className="login-footer-creds">
              admin@transindia.com<br/>
              Admin@123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}