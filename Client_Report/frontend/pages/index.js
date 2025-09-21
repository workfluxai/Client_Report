import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

export default function Home() {
  // Track UI state
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  // Handle Free Trial signup
  async function handleFreeTrial() {
    setLoading(true)
    setMessage(null)

    // For demo: generate a random email (in production, show signup form or Stripe checkout)
    const demoEmail = `demo_${Date.now()}@example.com`
    const demoPassword = 'StrongPassword123!'

    const { data, error } = await supabase.auth.signUp({
      email: demoEmail,
      password: demoPassword,
    })

    if (error) {
      console.error('❌ Supabase Error:', error.message)
      setMessage(`Error: ${error.message}`)
    } else {
      console.log('✅ Supabase User Created:', data)
      setMessage(`Free trial started! (User: ${demoEmail})`)
    }

    setLoading(false)
  }

  return (
    <main className="font-poppins text-gray-900">
      {/* HERO */}
      <section className="flex items-center justify-between min-h-[90vh] px-12 bg-gradient-to-r from-blue-50 to-white">
        <div className="w-3/5 space-y-6">
          <h1 className="text-5xl font-bold">Stop wasting hours on weekly client reports</h1>
          <h2 className="text-2xl text-gray-700">
            Automatically generate polished, client-friendly updates from Slack &amp; project tools.
          </h2>
          <div className="space-y-2">
            <button
              onClick={handleFreeTrial}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Starting...' : 'Start Free Trial →'}
            </button>
            {message && <p className="text-green-600 font-medium">{message}</p>}
            <div>
              <a href="#demo" className="underline text-blue-600">
                Request Demo
              </a>
            </div>
          </div>
        </div>
        <div className="w-2/5">
          <img src="/report-mockup.png" alt="Sample Client Report" className="rounded-lg shadow-lg"/>
        </div>
      </section>

      {/* Add How It Works, Benefits, Pricing, Testimonials, Form, Footer here */}
    </main>
  )
}