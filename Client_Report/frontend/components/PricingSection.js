export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#145DBD]">Simple, Transparent Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
        <div className="p-8 rounded-lg border text-center shadow">
          <h3 className="text-xl font-semibold mb-4">$29/mo Starter</h3>
          <p>1 project, unlimited reports</p>
          <button className="mt-6 bg-[#1877F2] hover:bg-[#145DBD] text-white px-6 py-3 rounded-lg">Start Free Trial</button>
        </div>
        <div className="p-8 rounded-lg border text-center shadow-lg bg-blue-50">
          <h3 className="text-xl font-semibold mb-4">$79/mo Agency</h3>
          <p>Up to 10 clients + white-label branding</p>
          <button className="mt-6 bg-[#1877F2] hover:bg-[#145DBD] text-white px-6 py-3 rounded-lg">Start Free Trial</button>
        </div>
        <div className="p-8 rounded-lg border text-center shadow">
          <h3 className="text-xl font-semibold mb-4">Custom</h3>
          <p>Contact us for enterprise</p>
          <button className="mt-6 bg-[#1877F2] hover:bg-[#145DBD] text-white px-6 py-3 rounded-lg">Request Demo</button>
        </div>
      </div>
    </section>
  )
}