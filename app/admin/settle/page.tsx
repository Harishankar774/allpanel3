"use client";

import { useEffect, useState } from "react";

type Candidate = {
  id: string;
  name: string;
  teamA: string;
  teamB: string;
  sport: string;
  startTime: string;
  pendingBets: number;
  pendingAmount: number;
};

export default function AdminSettlePage() {
  const [matchId, setMatchId] = useState("");
  const [winner, setWinner] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [bulkWinner, setBulkWinner] = useState("CANCELLED");
  const [sport, setSport] = useState("ALL");
  const [sports, setSports] = useState<string[]>([]);
  const [limit, setLimit] = useState(100);

  const loadCandidates = () => {
    const qs = new URLSearchParams({
      ...(sport !== "ALL" ? { sport } : {}),
      limit: String(limit),
    });
    fetch(`/api/admin/settle?${qs.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d.candidates) ? d.candidates : [];
        setCandidates(list);
        const dynamicSports = Array.from(new Set<string>(list.map((c: Candidate) => c.sport))).sort();
        setSports(dynamicSports);
      });
  };

  useEffect(() => {
    loadCandidates();
  }, [sport, limit]);

  const settle = async (path: string) => {
    setLoading(true);
    setMsg("");
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, winner }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(`Settled: ${data.updatedBets} bets (W:${data.winners}, L:${data.losers}, R:${data.refunded})`);
      loadCandidates();
    } else setMsg(data.error || "Failed");
    setLoading(false);
  };

  const settleQuick = async (id: string, selectedWinner: string) => {
    setMatchId(id);
    setWinner(selectedWinner);
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/admin/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: id, winner: selectedWinner }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(`Settled match ${id}: ${data.updatedBets} bets.`);
      loadCandidates();
    } else setMsg(data.error || "Failed");
    setLoading(false);
  };

  const runBulk = async () => {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/admin/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bulk: true, winner: bulkWinner, limit: 50, ...(sport !== "ALL" ? { sport } : {}) }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(`Bulk settled ${data.settledMatches} matches with winner=${bulkWinner}.`);
      loadCandidates();
    } else setMsg(data.error || "Bulk failed");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>Match Settlement</h1>
      <div style={{ background: "#1e293b", borderRadius: 12, padding: 16, maxWidth: 520 }}>
        <label style={{ display: "block", marginBottom: 8, color: "#94a3b8" }}>Match ID</label>
        <input
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "white", marginBottom: 12 }}
        />
        <label style={{ display: "block", marginBottom: 8, color: "#94a3b8" }}>Winner Team Name (or Draw / CANCELLED)</label>
        <input
          value={winner}
          onChange={(e) => setWinner(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "white", marginBottom: 16 }}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => settle("/api/admin/settle")} disabled={loading} style={{ background: "#7c3aed", color: "white", border: "none", borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}>
            Settle (Admin)
          </button>
        </div>
        {msg && <div style={{ marginTop: 12, color: "#fbbf24", fontWeight: 700 }}>{msg}</div>}
      </div>
      <div style={{ background: "#1e293b", borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ marginTop: 0, marginBottom: 10 }}>Bulk One-Click Settlement</h3>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <select value={sport} onChange={(e) => setSport(e.target.value)} style={{ background: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: 8, padding: 8 }}>
            <option value="ALL">All Sports</option>
            {sports.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            max={200}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value) || 100)}
            style={{ width: 90, background: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: 8, padding: 8 }}
          />
          <select value={bulkWinner} onChange={(e) => setBulkWinner(e.target.value)} style={{ background: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: 8, padding: 8 }}>
            <option value="CANCELLED">CANCELLED (refund all)</option>
            <option value="Draw">Draw</option>
          </select>
          <button onClick={runBulk} disabled={loading} style={{ background: "#334155", color: "white", border: "none", borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}>
            One-click Bulk Settle
          </button>
          <button onClick={loadCandidates} style={{ background: "#111827", color: "#cbd5e1", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}>
            Refresh List
          </button>
        </div>
      </div>
      <div style={{ background: "#1e293b", borderRadius: 12, overflow: "hidden", border: "1px solid #334155", marginTop: 12 }}>
        <div style={{ padding: 12, fontWeight: 700 }}>Completed Match Candidates (pending bets)</div>
        {candidates.length === 0 ? (
          <div style={{ padding: 12, color: "#94a3b8" }}>No eligible matches found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead style={{ background: "#111827" }}>
              <tr>
                <th style={{ textAlign: "left", padding: 10 }}>Match</th>
                <th style={{ textAlign: "left", padding: 10 }}>Pending</th>
                <th style={{ textAlign: "left", padding: 10 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #334155" }}>
                  <td style={{ padding: 10 }}>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div style={{ color: "#94a3b8", fontSize: 12 }}>{c.sport} • {new Date(c.startTime).toLocaleString("en-IN")}</div>
                  </td>
                  <td style={{ padding: 10 }}>
                    {c.pendingBets} bets / ₹{c.pendingAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => settleQuick(c.id, c.teamA)} disabled={loading} style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>{c.teamA}</button>
                    <button onClick={() => settleQuick(c.id, c.teamB)} disabled={loading} style={{ background: "#dc2626", color: "white", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>{c.teamB}</button>
                    <button onClick={() => settleQuick(c.id, "Draw")} disabled={loading} style={{ background: "#475569", color: "white", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>Draw</button>
                    <button onClick={() => settleQuick(c.id, "CANCELLED")} disabled={loading} style={{ background: "#7c3aed", color: "white", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
