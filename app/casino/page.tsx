'use client'
import Link from 'next/link'

const games = [
  { name:"MATKA", bg:"#7c2d12", em:"🎲", href:"/matka", desc:"Number 0-9 predict karo" },
  { name:"TEEN PATTI", bg:"#1e3a8a", em:"♠", href:"/teenpatti", desc:"3 card game" },
  { name:"LUCKY 6", bg:"#14532d", em:"🍀", href:"/lucky6", desc:"6 dice — Even ya Odd" },
  { name:"LUCKY 7", bg:"#713f12", em:"🎴", href:"/lucky7", desc:"Under/Over 7" },
  { name:"POKER", bg:"#500724", em:"🃏", href:"/poker", desc:"5 card poker" },
  { name:"BACCARAT", bg:"#312e81", em:"🎯", href:"/baccarat", desc:"Player ya Banker" },
  { name:"ROULETTE", bg:"#7f1d1d", em:"⭕", href:"/roulette", desc:"0-36 number game" },
  { name:"CRASH", bg:"#0c4a6e", em:"🚀", href:"/crash", desc:"Multiplier game" },
]

export default function CasinoPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', paddingBottom:80 }}>
      <div style={{ background:'#1a237e', color:'white', padding:'12px 16px', fontSize:18, fontWeight:700 }}>
        🎰 Casino Games
      </div>
      <div style={{ padding:12, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {games.map((g, i) => (
          <Link key={i} href={g.href} style={{ background:g.bg, borderRadius:12, padding:20, textDecoration:'none', color:'white', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', minHeight:120, justifyContent:'center' }}>
            <div style={{ fontSize:36, marginBottom:8 }}>{g.em}</div>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{g.name}</div>
            <div style={{ fontSize:11, opacity:0.8 }}>{g.desc}</div>
          </Link>
        ))}
      </div>
      <BottomNav active="casino" />
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