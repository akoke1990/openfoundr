#!/usr/bin/env node
/**
 * create-state-issues.js
 *
 * Creates a GitHub issue for every missing state.
 * Run once to populate the issue tracker with good first issues.
 *
 * Usage:
 *   GITHUB_TOKEN=your_token node scripts/create-state-issues.js
 *
 * Your token needs the `repo` scope.
 * Get one at: https://github.com/settings/tokens
 */

const OWNER = 'akoke1990'
const REPO  = 'openfoundr'
const TOKEN = process.env.GITHUB_TOKEN

if (!TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is required.')
  console.error('Usage: GITHUB_TOKEN=your_token node scripts/create-state-issues.js')
  process.exit(1)
}

const MISSING_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'Colorado',
  'Connecticut', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
]

async function createIssue(state) {
  const body = `## Add state data for ${state}

We need someone who knows **${state}** to contribute LLC filing data.

### What's needed

Copy \`data/states/_template.json\`, fill in ${state}'s data, and submit a PR. No coding required — you can do the whole thing in your browser on GitHub.

### Where to find the data

- **Secretary of State website:** Google "${state} secretary of state LLC filing"
- **SBA guide:** https://www.sba.gov/business-guide/launch-your-business/register-your-business

### Key fields to research

- LLC filing fee and link
- Processing time
- Annual report requirements and fee
- Publication requirement (rare — only NY and AZ require this)
- Any state-specific gotchas founders should know

### How to contribute

See [CONTRIBUTING.md](../blob/main/CONTRIBUTING.md) for full instructions. Takes about 15 minutes.

---

*If you're claiming this state, comment below so others know it's in progress.*`

  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      title: `Add state: ${state}`,
      body,
      labels: ['good first issue', 'state-data'],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to create issue for ${state}: ${err}`)
  }

  const issue = await res.json()
  return issue.number
}

async function main() {
  console.log(`Creating ${MISSING_STATES.length} issues on ${OWNER}/${REPO}...\n`)

  // Check labels exist first
  console.log('Ensuring labels exist...')
  for (const label of [
    { name: 'state-data', color: '0075ca', description: 'Contribution of state filing data' },
    { name: 'good first issue', color: '7057ff', description: 'Good for newcomers' },
  ]) {
    await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/labels`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
      },
      body: JSON.stringify(label),
    })
    // 422 means label already exists — that's fine
  }

  let created = 0
  let failed = 0

  for (const state of MISSING_STATES) {
    try {
      const num = await createIssue(state)
      console.log(`  ✓ #${num} — Add state: ${state}`)
      created++
      // Rate limit: 1 request per second to be safe
      await new Promise(r => setTimeout(r, 1000))
    } catch (err) {
      console.error(`  ✗ ${state}: ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. ${created} issues created, ${failed} failed.`)
  console.log(`View them at: https://github.com/${OWNER}/${REPO}/issues`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
