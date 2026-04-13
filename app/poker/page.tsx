'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function PokerPage() {
  const { data: session } = useSession()
  const [amount, setAmount] = useState(100)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const playGame = async () => {
    setLoading(true)
    const res = await fetch('/api/poker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const CardUI = ({ card }: { card: any }) => (
    <div style={{ background:'white', color: card.suit==='♥'||card.suit==='♦' ? '#dc2626' : '#1e293b', borderRadius:8, padding:'10px 14px', fontSize:16, fontWeight:700, textAlign:'center', minWidth:44, boxShadow:'0 2px 8px rgba(0,0,0,0.2)' }}>
      <div>{card.value}</div>
      <div>{card.suit}</div>
    </div>
  )

  if (!session) return (
    <div style={{ minHeight:'100vh', background:'#0f172a', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
      Please login first!
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', color:'white', padding:32 }}>
      <h1 style={{ fontSize:32, fontWeight:900, textAlign:'center', marginBottom:8 }}>🃏 POKER</h1>
      <p style={{ textAlign:'center', color:'#94a3b8', marginBottom:32 }}>5 card poker — Dealer ko beat karo!</p>

      {result && (
        <div style={{ maxWidth:600, margin:'0 auto', marginBottom:32 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <div style={{ background:'#1e293b', borderRadius:12, padding:20, textAlign:'center' }}>
              <h3 style={{ color:'#94a3b8', marginBottom:12 }}>Your Hand</h3>
              <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap', marginBottom:8 }}>
                {result.playerHand?.map((card: any, i: number) => <CardUI key={i} card={card} />)}
              </div>
              <p style={{ color:'#fbbf24', fontWeight:700 }}>{result.playerStrength}</p>
            </div>
            <div style={{ background:'#1e293b', borderRadius:12, padding:20, textAlign:'center' }}>
              <h3 style={{ color:'#94a3b8', marginBottom:12 }}>Dealer Hand</h3>
              <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap', marginBottom:8 }}>
                {result.dealerHand?.map((card: any, i: number) => <CardUI key={i} card={card} />)}
              </div>
              <p style={{ color:'#fbbf24', fontWeight:700 }}>{result.dealerStrength}</p>
            </div>
          </div>
          <div style={{ textAlign:'center', padding:20, borderRadius:12, background: result.result==='win' ? '#166534' : result.result==='loss' ? '#991b1b' : '#1e293b' }}>
            <p style={{ fontSize:24, fontWeight:900 }}>
              {result.result==='win' ? `🎉 +₹${result.winAmount}` : result.result==='loss' ? `😢 -₹${Math.abs(result.winAmount)}` : '🤝 DRAW!'}
            </p>
            <p style={{ color:'#94a3b8', marginTop:4 }}>Balance: ₹{result.newBalance}</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth:400, margin:'0 auto', background:'#1e293b', borderRadius:12, padding:24 }}>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
          style={{ width:'100%', background:'#334155', color:'white', border:'none', borderRadius:8, padding:12, fontSize:16, marginBottom:12, boxSizing:'border-box' }}
          placeholder="Bet Amount (₹)" />
        <button onClick={playGame} disabled={loading}
          style={{ width:'100%', background:'#16a34a', color:'white', border:'none', borderRadius:8, padding:14, fontWeight:900, fontSize:18, cursor:'pointer' }}>
          {loading ? 'Dealing...' : 'Deal Cards 🃏'}
        </button>
      </div>
    </div>
  )
}