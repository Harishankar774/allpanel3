"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <div style={{ minHeight: "100vh", background: "#0b0e14", color: "#e8ecf3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading…
      </div>
    );

  if (!session)
    return (
      <div style={{ minHeight: "100vh", background: "#0b0e14", color: "#e8ecf3", padding: 24 }}>
        <p>Please sign in.</p>
        <Link href="/login" style={{ color: "#e8c547" }}>
          Login
        </Link>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "#0b0e14", color: "#e8ecf3", padding: 24, maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Profile</h1>
      <div style={{ background: "#161b26", border: "1px solid #252d3a", borderRadius: 12, padding: 16 }}>
        <p style={{ margin: "8px 0", color: "#8b95a8", fontSize: 12 }}>Name</p>
        <p style={{ fontWeight: 700 }}>{session.user?.name || "—"}</p>
        <p style={{ margin: "16px 0 8px", color: "#8b95a8", fontSize: 12 }}>Email</p>
        <p style={{ fontWeight: 600 }}>{session.user?.email}</p>
      </div>
      <Link href="/home" style={{ display: "inline-block", marginTop: 24, color: "#e8c547", fontWeight: 700 }}>
        ← Back to Home
      </Link>
    </div>
  );
}
