import Link from "next/link";

export default function AgentPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0b0e14", color: "#e8ecf3", padding: 24, maxWidth: 560, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Agent</h1>
      <p style={{ color: "#8b95a8", lineHeight: 1.6 }}>
        Agent tools and commission reporting can be connected here later. This placeholder keeps the dashboard link working.
      </p>
      <Link href="/dashboard" style={{ display: "inline-block", marginTop: 28, color: "#e8c547", fontWeight: 700 }}>
        ← Back to Dashboard area
      </Link>
    </div>
  );
}
