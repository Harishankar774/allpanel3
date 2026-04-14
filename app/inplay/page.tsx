'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function InPlayPage() {
  const { data: session } = useSession()
  const [matches, setMatches] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/matches?sport=Cricket')
      .then(r => r.json())
      .then(data => setMatches(data.matches || []))
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'#f1f5f9', paddingBottom:80 }}>
      <div style={{ background:'#1a237e', color:'white', padding:'12px 16px', fontSize:18, fontWeight:700 }}>
        ▶️ In-Play
      </div>
      <div style={{ padding:12 }}>
        {matches.filter(m => m.isLive).length === 0 ? (
          <div style={{ textAlign:'center', padding:48, color:'#9ca3af' }}>
            <div style={{ fontSize:40 }}>⚽</div>
            <div style={{ marginTop:12 }}>No live matches right now</div>
          </div>
        ) : matches.filter(m => m.isLive).map(m => (
          <div key={m.id} style={{ background:'white', borderRadius:12, padding:16, marginBottom:12, boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ background:'#22c55e', color:'white', fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:700 }}>LIVE</span>
              <span style={{ fontSize:12, color:'#6b7280' }}>{m.sport}</span>
            </div>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>{m.name}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              <div style={{ background:'#ffcdd2', borderRadius:6, padding:'8px 4px', textAlign:'center' }}>
                <div style={{ fontSize:11, color:'#7f1d1d' }}>Back</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#7f1d1d' }}>{m.oddsA || '-'}</div>
              </div>
              <div style={{ background:'#f3f4f6', borderRadius:6, padding:'8px 4px', textAlign:'center' }}>
                <div style={{ fontSize:11, color:'#6b7280' }}>Draw</div>
                <div style={{ fontSize:16, fontWeight:700 }}>{m.oddsDraw || '-'}</div>
              </div>
              <div style={{ background:'#bbdefb', borderRadius:6, padding:'8px 4px', textAlign:'center' }}>
                <div style={{ fontSize:11, color:'#1e3a5f' }}>Lay</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#1e3a5f' }}>{m.oddsB || '-'}</div>
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