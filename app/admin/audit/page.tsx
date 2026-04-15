"use client";

import { useEffect, useState } from "react";

type AuditItem = {
  id: string;
  type: string;
  amount: number;
  reference?: string | null;
  createdAt: string;
  user?: { name?: string | null; email?: string | null } | null;
};

export default function AdminAuditPage() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [type, setType] = useState("ALL");
  const [user, setUser] = useState("");
  const [limit, setLimit] = useState(50);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = () => {
    const fromIso = from ? new Date(`${from}T00:00:00.000Z`).toISOString() : "";
    const toIso = to ? new Date(`${to}T23:59:59.999Z`).toISOString() : "";
    const qs = new URLSearchParams({
      type,
      limit: String(limit),
      ...(user.trim() ? { user: user.trim() } : {}),
      ...(fromIso ? { from: fromIso } : {}),
      ...(toIso ? { to: toIso } : {}),
    });
    fetch(`/api/admin/audit?${qs.toString()}`)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d.items) ? d.items : []));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>Security Audit Trail</h1>
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 12, marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ background: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: 8, padding: 8 }}>
          <option value="ALL">All Types</option>
          <option value="ADMIN_BALANCE_ADJUSTMENT">Admin Balance</option>
          <option value="BET_SETTLED_WIN">Settled Win</option>
          <option value="BET_REFUND">Refund</option>
        </select>
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Filter by user name/email"
          style={{ background: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: 8, padding: 8, minWidth: 220 }}
        />
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={{ background: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: 8, padding: 8 }}
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ background: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: 8, padding: 8 }}
        />
        <input
          type="number"
          min={1}
          max={200}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value) || 50)}
          style={{ width: 90, background: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: 8, padding: 8 }}
        />
        <button onClick={load} style={{ background: "#7c3aed", color: "white", border: "none", borderRadius: 8, padding: "8px 12px", fontWeight: 700, cursor: "pointer" }}>
          Apply
        </button>
        <button
          onClick={() => {
            setType("ALL");
            setUser("");
            setFrom("");
            setTo("");
            setLimit(50);
            fetch("/api/admin/audit?type=ALL&limit=50")
              .then((r) => r.json())
              .then((d) => setItems(Array.isArray(d.items) ? d.items : []));
          }}
          style={{ background: "#111827", color: "#cbd5e1", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", fontWeight: 700, cursor: "pointer" }}
        >
          Reset
        </button>
      </div>
      <div style={{ background: "#1e293b", borderRadius: 12, overflow: "hidden", border: "1px solid #334155" }}>
        {items.length === 0 ? (
          <div style={{ padding: 20, color: "#94a3b8" }}>No audit records.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead style={{ background: "#111827" }}>
              <tr>
                <th style={{ textAlign: "left", padding: 10 }}>Type</th>
                <th style={{ textAlign: "left", padding: 10 }}>User</th>
                <th style={{ textAlign: "left", padding: 10 }}>Amount</th>
                <th style={{ textAlign: "left", padding: 10 }}>Reference</th>
                <th style={{ textAlign: "left", padding: 10 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} style={{ borderTop: "1px solid #334155" }}>
                  <td style={{ padding: 10 }}>{it.type}</td>
                  <td style={{ padding: 10 }}>{it.user?.name || it.user?.email || "-"}</td>
                  <td style={{ padding: 10, color: it.amount >= 0 ? "#22c55e" : "#f87171" }}>{it.amount}</td>
                  <td style={{ padding: 10, color: "#cbd5e1" }}>{it.reference || "-"}</td>
                  <td style={{ padding: 10, color: "#94a3b8" }}>{new Date(it.createdAt).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
