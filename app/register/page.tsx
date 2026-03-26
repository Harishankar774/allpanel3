"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", referralCode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) router.push("/login?registered=1");
    else setError(data.message || "Registration failed");
  };

  const fields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
    { key: "email", label: "Email", type: "email", placeholder: "your@email.com" },
    { key: "phone", label: "Phone Number", type: "tel", placeholder: "10-digit mobile number" },
    { key: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password" },
    { key: "referralCode", label: "Referral Code (Optional)", type: "text", placeholder: "Enter if you have one" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: "white", letterSpacing: -3, lineHeight: 1 }}>ALL</div>
          <div style={{ background: "#1d4ed8", display: "inline-block", padding: "2px 12px", borderRadius: 4, fontSize: 12, color: "white", fontWeight: 700, marginTop: 4 }}>PANEL</div>
          <h2 style={{ color: "white", fontSize: 22, fontWeight: 700, marginTop: 20 }}>Create Account</h2>
        </div>
        <div style={{ background: "#1e293b", borderRadius: 16, padding: 32, border: "1px solid #334155" }}>
          {error && <div style={{ background: "#7f1d1d22", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#f87171", fontSize: 13 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            {fields.map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 5 }}>{f.label}</label>
                <input
                  type={f.type} value={form[f.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  required={f.key !== "referralCode"}
                />
              </div>
            ))}
            <button
              type="submit" disabled={loading}
              style={{ width: "100%", background: "#1d4ed8", color: "white", border: "none", borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 8 }}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, marginTop: 16 }}>
            Already have account?{" "}
            <Link href="/login" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
