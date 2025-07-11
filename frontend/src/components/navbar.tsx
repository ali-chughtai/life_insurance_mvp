'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [pathname])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    router.push('/login')
  }

  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #ccc', display: 'flex', gap: 20 }}>
      <Link href="/">Home</Link>
      {!token && (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
      {token && (
        <>
          <Link href="/user">Profile</Link>
          <Link href="/recommendations">Recommendations</Link>
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'red',
              fontWeight: 'bold',
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  )
}
