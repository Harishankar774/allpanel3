'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function MyBetsPage() {
  const { data: session } = useSession()
  const [bets, setBets] = useState<any[]>([])

  useEffect(() => {
    if (session) {
      fetch('/api/bets/my').then(r => r.json()).then(data => {
        if (Array.isArray(data)) setBets(data)
      })
    }
  }, [session])

  return (
    <div style={{ minHeight:'100vh', background:'#f1f5f9', paddingBottom:80 }}>
      <div style={{ background:'#1a237e', color:'white', padding:'12px 16px', fontSize:18, fontWeight:700 }}>
        📋 My Bets
      </div>
      <div style={{ padding:12 }}>
        {bets.length === 0 ? (
          <div style={{ textAlign:'center', padding:48, color:'#9ca3af' }}>
            <div style={{ fontSize:40 }}>📋</div>
            <div style={{ marginTop:12 }}>No bets yet!</div>
            <a href="/home" style={{ display:'inline-block', marginTop:16, background:'#1a237e', color:'white', padding:'10px 24px', borderRadius:8, textDecoration:'none', fontWeight:700 }}>
              Place a Bet
            </a>
          </div>
        ) : bets.map(bet => (
          <div key={bet.id} style={{ background:'white', borderRadius:12, padding:16, marginBottom:12, boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:13, fontWeight:700 }}>{bet.team}</span>
              <span style={{ fontSize:12, padding:'2px 8px', borderRadius:20, fontWeight:700, background: bet.status==='win' ? '#dcfce7' : bet.status==='loss' ? '#fee2e2' : '#fef9c3', color: bet.status==='win' ? '#166534' : bet.status==='loss' ? '#991b1b' : '#854d0e' }}>
                {bet.status?.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize:12, color:'#6b7280', marginBottom:8 }}>{bet.match?.name}</div>
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
    <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'white', borderTop:'1px solid #e5e7eb', display:'flex', justifyContent:'space-around', padding:'8px 0', zIndex:1000 }}>
      {[
        { icon:'🏠', label:'Home', href:'/home', key:'home' },
        { icon:'▶️', label:'In-Play', href:'/inplay', key:'inplay' },
        { icon:'📋', label:'My Bets', href:'/mybets', key:'mybets' },
        { icon:'🎰', label:'Casino', href:'/casino', key:'casino' },
        { icon:'👛', label:'Wallet', href:'/wallet', key:'wallet' },
      ].map(item => (
        <a key={item.key} href={item.href} style={{ display:'flex', flexDirection:'column', alignItems:'center', textDecoration:'none', color: active===item.key ? '#1a237e' : '#6b7280', fontSize:11, gap:2, fontWeight: active===item.key ? 700 : 400 }}>
          <span style={{ fontSize:20 }}>{item.icon}</span>
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  )
}