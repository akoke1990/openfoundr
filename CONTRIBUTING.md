# Contributing to OpenFounder

First: thank you. Every contribution here directly helps a real person start their business.

This guide is written for everyone — you don't need to be a developer. The most valuable contributions right now are **state data files**, and adding one requires nothing more than editing a JSON file on GitHub.

---

## Ways to contribute

### 1. Add your state's data (highest impact, no coding required)

We currently have: California, Delaware, Florida, New York, Texas.

Every other state needs someone who knows it. If you live there, practice law there, do accounting there, or just recently formed an LLC there — your knowledge belongs here.

**How to add a state:**

1. Go to [`data/states/`](./data/states/) in this repo
2. Click the `_template.json` file to see the format
3. Click **Add file → Create new file**
4. Name it `your-state-name.json` (lowercase, hyphens, e.g. `north-carolina.json`)
5. Fill in the data (see the template — every field has a comment explaining it)
6. Submit a pull request with the title: `Add state: [State Name]`

That's it. You don't need to clone the repo. You don't need to run anything. You can do the whole thing in your browser.

**Where to find accurate data:**
- Your state's Secretary of State website (Google "[state name] secretary of state LLC filing")
- The SBA's state guides: https://www.sba.gov/business-guide/launch-your-business/register-your-business
- Your state's franchise tax board or department of revenue

**Be honest about what you know.** If you're not sure about a field, leave it as `null` and add a note. Accurate and incomplete is better than complete and wrong.

---

### 2. Improve existing state data

If you spot outdated information — fees change, links break, requirements shift — open an issue or submit a PR with the correction. Include the official source in your PR description.

---

### 3. Review legal templates

The operating agreement in `agent/tools.py` (Python) and `web/lib/tools.ts` (TypeScript) is a starting point, not a final product. If you're a lawyer or have significant experience with LLC formation:

- Review the clauses for accuracy and completeness
- Flag anything that needs state-specific variation
- Suggest missing provisions
- Open an issue tagged `legal-review` with your suggestions

---

### 4. Build the web interface

The Next.js web app in `/web` needs polish. Good first issues:

- **Document download** — when the agent generates an operating agreement, add a "Download as .docx" button
- **Session persistence** — save conversation state to localStorage so users don't lose progress on refresh
- **Mobile layout** — the chat interface needs testing and tuning on small screens
- **Dark mode** — straightforward Tailwind addition
- **Checklist export** — export the launch checklist as a printable PDF

Check open issues tagged `web` for more.

---

### 5. Add industry data

Different businesses need different permits. A food truck needs a food handler's permit. An electrician needs a contractor's license. A massage therapist needs a professional license.

We want to add `/data/industries/` files that capture permit requirements by industry. If you know what your industry actually requires, that knowledge is valuable.

Format: see `data/industries/_template.json` (coming soon).

---

### 6. Report inaccuracies

If something is wrong — a bad link, outdated fee, incorrect requirement — please open an issue. State and local requirements change constantly. The community is the only way to keep this accurate.

---

## Pull request guidelines

**For state data PRs:**
- Include the official source URL for each field in your PR description
- Note anything you're uncertain about
- If a requirement has a `null` value, explain why in the PR

**For code PRs:**
- Keep it focused — one thing per PR
- The TypeScript build must pass (`npx tsc --noEmit` in `/web`)
- The Python tools must import cleanly (`python -c "from agent.tools import *"`)
- Don't introduce new dependencies without discussion

**For template/legal PRs:**
- Explain your reasoning — what problem does this fix?
- If you're a lawyer, say so — it adds credibility to your review
- We'll always note that documents are starting points, not legal advice

---

## Project principles

**Accuracy over completeness.** It's better to say "we don't have data for Montana yet" than to show wrong information that misleads someone filing their LLC.

**Plain language over legal language.** Our audience is someone who has never started a business. If a clause in the operating agreement can be said more plainly without losing meaning, say it plainly.

**No upsells, ever.** This is a community resource. Nothing in this project should push users toward a paid service, including our own. Recommendations for tools (Mercury, QuickBooks, etc.) should be honest and unsponsored.

**Disclaim properly.** Every document we generate carries a disclaimer. Every piece of state guidance includes a link to the official source. We help people take action — we don't replace professionals.

---

## Questions?

Open an issue tagged `question`. We read everything.

And again — thank you for being here.
