import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

export default function HeroSection() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleFreeTrial() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: `demo_${Date.now()}@example.com`,
      password: 'StrongPassword123!'
    })
    if (error) setMessage(error.message)
    else setMessage('✅ Account created! Please login to continue.')
    setLoading(false)
  }

  return (
    <section className="flex flex-col md:flex-row items-center justify-between min-h-[90vh] px-8 md:px-20 bg-gradient-to-r from-blue-50 to-white">
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-5xl font-bold text-[#145DBD]">Stop wasting hours on weekly client reports</h1>
        <h2 className="text-xl md:text-2xl text-gray-700">
          Automatically generate polished, client-friendly updates from Slack & project tools.
        </h2>
        <div className="space-y-2">
          <button
            onClick={handleFreeTrial}
            disabled={loading}
            className="bg-[#1877F2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#145DBD] disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Free Trial →'}
          </button>
          <div><a href="/login" className="underline text-blue-600">Already a user? Login</a></div>
          {message && <p className="text-green-600 mt-2">{message}</p>}
        </div>
      </div>
      <div className="md:w-1/2 mt-8 md:mt-0">
        <img src="/report-mockup.png" alt="Sample Client Report" className="rounded-lg shadow-lg"/>
      </div>
    </section>
  )
}