"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

// ---- TYPES ----
interface Match {
  id: string; sport: string; name: string;
  teamA: string; teamB: string;
  oddsA: number | null; oddsALay: number | null;
  oddsB: number | null; oddsBLay: number | null;
  oddsDraw: number | null;
  isLive: boolean; isLocked: boolean; status: string;
  startTime: string;
}
interface BetSlipItem { matchId: string; matchName: string; team: string; odds: number; stake: number; betType: string; }

// ---- HEADER ----
function Header({ balance, exposure, onLoginClick }: { balance: number; exposure: number; onLoginClick: () => void }) {
  const { data: session } = useSession();
  return (
    <header style={{ background: "#1a237e", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", flexShrink: 0 }}>
      <div style={{ fontSize: 52, fontWeight: 900, color: "white", letterSpacing: -3, lineHeight: 1 }}>ALL</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, color: "white", fontSize: 13 }}>
        <button style={{ background: "none", border: "none", color: "white", fontSize: 18, cursor: "pointer" }}>🔍</button>
        <span style={{ cursor: "pointer", textDecoration: "underline" }}>Rules</span>
        <span style={{ cursor: "pointer" }}>Download Apk <span style={{ color: "#ffd700" }}>♦</span></span>
        {session ? (
          <>
            <div style={{ textAlign: "right", lineHeight: 1.4, fontSize: 12 }}>
              <div>Balance:<strong style={{ color: "#ffd700" }}> ₹{balance.toFixed(0)}</strong></div>
              <div>Exp:<strong style={{ color: "#f87171" }}> ₹{exposure.toFixed(0)}</strong></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#93c5fd" }}>{session.user?.name}</span>
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                style={{ background: "#dc2626", color: "white", border: "none", borderRadius: 4, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/login" style={{ background: "transparent", color: "white", border: "1px solid white", borderRadius: 4, padding: "5px 14px", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Login</Link>
            <Link href="/register" style={{ background: "#ffd700", color: "#1a237e", border: "none", borderRadius: 4, padding: "5px 14px", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}

// ---- TOP NAV ----
const topNavItems = ["HOME","LOTTERY","CRICKET","TENNIS","FOOTBALL","TABLE TENNIS","BACCARAT","32 CARDS","TEENPATTI","POKER","LUCKY 7","🚀 CRASH"];

function TopNav({ active, onSelect }: { active: string; onSelect: (s: string) => void }) {
  return (
    <nav style={{ background: "#283593", display: "flex", overflowX: "auto", flexShrink: 0 }}>
      {topNavItems.map(item => (
        <button key={item} onClick={() => onSelect(item)}
          style={{ padding: "11px 18px", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, border: "none", cursor: "pointer", background: active === item ? "#fff" : "transparent", color: active === item ? "#1a237e" : "white", transition: "all 0.15s" }}>
          {item}
        </button>
      ))}
    </nav>
  );
}

// ---- LEFT SIDEBAR ----
const sidebarData = [
  { title: "Racing Sports", items: ["Horse Racing", "Greyhound Racing"] },
  { title: "Others", items: ["Our Casino","Our VIP Casino","Our Premium Casino","Our Virtual","Tembo","Live Casino","Slot Game","Fantasy Game"] },
  { title: "All Sports", items: ["Politics","Cricket","Football","Tennis","Table Tennis","Badminton","Esoccer","Basketball","Volleyball"], hasPlus: true },
];

function Sidebar({ active, onSelect }: { active: string; onSelect: (s: string) => void }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  return (
    <aside style={{ width: 220, background: "#fff", borderRight: "1px solid #e5e7eb", overflowY: "auto", flexShrink: 0 }}>
      {sidebarData.map(sec => (
        <div key={sec.title}>
          <div onClick={() => setCollapsed(p => ({ ...p, [sec.title]: !p[sec.title] }))}
            style={{ background: "#1565c0", color: "white", padding: "9px 12px", fontSize: 13, fontWeight: 700, display: "flex", justifyContent: "space-between", cursor: "pointer", userSelect: "none" }}>
            {sec.title} <span style={{ fontSize: 10 }}>{collapsed[sec.title] ? "▼" : "▲"}</span>
          </div>
          {!collapsed[sec.title] && sec.items.map(item => (
            <div key={item} onClick={() => onSelect(item)}
              style={{ padding: "8px 12px", fontSize: 13, color: active === item ? "#1d4ed8" : "#374151", background: active === item ? "#dbeafe" : "transparent", borderBottom: "1px solid #f3f4f6", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: active === item ? 600 : 400 }}>
              {(sec as any).hasPlus && <span style={{ color: "#2563eb", fontSize: 11, fontWeight: 900 }}>+</span>}
              {item}
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}

// ---- SPORT TABS ----
const sportTabs = ["Cricket","Football","Tennis","Table Tennis","Esoccer","Horse Racing","Greyhound Racing","Basketball","Wrestling","Volleyball","Badminton","Snooker","Darts","Boxing"];

function SportTabs({ active, onSelect }: { active: string; onSelect: (s: string) => void }) {
  return (
    <div style={{ display: "flex", overflowX: "auto", borderBottom: "2px solid #e5e7eb", background: "#fff", flexShrink: 0 }}>
      {sportTabs.map(tab => (
        <button key={tab} onClick={() => onSelect(tab)}
          style={{ padding: "10px 16px", fontSize: 13, whiteSpace: "nowrap", border: "none", background: "white", cursor: "pointer", borderBottom: active === tab ? "2px solid #1d4ed8" : "2px solid transparent", color: active === tab ? "#1d4ed8" : "#6b7280", fontWeight: active === tab ? 700 : 400, transition: "all 0.15s", marginBottom: -2 }}>
          {tab}
        </button>
      ))}
    </div>
  );
}

// ---- MATCH TABLE ----
function MatchTable({ matches, onSelectBet }: { matches: Match[]; onSelectBet: (b: BetSlipItem) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const OddsBtn = ({ val, type, match, color }: { val: number | null; type: string; match: Match; color: "pink" | "blue" }) => {
    const key = `${match.id}-${type}`;
    const isSelected = selected === key;
    const bg = isSelected ? "#1d4ed8" : color === "pink" ? "#ffcdd2" : "#bbdefb";
    const textColor = isSelected ? "white" : color === "pink" ? "#7f1d1d" : "#1e3a5f";
    if (!val) return <td style={{ padding: "4px 2px", width: 52 }}><div style={{ background: "#f3f4f6", color: "#9ca3af", fontSize: 11, fontWeight: 700, textAlign: "center", padding: "5px 4px", borderRadius: 3 }}>-</div></td>;
    return (
      <td style={{ padding: "4px 2px", width: 52 }}>
        <button onClick={() => {
            setSelected(isSelected ? null : key);
            if (!isSelected) onSelectBet({ matchId: match.id, matchName: match.name, team: type.includes("A") ? match.teamA : match.teamB, odds: val, stake: 100, betType: type });
          }}
          style={{ width: "100%", background: bg, color: textColor, border: isSelected ? "2px solid #1d4ed8" : "none", fontSize: 12, fontWeight: 700, textAlign: "center", padding: "5px 3px", borderRadius: 3, cursor: "pointer", transition: "all 0.1s" }}>
          {val}
        </button>
      </td>
    );
  };

  if (matches.length === 0) return (
    <div style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
      <div style={{ fontSize: 40 }}>⚽</div>
      <div style={{ marginTop: 12, fontSize: 14 }}>No matches available for this sport</div>
    </div>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #d1d5db" }}>
            <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Game</th>
            <th style={{ width: 90, fontSize: 12 }}></th>
            <th colSpan={2} style={{ background: "#ffcdd2", textAlign: "center", padding: "7px 4px", fontSize: 12, fontWeight: 700, color: "#7f1d1d", width: 104 }}>1</th>
            <th colSpan={2} style={{ textAlign: "center", padding: "7px 4px", fontSize: 12, fontWeight: 700, color: "#374151", width: 104 }}>X</th>
            <th colSpan={2} style={{ background: "#bbdefb", textAlign: "center", padding: "7px 4px", fontSize: 12, fontWeight: 700, color: "#1e3a5f", width: 104 }}>2</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m, i) => (
            <tr key={m.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#eff6ff")}
              onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#f9fafb")}>
              <td style={{ padding: "8px 12px" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{m.name}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{new Date(m.startTime).toLocaleString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
              </td>
              <td style={{ padding: "4px 8px", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center", flexWrap: "wrap" }}>
                  {m.isLive && <span style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>}
                  <span style={{ fontSize: 11, cursor: "pointer" }}>📺</span>
                  <span style={{ fontSize: 11, fontWeight: 900, color: "#1d4ed8", cursor: "pointer" }}>f</span>
                  <span style={{ background: "#1e3a8a", color: "white", fontSize: 9, padding: "1px 3px", borderRadius: 2, fontWeight: 700 }}>BM</span>
                </div>
              </td>
              {m.isLocked ? (
                <>
                  <td colSpan={2} style={{ textAlign: "center", padding: 4 }}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      {[0,1].map(k => <div key={k} style={{ background: "#f3f4f6", color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "5px 8px", borderRadius: 3, minWidth: 44 }}>🔒</div>)}
                    </div>
                  </td>
                  <td colSpan={2} style={{ textAlign: "center", color: "#d1d5db", fontSize: 12 }}>-</td>
                  <td colSpan={2} style={{ textAlign: "center", padding: 4 }}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      {[0,1].map(k => <div key={k} style={{ background: "#f3f4f6", color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "5px 8px", borderRadius: 3, minWidth: 44 }}>🔒</div>)}
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <OddsBtn val={m.oddsA} type="oddsA" match={m} color="pink" />
                  <OddsBtn val={m.oddsALay} type="oddsALay" match={m} color="pink" />
                  <OddsBtn val={m.oddsDraw} type="oddsDraw" match={m} color="blue" />
                  <OddsBtn val={null} type="oddsDraw2" match={m} color="blue" />
                  <OddsBtn val={m.oddsB} type="oddsB" match={m} color="blue" />
                  <OddsBtn val={m.oddsBLay} type="oddsBLay" match={m} color="blue" />
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- BET SLIP ----
function BetSlip({ bet, onClose, onStakeChange, onPlace, placing }: { bet: BetSlipItem; onClose: () => void; onStakeChange: (v: number) => void; onPlace: () => void; placing: boolean }) {
  const returns = (bet.stake * bet.odds).toFixed(2);
  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, width: 280, background: "white", border: "2px solid #1d4ed8", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", zIndex: 1000 }}>
      <div style={{ background: "#1d4ed8", color: "white", padding: "10px 14px", borderRadius: "10px 10px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Bet Slip</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ background: "#eff6ff", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>{bet.matchName}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>{bet.team}</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#1d4ed8" }}>{bet.odds}</div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Stake (₹)</label>
          <input type="number" value={bet.stake} onChange={e => onStakeChange(Number(e.target.value))} min={10}
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ background: "#f0fdf4", borderRadius: 6, padding: "8px 12px", marginBottom: 12, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "#6b7280" }}>Potential Win</span>
          <strong style={{ color: "#15803d" }}>₹{returns}</strong>
        </div>
        <button onClick={onPlace} disabled={placing}
          style={{ width: "100%", background: placing ? "#93c5fd" : "#1d4ed8", color: "white", border: "none", borderRadius: 6, padding: 11, fontWeight: 700, fontSize: 14, cursor: placing ? "not-allowed" : "pointer" }}>
          {placing ? "Placing..." : "Place Bet"}
        </button>
      </div>
    </div>
  );
}

// ---- CASINO BANNER ----
const casinoGames = [
  { name: "MATKA", bg: "#7c2d12", em: "🎲" }, { name: "VIP TEENPATTI 1DAY", bg: "#1e3a8a", em: "♠" },
  { name: "MOGAMBO", bg: "#7f1d1d", em: "👊" }, { name: "20-20 TEEN PATTI", bg: "#14532d", em: "♣" },
  { name: "LUCKY 6", bg: "#7c2d00", em: "🍀" }, { name: "LIVE CASINO", bg: "#500724", em: "🎰" },
  { name: "GOLDEN ROULETTE", bg: "#713f12", em: "⭕" }, { name: "POISON TEENPATTI", bg: "#1a2e05", em: "☠" },
  { name: "SLOT GAMES", bg: "#0c4a6e", em: "🎮" }, { name: "BACCARAT LIVE", bg: "#312e81", em: "🃏" },
];

function CasinoBanner() {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 12px", background: "#f1f5f9", borderTop: "1px solid #e5e7eb", flexShrink: 0 }}>
      {casinoGames.map((g, i) => (
        <div key={i}
          style={{ flexShrink: 0, width: 148, height: 88, borderRadius: 8, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, textAlign: "center", fontSize: 11, padding: 8, background: g.bg, transition: "transform 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
          <div style={{ fontSize: 26, marginBottom: 4 }}>{g.em}</div>
          <div style={{ lineHeight: 1.2 }}>{g.name}</div>
        </div>
      ))}
    </div>
  );
}

// ---- MAIN PAGE ----
export default function HomePage() {
  const { data: session } = useSession();
  const [activeSport, setActiveSport] = useState("Cricket");
  const [activeNav, setActiveNav] = useState("HOME");
  const [activeSidebar, setActiveSidebar] = useState("Cricket");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [betSlip, setBetSlip] = useState<BetSlipItem | null>(null);
  const [placing, setPlacing] = useState(false);
  const [betMsg, setBetMsg] = useState("");

  const fetchMatches = useCallback(async (sport: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/matches?sport=${sport}`);
      const data = await res.json();
      setMatches(data.matches || []);
    } catch {
      setMatches([]);
    }
    setLoading(false);
  }, []);

  const fetchBalance = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/wallet");
      const data = await res.json();
      setBalance(data.balance || 0);
      setExposure(data.exposure || 0);
    } catch {}
  }, [session]);

  useEffect(() => { fetchMatches(activeSport); }, [activeSport, fetchMatches]);
  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  const handlePlaceBet = async () => {
    if (!session) { window.location.href = "/login"; return; }
    if (!betSlip || betSlip.stake < 10) { setBetMsg("Minimum stake is ₹10"); return; }
    setPlacing(true);
    setBetMsg("");
    try {
      const res = await fetch("/api/bets", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: betSlip.matchId, team: betSlip.team, betType: betSlip.betType, amount: betSlip.stake, odds: betSlip.odds }),
      });
      const data = await res.json();
      if (data.success) {
        setBetMsg("✅ Bet placed successfully!");
        setBalance(data.newBalance || balance - betSlip.stake);
        setBetSlip(null);
        setTimeout(() => setBetMsg(""), 3000);
      } else setBetMsg(data.error || "Failed to place bet");
    } catch {
      setBetMsg("Network error");
    }
    setPlacing(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Header balance={balance} exposure={exposure} onLoginClick={() => {}} />
      <TopNav active={activeNav} onSelect={setActiveNav} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar active={activeSidebar} onSelect={s => { setActiveSidebar(s); if (sportTabs.includes(s)) setActiveSport(s); }} />
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#fff" }}>
          {/* Live Ticker */}
          <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #e5e7eb", background: "#fff", flexShrink: 0 }}>
            {["Indian Premier League 🏏","Brighton v Liverpool ⚽","Elche v Mallorca ⚽","Bayern Munich v Union Berlin ⚽","Ivan Kolenciak - Zdenek Luksa 🎾"].map((m, i) => (
              <div key={i} style={{ padding: "8px 16px", borderRight: "1px solid #e5e7eb", cursor: "pointer", flexShrink: 0, fontSize: 13, color: "#374151", whiteSpace: "nowrap" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                {m}
              </div>
            ))}
          </div>
          <SportTabs active={activeSport} onSelect={setActiveSport} />
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
                <div style={{ fontSize: 32 }}>⏳</div>
                <div style={{ marginTop: 12 }}>Loading matches...</div>
              </div>
            ) : (
              <MatchTable matches={matches} onSelectBet={setBetSlip} />
            )}
            <CasinoBanner />
          </div>
        </main>
      </div>

      {betSlip && (
        <BetSlip bet={betSlip} onClose={() => setBetSlip(null)}
          onStakeChange={v => setBetSlip(b => b ? { ...b, stake: v } : null)}
          onPlace={handlePlaceBet} placing={placing} />
      )}

      {betMsg && (
        <div style={{ position: "fixed", top: 80, right: 16, background: betMsg.includes("✅") ? "#15803d" : "#dc2626", color: "white", padding: "12px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, zIndex: 2000, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
          {betMsg}
        </div>
      )}
    </div>
  );
}
