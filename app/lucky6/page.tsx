'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Lucky6Page() {
  const { data: session } = useSession()
  const [prediction, setPrediction] = useState<'even'|'odd'>('even')
  const [amount, setAmount] = useState(100)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [rolling, setRolling] = useState(false)

  const playGame = async () => {
    setLoading(true)
    setRolling(true)
    setTimeout(() => setRolling(false), 1000)
    const res = await fetch('/api/lucky6', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prediction, amount })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const diceFaces: Record<number, string> = { 1:'⚀', 2:'⚁', 3:'⚂', 4:'⚃', 5:'⚄', 6:'⚅' }

  if (!session) return (
    <div style={{ minHeight:'100vh', background:'#0f172a', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
      Please login first!
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', color:'white', padding:32 }}>
      <h1 style={{ fontSize:32, fontWeight:900, textAlign:'center', marginBottom:8 }}>🍀 LUCKY 6</h1>
      <p style={{ textAlign:'center', color:'#94a3b8', marginBottom:32 }}>6 dice roll karo — Even ya Odd predict karo!</p>

      {result && (
        <div style={{ maxWidth:500, margin:'0 auto', marginBottom:32 }}>
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:16, fontSize: rolling ? 32 : 48, transition:'font-size 0.3s' }}>
            {result.dice.map((d: number, i: number) => (
              <span key={i} style={{ animation: rolling ? 'spin 0.5s linear infinite' : 'none' }}>{diceFaces[d]}</span>
            ))}
          </div>
          <div style={{ textAlign:'center', padding:20, borderRadius:12, background: result.result === 'win' ? '#166534' : '#991b1b' }}>
            <p style={{ fontSize:20, marginBottom:4 }}>Total: <strong>{result.total}</strong> — {result.actualResult.toUpperCase()}</p>
            <p style={{ fontSize:24, fontWeight:900 }}>
              {result.result === 'win' ? `🎉 +₹${result.winAmount}` : `😢 -₹${Math.abs(result.winAmount)}`}
            </p>
            <p style={{ color:'#94a3b8', marginTop:4 }}>Balance: ₹{result.newBalance}</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth:400, margin:'0 auto', background:'#1e293b', borderRadius:12, padding:24 }}>
        <h2 style={{ fontSize:16, fontWeight:700, marginBottom:16, textAlign:'center', color:'#94a3b8' }}>Even ya Odd?</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          {(['even', 'odd'] as const).map(p => (
            <button key={p} onClick={() => setPrediction(p)}
              style={{ background: prediction === p ? '#7c3aed' : '#334155', color:'white', border: prediction === p ? '2px solid #a78bfa' : '2px solid transparent', borderRadius:8, padding:16, fontSize:18, fontWeight:700, cursor:'pointer' }}>
              {p === 'even' ? '2️⃣ EVEN' : '1️⃣ ODD'}
            </button>
          ))}
        </div>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
          style={{ width:'100%', background:'#334155', color:'white', border:'none', borderRadius:8, padding:12, fontSize:16, marginBottom:12, boxSizing:'border-box' }}
          placeholder="Bet Amount (₹)" />
        <button onClick={playGame} disabled={loading}
          style={{ width:'100%', background:'#16a34a', color:'white', border:'none', borderRadius:8, padding:14, fontWeight:900, fontSize:18, cursor:'pointer' }}>
          {loading ? 'Rolling...' : 'Roll Dice 🎲'}
        </button>
      </div>
    </div>
  )
}