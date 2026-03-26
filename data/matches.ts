export interface Match {
  id: string;
  name: string;
  datetime: string;
  sport: string;
  isLive: boolean;
  hasTv: boolean;
  hasFb: boolean;
  hasBM: boolean;
  hasStream: boolean;
  hasExchange: boolean;
  odds: {
    t1Back: number | null;
    t1Lay: number | null;
    drawBack: number | null;
    drawLay: number | null;
    t2Back: number | null;
    t2Lay: number | null;
    locked: boolean;
  };
}

export const cricketMatches: Match[] = [
  {
    id: "1", name: "Super Over2", datetime: "", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: false, hasBM: false, hasStream: false, hasExchange: false,
    odds: { t1Back: null, t1Lay: null, drawBack: null, drawLay: null, t2Back: null, t2Lay: null, locked: true }
  },
  {
    id: "2", name: "Warriors v Kwazulu Natal Inland", datetime: "21/03/2026 13:30:00", sport: "Cricket",
    isLive: true, hasTv: true, hasFb: true, hasBM: true, hasStream: false, hasExchange: false,
    odds: { t1Back: 1.22, t1Lay: 1.23, drawBack: null, drawLay: null, t2Back: 5.3, t2Lay: 5.5, locked: false }
  },
  {
    id: "3", name: "GAW XI v SLZ XI", datetime: "21/03/2026 15:10:00", sport: "Cricket",
    isLive: true, hasTv: true, hasFb: true, hasBM: true, hasStream: false, hasExchange: true,
    odds: { t1Back: null, t1Lay: null, drawBack: null, drawLay: null, t2Back: null, t2Lay: null, locked: true }
  },
  {
    id: "4", name: "Indian Premier League", datetime: "28/03/2026 19:30:00", sport: "Cricket",
    isLive: true, hasTv: false, hasFb: true, hasBM: false, hasStream: false, hasExchange: false,
    odds: { t1Back: null, t1Lay: null, drawBack: null, drawLay: null, t2Back: null, t2Lay: null, locked: true }
  },
  {
    id: "5", name: "Test A v Test B", datetime: "13/02/2026 16:00:00", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: false, hasBM: true, hasStream: false, hasExchange: false,
    odds: { t1Back: null, t1Lay: null, drawBack: null, drawLay: null, t2Back: null, t2Lay: null, locked: true }
  },
  {
    id: "6", name: "Pakistan T10 v New Zealand T10", datetime: "21/03/2026 13:30:00", sport: "Cricket",
    isLive: false, hasTv: true, hasFb: true, hasBM: false, hasStream: true, hasExchange: false,
    odds: { t1Back: null, t1Lay: null, drawBack: null, drawLay: null, t2Back: null, t2Lay: null, locked: true }
  },
  {
    id: "7", name: "Delhi Capitals XI v Lucknow Super Giants XI", datetime: "21/03/2026 15:35:00", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: true, hasBM: false, hasStream: false, hasExchange: true,
    odds: { t1Back: null, t1Lay: null, drawBack: null, drawLay: null, t2Back: null, t2Lay: null, locked: true }
  },
  {
    id: "8", name: "Boland v Lions", datetime: "21/03/2026 16:30:00", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: true, hasBM: false, hasStream: false, hasExchange: false,
    odds: { t1Back: 2.92, t1Lay: 2.96, drawBack: null, drawLay: null, t2Back: 1.51, t2Lay: 1.52, locked: false }
  },
  {
    id: "9", name: "West Indies W v Australia W", datetime: "21/03/2026 23:30:00", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: true, hasBM: true, hasStream: false, hasExchange: false,
    odds: { t1Back: 13.5, t1Lay: 15.5, drawBack: null, drawLay: null, t2Back: 1.07, t2Lay: 1.08, locked: false }
  },
  {
    id: "10", name: "New Zealand W v South Africa W", datetime: "22/03/2026 07:15:00", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: true, hasBM: true, hasStream: false, hasExchange: false,
    odds: { t1Back: 1.58, t1Lay: 1.64, drawBack: null, drawLay: null, t2Back: 2.56, t2Lay: 2.74, locked: false }
  },
  {
    id: "11", name: "New Zealand W v South Africa W", datetime: "22/03/2026 11:45:00", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: true, hasBM: true, hasStream: false, hasExchange: false,
    odds: { t1Back: 1.68, t1Lay: 1.69, drawBack: null, drawLay: null, t2Back: 2.44, t2Lay: 2.48, locked: false }
  },
  {
    id: "12", name: "Knights v Eastern Cape Linyathi", datetime: "22/03/2026 13:30:00", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: true, hasBM: false, hasStream: false, hasExchange: false,
    odds: { t1Back: 1.61, t1Lay: 1.89, drawBack: null, drawLay: null, t2Back: 2.12, t2Lay: 2.64, locked: false }
  },
  {
    id: "13", name: "Titans v North West Dragons", datetime: "22/03/2026 13:30:00", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: true, hasBM: false, hasStream: false, hasExchange: false,
    odds: { t1Back: 1.98, t1Lay: 2.04, drawBack: null, drawLay: null, t2Back: 1.97, t2Lay: 2.04, locked: false }
  },
  {
    id: "14", name: "Dolphins v Western Province", datetime: "22/03/2026 13:30:00", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: true, hasBM: false, hasStream: false, hasExchange: false,
    odds: { t1Back: 1.95, t1Lay: 2, drawBack: null, drawLay: null, t2Back: 2, t2Lay: 2.06, locked: false }
  },
  {
    id: "15", name: "RC Bengaluru v Sunrisers Hyderabad", datetime: "28/03/2026 19:30:00", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: true, hasBM: false, hasStream: false, hasExchange: false,
    odds: { t1Back: 1.82, t1Lay: 1.91, drawBack: null, drawLay: null, t2Back: 2.08, t2Lay: 2.22, locked: false }
  },
  {
    id: "16", name: "Mumbai Indians v Kolkata Knight Riders", datetime: "29/03/2026 18:30:00", sport: "Cricket",
    isLive: false, hasTv: false, hasFb: true, hasBM: false, hasStream: false, hasExchange: false,
    odds: { t1Back: 1.64, t1Lay: 1.65, drawBack: null, drawLay: null, t2Back: 2.52, t2Lay: 2.58, locked: false }
  },
];

export const footballMatches: Match[] = [
  {
    id: "f1", name: "Brighton v Liverpool", datetime: "21/03/2026 20:45:00", sport: "Football",
    isLive: true, hasTv: true, hasFb: true, hasBM: false, hasStream: false, hasExchange: false,
    odds: { t1Back: 4.20, t1Lay: 4.40, drawBack: 3.50, drawLay: 3.60, t2Back: 1.90, t2Lay: 1.95, locked: false }
  },
  {
    id: "f2", name: "Elche v Mallorca", datetime: "21/03/2026 18:30:00", sport: "Football",
    isLive: true, hasTv: false, hasFb: true, hasBM: false, hasStream: false, hasExchange: false,
    odds: { t1Back: 2.80, t1Lay: 2.90, drawBack: 3.20, drawLay: 3.30, t2Back: 2.50, t2Lay: 2.60, locked: false }
  },
  {
    id: "f3", name: "Bayern Munich v Union Berlin", datetime: "21/03/2026 17:30:00", sport: "Football",
    isLive: true, hasTv: true, hasFb: true, hasBM: true, hasStream: false, hasExchange: false,
    odds: { t1Back: 1.35, t1Lay: 1.38, drawBack: 5.50, drawLay: 5.80, t2Back: 8.00, t2Lay: 8.50, locked: false }
  },
  {
    id: "f4", name: "Manchester City v Arsenal", datetime: "22/03/2026 16:00:00", sport: "Football",
    isLive: false, hasTv: true, hasFb: true, hasBM: true, hasStream: false, hasExchange: false,
    odds: { t1Back: null, t1Lay: null, drawBack: null, drawLay: null, t2Back: null, t2Lay: null, locked: true }
  },
];

export const tennisMatches: Match[] = [
  {
    id: "t1", name: "Ivan Kolenciak v Zdenek Luksa", datetime: "21/03/2026 14:00:00", sport: "Tennis",
    isLive: true, hasTv: false, hasFb: true, hasBM: false, hasStream: false, hasExchange: false,
    odds: { t1Back: 1.45, t1Lay: 1.48, drawBack: null, drawLay: null, t2Back: 2.80, t2Lay: 2.90, locked: false }
  },
  {
    id: "t2", name: "Carlos Alcaraz v Novak Djokovic", datetime: "22/03/2026 19:00:00", sport: "Tennis",
    isLive: false, hasTv: true, hasFb: true, hasBM: true, hasStream: false, hasExchange: false,
    odds: { t1Back: null, t1Lay: null, drawBack: null, drawLay: null, t2Back: null, t2Lay: null, locked: true }
  },
];

export const liveMatchTicker = [
  { sport: "cricket", name: "Indian Premier League" },
  { sport: "football", name: "Brighton v Liverpool" },
  { sport: "football", name: "Elche v Mallorca" },
  { sport: "football", name: "Bayern Munich v Union Berlin" },
  { sport: "tennis", name: "Ivan Kolenciak - Zdenek Luksa" },
];

export const casinoGames = [
  { name: "MATKA", color: "#8B4513", emoji: "🎲" },
  { name: "VIP TEENPATTI 1DAY", color: "#1a237e", emoji: "♠" },
  { name: "PREMIUM CASINO", color: "#4a148c", emoji: "🃏" },
  { name: "MOGAMBO", color: "#b71c1c", emoji: "👊" },
  { name: "20-20 TEEN PATTI", color: "#1b5e20", emoji: "♣" },
  { name: "LUCKY 6", color: "#e65100", emoji: "🍀" },
  { name: "LIVE CASINO", color: "#880e4f", emoji: "🎰" },
  { name: "GOLDEN ROULETTE", color: "#f57f17", emoji: "⭕" },
  { name: "SLOT GAMES", color: "#006064", emoji: "🎮" },
  { name: "POISON TEENPATTI ONE DAY", color: "#33691e", emoji: "☠" },
];
