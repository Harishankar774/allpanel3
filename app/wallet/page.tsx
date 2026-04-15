'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function WalletPage() {
  const { data: session } = useSession()
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [amount, setAmount] = useState(500)
  const [msg, setMsg] = useState('')

  const loadWallet = () => {
    if (!session) return
    fetch('/api/wallet').then(r => r.json()).then(data => {
      setWallet(data)
      setTransactions(data.transactions || [])
    })
  }

  useEffect(() => {
    loadWallet()
  }, [session])

  const submitRequest = async (type: 'DEPOSIT' | 'WITHDRAWAL') => {
    setMsg('')
    const res = await fetch('/api/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount, method: 'MANUAL' }),
    })
    const data = await res.json()
    if (data.success) {
      setMsg(data.message || 'Request submitted')
      loadWallet()
    } else setMsg(data.error || 'Failed')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0b0e14', paddingBottom:80 }}>
      <div style={{ background:'#12161f', color:'#e8ecf3', padding:'12px 16px', fontSize:18, fontWeight:800, borderBottom:'1px solid #252d3a' }}>
        👛 Wallet
      </div>

      <div style={{ padding:12 }}>
        <div style={{ background:'linear-gradient(145deg,#2a2210,#1a1508)', border:'1px solid #8b6b18', borderRadius:16, padding:24, color:'#e8ecf3', marginBottom:16, textAlign:'center' }}>
          <div style={{ fontSize:14, opacity:0.8, marginBottom:4 }}>Available Balance</div>
          <div style={{ fontSize:36, fontWeight:900 }}>₹{wallet?.balance?.toFixed(0) || '0'}</div>
          <div style={{ fontSize:12, opacity:0.8, marginTop:4, color:'#e8c547' }}>Exposure: ₹{wallet?.exposure?.toFixed(0) || '0'}</div>
        </div>

        <div style={{ background:'#161b26', border:'1px solid #252d3a', borderRadius:12, padding:12, marginBottom:12 }}>
          <div style={{ fontSize:12, color:'#8b95a8', marginBottom:8 }}>Amount (₹)</div>
          <input type="number" min={100} value={amount} onChange={e => setAmount(Number(e.target.value))}
            style={{ width:'100%', background:'#0b0e14', color:'#e8ecf3', border:'1px solid #252d3a', borderRadius:8, padding:10, boxSizing:'border-box' }} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          <button onClick={() => submitRequest('DEPOSIT')} style={{ background:'#16a34a', color:'white', border:'none', borderRadius:12, padding:16, fontSize:16, fontWeight:700, cursor:'pointer' }}>
            + Deposit
          </button>
          <button onClick={() => submitRequest('WITHDRAWAL')} style={{ background:'#dc2626', color:'white', border:'none', borderRadius:12, padding:16, fontSize:16, fontWeight:700, cursor:'pointer' }}>
            - Withdraw
          </button>
        </div>
        {msg && <div style={{ background:'#161b26', border:'1px solid #252d3a', color:'#e8c547', borderRadius:10, padding:'10px 12px', marginBottom:12, fontSize:13 }}>{msg}</div>}

        <div style={{ background:'#161b26', border:'1px solid #252d3a', borderRadius:12, padding:16 }}>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:12, color:'#e8ecf3' }}>Transaction History</h3>
          {transactions.length === 0 ? (
            <div style={{ textAlign:'center', padding:24, color:'#9ca3af' }}>No transactions yet!</div>
          ) : transactions.map((t, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #252d3a' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#e8ecf3' }}>{t.type}</div>
                <div style={{ fontSize:11, color:'#8b95a8' }}>{new Date(t.createdAt).toLocaleDateString()}</div>
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