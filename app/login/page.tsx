"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);
    if (res?.error) setError("Invalid email/phone or password");
    else router.push("/home");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: "white", letterSpacing: -3, lineHeight: 1 }}>ALL</div>
          <div style={{ background: "#1d4ed8", display: "inline-block", padding: "2px 12px", borderRadius: 4, fontSize: 12, color: "white", fontWeight: 700, marginTop: 4 }}>PANEL</div>
          <h2 style={{ color: "white", fontSize: 22, fontWeight: 700, marginTop: 20 }}>Welcome Back</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>Sign in to your account</p>
        </div>

        <div style={{ background: "#1e293b", borderRadius: 16, padding: 32, border: "1px solid #334155" }}>
          {error && (
            <div style={{ background: "#7f1d1d22", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#f87171", fontSize: 13 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>Email / Phone</label>
              <input
                type="text" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email or phone"
                style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "11px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#334155"}
                required
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>Password</label>
              <input
                type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "11px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#334155"}
                required
              />
            </div>
            <button
              type="submit" disabled={loading}
              style={{ width: "100%", background: loading ? "#1d4ed888" : "#1d4ed8", color: "white", border: "none", borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", transition: "opacity 0.2s" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20, color: "#64748b", fontSize: 13 }}>
            <span>Demo: </span>
            <code style={{ background: "#0f172a", padding: "2px 6px", borderRadius: 4, color: "#fbbf24", fontSize: 12 }}>demo@allpanel.com / demo123</code>
          </div>

          <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, marginTop: 16 }}>
            Don't have account?{" "}
            <Link href="/register" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
