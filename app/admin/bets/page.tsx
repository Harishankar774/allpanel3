'use client'
import { useEffect, useState } from 'react'

export default function BetsPage() {
  const [bets, setBets] = useState([])

  useEffect(() => {
    fetch('/api/admin/bets').then(r => r.json()).then(setBets)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">All Bets</h1>
      <table className="w-full bg-gray-800 rounded-xl">
        <thead>
          <tr className="text-left">
            <th className="p-4">User</th>
            <th className="p-4">Game</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {bets.map((b: any) => (
            <tr key={b.id} className="border-t border-gray-700">
              <td className="p-4">{b.user?.name}</td>
              <td className="p-4">{b.gameType}</td>
              <td className="p-4">₹{b.amount}</td>
              <td className="p-4">{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}