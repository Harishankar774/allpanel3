'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, bets: 0, balance: 0 })

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then((users: unknown) => {
      if (!Array.isArray(users)) return
      const totalBalance = users.reduce((a: number, u: { balance?: number }) => a + (u.balance || 0), 0)
      setStats(s => ({ ...s, users: users.length, balance: totalBalance }))
    })
    fetch('/api/admin/bets').then(r => r.json()).then((data: { bets?: unknown[]; weatherBets?: unknown[] }) => {
      const n = (data.bets?.length ?? 0) + (data.weatherBets?.length ?? 0)
      setStats(s => ({ ...s, bets: n }))
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg text-gray-400 mb-2">Total Users</h2>
          <p className="text-4xl font-bold text-blue-400">{stats.users}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg text-gray-400 mb-2">Total Bets</h2>
          <p className="text-4xl font-bold text-green-400">{stats.bets}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg text-gray-400 mb-2">Total Balance</h2>
          <p className="text-4xl font-bold text-yellow-400">₹{stats.balance}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Link href="/admin/users" className="bg-blue-600 hover:bg-blue-700 rounded-xl p-6 text-center text-xl font-bold">👥 Users</Link>
        <Link href="/admin/bets" className="bg-green-600 hover:bg-green-700 rounded-xl p-6 text-center text-xl font-bold">🎲 Bets</Link>
        <Link href="/admin/balance" className="bg-yellow-600 hover:bg-yellow-700 rounded-xl p-6 text-center text-xl font-bold">💰 Balance</Link>
        <Link href="/admin/settle" className="bg-purple-600 hover:bg-purple-700 rounded-xl p-6 text-center text-xl font-bold">⚖️ Settle</Link>
        <Link href="/admin/audit" className="bg-slate-600 hover:bg-slate-700 rounded-xl p-6 text-center text-xl font-bold">🛡️ Audit</Link>
      </div>
    </div>
  )
}