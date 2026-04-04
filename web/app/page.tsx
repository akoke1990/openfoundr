import Link from 'next/link'

const phases = [
  {
    number: '01',
    title: 'Legal foundation',
    color: 'bg-forest-50 border-forest-200',
    numColor: 'text-forest-700',
    items: [
      'LLC vs S-Corp vs sole prop — explained plainly',
      'Operating agreement drafted for your situation',
      'Exactly what to file, where, and what it costs',
    ],
  },
  {
    number: '02',
    title: 'Financial infrastructure',
    color: 'bg-blue-50 border-blue-200',
    numColor: 'text-blue-700',
    items: [
      'Right business bank account for your stage',
      'Tax obligations in plain English',
      'Bookkeeping setup from day one',
    ],
  },
  {
    number: '03',
    title: 'Digital presence',
    color: 'bg-amber-50 border-amber-200',
    numColor: 'text-amber-700',
    items: [
      'Domain registration walkthrough',
      'Professional email setup (Google Workspace)',
      'Website builder matched to your business type',
    ],
  },
  {
    number: '04',
    title: 'Operations & compliance',
    color: 'bg-purple-50 border-purple-200',
    numColor: 'text-purple-700',
    items: [
      'Licenses and permits you actually need',
      'Minimum viable insurance guidance',
      'Personalized launch checklist with links',
    ],
  },
]

const forWho = [
  'A first-generation entrepreneur with no idea where to start',
  'A freelancer formalizing what they\'ve been doing informally',
  'A plumber, electrician, or contractor going out on their own',
  'Two friends starting a business who need an operating agreement',
  'Anyone who can\'t afford $500/hour for a lawyer to answer basic questions',
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-semibold text-gray-900">OpenFounder</span>
          </div>
          <a
            href="https://github.com/openfoundr/openfoundr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-forest-50 text-forest-700 text-xs font-medium px-3 py-1.5 rounded-full border border-forest-200 mb-8">
          <span className="w-1.5 h-1.5 bg-forest-600 rounded-full"></span>
          Free &amp; open source — no account required
        </div>

        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight mb-6 max-w-3xl mx-auto">
          Everything you need to launch your business
          <span className="text-forest-700"> — free.</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          OpenFounder is a free AI guide that walks you from "I have an idea" to
          a legally operating business — entity formation, operating agreements,
          EIN, banking, email, and website. Step by step. In plain English.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/workspace"
            className="bg-forest-700 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-forest-800 transition-colors text-base"
          >
            Start for free →
          </Link>
          <Link
            href="/start"
            className="border border-gray-200 text-gray-700 px-8 py-3.5 rounded-lg font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors text-base"
          >
            Guided questionnaire
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          No sign-up. No credit card. No upsell. Just help.
        </p>
      </section>

      {/* Phases */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-100">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-8 text-center">
          What we cover
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((phase) => (
            <div key={phase.number} className={`rounded-xl border p-5 ${phase.color}`}>
              <div className={`text-xs font-semibold mb-3 ${phase.numColor}`}>
                {phase.number}
              </div>
              <div className="font-medium text-gray-900 mb-3 text-sm">{phase.title}</div>
              <ul className="space-y-1.5">
                {phase.items.map((item) => (
                  <li key={item} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5 shrink-0">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-semibold text-gray-900 text-xl mb-2">Who this is for</h2>
          <p className="text-gray-500 text-sm mb-8">
            If you've ever Googled "how to start an LLC" and gotten lost, this is for you.
          </p>
          <ul className="space-y-3">
            {forWho.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-forest-600 mt-0.5 text-sm shrink-0">✓</span>
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Open source CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-100">
        <div className="bg-gray-900 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-white font-semibold text-2xl mb-3">Built by the community</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            OpenFounder is open source. Every state's filing data, every document template,
            every piece of guidance is community-maintained. If you're a lawyer, accountant,
            or founder who knows your state well — your contributions directly help people
            starting businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://github.com/openfoundr/openfoundr"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              Contribute on GitHub
            </a>
            <a
              href="https://github.com/openfoundr/openfoundr/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-700 text-gray-300 px-6 py-3 rounded-lg font-medium text-sm hover:border-gray-500 transition-colors"
            >
              Add your state's data
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span>🌱</span>
            <span className="font-medium text-gray-700 text-sm">OpenFounder</span>
          </div>
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            OpenFounder is not a law firm and does not provide legal advice. Information
            provided is educational and a starting point — not a substitute for professional
            legal or tax counsel. MIT License.
          </p>
        </div>
      </footer>

    </div>
  )
}
