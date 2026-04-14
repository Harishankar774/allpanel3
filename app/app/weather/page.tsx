'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function WeatherPage() {
  const { data: session } = useSession()
  const [weather, setWeather] = useState<any>(null)
  const [city, setCity] = useState('VIDP')
  const [betType, setBetType] = useState('temperature')
  const [prediction, setPrediction] = useState('above')
  const [amount, setAmount] = useState(100)
  const [bets, setBets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchWeather() }, [city])
  useEffect(() => { if(session) fetchBets() }, [session])

  const fetchWeather = async () => {
    const res = await fetch(`/api/weather?icao=${city}`)
    const data = await res.json()
    if (data.data?.[0]) setWeather(data.data[0])
  }

  const fetchBets = async () => {
    const res = await fetch('/api/weather/bet')
    const data = await res.json()
    if (Array.isArray(data)) setBets(data)
  }

  const placeBet = async () => {
    setLoading(true)
    const res = await fetch('/api/weather/bet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, betType, prediction, amount })
    })
    const data = await res.json()
    setMsg(data.error || 'Bet placed!')
    fetchBets()
    setLoading(false)
  }

  if (!session) return (
    <div style={{ minHeight: '100vh', background: '#111827', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
      Please login first!
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#111827', color: 'white', padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>🌡️ Weather Prediction Game</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={{ background: '#1f2937', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Live Weather</h2>
          <select value={city} onChange={e => setCity(e.target.value)}
            style={{ background: '#374151', color: 'white', borderRadius: 6, padding: 8, width: '100%', marginBottom: 16, border: 'none' }}>
            <option value="VIDP">Delhi</option>
            <option value="VABB">Mumbai</option>
            <option value="VOBL">Bangalore</option>
            <option value="VOMM">Chennai</option>
            <option value="VECC">Kolkata</option>
          </select>
          {weather ? (
            <div style={{ lineHeight: 2 }}>
              <p>🌡️ Temperature: <strong style={{ color: '#fbbf24' }}>{weather.temperature?.celsius}°C</strong></p>
              <p>💨 Wind: <strong style={{ color: '#60a5fa' }}>{weather.wind?.speed_kts} kt</strong></p>
              <p>👁️ Visibility: <strong style={{ color: '#34d399' }}>{weather.visibility?.meters}m</strong></p>
              <p>☁️ Conditions: <strong>{weather.conditions?.[0]?.text || 'Clear'}</strong></p>
            </div>
          ) : <p style={{ color: '#9ca3af' }}>Loading weather data...</p>}
        </div>
        <div style={{ background: '#1f2937', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Place Bet</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <select value={betType} onChange={e => setBetType(e.target.value)}
              style={{ background: '#374151', color: 'white', borderRadius: 6, padding: 8, border: 'none' }}>
              <option value="temperature">Temperature</option>
              <option value="rain">Rain</option>
              <option value="wind">Wind Speed</option>
            </select>
            <select value={prediction} onChange={e => setPrediction(e.target.value)}
              style={{ background: '#374151', color: 'white', borderRadius: 6, padding: 8, border: 'none' }}>
              <option value="above">Above 30°C</option>
              <option value="below">Below 30°C</option>
              <option value="rain_yes">Will Rain</option>
              <option value="rain_no">No Rain</option>
            </select>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
              style={{ background: '#374151', color: 'white', borderRadius: 6, padding: 8, border: 'none' }}
              placeholder="Bet Amount" />
            <button onClick={placeBet} disabled={loading}
              style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, padding: 12, fontWeight: 700, cursor: 'pointer', fontSize: 16 }}>
              {loading ? 'Placing...' : 'Place Bet 🎯'}
            </button>
            {msg && <p style={{ color: '#fbbf24' }}>{msg}</p>}
          </div>
        </div>
      </div>
      <div style={{ background: '#1f2937', borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your Bets</h2>
        {bets.length === 0 ? <p style={{ color: '#9ca3af' }}>No bets yet!</p> : (
          bets.map(bet => (
            <div key={bet.id} style={{ background: '#374151', borderRadius: 8, padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span>{bet.city} — {bet.betType} — {bet.prediction}</span>
              <span style={{ color: bet.status === 'win' ? '#34d399' : bet.status === 'loss' ? '#f87171' : '#fbbf24' }}>
                ₹{bet.amount} — {bet.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}