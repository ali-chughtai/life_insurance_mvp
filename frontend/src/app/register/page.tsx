'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || data.errors?.[0]?.msg || 'Registration failed')
      setLoading(false)
      return
    }

    alert('Registered successfully! Please login.')
    setLoading(false)
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg md:p-10"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Register</h1>

        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="your@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password (min 6 chars)"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="mb-4 text-center text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-green-600 p-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-green-400"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
