"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const C = {
  bg: "#0b0e14",
  surface: "#12161f",
  card: "#161b26",
  border: "#252d3a",
  muted: "#8b95a8",
  gold: "#e8c547",
  goldDim: "#b8860b",
  back: "#1d4ed8",
  lay: "#be123c",
  text: "#e8ecf3",
};

interface Match {
  id: string;
  sport: string;
  name: string;
  teamA: string;
  teamB: string;
  oddsA: number | null;
  oddsALay: number | null;
  oddsB: number | null;
  oddsBLay: number | null;
  oddsDraw: number | null;
  isLive: boolean;
  isLocked: boolean;
  status: string;
  startTime: string;
}

interface BetSlipItem {
  matchId: string;
  matchName: string;
  team: string;
  odds: number;
  stake: number;
  betType: string;
}

function liveLabel(sport: string, isLive: boolean): string {
  if (!isLive) return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (sport === "Cricket") return "13th Over";
  if (sport === "Football") return "78 min";
  if (sport === "Tennis") return "Set 2";
  return "Live";
}

function pickTeam(type: string, m: Match): string {
  if (type === "oddsDraw" || type === "oddsDraw2") return "Draw";
  if (type.startsWith("oddsA")) return m.teamA;
  if (type.startsWith("oddsB")) return m.teamB;
  return m.teamB;
}

// ---- HEADER (reference: hamburger, logo, profile, bell, gold wallet) ----
function TopHeader({
  balance,
  sidebarOpen,
  setSidebarOpen,
}: {
  balance: number;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const { data: session } = useSession();
  return (
    <header
      style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: "10px 12px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Menu"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.text,
              borderRadius: 8,
              width: 40,
              height: 40,
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ☰
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: C.text, letterSpacing: -1 }}>ALL</span>
            <span style={{ color: C.muted, fontSize: 16 }}>🔍</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {session ? (
            <>
              <Link
                href="/profile"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg,${C.gold},${C.goldDim})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#111",
                  fontWeight: 800,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                {(session.user?.name || session.user?.email || "?").charAt(0).toUpperCase()}
              </Link>
              <div style={{ position: "relative" }}>
                <span style={{ fontSize: 20, cursor: "pointer" }}>🔔</span>
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    background: "#dc2626",
                    color: "white",
                    fontSize: 10,
                    fontWeight: 800,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  1
                </span>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "6px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" style={{ color: C.gold, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              Login
            </Link>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 10,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            flex: 1,
            background: `linear-gradient(145deg, #2a2210 0%, #1a1508 100%)`,
            border: `1px solid ${C.goldDim}`,
            borderRadius: 10,
            padding: "12px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>Balance</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.gold }}>₹{balance.toFixed(2)}</div>
          </div>
          <Link
            href="/wallet"
            style={{
              background: C.gold,
              color: "#111",
              fontWeight: 800,
              fontSize: 13,
              padding: "8px 14px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Deposit
          </Link>
        </div>
      </div>
    </header>
  );
}

const TOP_NAV_LINKS: { label: string; href: string }[] = [
  { label: "HOME", href: "/home" },
  { label: "LOTTERY", href: "/lottery" },
  { label: "CRICKET", href: "/home?sport=Cricket" },
  { label: "TENNIS", href: "/home?sport=Tennis" },
  { label: "FOOTBALL", href: "/home?sport=Football" },
  { label: "TABLE TENNIS", href: "/home?sport=Table%20Tennis" },
  { label: "BACCARAT", href: "/baccarat" },
  { label: "32 CARDS", href: "/32cards" },
  { label: "TEENPATTI", href: "/teenpatti" },
  { label: "POKER", href: "/poker" },
  { label: "LUCKY 7", href: "/lucky7" },
  { label: "CRASH", href: "/crash" },
  { label: "WEATHER", href: "/weather" },
];

function TopNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sportQ = searchParams.get("sport");

  return (
    <nav
      style={{
        background: C.surface,
        display: "flex",
        overflowX: "auto",
        flexShrink: 0,
        borderBottom: `1px solid ${C.border}`,
        scrollbarWidth: "none",
      }}
    >
      {TOP_NAV_LINKS.map(({ label, href }) => {
        const u = new URL(href, "http://local");
        const isHomeSport = u.pathname === "/home" && u.searchParams.get("sport");
        const active =
          href === "/home"
            ? pathname === "/home" && !sportQ
            : isHomeSport
              ? pathname === "/home" && sportQ === u.searchParams.get("sport")
              : pathname === u.pathname;
        return (
          <Link
            key={label + href}
            href={href}
            style={{
              padding: "9px 14px",
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: "nowrap",
              flexShrink: 0,
              textDecoration: "none",
              background: active ? `${C.gold}22` : "transparent",
              color: active ? C.gold : C.muted,
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

const sidebarData = [
  { title: "Racing Sports", items: ["Horse Racing", "Greyhound Racing"] },
  {
    title: "Others",
    items: [
      "Our Casino",
      "Our VIP Casino",
      "Our Premium Casino",
      "Our Virtual",
      "Tembo",
      "Live Casino",
      "Slot Game",
      "Fantasy Game",
      "Teen Patti",
      "Matka",
      "Lucky 6",
      "Lucky 7",
      "Poker",
      "Baccarat",
      "Roulette",
      "Crash",
    ],
  },
  {
    title: "All Sports",
    items: ["Politics", "Cricket", "Football", "Tennis", "Table Tennis", "Badminton", "Esoccer", "Basketball", "Volleyball"],
    hasPlus: true,
  },
];

function SidebarDrawer({
  open,
  onClose,
  active,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  active: string;
  onSelect: (s: string) => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const gameRoutes: Record<string, string> = {
    "Teen Patti": "/teenpatti",
    Matka: "/matka",
    "Lucky 6": "/lucky6",
    "Lucky 7": "/lucky7",
    Poker: "/poker",
    Baccarat: "/baccarat",
    Roulette: "/roulette",
    Crash: "/crash",
  };
  if (!open) return null;
  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 2000,
        }}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: 260,
          background: C.surface,
          zIndex: 2001,
          overflowY: "auto",
          borderRight: `1px solid ${C.border}`,
          boxShadow: "8px 0 32px rgba(0,0,0,0.4)",
        }}
      >
        {sidebarData.map((sec) => (
          <div key={sec.title}>
            <button
              type="button"
              onClick={() => setCollapsed((p) => ({ ...p, [sec.title]: !p[sec.title] }))}
              style={{
                width: "100%",
                background: C.card,
                color: C.text,
                padding: "10px 12px",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                border: "none",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {sec.title} <span>{collapsed[sec.title] ? "▼" : "▲"}</span>
            </button>
            {!collapsed[sec.title] &&
              sec.items.map((item) => (
                <div
                  key={item}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (gameRoutes[item]) window.location.href = gameRoutes[item];
                    else onSelect(item);
                    onClose();
                  }}
                  style={{
                    padding: "10px 12px",
                    fontSize: 13,
                    color: active === item ? C.gold : C.muted,
                    background: active === item ? `${C.gold}14` : "transparent",
                    borderBottom: `1px solid ${C.border}`,
                    cursor: "pointer",
                  }}
                >
                  {(sec as { hasPlus?: boolean }).hasPlus && <span style={{ color: C.gold, marginRight: 6 }}>+</span>}
                  {item}
                </div>
              ))}
          </div>
        ))}
      </aside>
    </>
  );
}

const sportTabs = [
  { name: "All", icon: "⊞" },
  { name: "Cricket", icon: "🏏" },
  { name: "Football", icon: "⚽" },
  { name: "Tennis", icon: "🎾" },
  { name: "Table Tennis", icon: "🏓" },
  { name: "Live Casino", icon: "🎰" },
  { name: "Others", icon: "•••" },
];

function SportTabs({ active, onSelect }: { active: string; onSelect: (s: string) => void }) {
  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        background: C.bg,
        flexShrink: 0,
        padding: "8px 6px",
        gap: 6,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {sportTabs.map((tab) => {
        const sel = active === tab.name;
        return (
          <button
            key={tab.name}
            type="button"
            onClick={() => onSelect(tab.name)}
            style={{
              padding: "10px 12px",
              fontSize: 10,
              whiteSpace: "nowrap",
              border: sel ? `2px solid ${C.gold}` : `1px solid ${C.border}`,
              borderRadius: 10,
              background: sel ? `${C.gold}18` : C.card,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: sel ? C.gold : C.muted,
              fontWeight: sel ? 800 : 500,
              minWidth: 56,
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function MatchCard({
  m,
  onSelectBet,
  selected,
  setSelected,
  activeWager,
}: {
  m: Match;
  onSelectBet: (b: BetSlipItem) => void;
  selected: string | null;
  setSelected: (k: string | null) => void;
  activeWager: number;
}) {
  const sportIcon = m.sport === "Cricket" ? "🏏" : m.sport === "Football" ? "⚽" : m.sport === "Tennis" ? "🎾" : "🎯";

  const OddsBtn = ({
    val,
    type,
    color,
  }: {
    val: number | null;
    type: string;
    color: "back" | "lay";
  }) => {
    const key = `${m.id}-${type}`;
    const isSel = selected === key;
    const bg = isSel ? C.gold : color === "back" ? C.back : "#fda4af";
    const fg = isSel ? "#111" : color === "back" ? "white" : "#450a0a";
    if (!val)
      return (
        <div
          style={{
            background: C.border,
            color: C.muted,
            fontSize: 11,
            fontWeight: 700,
            textAlign: "center",
            padding: "8px 4px",
            borderRadius: 6,
          }}
        >
          —
        </div>
      );
    return (
      <button
        type="button"
        onClick={() => {
          setSelected(isSel ? null : key);
          if (!isSel)
            onSelectBet({
              matchId: m.id,
              matchName: m.name,
              team: pickTeam(type, m),
              odds: val,
              stake: 100,
              betType: type,
            });
        }}
        style={{
          width: "100%",
          background: bg,
          color: fg,
          border: isSel ? `2px solid ${C.gold}` : "none",
          fontSize: 12,
          fontWeight: 800,
          textAlign: "center",
          padding: "8px 4px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        {color === "back" ? "Back " : "Lay "}
        {val}
      </button>
    );
  };

  return (
    <div
      style={{
        background: C.card,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        margin: "10px 12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ flex: 1, padding: 12, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 18 }}>{sportIcon}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{m.sport}</span>
          {m.isLive && (
            <span
              style={{
                background: "#dc2626",
                color: "white",
                fontSize: 10,
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              LIVE
            </span>
          )}
          <span style={{ fontSize: 11, color: C.gold, marginLeft: "auto" }}>{liveLabel(m.sport, m.isLive)}</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 10 }}>{m.name}</div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>🔵</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{m.teamA}</div>
          </div>
          <div style={{ alignSelf: "center", color: C.muted, fontWeight: 800 }}>VS</div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>🔴</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{m.teamB}</div>
          </div>
        </div>

        {m.isLocked ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 12 }}>🔒 Suspended</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textAlign: "center" }}>Team 1</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <OddsBtn val={m.oddsA} type="oddsA" color="back" />
                <OddsBtn val={m.oddsALay} type="oddsALay" color="lay" />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textAlign: "center" }}>Team 2</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <OddsBtn val={m.oddsB} type="oddsB" color="back" />
                <OddsBtn val={m.oddsBLay} type="oddsBLay" color="lay" />
              </div>
            </div>
            {m.oddsDraw != null && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Draw</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, maxWidth: 200 }}>
                  <OddsBtn val={m.oddsDraw} type="oddsDraw" color="back" />
                  <OddsBtn val={null} type="oddsDraw2" color="lay" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        style={{
          width: 72,
          flexShrink: 0,
          background: C.bg,
          borderLeft: `1px solid ${C.border}`,
          padding: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", fontWeight: 700 }}>My Bets</div>
        <div style={{ fontSize: 10, color: C.muted }}>Active</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: C.gold }}>₹{activeWager.toFixed(0)}</div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>Win est.</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e" }}>—</div>
      </div>
    </div>
  );
}

function MatchList({
  matches,
  onSelectBet,
  exposure,
}: {
  matches: Match[];
  onSelectBet: (b: BetSlipItem) => void;
  exposure: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const perCard = exposure / Math.max(matches.length, 1);

  if (matches.length === 0)
    return (
      <div style={{ padding: 48, textAlign: "center", color: C.muted }}>
        <div style={{ fontSize: 40 }}>⚽</div>
        <div style={{ marginTop: 12, fontSize: 14 }}>No matches available for this sport</div>
      </div>
    );

  return (
    <div style={{ paddingBottom: 88 }}>
      {matches.map((m) => (
        <MatchCard
          key={m.id}
          m={m}
          onSelectBet={onSelectBet}
          selected={selected}
          setSelected={setSelected}
          activeWager={perCard}
        />
      ))}
    </div>
  );
}

function BetSlip({
  bet,
  onClose,
  onStakeChange,
  onPlace,
  placing,
}: {
  bet: BetSlipItem;
  onClose: () => void;
  onStakeChange: (v: number) => void;
  onPlace: () => void;
  placing: boolean;
}) {
  const returns = (bet.stake * bet.odds).toFixed(2);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 76,
        right: 12,
        left: 12,
        maxWidth: 360,
        margin: "0 auto",
        background: C.card,
        border: `2px solid ${C.gold}`,
        borderRadius: 12,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        zIndex: 1500,
      }}
    >
      <div
        style={{
          background: `linear-gradient(90deg, ${C.gold}33, transparent)`,
          color: C.text,
          padding: "10px 14px",
          borderRadius: "10px 10px 0 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 14 }}>Bet Slip</span>
        <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: C.text, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>
          ×
        </button>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ background: C.bg, borderRadius: 8, padding: "10px 12px", marginBottom: 12, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{bet.matchName}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{bet.team}</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: C.text }}>@ {bet.odds}</div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 4 }}>Stake (₹)</label>
          <input
            type="number"
            value={bet.stake}
            onChange={(e) => onStakeChange(Number(e.target.value))}
            min={10}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              background: C.bg,
              color: C.text,
            }}
          />
        </div>
        <div
          style={{
            background: "#14532d44",
            borderRadius: 8,
            padding: "8px 12px",
            marginBottom: 12,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            border: "1px solid #16653455",
          }}
        >
          <span style={{ color: C.muted }}>Potential</span>
          <strong style={{ color: "#4ade80" }}>₹{returns}</strong>
        </div>
        <button
          type="button"
          onClick={onPlace}
          disabled={placing}
          style={{
            width: "100%",
            background: placing ? C.border : C.gold,
            color: placing ? C.muted : "#111",
            border: "none",
            borderRadius: 8,
            padding: 12,
            fontWeight: 800,
            fontSize: 14,
            cursor: placing ? "not-allowed" : "pointer",
          }}
        >
          {placing ? "Placing..." : "Place Bet"}
        </button>
      </div>
    </div>
  );
}

const casinoGames = [
  { name: "MATKA", bg: "#5c1d0a", em: "🎲", href: "/matka" },
  { name: "VIP TEENPATTI", bg: "#1e3a6e", em: "♠", href: "/teenpatti" },
  { name: "SLOT GAMES", bg: "#3b0764", em: "👑", href: "/lucky7" },
  { name: "LUCKY 6", bg: "#713f12", em: "🍀", href: "/lucky6" },
  { name: "LIVE CASINO", bg: "#500724", em: "🎰", href: "/baccarat" },
  { name: "ROULETTE", bg: "#713f12", em: "⭕", href: "/roulette" },
];

function CasinoBanner() {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        overflowX: "auto",
        padding: "14px 12px 100px",
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      {casinoGames.map((g, i) => (
        <Link
          key={i}
          href={g.href}
          style={{
            flexShrink: 0,
            width: 140,
            height: 96,
            borderRadius: 12,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            textAlign: "center",
            fontSize: 11,
            padding: 8,
            background: g.bg,
            textDecoration: "none",
            border: `1px solid ${C.border}`,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 4 }}>{g.em}</div>
          <div style={{ lineHeight: 1.2 }}>{g.name}</div>
        </Link>
      ))}
    </div>
  );
}

function BottomNav() {
  const path = usePathname();
  const items = [
    { icon: "🏠", label: "Home", href: "/home" },
    { icon: "▶️", label: "In-Play", href: "/inplay" },
    { icon: "📋", label: "My Bets", href: "/mybets" },
    { icon: "🎰", label: "Casino", href: "/casino" },
    { icon: "👛", label: "Wallet", href: "/wallet" },
  ];
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0 12px",
        zIndex: 1000,
        boxShadow: "0 -4px 24px rgba(0,0,0,0.35)",
      }}
    >
      {items.map((item) => {
        const active = path === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              color: active ? C.gold : C.muted,
              fontSize: 10,
              gap: 4,
              fontWeight: active ? 800 : 500,
            }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default function HomePageContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [activeSport, setActiveSport] = useState("All");
  const [activeSidebar, setActiveSidebar] = useState("Cricket");
  const [matches, setMatches] = useState<Match[]>([]);
  const [searchPool, setSearchPool] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [betSlip, setBetSlip] = useState<BetSlipItem | null>(null);
  const [placing, setPlacing] = useState(false);
  const [betMsg, setBetMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchMatches = useCallback(async (sport: string) => {
    if (sport === "Live Casino" || sport === "Others") {
      setMatches([]);
      setFetchError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/matches?sport=${encodeURIComponent(sport)}`);
      if (!res.ok) {
        setFetchError("Could not load matches");
        setMatches([]);
        return;
      }
      const data = await res.json();
      setMatches(Array.isArray(data.matches) ? data.matches : []);
    } catch {
      setFetchError("Network error");
      setMatches([]);
    }
    setLoading(false);
  }, []);

  const fetchBalance = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/wallet");
      if (!res.ok) return;
      const data = await res.json();
      setBalance(data.balance || 0);
      setExposure(data.exposure || 0);
    } catch {
      /* ignore */
    }
  }, [session]);

  useEffect(() => {
    fetchMatches(activeSport);
  }, [activeSport, fetchMatches]);

  useEffect(() => {
    const sport = searchParams.get("sport");
    if (!sport) return;
    const decoded = decodeURIComponent(sport);
    if (decoded === "All" || sportTabs.some((tab) => tab.name === decoded)) {
      setActiveSport(decoded);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchPool([]);
      return;
    }
    const t = window.setTimeout(() => {
      fetch(`/api/matches?sport=${encodeURIComponent("All")}`)
        .then((r) => r.json())
        .then((d) => setSearchPool(Array.isArray(d.matches) ? d.matches : []))
        .catch(() => setSearchPool([]));
    }, 300);
    return () => window.clearTimeout(t);
  }, [searchQuery]);

  const filteredMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = q.length >= 2 ? searchPool : matches;
    if (!q) return base;
    return base.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.teamA.toLowerCase().includes(q) ||
        m.teamB.toLowerCase().includes(q) ||
        m.sport.toLowerCase().includes(q)
    );
  }, [matches, searchQuery, searchPool]);

  const handlePlaceBet = async () => {
    if (!session) {
      window.location.href = "/login";
      return;
    }
    if (!betSlip || betSlip.stake < 10) {
      setBetMsg("Minimum stake is ₹10");
      return;
    }
    setPlacing(true);
    setBetMsg("");
    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: betSlip.matchId,
          team: betSlip.team,
          betType: betSlip.betType,
          amount: betSlip.stake,
          odds: betSlip.odds,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBetMsg("✅ Bet placed successfully!");
        setBalance(typeof data.newBalance === "number" ? data.newBalance : balance - betSlip.stake);
        setBetSlip(null);
        fetchMatches(activeSport);
        fetchBalance();
        setTimeout(() => setBetMsg(""), 3000);
      } else setBetMsg(data.error || "Failed to place bet");
    } catch {
      setBetMsg("Network error");
    }
    setPlacing(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, color: C.text }}>
      <TopHeader balance={balance} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div style={{ padding: "0 12px 8px", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div
          style={{
            background: C.card,
            borderRadius: 10,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: `1px solid ${C.border}`,
          }}
        >
          <span style={{ color: C.muted }}>🔍</span>
          <input
            placeholder="Search for matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: C.text,
              fontSize: 14,
              width: "100%",
            }}
          />
        </div>
        {searchQuery.trim().length >= 2 && (
          <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Searching across all sports…</div>
        )}
        {session && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, color: C.muted }}>
            <span>
              Exp: ₹{exposure.toFixed(2)}
            </span>
            <Link href="/support" style={{ color: C.gold, textDecoration: "none", fontWeight: 600 }}>
              ❓ Help Center
            </Link>
          </div>
        )}
      </div>

      <SidebarDrawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        active={activeSidebar}
        onSelect={(s) => {
          setActiveSidebar(s);
          if (sportTabs.some((tab) => tab.name === s)) setActiveSport(s);
        }}
      />

      <TopNav />

      <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
        <div style={{ display: "flex", overflowX: "auto", borderBottom: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
          {["Indian Premier League 🏏", "Brighton v Liverpool ⚽", "Elche v Mallorca ⚽", "Bayern v Union ⚽", "Ivan v Zdenek 🎾"].map((t, i) => (
            <div
              key={i}
              style={{
                padding: "8px 14px",
                borderRight: `1px solid ${C.border}`,
                cursor: "pointer",
                flexShrink: 0,
                fontSize: 12,
                color: C.muted,
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </div>
          ))}
        </div>
        <SportTabs active={activeSport} onSelect={setActiveSport} />
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: "center", color: C.muted }}>
              <div style={{ fontSize: 32 }}>⏳</div>
              <div style={{ marginTop: 12 }}>Loading matches...</div>
            </div>
          ) : fetchError ? (
            <div style={{ padding: 48, textAlign: "center", color: "#f87171" }}>{fetchError}</div>
          ) : (
            <MatchList matches={filteredMatches} onSelectBet={setBetSlip} exposure={exposure} />
          )}
          <CasinoBanner />
        </div>
      </div>

      {betSlip && (
        <BetSlip
          bet={betSlip}
          onClose={() => setBetSlip(null)}
          onStakeChange={(v) => setBetSlip((b) => (b ? { ...b, stake: v } : null))}
          onPlace={handlePlaceBet}
          placing={placing}
        />
      )}

      {betMsg && (
        <div
          style={{
            position: "fixed",
            top: 72,
            left: 16,
            right: 16,
            textAlign: "center",
            background: betMsg.includes("✅") ? "#15803d" : "#dc2626",
            color: "white",
            padding: "12px 16px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            zIndex: 2000,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          {betMsg}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
