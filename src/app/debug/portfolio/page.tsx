'use client'

import { useState } from 'react'

export default function PortfolioDebugPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const setupPortfolio = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/setup-portfolio', {
        method: 'POST'
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Portfolio Debug Page</h1>
        
        <button
          onClick={setupPortfolio}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Setting up...' : 'Setup Portfolio Data'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-white rounded border">
            <h2 className="font-bold mb-2">Result:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 