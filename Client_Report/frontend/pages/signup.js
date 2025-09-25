import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSignup(e) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage(`✅ Account created for ${email}`)
  }

  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleSignup} className="p-8 bg-white rounded-xl shadow-md space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 w-full rounded">
          Create Account
        </button>
        {message && <p className="text-green-600">{message}</p>}
      </form>
    </main>
  )
}