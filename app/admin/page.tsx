'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, bets: 0, balance: 0 })

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(users => {
      const totalBalance = users.reduce((a: number, u: any) => a + u.balance, 0)
      setStats(s => ({ ...s, users: users.length, balance: totalBalance }))
    })
    fetch('/api/admin/bets').then(r => r.json()).then(bets => {
      setStats(s => ({ ...s, bets: bets.length }))
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/users" className="bg-blue-600 hover:bg-blue-700 rounded-xl p-6 text-center text-xl font-bold">👥 Users</Link>
        <Link href="/admin/bets" className="bg-green-600 hover:bg-green-700 rounded-xl p-6 text-center text-xl font-bold">🎲 Bets</Link>
        <Link href="/admin/balance" className="bg-yellow-600 hover:bg-yellow-700 rounded-xl p-6 text-center text-xl font-bold">💰 Balance</Link>
      </div>
    </div>
  )
}