import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Settings() {
  const [rates, setRates] = useState({ kes: '', ugx: '', tzs: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('/api/settings/exchange-rates')
      .then(res => {
        if (res.data) setRates(res.data)
      })
      .catch(err => console.error('Failed to load rates', err))
  }, [])

  const updateRates = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/settings/exchange-rates', rates, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('Exchange rates updated successfully!')
    } catch (err) {
      console.error(err)
      setMessage('Failed to update rates')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin: Exchange Rates</h1>

      <form onSubmit={updateRates} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">KES per USD</label>
          <input
            type="number"
            value={rates.kes}
            onChange={e => setRates({ ...rates, kes: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">UGX per USD</label>
          <input
            type="number"
            value={rates.ugx}
            onChange={e => setRates({ ...rates, ugx: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">TZS per USD</label>
          <input
            type="number"
            value={rates.tzs}
            onChange={e => setRates({ ...rates, tzs: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-kahawa-dark text-white rounded">
          Update Rates
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  )
}
