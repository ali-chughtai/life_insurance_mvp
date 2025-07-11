'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg md:p-10"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Login</h1>

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
            placeholder="********"
            required
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
          className="w-full rounded-md bg-blue-600 p-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
