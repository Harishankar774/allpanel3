import Link from "next/link";

export default function SupportPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0b0e14", color: "#e8ecf3", padding: 24, maxWidth: 560, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Help Center</h1>
      <p style={{ color: "#8b95a8", lineHeight: 1.6, marginBottom: 20 }}>
        For account, deposits, or betting questions, contact support through your agent or official channels. This is a demo help page.
      </p>
      <ul style={{ color: "#c9d1e0", lineHeight: 2, paddingLeft: 20 }}>
        <li>Check Rules from the main menu when available.</li>
        <li>Minimum bet and wallet limits apply as shown on each screen.</li>
        <li>Always verify odds on the bet slip before confirming.</li>
      </ul>
      <Link href="/home" style={{ display: "inline-block", marginTop: 28, color: "#e8c547", fontWeight: 700 }}>
        ← Back to Home
      </Link>
    </div>
  );
}
