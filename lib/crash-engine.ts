export type CrashStatus = "waiting" | "running" | "crashed";

type CrashPlayer = {
  userId: string;
  amount: number;
  cashedOut: boolean;
  cashOutAt?: number;
};

class CrashEngine {
  private status: CrashStatus = "waiting";
  private crashPoint = 1.0;
  private startTs = 0;
  private players: CrashPlayer[] = [];
  private history: number[] = [];

  private generateCrashPoint() {
    const r = Math.random();
    if (r < 0.01) return 1.0;
    return Math.max(1.0, (1 / (1 - r)) * 0.97);
  }

  getMultiplier() {
    if (this.status === "crashed") return this.crashPoint;
    if (this.status !== "running" || !this.startTs) return 1.0;

    const elapsed = Date.now() - this.startTs;
    const steps = Math.floor(elapsed / 100);
    const m = Math.min(parseFloat((1 + steps * 0.01).toFixed(2)), this.crashPoint);

    if (m >= this.crashPoint) {
      this.history = [this.crashPoint, ...this.history].slice(0, 20);
      // End round: clear players immediately so the same user can bet the next round
      // (otherwise players[] blocks canPlaceBet until the old reset timer fired).
      this.players = [];
      this.status = "waiting";
      this.startTs = 0;
    }

    return m;
  }

  getState() {
    const multiplier = this.getMultiplier();
    return {
      status: this.status,
      multiplier,
      players: this.players.length,
      crashPoint: this.status === "running" ? this.crashPoint : undefined,
      history: this.history,
    };
  }

  canPlaceBet(userId: string) {
    return this.status === "waiting" && !this.players.some((p) => p.userId === userId);
  }

  placeBet(userId: string, amount: number) {
    if (!this.canPlaceBet(userId)) return false;
    this.players.push({ userId, amount, cashedOut: false });
    return true;
  }

  cashout(userId: string) {
    if (this.status !== "running") return { ok: false as const };
    const player = this.players.find((p) => p.userId === userId);
    if (!player || player.cashedOut) return { ok: false as const };

    const mult = this.getMultiplier();
    player.cashedOut = true;
    player.cashOutAt = mult;
    return { ok: true as const, multiplier: mult, amount: player.amount };
  }

  startRound() {
    if (this.status !== "waiting" || this.players.length === 0) return false;
    this.crashPoint = this.generateCrashPoint();
    this.status = "running";
    this.startTs = Date.now();
    return true;
  }
}

export const crashEngine = new CrashEngine();
