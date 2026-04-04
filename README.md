# OpenFounder 🌱

**Free, open source AI guide that helps anyone start a business — from legal formation to first day of operations.**

Starting a business shouldn't cost $2,000 in lawyer fees before you've made a dollar. OpenFounder walks real people through the real steps: choosing an entity, drafting an operating agreement, filing with the state, getting an EIN, opening a bank account, setting up email, building a website, and knowing what licenses they actually need.

Completely free. No upsell. No account required. Built by the community, for the community.

---

## What it does

OpenFounder is a conversational AI agent powered by Claude. You tell it what you're building and where, and it guides you through four phases:

**Phase 1 — Legal Foundation**
- Recommends the right business entity (LLC, S-Corp, sole proprietorship, C-Corp)
- Drafts a complete operating agreement tailored to your situation
- Walks you through exactly what to file, where, and what it costs — with direct links

**Phase 2 — Financial Infrastructure**
- Recommends the right business bank account for your stage
- Explains your tax obligations plainly (quarterly estimates, SE tax, what you can deduct)
- Sets you up with basic bookkeeping from day one

**Phase 3 — Digital Presence**
- Domain registration and professional email setup
- Website builder recommendation matched to your type of business
- DNS setup walkthrough

**Phase 4 — Operations & Compliance**
- Local business license identification
- Minimum viable insurance guidance
- Personalized launch checklist with time and cost estimates

---

## Who this is for

- A first-generation entrepreneur opening a cleaning business
- A freelancer formalizing what they've been doing informally
- A tradesperson (plumber, electrician, contractor) going solo
- Two friends starting a business together who need an operating agreement
- Anyone who can't afford $500/hour for a lawyer to answer basic questions

---

## Quickstart

```bash
# 1. Clone the repo
git clone https://github.com/openfoundr/openfoundr.git
cd openfoundr

# 2. Install dependencies
pip install -r requirements.txt

# 3. # 3. Get a free Groq API key (no credit card required)
# Sign up at https://console.groq.com and create an API key
cp web/.env.example web/.env.local
# Edit web/.env.local and add your OPENAI_API_KEY=gsk_...

# 4. Run the agent
python main.py
```

That's it. The agent starts a conversation and guides you from there.

---

## Project structure

```
openfoundr/
├── agent/
│   ├── agent.py        # Core agent loop and conversation management
│   ├── tools.py        # All tool implementations (entity rec, doc gen, etc.)
│   └── prompts.py      # System prompt — the agent's personality and knowledge
├── data/
│   └── states/         # State-specific filing data (JSON)
│       ├── new-york.json
│       ├── california.json
│       ├── texas.json
│       ├── florida.json
│       └── delaware.json
├── outputs/            # Generated documents saved here (gitignored)
├── main.py             # CLI entry point
├── requirements.txt
└── .env.example
```

---

## Contributing

This project lives or dies by community contributions. Here's where help is most needed:

### Add your state
We currently have data for NY, CA, TX, FL, and DE. Every other state needs someone who knows it.

Copy `data/states/new-york.json` and fill in your state's:
- LLC filing fee and link
- Processing time
- Publication requirements (if any)
- Annual report requirements and fees
- Registered agent rules
- State-specific gotchas

Submit a PR. That's it. You don't need to be a developer — it's just a JSON file.

### Improve the templates
Are you a lawyer? Review the operating agreement logic in `agent/tools.py` and suggest improvements. Flag clauses that need state-specific variation.

### Add industry data
We want to add permit requirements by industry type. If you know what a food truck needs in Texas, or what a contractor needs in New York, that knowledge belongs here.

### Build the web interface
We need a Next.js web app that wraps this agent so anyone with a browser can use it — no terminal, no API key. See `CONTRIBUTING.md` for the spec.

### Report inaccuracies
State requirements change. If you spot outdated information, open an issue. Accuracy is everything for a project like this.

---

## Important disclaimers

OpenFounder is not a law firm and does not provide legal advice. Information provided is for educational purposes and as a starting point. For complex situations — multi-member LLCs with unusual structures, regulated industries, fundraising — consult a licensed attorney. OpenFounder helps you know what questions to ask and how to take action on the straightforward parts.

---

## Built with

- [Anthropic Claude](https://www.anthropic.com/) — the AI model powering the agent
- Python 3.9+
- Love for small business owners everywhere

---

## License

MIT License — use it, fork it, build on it.

---

*OpenFounder is an independent open source project. If it helped you start your business, pay it forward: contribute your state's data, review a PR, or just tell someone else about it.*
