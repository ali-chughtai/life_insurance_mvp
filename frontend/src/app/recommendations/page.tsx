'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'


export default function Recommendations() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<any>(null)
  const [alternatives, setAlternatives] = useState<any[]>([])

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
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setRecommendation(null)
    setAlternatives([])

    const payload = {
      age: Number(form.age),
      income: Number(form.income),
      dependents: Number(form.dependents),
      risk_tolerance: form.risk_tolerance,
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setRecommendation(data.recommendation)
        setAlternatives(data.alternatives || [])
      }
    } catch (err) {
      setError('Failed to fetch recommendations')
    }
    setLoading(false)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ddd', borderRadius: 6 }}
      >
        <h1 style={{ textAlign: 'center' }}>Get Recommendations</h1>

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

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, width: '100%', backgroundColor: '#0070f3', color: 'white', borderRadius: 4 }}
        >
          {loading ? 'Loading...' : 'Get Recommendation'}
        </button>
      </form>

      {recommendation && (
        <section style={{ maxWidth: 600, margin: '20px auto', padding: 20, border: '1px solid #eee', borderRadius: 6 }}>
          <h2>Primary Recommendation</h2>
          <p><strong>Name:</strong> {recommendation.product_name}</p>
          <p><strong>Type:</strong> {recommendation.product_type}</p>
          <p><strong>Coverage:</strong> {recommendation.coverage_amount}</p>
          <p><strong>Term Length:</strong> {recommendation.term_length} years</p>
          <p><strong>Monthly Premium:</strong> ${recommendation.monthly_premium}</p>
          <p><strong>Description:</strong> {recommendation.description}</p>
          <p><strong>Features:</strong> {recommendation.features}</p>
          <p><strong>Explanation:</strong> {recommendation.explanation}</p>

          {alternatives.length > 0 && (
            <>
              <h3>Alternatives</h3>
              <ul>
                {alternatives.map((alt, idx) => (
                  <li key={idx} style={{ marginBottom: 12 }}>
                    <p><strong>{alt.product_name}</strong> - {alt.product_type}</p>
                    <p>Coverage: {alt.coverage_amount}</p>
                    <p>Term Length: {alt.term_length} years</p>
                    <p>Monthly Premium: ${alt.monthly_premium}</p>
                    <p>Description: {alt.description}</p>
                    <p>Features: {alt.features}</p>
                    <p>Explanation: {alt.explanation}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </>
  )
}