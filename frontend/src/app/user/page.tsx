'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const BASE_URL = 'http://localhost:3001/api'

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
    const res = await fetch(`${BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()

    if (data.error) {
      setError(data.error)
    } else if (data.profile) {
      setForm({
        age: data.profile.age.toString(),
        income: data.profile.income.toString(),
        dependents: data.profile.dependents.toString(),
        risk_tolerance: data.profile.risk_tolerance,
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

    const res = await fetch(`${BASE_URL}/user/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (data.error) {
      setError(data.error)
    } else {
      setSuccess('Profile updated successfully!')
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ddd', borderRadius: 6 }}
    >
      <h1 style={{ textAlign: 'center' }}>Your Profile</h1>

      <input
        type="number"
        placeholder="Age"
        min={18}
        max={100}
        required
        value={form.age}
        onChange={e => setForm({ ...form, age: e.target.value })}
        style={{ padding: 8, fontSize: 16, marginBottom: 12, width: '100%' }}
      />
      <input
        type="number"
        placeholder="Annual Income"
        min={0}
        step="0.01"
        required
        value={form.income}
        onChange={e => setForm({ ...form, income: e.target.value })}
        style={{ padding: 8, fontSize: 16, marginBottom: 12, width: '100%' }}
      />
      <input
        type="number"
        placeholder="Number of Dependents"
        min={0}
        required
        value={form.dependents}
        onChange={e => setForm({ ...form, dependents: e.target.value })}
        style={{ padding: 8, fontSize: 16, marginBottom: 12, width: '100%' }}
      />
      <select
        value={form.risk_tolerance}
        onChange={e => setForm({ ...form, risk_tolerance: e.target.value })}
        style={{ padding: 8, fontSize: 16, marginBottom: 12, width: '100%' }}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{ padding: 10, width: '100%', backgroundColor: '#0070f3', color: 'white', borderRadius: 4 }}
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}
