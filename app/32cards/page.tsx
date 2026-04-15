import Link from "next/link";

export default function ThirtyTwoCardsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0b0e14", color: "#e8ecf3", padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>32 Cards</h1>
      <p style={{ color: "#8b95a8", lineHeight: 1.6, marginBottom: 16 }}>
        Card games are available in Teen Patti and Baccarat. Pick one below.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Link
          href="/teenpatti"
          style={{
            display: "block",
            textAlign: "center",
            background: "#1e3a6e",
            color: "white",
            fontWeight: 800,
            padding: "14px 20px",
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          Teen Patti
        </Link>
        <Link
          href="/baccarat"
          style={{
            display: "block",
            textAlign: "center",
            background: "#500724",
            color: "white",
            fontWeight: 800,
            padding: "14px 20px",
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          Baccarat
        </Link>
      </div>
      <div style={{ marginTop: 24 }}>
        <Link href="/home" style={{ color: "#e8c547", fontWeight: 600 }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
