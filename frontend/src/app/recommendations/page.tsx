// Your Next.js Frontend Recommendation Page: app/recommendations/page.tsx (assuming this path)
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'


export default function Recommendations() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<any>(null)
  const [alternatives, setAlternatives] = useState<any[]>([])

  const [userProfile, setUserProfile] = useState({
    age: '',
    income: '',
    dependents: '',
    risk_tolerance: 'Low',
  })

  const getRecommendations = useCallback(async (profileData: typeof userProfile, authToken: string) => {
    setLoading(true)
    setError(null)
    setRecommendation(null)
    setAlternatives([])

    const payload = {
      age: Number(profileData.age),
      income: Number(profileData.income),
      dependents: Number(profileData.dependents),
      risk_tolerance: profileData.risk_tolerance,
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        setError(errorData.error || errorData.message || 'Failed to fetch recommendations: Server returned an error.')
        return
      }

      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setRecommendation(data.recommendation)
        setAlternatives(data.alternatives || [])
        if (!data.recommendation && data.message) {
            setError(data.message)
        }
      }
    } catch (err: any) {
      setError('Failed to connect to the server for recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      router.push('/login')
      return
    }
    setToken(t)

    const loadAndRecommend = async () => {
      setLoading(true)
      try {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${t}` },
        })
        const profileData = await profileRes.json()

        if (!profileRes.ok) {
          setError(profileData.error || 'Failed to load profile for recommendations.')
          setLoading(false)
          return
        }

        if (profileData.profile) {
          const loadedProfile = {
            age: profileData.profile.age?.toString() || '',
            income: profileData.profile.income?.toString() || '',
            dependents: profileData.profile.dependents?.toString() || '',
            risk_tolerance: profileData.profile.risk_tolerance || 'Low',
          }
          setUserProfile(loadedProfile)

          if (loadedProfile.age && loadedProfile.income && loadedProfile.dependents && loadedProfile.risk_tolerance) {
             await getRecommendations(loadedProfile, t)
          } else {
              setError("Please complete your profile details to get recommendations.")
              setLoading(false)
          }
        } else {
          setError("User profile not found. Please complete your profile.")
          setLoading(false)
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.")
        setLoading(false)
      }
    }

    loadAndRecommend()
  }, [router, getRecommendations])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value })
  }

  const handleManualRecommendationFetch = (e: React.FormEvent) => {
    e.preventDefault()
    if (token) {
        getRecommendations(userProfile, token)
    } else {
        setError("Authentication token not available. Please log in.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleManualRecommendationFetch}
        className="mx-auto my-10 w-full max-w-lg rounded-lg bg-white p-8 shadow-lg md:p-10"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Get Recommendations</h1>
        <p className="mb-6 text-center text-gray-600">Your current profile details:</p>

        <div className="mb-4">
          <label htmlFor="age" className="mb-2 block text-sm font-medium text-gray-700">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Age"
            min={18}
            max={100}
            required
            value={userProfile.age}
            onChange={handleFormChange}
            className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="income" className="mb-2 block text-sm font-medium text-gray-700">Annual Income:</label>
          <input
            type="number"
            id="income"
            name="income"
            placeholder="Annual Income"
            min={0}
            step="0.01"
            required
            value={userProfile.income}
            onChange={handleFormChange}
            className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="dependents" className="mb-2 block text-sm font-medium text-gray-700">Number of Dependents:</label>
          <input
            type="number"
            id="dependents"
            name="dependents"
            placeholder="Number of Dependents"
            min={0}
            required
            value={userProfile.dependents}
            onChange={handleFormChange}
            className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="risk_tolerance" className="mb-2 block text-sm font-medium text-gray-700">Risk Tolerance:</label>
          <select
            id="risk_tolerance"
            name="risk_tolerance"
            value={userProfile.risk_tolerance}
            onChange={handleFormChange}
            className="w-full rounded-md border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {error && <p className="mb-4 text-center text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 p-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {loading ? 'Loading...' : 'Refresh Recommendation'}
        </button>
      </form>

      {loading && !recommendation && <p className="mt-8 text-center text-gray-700">Loading recommendations...</p>}
      {!loading && !recommendation && !error && <p className="mt-8 text-center text-gray-700">No recommendation available based on your profile. Please fill in your profile details or adjust them.</p>}

      {recommendation && (
        <section className="mx-auto my-8 w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-md md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Primary Recommendation</h2>
          <div className="grid grid-cols-1 gap-4 text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
            <p><strong>Name:</strong> {recommendation.product_name}</p>
            <p><strong>Type:</strong> {recommendation.product_type}</p>
            <p><strong>Coverage:</strong> {recommendation.coverage_amount}</p>
            <p><strong>Term Length:</strong> {recommendation.term_length} years</p>
            <p><strong>Monthly Premium:</strong> ${recommendation.monthly_premium}</p>
            <p className="col-span-1 sm:col-span-2 lg:col-span-3"><strong>Description:</strong> {recommendation.description}</p>
            <p className="col-span-1 sm:col-span-2 lg:col-span-3"><strong>Features:</strong> {recommendation.features}</p>
            <p className="col-span-1 sm:col-span-2 lg:col-span-3"><strong>Explanation:</strong> {recommendation.explanation}</p>
          </div>

          {alternatives.length > 0 && (
            <>
              <h3 className="mb-4 mt-8 text-xl font-bold text-gray-800">Alternatives</h3>
              <ul className="space-y-6">
                {alternatives.map((alt, idx) => (
                  <li key={idx} className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
                    <p className="mb-2 text-lg font-semibold text-gray-900"><strong>{alt.product_name}</strong> - {alt.product_type}</p>
                    <div className="grid grid-cols-1 gap-2 text-gray-600 sm:grid-cols-2">
                      <p>Coverage: {alt.coverage_amount}</p>
                      <p>Term Length: {alt.term_length} years</p>
                      <p>Monthly Premium: ${alt.monthly_premium}</p>
                    </div>
                    <p className="mt-2 text-gray-700">Description: {alt.description}</p>
                    {alt.features && <p className="mt-1 text-gray-700">Features: {alt.features}</p>}
                    {alt.explanation && <p className="mt-1 text-gray-700">Explanation: {alt.explanation}</p>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </div>
  )
}