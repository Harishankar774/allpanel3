'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function WalletPage() {
  const { data: session } = useSession()
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    if (session) {
      fetch('/api/wallet').then(r => r.json()).then(data => {
        setWallet(data)
        setTransactions(data.transactions || [])
      })
    }
  }, [session])

  return (
    <div style={{ minHeight:'100vh', background:'#f1f5f9', paddingBottom:80 }}>
      <div style={{ background:'#1a237e', color:'white', padding:'12px 16px', fontSize:18, fontWeight:700 }}>
        👛 Wallet
      </div>

      <div style={{ padding:12 }}>
        <div style={{ background:'linear-gradient(135deg, #1a237e, #283593)', borderRadius:16, padding:24, color:'white', marginBottom:16, textAlign:'center' }}>
          <div style={{ fontSize:14, opacity:0.8, marginBottom:4 }}>Available Balance</div>
          <div style={{ fontSize:36, fontWeight:900 }}>₹{wallet?.balance?.toFixed(0) || '0'}</div>
          <div style={{ fontSize:12, opacity:0.7, marginTop:4 }}>Exposure: ₹{wallet?.exposure?.toFixed(0) || '0'}</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          <button style={{ background:'#16a34a', color:'white', border:'none', borderRadius:12, padding:16, fontSize:16, fontWeight:700, cursor:'pointer' }}>
            + Deposit
          </button>
          <button style={{ background:'#dc2626', color:'white', border:'none', borderRadius:12, padding:16, fontSize:16, fontWeight:700, cursor:'pointer' }}>
            - Withdraw
          </button>
        </div>

        <div style={{ background:'white', borderRadius:12, padding:16 }}>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:12, color:'#1e293b' }}>Transaction History</h3>
          {transactions.length === 0 ? (
            <div style={{ textAlign:'center', padding:24, color:'#9ca3af' }}>No transactions yet!</div>
          ) : transactions.map((t, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f3f4f6' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{t.type}</div>
                <div style={{ fontSize:11, color:'#6b7280' }}>{new Date(t.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color: t.amount > 0 ? '#16a34a' : '#dc2626' }}>
                {t.amount > 0 ? '+' : ''}₹{t.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="wallet" />
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