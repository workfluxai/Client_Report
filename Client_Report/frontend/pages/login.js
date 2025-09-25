import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return setMessage(error.message)
    setMessage('✅ Logged in!')
    router.push('/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input className="w-full px-3 py-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full px-3 py-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="bg-[#1877F2] w-full py-2 rounded text-white font-semibold hover:bg-[#145DBD]">Log In →</button>
        {message && <p className="text-center text-sm text-green-600">{message}</p>}
      </form>
    </div>
  )
}