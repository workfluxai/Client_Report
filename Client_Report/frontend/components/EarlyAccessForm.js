import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function EarlyAccessForm() {
  const [form, setForm] = useState({ name:'', email:'', company:'', role:'', tools:'', clients:'' })
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.from('early_access_requests').insert({
      name: form.name,
      email: form.email,
      company: form.company,
      role: form.role,
      tools: form.tools,
      clients_count: form.clients
    })
    if (error) setMessage(error.message)
    else {
      setMessage("✅ Request submitted! We'll be in touch.")
      setForm({ name:'', email:'', company:'', role:'', tools:'', clients:'' })
    }
  }

  return (
    <section className="py-20 bg-white text-center">
      <h2 className="text-3xl font-bold mb-6">Request Early Access</h2>
      <p className="mb-6 text-gray-700">Be among the first to automate your client reporting. Free trial included.</p>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <input type="text" placeholder="Name" className="w-full border rounded px-4 py-3" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input type="email" placeholder="Email" className="w-full border rounded px-4 py-3" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input type="text" placeholder="Company" className="w-full border rounded px-4 py-3" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/>
        <input type="text" placeholder="Role" className="w-full border rounded px-4 py-3" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}/>
        <input type="text" placeholder="Tools you use" className="w-full border rounded px-4 py-3" value={form.tools} onChange={e=>setForm({...form,tools:e.target.value})}/>
        <input type="number" placeholder="# of Clients" className="w-full border rounded px-4 py-3" value={form.clients} onChange={e=>setForm({...form,clients:e.target.value})}/>
        <button className="w-full bg-[#1877F2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#145DBD]">Request Free Trial →</button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </section>
  )
}