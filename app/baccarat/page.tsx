'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function BaccaratPage() {
  const { data: session } = useSession()
  const [betOn, setBetOn] = useState('player')
  const [amount, setAmount] = useState(100)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const cardName = (n: number) => {
    if (n===1) return 'A'
    if (n===11) return 'J'
    if (n===12) return 'Q'
    if (n===13) return 'K'
    return String(n)
  }

  const playGame = async () => {
    setLoading(true)
    const res = await fetch('/api/baccarat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betOn, amount })
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
      <h1 style={{ fontSize:32, fontWeight:900, textAlign:'center', marginBottom:8 }}>🃏 BACCARAT</h1>
      <p style={{ textAlign:'center', color:'#94a3b8', marginBottom:32 }}>Player ya Banker — kaunsa jeeta?</p>

      {result && (
        <div style={{ maxWidth:500, margin:'0 auto', marginBottom:32 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            {[['Player', result.playerCards, result.playerTotal], ['Banker', result.bankerCards, result.bankerTotal]].map(([label, cards, total]: any) => (
              <div key={label} style={{ background:'#1e293b', borderRadius:12, padding:20, textAlign:'center' }}>
                <h3 style={{ color:'#94a3b8', marginBottom:12 }}>{label}</h3>
                <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:8 }}>
                  {cards.map((c: number, i: number) => (
                    <div key={i} style={{ background:'white', color:'#1e293b', borderRadius:8, padding:'10px 14px', fontSize:20, fontWeight:900 }}>{cardName(c)}</div>
                  ))}
                </div>
                <p style={{ fontSize:24, fontWeight:900, color:'#fbbf24' }}>Total: {total}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', padding:20, borderRadius:12, background: result.result==='win' ? '#166534' : '#991b1b' }}>
            <p style={{ fontSize:18, marginBottom:4 }}>Winner: <strong>{result.winner.toUpperCase()}</strong></p>
            <p style={{ fontSize:24, fontWeight:900 }}>
              {result.result==='win' ? `🎉 +₹${result.winAmount}` : `😢 -₹${Math.abs(result.winAmount)}`}
            </p>
            <p style={{ color:'#94a3b8', marginTop:4 }}>Balance: ₹{result.newBalance}</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth:400, margin:'0 auto', background:'#1e293b', borderRadius:12, padding:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
          {[['player','👤 Player','1x'],['banker','🏦 Banker','0.95x'],['tie','🤝 Tie','8x']].map(([val, label, mult]) => (
            <button key={val} onClick={() => setBetOn(val)}
              style={{ background: betOn===val ? '#7c3aed' : '#334155', color:'white', border: betOn===val ? '2px solid #a78bfa' : '2px solid transparent', borderRadius:8, padding:10, fontSize:13, fontWeight:700, cursor:'pointer' }}>
              <div>{label}</div>
              <div style={{ fontSize:11, marginTop:4, opacity:0.8 }}>{mult}</div>
            </button>
          ))}
        </div>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
          style={{ width:'100%', background:'#334155', color:'white', border:'none', borderRadius:8, padding:12, fontSize:16, marginBottom:12, boxSizing:'border-box' }}
          placeholder="Bet Amount (₹)" />
        <button onClick={playGame} disabled={loading}
          style={{ width:'100%', background:'#7c3aed', color:'white', border:'none', borderRadius:8, padding:14, fontWeight:900, fontSize:18, cursor:'pointer' }}>
          {loading ? 'Dealing...' : 'Deal Cards 🃏'}
        </button>
      </div>
    </div>
  )
}