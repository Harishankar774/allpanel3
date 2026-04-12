import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const suits = ['♠', '♥', '♦', '♣']
const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']

function generateDeck() {
  const deck = []
  for (const suit of suits)
    for (const value of values)
      deck.push({ suit, value })
  return deck
}

function shuffle(deck: any[]) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function dealHand(deck: any[], count = 3) {
  return deck.splice(0, count)
}

function getHandRank(hand: any[]) {
  const values = hand.map(c => c.value)
  const suits = hand.map(c => c.suit)
  const isFlush = suits.every(s => s === suits[0])
  const valueOrder = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
  const nums = values.map(v => valueOrder.indexOf(v)).sort((a,b) => a-b)
  const isSeq = nums[2]-nums[1]===1 && nums[1]-nums[0]===1
  const pairs = values.filter((v,i) => values.indexOf(v) !== i).length
  const isThree = new Set(values).size === 1

  if (isThree) return { rank: 6, name: 'Three of a Kind' }
  if (isFlush && isSeq) return { rank: 5, name: 'Pure Sequence' }
  if (isSeq) return { rank: 4, name: 'Sequence' }
  if (isFlush) return { rank: 3, name: 'Flush' }
  if (pairs > 0) return { rank: 2, name: 'Pair' }
  return { rank: 1, name: 'High Card' }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { amount } = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user?.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

  const deck = shuffle(generateDeck())
  const playerHand = dealHand(deck)
  const dealerHand = dealHand(deck)

  const playerRank = getHandRank(playerHand)
  const dealerRank = getHandRank(dealerHand)

  let result = 'loss'
  let winAmount = -amount

  if (playerRank.rank > dealerRank.rank) {
    result = 'win'
    winAmount = amount
  } else if (playerRank.rank === dealerRank.rank) {
    result = 'draw'
    winAmount = 0
  }

  const newBalance = user.balance + winAmount
  await prisma.user.update({ where: { id: user.id }, data: { balance: newBalance } })

  return NextResponse.json({
    playerHand, dealerHand,
    playerRank: playerRank.name,
    dealerRank: dealerRank.name,
    result, winAmount, newBalance
  })
}
