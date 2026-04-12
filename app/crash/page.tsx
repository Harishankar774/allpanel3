'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

export default function CrashGame() {
  const { data: session } = useSession()
  const [multiplier, setMultiplier] = useState(1.0)
  const [status, setStatus] = useState('waiting')
  const [amount, setAmount] = useState(100)
  const [betPlaced, setBetPlaced] = useState(false)
  const [cashedOut, setCashedOut] = useState(false)
  const [msg, setMsg] = useState('')
  const [history, setHistory] = useState<number[]>([])
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    intervalRef.current = setInterval(fetchGame, 200)
    return () => clearInterval(intervalRef.current)
  }, [])

  const fetchGame = async () => {
    const res = await fetch('/api/crash')
    const data = await res.json()
    setMultiplier(data.multiplier)
    setStatus(data.status)
    if (data.status === 'crashed') {
      setHistory(h => [data.multiplier, ...h].slice(0, 10))
      setBetPlaced(false)
      setCashedOut(false)
    }
  }

  const placeBet = async () => {
    const res = await fetch('/api/crash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'bet', amount })
    })
    const data = await res.json()
    if (data.success) { setBetPlaced(true); setMsg('Bet placed! 🎯') }
    else setMsg(data.error)
  }

  const cashOut = async () => {
    const res = await fetch('/api/crash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cashout' })
    })
    const data = await res.json()
    if (data.success) { setCashedOut(true); setMsg(`Won ₹${data.winAmount}! 🎉`) }
    else setMsg(data.error)
  }

  const startGame = async () => {
    await fetch('/api/crash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start' })
    })
  }

  const multiplierColor = status === 'crashed' ? '#ef4444' : multiplier >= 2 ? '#22c55e' : '#fbbf24'

  if (!session) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
      Please login first!
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24, textAlign: 'center' }}>🚀 CRASH GAME</h1>

      {/* History */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {history.map((h, i) => (
          <span key={i} style={{ background: h >= 2 ? '#166534' : '#991b1b', padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            {h.toFixed(2)}x
          </span>
        ))}
      </div>

      {/* Multiplier Display */}
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 48, textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: multiplierColor, transition: 'color 0.3s' }}>
          {status === 'crashed' ? '💥 CRASHED!' : `${multiplier.toFixed(2)}x`}
        </div>
        <div style={{ fontSize: 18, color: '#94a3b8', marginTop: 8 }}>
          {status === 'waiting' ? '⏳ Waiting for next round...' : status === 'running' ? '🚀 Flying!' : ''}
        </div>
      </div>

      {/* Controls */}
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 24, maxWidth: 400, margin: '0 auto' }}>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
          style={{ width: '100%', background: '#334155', color: 'white', border: 'none', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12, boxSizing: 'border-box' }}
          placeholder="Bet Amount (₹)" />

        {status === 'waiting' && !betPlaced && (
          <button onClick={placeBet}
            style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 8 }}>
            Place Bet 🎯
          </button>
        )}

        {status === 'running' && betPlaced && !cashedOut && (
          <button onClick={cashOut}
            style={{ width: '100%', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginBottom: 8 }}>
            Cash Out @ {multiplier.toFixed(2)}x 💰
          </button>
        )}

        {/* Admin Start Button */}
        {status === 'waiting' && (
          <button onClick={startGame}
            style={{ width: '100%', background: '#7c3aed', color: 'white', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            Start Game 🚀
          </button>
        )}

        {msg && <p style={{ color: '#fbbf24', marginTop: 12, textAlign: 'center', fontWeight: 700 }}>{msg}</p>}
      </div>
    </div>
  )
}