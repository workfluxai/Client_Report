export default function Home() {
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
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
                Start Free Trial →
              </button>
              <div>
                <a href="#demo" className="underline text-blue-600">Request Demo</a>
              </div>
            </div>
          </div>
          <div className="w-2/5">
            <img src="/report-mockup.png" alt="Sample Client Report" className="rounded-lg shadow-lg"/>
          </div>
        </section>
        {/* Add How It Works, Benefits, Pricing, Testimonials, Form, Footer similarly */}
      </main>
    )
  }