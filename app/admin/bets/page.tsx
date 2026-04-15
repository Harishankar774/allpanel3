"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  team?: string;
  amount?: number;
  odds?: number;
  status?: string;
  createdAt?: string;
  user?: { name?: string; email?: string };
  match?: { name?: string };
};

export default function AdminBetsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/bets")
      .then((r) => r.json())
      .then((data: { bets?: Row[]; weatherBets?: any[]; error?: string }) => {
        if (data.error) {
          setRows([]);
          setLoading(false);
          return;
        }
        const sports = data.bets || [];
        const weather = (data.weatherBets || []).map(
          (w: { id: string; user?: Row["user"]; city?: string; betType?: string; prediction?: string; amount?: number; status?: string; createdAt?: string }) => ({
            id: w.id,
            user: w.user,
            team: w.prediction,
            amount: w.amount,
            odds: undefined,
            status: w.status,
            createdAt: w.createdAt,
            match: { name: `${w.city || "?"} (${w.betType || "weather"})` },
          })
        );
        setRows([...sports, ...weather]);
        setLoading(false);
      })
      .catch(() => {
        setRows([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>All Bets</h2>
      {rows.length === 0 ? (
        <div style={{ color: "#6b7280" }}>No bets found</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ padding: "10px", textAlign: "left", fontSize: 13 }}>User</th>
              <th style={{ padding: "10px", textAlign: "left", fontSize: 13 }}>Game</th>
              <th style={{ padding: "10px", textAlign: "left", fontSize: 13 }}>Team</th>
              <th style={{ padding: "10px", textAlign: "left", fontSize: 13 }}>Amount</th>
              <th style={{ padding: "10px", textAlign: "left", fontSize: 13 }}>Odds</th>
              <th style={{ padding: "10px", textAlign: "left", fontSize: 13 }}>Status</th>
              <th style={{ padding: "10px", textAlign: "left", fontSize: 13 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "10px", fontSize: 13 }}>{b.user?.name || b.user?.email || "-"}</td>
                <td style={{ padding: "10px", fontSize: 13 }}>{b.match?.name || "-"}</td>
                <td style={{ padding: "10px", fontSize: 13 }}>{b.team || "-"}</td>
                <td style={{ padding: "10px", fontSize: 13 }}>₹{b.amount ?? "-"}</td>
                <td style={{ padding: "10px", fontSize: 13 }}>{b.odds ?? "-"}</td>
                <td style={{ padding: "10px", fontSize: 13 }}>
                  <span
                    style={{
                      background: b.status === "WON" || b.status === "won" ? "#dcfce7" : b.status === "LOST" || b.status === "lost" ? "#fee2e2" : "#fef9c3",
                      color: b.status === "WON" || b.status === "won" ? "#15803d" : b.status === "LOST" || b.status === "lost" ? "#dc2626" : "#854d0e",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {b.status || "pending"}
                  </span>
                </td>
                <td style={{ padding: "10px", fontSize: 13 }}>
                  {b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN") : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
