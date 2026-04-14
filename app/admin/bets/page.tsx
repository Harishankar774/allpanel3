"use client";
import { useEffect, useState } from "react";

export default function BetsPage() {
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bets")
      .then(r => r.json())
      .then(data => {
        // Array hai ya object — dono handle karo
        if (Array.isArray(data)) setBets(data);
        else if (Array.isArray(data.bets)) setBets(data.bets);
        else setBets([]);
        setLoading(false);
      })
      .catch(() => { setBets([]); setLoading(false); });
  }, []);

  if (loading) return <div style={{padding:40, textAlign:"center"}}>Loading...</div>;

  return (
    <div style={{padding:24}}>
      <h2 style={{marginBottom:16}}>All Bets</h2>
      {bets.length === 0 ? (
        <div style={{color:"#6b7280"}}>No bets found</div>
      ) : (
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:"#f3f4f6"}}>
              <th style={{padding:"10px",textAlign:"left",fontSize:13}}>User</th>
              <th style={{padding:"10px",textAlign:"left",fontSize:13}}>Game</th>
              <th style={{padding:"10px",textAlign:"left",fontSize:13}}>Team</th>
              <th style={{padding:"10px",textAlign:"left",fontSize:13}}>Amount</th>
              <th style={{padding:"10px",textAlign:"left",fontSize:13}}>Odds</th>
              <th style={{padding:"10px",textAlign:"left",fontSize:13}}>Status</th>
              <th style={{padding:"10px",textAlign:"left",fontSize:13}}>Date</th>
            </tr>
          </thead>
          <tbody>
            {bets.map((b: any) => (
              <tr key={b.id} style={{borderTop:"1px solid #e5e7eb"}}>
                <td style={{padding:"10px",fontSize:13}}>{b.user?.name || b.user?.email || "-"}</td>
                <td style={{padding:"10px",fontSize:13}}>{b.gameType || b.match?.name || "-"}</td>
                <td style={{padding:"10px",fontSize:13}}>{b.team || "-"}</td>
                <td style={{padding:"10px",fontSize:13}}>₹{b.amount}</td>
                <td style={{padding:"10px",fontSize:13}}>{b.odds || "-"}</td>
                <td style={{padding:"10px",fontSize:13}}>
                  <span style={{
                    background: b.status==="won" ? "#dcfce7" : b.status==="lost" ? "#fee2e2" : "#fef9c3",
                    color: b.status==="won" ? "#15803d" : b.status==="lost" ? "#dc2626" : "#854d0e",
                    padding:"2px 8px", borderRadius:4, fontSize:12, fontWeight:700
                  }}>{b.status || "pending"}</span>
                </td>
                <td style={{padding:"10px",fontSize:13}}>
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