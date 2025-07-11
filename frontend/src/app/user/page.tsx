'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'


export default function UserProfile() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState({
    age: '',
    income: '',
    dependents: '',
    risk_tolerance: 'Low',
  })

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      router.push('/login')
      return
    }
    setToken(t)
    loadProfile(t)
  }, [router])

  async function loadProfile(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()

    if (data.error) {
      setError(data.error)
    } else if (data.profile) {
      setForm({
        age: data.profile.age?.toString() || '',
        income: data.profile.income?.toString() || '',
        dependents: data.profile.dependents?.toString() || '',
        risk_tolerance: data.profile.risk_tolerance || 'Low',
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const payload = {
      age: Number(form.age),
      income: Number(form.income),
      dependents: Number(form.dependents),
      risk_tolerance: form.risk_tolerance,
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (data.error) {
      setError(data.error)
    } else {
      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        router.push('/recommendations')
      }, 1500)
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto my-10 p-8 border border-gray-300 rounded-lg shadow-md bg-white"
    >
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>

      <input
        type="number"
        placeholder="Age"
        min={18}
        max={100}
        required
        value={form.age}
        onChange={e => setForm({ ...form, age: e.target.value })}
        className="p-3 text-base mb-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Annual Income"
        min={0}
        step="0.01"
        required
        value={form.income}
        onChange={e => setForm({ ...form, income: e.target.value })}
        className="p-3 text-base mb-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Number of Dependents"
        min={0}
        required
        value={form.dependents}
        onChange={e => setForm({ ...form, dependents: e.target.value })}
        className="p-3 text-base mb-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={form.risk_tolerance}
        onChange={e => setForm({ ...form, risk_tolerance: e.target.value })}
        className="p-3 text-base mb-4 w-full border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {success && <p className="text-green-600 text-center mb-4">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="p-3 w-full bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}