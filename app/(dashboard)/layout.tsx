"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Sports", href: "/sports" },
  { name: "Casino", href: "/casino" },
  { name: "Wallet", href: "/wallet" },
  { name: "SMM Panel", href: "/smm" },
  { name: "Agent", href: "/agent" },
  { name: "Profile", href: "/profile" },
  { name: "Support", href: "/support" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/wallet")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.balance === "number") setBalance(d.balance);
      })
      .catch(() => {});
  }, [session]);

  return (
    <div className="flex min-h-screen bg-[#0a0f1e] text-white">
      <aside className="w-72 border-r border-slate-800 bg-[#111827] p-5">
        <h2 className="text-2xl font-black text-[#f59e0b]">AllPanel</h2>
        <div className="mt-6 rounded-xl bg-[#1e293b] p-4">
          <p className="text-xs uppercase text-slate-400">Available Balance</p>
          <p className="mt-1 text-2xl font-extrabold text-[#f59e0b]">
            {balance !== null ? `₹${balance.toFixed(2)}` : "—"}
          </p>
        </div>
        <nav className="mt-6 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "block rounded-lg px-3 py-2 text-sm font-semibold transition",
                  active ? "bg-[#f59e0b]/20 text-[#f59e0b] ring-1 ring-[#f59e0b]/30" : "text-slate-200 hover:bg-slate-800 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
