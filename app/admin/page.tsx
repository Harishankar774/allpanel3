'use client'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-4xl font-bold text-blue-400">0</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Total Bets</h2>
          <p className="text-4xl font-bold text-green-400">0</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Total Balance</h2>
          <p className="text-4xl font-bold text-yellow-400">₹0</p>
        </div>
      </div>
    </div>
  )
}