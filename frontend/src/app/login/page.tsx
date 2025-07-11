'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || data.errors?.[0]?.msg || 'Login failed')
      setLoading(false)
      return
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    setLoading(false)
    router.push('/user')
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ddd', borderRadius: 6 }}
    >
      <h1 style={{ textAlign: 'center' }}>Login</h1>
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ padding: 8, fontSize: 16, marginBottom: 12, width: '100%' }}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ padding: 8, fontSize: 16, marginBottom: 12, width: '100%' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        style={{ padding: 10, width: '100%', backgroundColor: '#0070f3', color: 'white', borderRadius: 4 }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
