import Link from "next/link";

export default function LotteryPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0b0e14", color: "#e8ecf3", padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Lottery / Matka</h1>
      <p style={{ color: "#8b95a8", lineHeight: 1.6, marginBottom: 20 }}>
        Lottery draws run on the Matka game page. Use the button below to play.
      </p>
      <Link
        href="/matka"
        style={{
          display: "inline-block",
          background: "#e8c547",
          color: "#111",
          fontWeight: 800,
          padding: "12px 20px",
          borderRadius: 10,
          textDecoration: "none",
        }}
      >
        Open Matka
      </Link>
      <div style={{ marginTop: 24 }}>
        <Link href="/home" style={{ color: "#e8c547", fontWeight: 600 }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
