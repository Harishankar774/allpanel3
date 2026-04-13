'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Lucky7Page() {
  const { data: session } = useSession()
  const [betType, setBetType] = useState('under7')
  const [amount, setAmount] = useState(100)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const cardNames: Record<number, string> = {
    1:'A', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7',
    8:'8', 9:'9', 10:'10', 11:'J', 12:'Q', 13:'K'
  }

  const playGame = async () => {
    setLoading(true)
    const res = await fetch('/api/lucky7', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betType, amount })
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
      <h1 style={{ fontSize:32, fontWeight:900, textAlign:'center', marginBottom:8 }}>🎴 LUCKY 7</h1>
      <p style={{ textAlign:'center', color:'#94a3b8', marginBottom:32 }}>2 cards ka total 7 se upar, neeche ya exactly 7!</p>

      {result && (
        <div style={{ maxWidth:500, margin:'0 auto', marginBottom:32 }}>
          <div style={{ display:'flex', justifyContent:'center', gap:16, marginBottom:16 }}>
            {[result.card1, result.card2].map((card, i) => (
              <div key={i} style={{ background:'white', color:'#1e293b', borderRadius:12, padding:'20px 28px', fontSize:32, fontWeight:900, textAlign:'center', boxShadow:'0 4px 20px rgba(0,0,0,0.3)' }}>
                {cardNames[card]}
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', padding:20, borderRadius:12, background: result.result === 'win' ? '#166534' : '#991b1b' }}>
            <p style={{ fontSize:20, marginBottom:4 }}>Total: <strong>{result.total}</strong></p>
            <p style={{ fontSize:24, fontWeight:900 }}>
              {result.result === 'win' ? `🎉 +₹${result.winAmount}` : `😢 -₹${Math.abs(result.winAmount)}`}
            </p>
            <p style={{ color:'#94a3b8', marginTop:4 }}>Balance: ₹{result.newBalance}</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth:400, margin:'0 auto', background:'#1e293b', borderRadius:12, padding:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
          {[['under7','Under 7','2x'],['lucky7','Lucky 7','4x'],['over7','Over 7','2x']].map(([val, label, mult]) => (
            <button key={val} onClick={() => setBetType(val)}
              style={{ background: betType===val ? '#fbbf24' : '#334155', color: betType===val ? '#1e293b' : 'white', border: betType===val ? '2px solid #f59e0b' : '2px solid transparent', borderRadius:8, padding:12, fontSize:13, fontWeight:700, cursor:'pointer' }}>
              <div>{label}</div>
              <div style={{ fontSize:11, marginTop:4, opacity:0.8 }}>{mult}</div>
            </button>
          ))}
        </div>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
          style={{ width:'100%', background:'#334155', color:'white', border:'none', borderRadius:8, padding:12, fontSize:16, marginBottom:12, boxSizing:'border-box' }}
          placeholder="Bet Amount (₹)" />
        <button onClick={playGame} disabled={loading}
          style={{ width:'100%', background:'#fbbf24', color:'#1e293b', border:'none', borderRadius:8, padding:14, fontWeight:900, fontSize:18, cursor:'pointer' }}>
          {loading ? 'Dealing...' : 'Deal Cards 🎴'}
        </button>
      </div>
    </div>
  )
}