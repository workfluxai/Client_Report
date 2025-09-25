// pages/subscription.js
export default function Subscription() {
  return (
    <main className="font-poppins px-12 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h1>
      <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="rounded-lg border p-8 shadow hover:shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">$29/mo Starter</h2>
          <p>1 project, unlimited reports</p>
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">Start Free Trial</button>
        </div>

        <div className="rounded-lg border p-8 shadow-lg bg-blue-50">
          <h2 className="text-2xl font-semibold mb-4">$79/mo Agency</h2>
          <p>Up to 10 clients, white-label branding</p>
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">Start Free Trial</button>
        </div>

        <div className="rounded-lg border p-8 shadow hover:shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Custom</h2>
          <p>Contact us for enterprise</p>
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">Request Demo</button>
        </div>
      </div>
    </main>
  )
}