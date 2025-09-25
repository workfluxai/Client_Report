export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#145DBD]">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
        <div className="text-center">
          <img src="/icons/connect.svg" className="mx-auto mb-4 h-12" />
          <h3 className="font-semibold mb-2">Connect your tools</h3>
          <p>Slack + Jira/Asana/Trello</p>
        </div>
        <div className="text-center">
          <img src="/icons/ai.svg" className="mx-auto mb-4 h-12" />
          <h3 className="font-semibold mb-2">AI generates your report</h3>
          <p>Updates, blockers, milestones</p>
        </div>
        <div className="text-center">
          <img src="/icons/share.svg" className="mx-auto mb-4 h-12" />
          <h3 className="font-semibold mb-2">Share instantly</h3>
          <p>Email, PDF or Client Portal</p>
        </div>
      </div>
    </section>
  )
}