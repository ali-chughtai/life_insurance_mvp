'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link' 

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.replace('/user')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
          Secure Your Family's Future with <span className="text-blue-600">Life Insurance</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Life insurance is more than just a policy; it's a promise to protect those who matter most. Explore how it can provide financial security and peace of mind for your loved ones.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold text-blue-700 mb-3">Affordability</h3>
          <p className="text-gray-700">
            **Did you know?** Over half of Americans overestimate the cost of life insurance by as much as three times! Many term policies are more affordable than you think.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold text-blue-700 mb-3">Coverage Gaps</h3>
          <p className="text-gray-700">
            Roughly **75 million Americans are uninsured** and **27 million are underinsured**. Don't let your family be part of this gap.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold text-blue-700 mb-3">Peace of Mind</h3>
          <p className="text-gray-700">
            Life insurance provides a vital financial safety net, helping cover expenses like mortgages, education, and daily living costs for your beneficiaries.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold text-blue-700 mb-3">Types of Policies</h3>
          <p className="text-gray-700">
            From **Term Life** (coverage for a specific period) to **Whole Life** (lifelong coverage with cash value), there are various options to suit your needs.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold text-blue-700 mb-3">Market Growth</h3>
          <p className="text-gray-700">
            The global life insurance market was valued at **$3.1 trillion in 2024** and is projected to reach **$4 trillion by 2028**, showing its increasing importance.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold text-blue-700 mb-3">Why People Buy</h3>
          <p className="text-gray-700">
            The most common reason for purchasing life insurance is to cover **burial and final expenses** (60% of policyholders), followed by income replacement.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg text-gray-700 mb-8">
          Ready to learn more about securing your future? Your personalized profile helps us understand your needs.
          Please proceed to your user dashboard to get started.
        </p>
        <Link href="/user" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:px-10 text-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
          Go to Your Dashboard
        </Link>
      </div>
    </div>
  )
}