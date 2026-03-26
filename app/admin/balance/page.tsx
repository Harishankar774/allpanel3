'use client'
import { useState } from 'react'

export default function BalancePage() {
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState('')

  const updateBalance = async (type: 'add' | 'deduct') => {
    const res = await fetch('/api/admin/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount: Number(amount), type })
    })
    const data = await res.json()
    setMsg(data.message || data.error)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Balance Management</h1>
      <div className="bg-gray-800 rounded-xl p-6 max-w-md">
        <input
          className="w-full bg-gray-700 rounded p-3 mb-4"
          placeholder="User Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full bg-gray-700 rounded p-3 mb-4"
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <div className="flex gap-4">
          <button
            onClick={() => updateBalance('add')}
            className="bg-green-600 px-6 py-3 rounded-lg flex-1"
          >Add</button>
          <button
            onClick={() => updateBalance('deduct')}
            className="bg-red-600 px-6 py-3 rounded-lg flex-1"
          >Deduct</button>
        </div>
        {msg && <p className="mt-4 text-yellow-400">{msg}</p>}
      </div>
    </div>
  )
}