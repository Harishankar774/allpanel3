'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function RoulettePage() {
  const { data: session } = useSession()
  const [betType, setBetType] = useState('color')
  const [betValue, setBetValue] = useState('red')
  const [amount, setAmount] = useState(100)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [spinning, setSpinning] = useState(false)

  const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]

  const playGame = async () => {
    setLoading(true)
    setSpinning(true)
    setTimeout(() => setSpinning(false), 2000)
    const res = await fetch('/api/roulette', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betType, betValue, amount })
    })
    const data = await res.json()
    setTimeout(() => { setResult(data); setLoading(false) }, 2000)
  }

  if (!session) return (
    <div style={{ minHeight:'100vh', background:'#0f172a', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
      Please login first!
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', color:'white', padding:32 }}>
      <h1 style={{ fontSize:32, fontWeight:900, textAlign:'center', marginBottom:8 }}>⭕ ROULETTE</h1>
      <p style={{ textAlign:'center', color:'#94a3b8', marginBottom:24 }}>Number 0-36 — Apni bet lagao!</p>

      {/* Wheel Display */}
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:150, height:150, borderRadius:'50%', background: spinning ? '#fbbf24' : result ? (result.isRed ? '#dc2626' : result.spinResult === 0 ? '#16a34a' : '#1e293b') : '#334155', fontSize:64, fontWeight:900, transition:'background 0.5s', animation: spinning ? 'spin 0.3s linear infinite' : 'none', border:'6px solid #fbbf24' }}>
          {spinning ? '🎡' : result ? result.spinResult : '?'}
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>

      {result && !spinning && (
        <div style={{ maxWidth:400, margin:'0 auto', marginBottom:24, textAlign:'center', padding:20, borderRadius:12, background: result.result === 'win' ? '#166534' : '#991b1b' }}>
          <p style={{ fontSize:18, marginBottom:4 }}>Number: <strong>{result.spinResult}</strong> — {result.isRed ? '🔴 Red' : result.spinResult === 0 ? '🟢 Zero' : '⚫ Black'}</p>
          <p style={{ fontSize:24, fontWeight:900 }}>
            {result.result === 'win' ? `🎉 +₹${result.winAmount}` : `😢 -₹${Math.abs(result.winAmount)}`}
          </p>
          <p style={{ color:'#94a3b8', marginTop:4 }}>Balance: ₹{result.newBalance}</p>
        </div>
      )}

      <div style={{ maxWidth:500, margin:'0 auto', background:'#1e293b', borderRadius:12, padding:24 }}>
        {/* Bet Type */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:16 }}>
          {[['color','Color'],['evenodd','Even/Odd'],['half','Low/High'],['number','Number']].map(([val, label]) => (
            <button key={val} onClick={() => { setBetType(val); setBetValue(val==='color'?'red':val==='evenodd'?'even':val==='half'?'low':'0') }}
              style={{ background: betType===val ? '#7c3aed' : '#334155', color:'white', border: betType===val ? '2px solid #a78bfa' : '2px solid transparent', borderRadius:8, padding:10, fontSize:13, fontWeight:700, cursor:'pointer' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Bet Value */}
        {betType === 'color' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            {[['red','🔴 Red'],['black','⚫ Black']].map(([val, label]) => (
              <button key={val} onClick={() => setBetValue(val)}
                style={{ background: betValue===val ? (val==='red'?'#dc2626':'#374151') : '#334155', color:'white', border: betValue===val ? '2px solid white' : '2px solid transparent', borderRadius:8, padding:12, fontSize:16, fontWeight:700, cursor:'pointer' }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {betType === 'evenodd' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            {[['even','2️⃣ Even'],['odd','1️⃣ Odd']].map(([val, label]) => (
              <button key={val} onClick={() => setBetValue(val)}
                style={{ background: betValue===val ? '#7c3aed' : '#334155', color:'white', border: betValue===val ? '2px solid #a78bfa' : '2px solid transparent', borderRadius:8, padding:12, fontSize:16, fontWeight:700, cursor:'pointer' }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {betType === 'half' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            {[['low','📉 1-18'],['high','📈 19-36']].map(([val, label]) => (
              <button key={val} onClick={() => setBetValue(val)}
                style={{ background: betValue===val ? '#7c3aed' : '#334155', color:'white', border: betValue===val ? '2px solid #a78bfa' : '2px solid transparent', borderRadius:8, padding:12, fontSize:16, fontWeight:700, cursor:'pointer' }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {betType === 'number' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:16 }}>
            {Array.from({length:37},(_,i)=>i).map(n => (
              <button key={n} onClick={() => setBetValue(String(n))}
                style={{ background: betValue===String(n) ? '#fbbf24' : redNumbers.includes(n) ? '#dc2626' : n===0 ? '#16a34a' : '#374151', color:'white', border: betValue===String(n) ? '2px solid white' : '2px solid transparent', borderRadius:4, padding:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                {n}
              </button>
            ))}
          </div>
        )}

        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
          style={{ width:'100%', background:'#334155', color:'white', border:'none', borderRadius:8, padding:12, fontSize:16, marginBottom:12, boxSizing:'border-box' }}
          placeholder="Bet Amount (₹)" />
        <button onClick={playGame} disabled={loading}
          style={{ width:'100%', background:'#dc2626', color:'white', border:'none', borderRadius:8, padding:14, fontWeight:900, fontSize:18, cursor:'pointer' }}>
          {loading ? '🎡 Spinning...' : 'Spin ⭕'}
        </button>
      </div>
    </div>
  )
}