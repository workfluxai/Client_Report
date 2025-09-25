export default function SampleReportSection() {
  return (
    <section className="py-20 bg-white text-center">
      <h2 className="text-3xl font-bold mb-8 text-[#145DBD]">Your Clients See This</h2>

      <div className="flex flex-col items-center space-y-6">
        <img 
          src="/report-mockup.png" 
          alt="Sample Weekly Report" 
          className="mx-auto rounded-lg shadow-lg max-w-3xl"
        />
        <p className="text-gray-700 text-lg">
          Automated → Client‑Ready → Branded
        </p>
      </div>
    </section>
  )
}