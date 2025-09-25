export default function BenefitsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#145DBD]">Why Teams Love It</h2>
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto px-6 items-center">
        {/* Left: Benefits */}
        <ul className="space-y-4 text-lg">
          <li>✅ Save <strong>5+ hours/week</strong></li>
          <li>✅ Never forget updates – always consistent</li>
          <li>✅ Fewer status calls → happier clients</li>
          <li>✅ White‑label branding for agencies</li>
        </ul>
        
        {/* Right: Supporting image */}
        <div className="flex justify-center">
          <img 
            src="/dashboard-mockup.png" 
            alt="Client Dashboard" 
            className="rounded-lg shadow-lg max-w-sm"
          />
        </div>
      </div>
    </section>
  )
}