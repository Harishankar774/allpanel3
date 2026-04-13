import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const suits = ['♠','♥','♦','♣']
const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']

function generateDeck() {
  const deck = []
  for (const suit of suits)
    for (const value of values)
      deck.push({ suit, value })
  return deck
}

function shuffle(deck: any[]) {
  for (let i = deck.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function getHandStrength(hand: any[]) {
  const vals = hand.map(c => values.indexOf(c.value))
  const suits = hand.map(c => c.suit)
  const isFlush = suits.every(s => s === suits[0])
  const sorted = [...vals].sort((a,b) => a-b)
  const isStraight = sorted[4]-sorted[0]===4 && new Set(sorted).size===5
  const counts: Record<number,number> = {}
  vals.forEach(v => counts[v] = (counts[v]||0)+1)
  const countVals = Object.values(counts).sort((a,b) => b-a)

  if (isFlush && isStraight) return { rank:8, name:'Straight Flush' }
  if (countVals[0]===4) return { rank:7, name:'Four of a Kind' }
  if (countVals[0]===3 && countVals[1]===2) return { rank:6, name:'Full House' }
  if (isFlush) return { rank:5, name:'Flush' }
  if (isStraight) return { rank:4, name:'Straight' }
  if (countVals[0]===3) return { rank:3, name:'Three of a Kind' }
  if (countVals[0]===2 && countVals[1]===2) return { rank:2, name:'Two Pair' }
  if (countVals[0]===2) return { rank:1, name:'One Pair' }
  return { rank:0, name:'High Card' }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { amount } = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

  const deck = shuffle(generateDeck())
  const playerHand = deck.slice(0,5)
  const dealerHand = deck.slice(5,10)

  const playerStrength = getHandStrength(playerHand)
  const dealerStrength = getHandStrength(dealerHand)

  let result = 'loss'
  let winAmount = -amount
  if (playerStrength.rank > dealerStrength.rank) { result = 'win'; winAmount = amount }
  else if (playerStrength.rank === dealerStrength.rank) { result = 'draw'; winAmount = 0 }

  const newBalance = user.balance + winAmount
  await prisma.user.update({ where: { id: user.id }, data: { balance: newBalance } })

  return NextResponse.json({ playerHand, dealerHand, playerStrength: playerStrength.name, dealerStrength: dealerStrength.name, result, winAmount, newBalance })
}