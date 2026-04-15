'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function InPlayPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches?sport=All')
      .then(r => r.json())
      .then(data => setMatches(data.matches || []))
      .finally(() => setLoading(false))
  }, [])

  const live = matches.filter(m => m.isLive)

  return (
    <div style={{ minHeight:'100vh', background:'#0b0e14', paddingBottom:80, color:'#e8ecf3' }}>
      <div style={{ background:'#12161f', color:'#e8ecf3', padding:'12px 16px', fontSize:18, fontWeight:800, borderBottom:'1px solid #252d3a' }}>
        ▶️ In-Play
      </div>
      <div style={{ padding:12 }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:48, color:'#9ca3af' }}>Loading live matches...</div>
        ) : live.length === 0 ? (
          <div style={{ textAlign:'center', padding:48, color:'#9ca3af' }}>
            <div style={{ fontSize:40 }}>⚽</div>
            <div style={{ marginTop:12 }}>No live matches right now</div>
          </div>
        ) : live.map(m => (
          <div key={m.id} style={{ background:'#161b26', borderRadius:12, padding:16, marginBottom:12, border:'1px solid #252d3a' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ background:'#22c55e', color:'white', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:700 }}>LIVE</span>
              <span style={{ fontSize:12, color:'#e8c547' }}>{m.sport}</span>
            </div>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>{m.name}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              <div style={{ background:'#1d4ed8', borderRadius:6, padding:'8px 4px', textAlign:'center' }}>
                <div style={{ fontSize:11, color:'#dbeafe' }}>Back</div>
                <div style={{ fontSize:16, fontWeight:700, color:'white' }}>{m.oddsA || '-'}</div>
              </div>
              <div style={{ background:'#334155', borderRadius:6, padding:'8px 4px', textAlign:'center' }}>
                <div style={{ fontSize:11, color:'#cbd5e1' }}>Draw</div>
                <div style={{ fontSize:16, fontWeight:700 }}>{m.oddsDraw || '-'}</div>
              </div>
              <div style={{ background:'#fda4af', borderRadius:6, padding:'8px 4px', textAlign:'center' }}>
                <div style={{ fontSize:11, color:'#4c0519' }}>Lay</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#4c0519' }}>{m.oddsB || '-'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="inplay" />
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