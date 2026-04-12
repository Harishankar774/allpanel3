'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function TeenPattiPage() {
  const { data: session } = useSession()
  const [amount, setAmount] = useState(100)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const playGame = async () => {
    setLoading(true)
    const res = await fetch('/api/teenpatti', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
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
      <h1 style={{ fontSize:32, fontWeight:900, textAlign:'center', marginBottom:32 }}>♠ TEEN PATTI</h1>

      {result && (
        <div style={{ maxWidth:600, margin:'0 auto', marginBottom:32 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <div style={{ background:'#1e293b', borderRadius:12, padding:20, textAlign:'center' }}>
              <h3 style={{ color:'#94a3b8', marginBottom:12 }}>Your Hand</h3>
              <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:8 }}>
                {result.playerHand?.map((card: any, i: number) => (
                  <div key={i} style={{ background:'white', color: card.suit === '♥' || card.suit === '♦' ? '#dc2626' : '#1e293b', borderRadius:8, padding:'12px 16px', fontSize:18, fontWeight:700, minWidth:50, textAlign:'center' }}>
                    <div>{card.value}</div>
                    <div>{card.suit}</div>
                  </div>
                ))}
              </div>
              <p style={{ color:'#fbbf24', fontWeight:700 }}>{result.playerRank}</p>
            </div>
            <div style={{ background:'#1e293b', borderRadius:12, padding:20, textAlign:'center' }}>
              <h3 style={{ color:'#94a3b8', marginBottom:12 }}>Dealer Hand</h3>
              <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:8 }}>
                {result.dealerHand?.map((card: any, i: number) => (
                  <div key={i} style={{ background:'white', color: card.suit === '♥' || card.suit === '♦' ? '#dc2626' : '#1e293b', borderRadius:8, padding:'12px 16px', fontSize:18, fontWeight:700, minWidth:50, textAlign:'center' }}>
                    <div>{card.value}</div>
                    <div>{card.suit}</div>
                  </div>
                ))}
              </div>
              <p style={{ color:'#fbbf24', fontWeight:700 }}>{result.dealerRank}</p>
            </div>
          </div>
          <div style={{ textAlign:'center', padding:20, borderRadius:12, background: result.result === 'win' ? '#166534' : result.result === 'loss' ? '#991b1b' : '#1e293b' }}>
            <p style={{ fontSize:24, fontWeight:900 }}>
              {result.result === 'win' ? '🎉 YOU WIN!' : result.result === 'loss' ? '😢 YOU LOSE!' : '🤝 DRAW!'}
            </p>
            <p style={{ fontSize:18, marginTop:8 }}>
              {result.result === 'win' ? `+₹${result.winAmount}` : result.result === 'loss' ? `-₹${Math.abs(result.winAmount)}` : 'No change'}
            </p>
            <p style={{ color:'#94a3b8', marginTop:4 }}>Balance: ₹{result.newBalance}</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth:400, margin:'0 auto', background:'#1e293b', borderRadius:12, padding:24 }}>
        <h2 style={{ fontSize:18, fontWeight:700, marginBottom:16, textAlign:'center' }}>Place Your Bet</h2>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
          style={{ width:'100%', background:'#334155', color:'white', border:'none', borderRadius:8, padding:12, fontSize:16, marginBottom:12, boxSizing:'border-box' }}
          placeholder="Bet Amount (₹)" />
        <button onClick={playGame} disabled={loading}
          style={{ width:'100%', background:'#7c3aed', color:'white', border:'none', borderRadius:8, padding:14, fontWeight:900, fontSize:18, cursor:'pointer' }}>
          {loading ? 'Dealing...' : 'Deal Cards ♠'}
        </button>
      </div>
    </div>
  )
}