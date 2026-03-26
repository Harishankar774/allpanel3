'use client'
import { useEffect, useState } from 'react'

export default function UsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(setUsers)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Users</h1>
      <table className="w-full bg-gray-800 rounded-xl">
        <thead>
          <tr className="text-left p-4">
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Balance</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id} className="border-t border-gray-700">
              <td className="p-4">{u.name}</td>
              <td className="p-4">{u.email}</td>
              <td className="p-4">₹{u.balance}</td>
              <td className="p-4">{u.isActive ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}