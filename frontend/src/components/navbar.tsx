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
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 shadow-md">
      <div className="container mx-auto flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-200 transition duration-300">
            LifeSecure
          </Link>
          <div className="hidden sm:flex space-x-6">
            <Link href="/" className="text-white hover:text-blue-200 transition duration-300">Home</Link>
            {token && (
              <>
                <Link href="/user" className="text-white hover:text-blue-200 transition duration-300">Profile</Link>
                <Link href="/recommendations" className="text-white hover:text-blue-200 transition duration-300">Recommendations</Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {!token && (
            <>
              <Link href="/login" className="rounded-md px-4 py-2 text-white border border-white hover:bg-white hover:text-blue-700 transition duration-300">
                Login
              </Link>
              <Link href="/register" className="rounded-md bg-white px-4 py-2 font-medium text-blue-700 hover:bg-blue-100 transition duration-300">
                Register
              </Link>
            </>
          )}
          {token && (
            <button
              onClick={logout}
              className="rounded-md px-4 py-2 bg-red-500 text-white font-medium hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}