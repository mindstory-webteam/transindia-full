import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

const LOGIN_STYLES = `
  .login-input:focus {
    border-color: #F15A3E !important;
    box-shadow: 0 0 0 3px rgba(241,90,62,0.22);
  }
  .login-submit { transition: background .15s ease, opacity .15s ease; }
  .login-submit:hover:not(:disabled) { background: #DC4426; }
`;

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <style>{LOGIN_STYLES}</style>
      <div style={{ width:"100%", maxWidth:400 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          {/* <div style={{ width:56, height:56, borderRadius:14, background:"linear-gradient(135deg, #F15A3E 0%, #FB7E54 100%)", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:12, boxShadow:"0 10px 24px rgba(241,90,62,0.38)" }}>
            <ShieldCheck size={28} color="#fff" />
          </div> */}
          <img
  src="/logo/transindia.png"
  alt="TransIndia"
  style={{ height: 56, marginBottom: 12, objectFit: "contain" }}
/>
          <h1 style={{ color:"#fff", fontSize:22, fontWeight:800, letterSpacing:"-0.02em" }}>TransIndia Admin</h1>
          <p style={{ color:"#64748B", fontSize:13, marginTop:4 }}>Sign in to manage your services</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} style={{ background:"#1E293B", borderRadius:16, padding:28 }}>
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", color:"#94A3B8", fontSize:12, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>
              Email Address
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="admin@transindia.com" className="login-input"
              style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:"1.5px solid #334155", background:"#0F172A", color:"#F1F5F9", fontSize:14, outline:"none", transition:"border-color .15s, box-shadow .15s" }}
            />
          </div>

          <div style={{ marginBottom:24, position:"relative" }}>
            <label style={{ display:"block", color:"#94A3B8", fontSize:12, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>
              Password
            </label>
            <div style={{ position:"relative" }}>
              <input
                type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••" className="login-input"
                style={{ width:"100%", padding:"11px 40px 11px 14px", borderRadius:8, border:"1.5px solid #334155", background:"#0F172A", color:"#F1F5F9", fontSize:14, outline:"none", transition:"border-color .15s, box-shadow .15s" }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#64748B", cursor:"pointer" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-submit"
            style={{ width:"100%", padding:"13px", background:"#F15A3E", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer", opacity: loading ? 0.7 : 1, boxShadow:"0 10px 22px rgba(241,90,62,0.3)" }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign:"center", color:"#334155", fontSize:12, marginTop:20 }}>
          Default: admin@transindia.com / Admin@123
        </p>
      </div>
    </div>
  );
}