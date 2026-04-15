'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function MyBetsPage() {
  const { data: session, status } = useSession()
  const [bets, setBets] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== 'authenticated') {
      setLoading(status === 'loading')
      setBets([])
      return
    }
    setLoading(true)
    setError(null)
    fetch('/api/bets/my', { credentials: 'same-origin' })
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) {
          setError(data.error || 'Could not load bets')
          setBets([])
          return
        }
        if (Array.isArray(data)) setBets(data)
        else if (Array.isArray(data.bets)) setBets(data.bets)
        else setBets([])
      })
      .catch(() => {
        setError('Network error')
        setBets([])
      })
      .finally(() => setLoading(false))
  }, [status, session])

  return (
    <div style={{ minHeight:'100vh', background:'#0b0e14', paddingBottom:80 }}>
      <div style={{ background:'#12161f', color:'#e8ecf3', padding:'12px 16px', fontSize:18, fontWeight:800, borderBottom:'1px solid #252d3a' }}>
        📋 My Bets
      </div>
      <div style={{ padding:12 }}>
        {status === 'unauthenticated' ? (
          <div style={{ textAlign:'center', padding:48, color:'#9ca3af' }}>
            <p style={{ marginBottom:16 }}>Please log in to see your bets.</p>
            <Link href="/login" style={{ background:'#e8c547', color:'#111', padding:'10px 24px', borderRadius:8, textDecoration:'none', fontWeight:700 }}>Login</Link>
          </div>
        ) : loading ? (
          <div style={{ textAlign:'center', padding:48, color:'#9ca3af' }}>Loading your bets…</div>
        ) : error ? (
          <div style={{ textAlign:'center', padding:48, color:'#f87171' }}>{error}</div>
        ) : bets.length === 0 ? (
          <div style={{ textAlign:'center', padding:48, color:'#9ca3af' }}>
            <div style={{ fontSize:40 }}>📋</div>
            <div style={{ marginTop:12 }}>No bets yet!</div>
            <Link href="/home" style={{ display:'inline-block', marginTop:16, background:'#e8c547', color:'#111', padding:'10px 24px', borderRadius:8, textDecoration:'none', fontWeight:700 }}>
              Place a Bet
            </Link>
          </div>
        ) : bets.map(bet => (
          <div key={bet.id} style={{ background:'#161b26', borderRadius:12, padding:16, marginBottom:12, border:'1px solid #252d3a', color:'#e8ecf3' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:13, fontWeight:700 }}>{bet.team}</span>
              <span style={{ fontSize:12, padding:'2px 8px', borderRadius:20, fontWeight:700, background: bet.status==='WON' ? '#14532d' : bet.status==='LOST' ? '#7f1d1d' : '#78350f', color: bet.status==='WON' ? '#bbf7d0' : bet.status==='LOST' ? '#fecaca' : '#fde68a' }}>
                {bet.status?.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize:12, color:'#8b95a8', marginBottom:8 }}>{bet.match?.name}</div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
              <span>Stake: <strong>₹{bet.amount}</strong></span>
              <span>Odds: <strong>{bet.odds}</strong></span>
              <span>Returns: <strong>₹{(bet.amount * bet.odds).toFixed(0)}</strong></span>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="mybets" />
    </div>
  )
}

function BottomNav({ active }: { active: string }) {
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#12161f', borderTop:'1px solid #252d3a', display:'flex', justifyContent:'space-around', padding:'8px 0', zIndex:1000 }}>
      {[
        { icon:'🏠', label:'Home', href:'/home', key:'home' },
        { icon:'▶️', label:'In-Play', href:'/inplay', key:'inplay' },
        { icon:'📋', label:'My Bets', href:'/mybets', key:'mybets' },
        { icon:'🎰', label:'Casino', href:'/casino', key:'casino' },
        { icon:'👛', label:'Wallet', href:'/wallet', key:'wallet' },
      ].map(item => (
        <Link key={item.key} href={item.href} style={{ display:'flex', flexDirection:'column', alignItems:'center', textDecoration:'none', color: active===item.key ? '#e8c547' : '#8b95a8', fontSize:11, gap:2, fontWeight: active===item.key ? 700 : 400 }}>
          <span style={{ fontSize:20 }}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  )
}