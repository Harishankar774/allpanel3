'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function MatkaPage() {
  const { data: session } = useSession()
  const [number, setNumber] = useState<number | null>(null)
  const [amount, setAmount] = useState(100)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const playGame = async () => {
    if (number === null) return alert('Number chunein!')
    setLoading(true)
    const res = await fetch('/api/matka', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number, amount })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  if (!session) return (
    <div style={{ minHeight:'100vh', background:'#0f172a', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
      Please login first!
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', color:'white', padding:32 }}>
      <h1 style={{ fontSize:32, fontWeight:900, textAlign:'center', marginBottom:8 }}>🎲 MATKA</h1>
      <p style={{ textAlign:'center', color:'#94a3b8', marginBottom:32 }}>0-9 mein se ek number chunein — jeeto 9x!</p>

      {result && (
        <div style={{ maxWidth:400, margin:'0 auto', marginBottom:32, textAlign:'center', padding:24, borderRadius:12, background: result.result === 'win' ? '#166534' : '#991b1b' }}>
          <p style={{ fontSize:48, fontWeight:900 }}>{result.winningNumber}</p>
          <p style={{ fontSize:14, color:'#d1d5db', marginBottom:8 }}>Winning Number</p>
          <p style={{ fontSize:22, fontWeight:700 }}>
            {result.result === 'win' ? `🎉 +₹${result.winAmount}` : `😢 -₹${Math.abs(result.winAmount)}`}
          </p>
          <p style={{ color:'#94a3b8', marginTop:4 }}>Balance: ₹{result.newBalance}</p>
        </div>
      )}

      <div style={{ maxWidth:400, margin:'0 auto', background:'#1e293b', borderRadius:12, padding:24 }}>
        <h2 style={{ fontSize:16, fontWeight:700, marginBottom:16, textAlign:'center', color:'#94a3b8' }}>Number Chunein (0-9)</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8, marginBottom:16 }}>
          {[0,1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => setNumber(n)}
              style={{ background: number === n ? '#7c3aed' : '#334155', color:'white', border: number === n ? '2px solid #a78bfa' : '2px solid transparent', borderRadius:8, padding:12, fontSize:20, fontWeight:700, cursor:'pointer' }}>
              {n}
            </button>
          ))}
        </div>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
          style={{ width:'100%', background:'#334155', color:'white', border:'none', borderRadius:8, padding:12, fontSize:16, marginBottom:12, boxSizing:'border-box' }}
          placeholder="Bet Amount (₹)" />
        <button onClick={playGame} disabled={loading || number === null}
          style={{ width:'100%', background: number === null ? '#475569' : '#7c3aed', color:'white', border:'none', borderRadius:8, padding:14, fontWeight:900, fontSize:18, cursor: number === null ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Rolling...' : 'Play 🎲'}
        </button>
      </div>
    </div>
  )
}