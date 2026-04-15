import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(/^[0-9]{10,15}$/),
  password: z.string().min(6).max(128),
  referralCode: z.string().trim().max(100).optional().nullable(),
});

export const adminBalanceSchema = z.object({
  email: z.string().trim().email(),
  amount: z.number().positive().finite(),
  type: z.enum(["add", "subtract"]),
});

export const placeBetSchema = z.object({
  matchId: z.string().trim().min(1),
  team: z.string().trim().min(1).max(100),
  betType: z.enum(["oddsA", "oddsALay", "oddsB", "oddsBLay", "oddsDraw", "oddsDraw2"]),
  amount: z.number().finite().min(10),
  odds: z.number().finite().positive(),
});

export const crashActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("bet"),
    amount: z.number().finite().positive().max(1000000),
  }),
  z.object({ action: z.literal("cashout") }),
  z.object({ action: z.literal("start") }),
]);

export const settleMatchSchema = z.object({
  matchId: z.string().trim().min(1),
  winner: z.string().trim().min(1).max(120),
});

export const settleBulkSchema = z.object({
  bulk: z.literal(true),
  winner: z.string().trim().min(1).max(120),
  limit: z.number().int().positive().max(200).optional(),
  sport: z.string().trim().min(1).max(50).optional(),
});

export const auditQuerySchema = z.object({
  type: z.enum(["ALL", "ADMIN_BALANCE_ADJUSTMENT", "BET_SETTLED_WIN", "BET_REFUND"]).optional(),
  user: z.string().trim().max(120).optional(),
  limit: z.number().int().positive().max(200).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const settleCandidatesQuerySchema = z.object({
  sport: z.string().trim().min(1).max(50).optional(),
  limit: z.number().int().positive().max(200).optional(),
});
