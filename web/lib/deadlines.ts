import type { FounderProfile } from './types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComputedDeadline {
  type: string          // machine key, e.g. 'q1_estimated_tax'
  label: string         // human label, e.g. 'Q1 Estimated Tax Payment'
  due_date: Date
  details: string       // one sentence of context
  fee?: string          // e.g. '$300'
  link: string
  send_days_before: number  // 30 or 7 — one row per window
}

// ─── Quarterly estimated taxes (federal, fixed dates) ─────────────────────────

const IRS_ESTIMATED_TAX_LINK =
  'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes'

function quarterlyDeadlines(referenceDate: Date): ComputedDeadline[] {
  const year = referenceDate.getFullYear()
  const dates: Array<{ type: string; label: string; date: Date }> = [
    { type: 'q1_estimated_tax', label: 'Q1 Estimated Tax Payment', date: new Date(year, 3, 15) },
    { type: 'q2_estimated_tax', label: 'Q2 Estimated Tax Payment', date: new Date(year, 5, 15) },
    { type: 'q3_estimated_tax', label: 'Q3 Estimated Tax Payment', date: new Date(year, 8, 15) },
    { type: 'q4_estimated_tax', label: 'Q4 Estimated Tax Payment', date: new Date(year + 1, 0, 15) },
    // also next year's Q1 so the 30-day reminder fires before year rolls
    { type: 'q1_estimated_tax', label: 'Q1 Estimated Tax Payment', date: new Date(year + 1, 3, 15) },
  ]

  const cutoff = new Date(referenceDate)
  cutoff.setDate(cutoff.getDate() - 1) // anything after yesterday

  const deadlines: ComputedDeadline[] = []
  for (const { type, label, date } of dates) {
    if (date <= cutoff) continue
    for (const days of [30, 7]) {
      deadlines.push({
        type,
        label,
        due_date: date,
        details:
          'Self-employed founders must pay quarterly estimated taxes to avoid an underpayment penalty. Use IRS Form 1040-ES to calculate your amount.',
        link: IRS_ESTIMATED_TAX_LINK,
        send_days_before: days,
      })
    }
  }
  return deadlines
}

// ─── State annual report rules ────────────────────────────────────────────────

interface AnnualReportRule {
  // How to compute the due date each cycle
  kind: 'fixed_date'         // same month/day every year
      | 'anniversary_month'  // last day of the formation month, each year
      | 'within_days'        // N days after formation date (first filing only, then anniversary)
  month?: number   // 1–12, for fixed_date
  day?: number     // 1–31, for fixed_date (default 15)
  within_days?: number  // for within_days kind
  frequency_years: number
  label: string
  fee: string
  link: string
  details: string
}

const STATE_ANNUAL_REPORT: Record<string, AnnualReportRule> = {
  California: {
    kind: 'within_days',
    within_days: 90,
    frequency_years: 2,
    label: 'CA Statement of Information',
    fee: '$20',
    link: 'https://bizfileonline.sos.ca.gov/',
    details:
      'California requires an LLC Statement of Information within 90 days of formation, then every 2 years. Late fee is $250.',
  },
  Colorado: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'CO Periodic Report',
    fee: '$10',
    link: 'https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do',
    details: 'Colorado requires an annual Periodic Report due during your formation anniversary month.',
  },
  Delaware: {
    kind: 'fixed_date',
    month: 6,
    day: 1,
    frequency_years: 1,
    label: 'DE LLC Annual Tax',
    fee: '$300',
    link: 'https://corp.delaware.gov/paytaxes.shtml',
    details: 'Delaware charges a $300 flat annual LLC tax due June 1. Failure to pay results in a $200 penalty.',
  },
  Florida: {
    kind: 'fixed_date',
    month: 5,
    day: 1,
    frequency_years: 1,
    label: 'FL Annual Report',
    fee: '$138.75',
    link: 'https://dos.myflorida.com/sunbiz/manage-business/efile/annual-report/',
    details:
      'Florida annual reports are due May 1. Filing after May 1 but before the third Friday in September costs $538.75.',
  },
  Georgia: {
    kind: 'fixed_date',
    month: 4,
    day: 1,
    frequency_years: 1,
    label: 'GA Annual Registration',
    fee: '$50',
    link: 'https://sos.ga.gov/index.php/corporations/annual_registration',
    details: 'Georgia LLCs must file an Annual Registration by April 1 each year to maintain good standing.',
  },
  Illinois: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'IL Annual Report',
    fee: '$75',
    link: 'https://www.ilsos.gov/departments/business_services/home.html',
    details:
      'Illinois requires an annual report filed before the first day of your LLC\'s anniversary month each year.',
  },
  Massachusetts: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'MA Annual Report',
    fee: '$500',
    link: 'https://corp.sec.state.ma.us/CorpWeb/CorpSearch/CorpSearch.aspx',
    details:
      'Massachusetts annual reports are due on the anniversary date of your LLC formation. The $500 fee is among the highest in the country.',
  },
  Michigan: {
    kind: 'fixed_date',
    month: 2,
    day: 15,
    frequency_years: 1,
    label: 'MI Annual Statement',
    fee: '$25',
    link: 'https://www.michigan.gov/lara/bureau-list/bcs/corp',
    details: 'Michigan LLCs must file an Annual Statement by February 15 each year.',
  },
  'New Jersey': {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'NJ Annual Report',
    fee: '$75',
    link: 'https://www.njportal.com/DOR/BusinessFormation/',
    details:
      'New Jersey requires an annual report filed during your LLC\'s anniversary month.',
  },
  'New York': {
    kind: 'anniversary_month',
    frequency_years: 2,
    label: 'NY Biennial Statement',
    fee: '$9',
    link: 'https://www.businessexpress.ny.gov/',
    details:
      'New York LLCs must file a Biennial Statement every 2 years during the month of their formation anniversary.',
  },
  'North Carolina': {
    kind: 'fixed_date',
    month: 4,
    day: 15,
    frequency_years: 1,
    label: 'NC Annual Report',
    fee: '$200',
    link: 'https://www.sosnc.gov/online_services/annual_report/',
    details:
      'North Carolina annual reports are due April 15 — same as federal Tax Day, easy to remember. The $200 fee is on the higher end.',
  },
  // Ohio: no annual report required — omitted intentionally
  Texas: {
    kind: 'fixed_date',
    month: 5,
    day: 15,
    frequency_years: 1,
    label: 'TX Franchise Tax Report',
    fee: 'Varies (often $0 for small businesses)',
    link: 'https://comptroller.texas.gov/taxes/franchise/',
    details:
      'Texas LLCs must file a Franchise Tax Report by May 15 each year. Most small businesses owe $0 but the filing is still required.',
  },
  Virginia: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'VA Annual Registration',
    fee: '$50',
    link: 'https://www.scc.virginia.gov/pages/Annual-Registration-Fees',
    details:
      'Virginia requires an annual registration fee paid by the last day of your LLC\'s anniversary month.',
  },
  Washington: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'WA Annual Report',
    fee: '$60',
    link: 'https://ccfs.sos.wa.gov/',
    details:
      'Washington requires an annual report filed in your LLC\'s anniversary month.',
  },
  Alaska: {
    kind: 'fixed_date',
    month: 1,
    day: 2,
    frequency_years: 2,
    label: 'AK Biennial Report',
    fee: '$100',
    link: 'https://www.commerce.alaska.gov/cbp/main/search/entities',
    details: 'Alaska LLCs must file a Biennial Report by January 2 in even-numbered years.',
  },
  Alabama: {
    kind: 'fixed_date',
    month: 4,
    day: 15,
    frequency_years: 1,
    label: 'AL Annual Report',
    fee: '$100',
    link: 'https://www.sos.alabama.gov/government-records/business-entities',
    details: 'Alabama LLCs must file an Annual Report by April 15 each year, along with the Business Privilege Tax ($100 minimum).',
  },
  Arkansas: {
    kind: 'fixed_date',
    month: 5,
    day: 1,
    frequency_years: 1,
    label: 'AR Franchise Tax Report',
    fee: '$150+',
    link: 'https://www.sos.arkansas.gov/corps/index.php',
    details: 'Arkansas LLCs must file an Annual Franchise Tax Report by May 1. Minimum $150 based on total assets.',
  },
  Arizona: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'AZ Annual Report',
    fee: '$0',
    link: 'https://azcc.gov/',
    details: 'Arizona LLCs must file a free Annual Report in their anniversary month to remain in good standing.',
  },
  Connecticut: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'CT Annual Report',
    fee: '$80',
    link: 'https://www.ctbusiness.ct.gov/',
    details: 'Connecticut LLCs must file an Annual Report in their anniversary month. The $80 fee is due at filing.',
  },
  Hawaii: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'HI Annual Report',
    fee: '$15',
    link: 'https://hbe.ehawaii.gov/documents/home.html',
    details: 'Hawaii LLCs must file an Annual Report in the quarter they were formed. The $15 fee is among the lowest in the country.',
  },
  Iowa: {
    kind: 'fixed_date',
    month: 4,
    day: 1,
    frequency_years: 2,
    label: 'IA Biennial Report',
    fee: '$60',
    link: 'https://sos.iowa.gov/business/index.html',
    details: 'Iowa LLCs must file a Biennial Report by April 1 in odd-numbered years, regardless of when they formed.',
  },
  Idaho: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'ID Annual Report',
    fee: '$0',
    link: 'https://sos.idaho.gov/corps/corpindex.html',
    details: 'Idaho LLCs must file a free Annual Report in their anniversary month. No fee — just file to stay in good standing.',
  },
  Indiana: {
    kind: 'anniversary_month',
    frequency_years: 2,
    label: 'IN Business Entity Report',
    fee: '$32',
    link: 'https://inbiz.in.gov/',
    details: 'Indiana LLCs must file a Business Entity Report every 2 years in their anniversary month. The $32 fee is very reasonable.',
  },
  Kansas: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'KS Annual Report',
    fee: '$55',
    link: 'https://www.sos.ks.gov/businesses/bus_annual_reports.html',
    details: 'Kansas LLCs must file an Annual Report in their anniversary month each year.',
  },
  Kentucky: {
    kind: 'fixed_date',
    month: 6,
    day: 30,
    frequency_years: 1,
    label: 'KY Annual Report',
    fee: '$15',
    link: 'https://www.sos.ky.gov/bus/business-filings/',
    details: 'Kentucky LLCs must file an Annual Report by June 30 each year. At $15, it\'s one of the cheapest in the country.',
  },
  Louisiana: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'LA Annual Report',
    fee: '$35',
    link: 'https://www.sos.la.gov/BusinessServices/Pages/default.aspx',
    details: 'Louisiana LLCs must file an Annual Report in their anniversary month each year.',
  },
  Maryland: {
    kind: 'fixed_date',
    month: 4,
    day: 15,
    frequency_years: 1,
    label: 'MD Annual Report',
    fee: '$300',
    link: 'https://dat.maryland.gov/businesses/Pages/Annual-Report.aspx',
    details: 'Maryland LLCs must file an Annual Report by April 15. The $300 fee is one of the highest in the country — plan for it.',
  },
  Maine: {
    kind: 'fixed_date',
    month: 6,
    day: 1,
    frequency_years: 1,
    label: 'ME Annual Report',
    fee: '$85',
    link: 'https://www.maine.gov/sos/cec/corp/service.html',
    details: 'Maine LLCs must file an Annual Report by June 1 each year.',
  },
  Minnesota: {
    kind: 'fixed_date',
    month: 12,
    day: 31,
    frequency_years: 1,
    label: 'MN Annual Renewal',
    fee: '$0',
    link: 'https://mblsportal.sos.state.mn.us/',
    details: 'Minnesota LLCs must file a free Annual Renewal by December 31 each year. Missing this date results in "not in good standing" status.',
  },
  Mississippi: {
    kind: 'fixed_date',
    month: 4,
    day: 15,
    frequency_years: 1,
    label: 'MS Annual Report',
    fee: '$0',
    link: 'https://www.sos.ms.gov/BusinessServices/Pages/default.aspx',
    details: 'Mississippi LLCs must file a free Annual Report by April 15 each year. No fee — just file online.',
  },
  Montana: {
    kind: 'fixed_date',
    month: 4,
    day: 15,
    frequency_years: 1,
    label: 'MT Annual Report',
    fee: '$15',
    link: 'https://biz.sosmt.gov/',
    details: 'Montana LLCs must file an Annual Report by April 15 each year. Only $15 — one of the most affordable in the country.',
  },
  'North Dakota': {
    kind: 'fixed_date',
    month: 11,
    day: 15,
    frequency_years: 1,
    label: 'ND Annual Report',
    fee: '$50',
    link: 'https://www.sos.nd.gov/business/business-services',
    details: 'North Dakota LLCs must file an Annual Report by November 15 each year.',
  },
  Nebraska: {
    kind: 'anniversary_month',
    frequency_years: 2,
    label: 'NE Biennial Report',
    fee: '$30',
    link: 'https://www.nebraska.gov/sos/corp/corpsearch.cgi',
    details: 'Nebraska LLCs must file a Biennial Report in their anniversary month in odd-numbered years. Only $30.',
  },
  'New Hampshire': {
    kind: 'fixed_date',
    month: 4,
    day: 1,
    frequency_years: 1,
    label: 'NH Annual Report',
    fee: '$100',
    link: 'https://www.sos.nh.gov/corporations/index.htm',
    details: 'New Hampshire LLCs must file an Annual Report by April 1 each year.',
  },
  Nevada: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'NV Annual List + Business License',
    fee: '$350',
    link: 'https://esos.nv.gov/',
    details: 'Nevada LLCs must file an Annual List ($150) and renew their State Business License ($200) in their anniversary month. Total $350.',
  },
  Oklahoma: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'OK Annual Certificate',
    fee: '$25',
    link: 'https://www.sos.ok.gov/',
    details: 'Oklahoma LLCs must file an Annual Certificate in their anniversary month. Only $25.',
  },
  Oregon: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'OR Annual Report',
    fee: '$100',
    link: 'https://sos.oregon.gov/business/Pages/annual-report.aspx',
    details: 'Oregon LLCs must file an Annual Report in their anniversary month each year.',
  },
  'Rhode Island': {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'RI Annual Report',
    fee: '$50',
    link: 'https://business.sos.ri.gov/',
    details: 'Rhode Island LLCs must file an Annual Report in their anniversary month. Note: RI also charges a $400 minimum franchise tax separately.',
  },
  'South Carolina': {
    kind: 'fixed_date',
    month: 4,
    day: 1,
    frequency_years: 1,
    label: 'SC Annual Report',
    fee: '$0',
    link: 'https://businessfilings.sc.gov/',
    details: 'South Carolina LLCs must file a free Annual Report by April 1 each year. No fee — just file to maintain good standing.',
  },
  'South Dakota': {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'SD Annual Report',
    fee: '$50',
    link: 'https://sdsos.gov/business-services/',
    details: 'South Dakota LLCs must file an Annual Report in their anniversary month each year.',
  },
  Tennessee: {
    kind: 'fixed_date',
    month: 4,
    day: 1,
    frequency_years: 1,
    label: 'TN Annual Report',
    fee: '$300',
    link: 'https://tnbear.tn.gov/',
    details: 'Tennessee LLCs must file an Annual Report by April 1. The $300 fee is one of the highest in the country — budget for it every year.',
  },
  Utah: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'UT Annual Renewal',
    fee: '$18',
    link: 'https://secure.utah.gov/bes/',
    details: 'Utah LLCs must file an Annual Renewal in their anniversary month. At $18, it\'s one of the most affordable in the country.',
  },
  Vermont: {
    kind: 'fixed_date',
    month: 3,
    day: 15,
    frequency_years: 1,
    label: 'VT Annual Report',
    fee: '$35',
    link: 'https://bizfilings.vermont.gov/',
    details: 'Vermont LLCs must file an Annual Report by March 15 each year.',
  },
  Wisconsin: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'WI Annual Report',
    fee: '$25',
    link: 'https://www.wdfi.org/corporations/',
    details: 'Wisconsin LLCs must file an Annual Report in their anniversary quarter each year.',
  },
  'West Virginia': {
    kind: 'fixed_date',
    month: 7,
    day: 1,
    frequency_years: 1,
    label: 'WV Annual Report',
    fee: '$25',
    link: 'https://business4.wv.gov/',
    details: 'West Virginia LLCs must file an Annual Report by July 1 each year regardless of formation date.',
  },
  Wyoming: {
    kind: 'anniversary_month',
    frequency_years: 1,
    label: 'WY Annual Report',
    fee: '$60',
    link: 'https://wyobiz.wyo.gov/',
    details: 'Wyoming LLCs must file an Annual Report in their anniversary month. Fee is $60 or 0.0002 × total assets (whichever is greater). Most small businesses pay $60.',
  },
  // Missouri and New Mexico have no annual report requirement — omitted intentionally
  // Pennsylvania only requires a decennial (10-year) report — omitted from annual reminders
}

// ─── CA franchise tax (bonus — $800/year on top of annual report) ────────────

function caFranchiseTax(formationDate: Date, referenceDate: Date): ComputedDeadline[] {
  const deadlines: ComputedDeadline[] = []
  const startYear = Math.max(formationDate.getFullYear() + 1, referenceDate.getFullYear())
  for (let year = startYear; year <= referenceDate.getFullYear() + 1; year++) {
    const due = new Date(year, 2, 15) // March 15
    if (due <= referenceDate) continue
    for (const days of [30, 7]) {
      deadlines.push({
        type: 'ca_franchise_tax',
        label: 'CA Minimum Franchise Tax',
        due_date: due,
        details:
          'California charges a minimum $800 franchise tax per year, due by March 15 for calendar-year filers. This is owed even if your LLC made no money.',
        fee: '$800',
        link: 'https://www.ftb.ca.gov/pay/index.html',
        send_days_before: days,
      })
    }
  }
  return deadlines
}

// ─── Annual report deadline computation ───────────────────────────────────────

function annualReportDeadlines(
  stateName: string,
  formationDate: Date,
  referenceDate: Date
): ComputedDeadline[] {
  const rule = STATE_ANNUAL_REPORT[stateName]
  if (!rule) return []

  const deadlines: ComputedDeadline[] = []
  const candidates: Date[] = []

  if (rule.kind === 'fixed_date') {
    // Same month/day each year for the next 2 years
    const day = rule.day ?? 15
    for (let offset = 0; offset <= 2; offset++) {
      candidates.push(new Date(referenceDate.getFullYear() + offset, rule.month! - 1, day))
    }
  } else if (rule.kind === 'anniversary_month') {
    // Last day of the formation month, each cycle
    for (let offset = 0; offset <= 2; offset++) {
      const yr = formationDate.getFullYear() + Math.ceil(offset * rule.frequency_years) +
        Math.floor((referenceDate.getFullYear() - formationDate.getFullYear()) / rule.frequency_years) * rule.frequency_years
      const dueYear = yr
      // last day of anniversary month
      const lastDay = new Date(dueYear, formationDate.getMonth() + 1, 0)
      candidates.push(lastDay)
    }
  } else if (rule.kind === 'within_days') {
    // First filing: formationDate + within_days
    const firstDue = new Date(formationDate)
    firstDue.setDate(firstDue.getDate() + (rule.within_days ?? 90))
    candidates.push(firstDue)
    // Subsequent filings: every frequency_years years from first due
    for (let i = 1; i <= 3; i++) {
      const next = new Date(firstDue)
      next.setFullYear(next.getFullYear() + rule.frequency_years * i)
      candidates.push(next)
    }
  }

  const yesterday = new Date(referenceDate)
  yesterday.setDate(yesterday.getDate() - 1)

  for (const due of candidates) {
    if (due <= yesterday) continue
    for (const days of [30, 7]) {
      deadlines.push({
        type: `annual_report_${stateName.toLowerCase().replace(/\s+/g, '_')}`,
        label: rule.label,
        due_date: due,
        details: rule.details,
        fee: rule.fee,
        link: rule.link,
        send_days_before: days,
      })
    }
  }

  // Deduplicate: only the next 2 actual due dates (4 rows: 2 dates × 2 windows)
  const seen = new Set<string>()
  return deadlines.filter(d => {
    const key = d.due_date.toISOString().slice(0, 10)
    if (seen.has(key)) return true // both windows for same date are fine
    seen.add(key)
    return seen.size <= 2
  })
}

// ─── Domain renewal reminders ─────────────────────────────────────────────────

function domainRenewalDeadlines(formationDate: Date, referenceDate: Date): ComputedDeadline[] {
  const deadlines: ComputedDeadline[] = []
  const cutoff = new Date(referenceDate)
  cutoff.setDate(cutoff.getDate() - 1)

  // Assume domain was registered around formation time; remind annually
  for (let yearOffset = 0; yearOffset <= 2; yearOffset++) {
    const due = new Date(formationDate)
    due.setFullYear(formationDate.getFullYear() + yearOffset + 1)
    if (due <= cutoff) continue

    for (const days of [30, 7]) {
      deadlines.push({
        type: 'domain_renewal',
        label: 'Domain Name Renewal',
        due_date: due,
        details:
          'Your domain name likely renews annually. Log in to your registrar (Namecheap, GoDaddy, etc.) to confirm your renewal date and ensure auto-renew is on. A lapsed domain can be snatched by others.',
        fee: '$10–$20',
        link: 'https://www.namecheap.com/',
        send_days_before: days,
      })
    }
    break // only the next upcoming renewal
  }
  return deadlines
}

// ─── Business license renewal reminders ──────────────────────────────────────

function businessLicenseDeadlines(formationDate: Date, referenceDate: Date): ComputedDeadline[] {
  const deadlines: ComputedDeadline[] = []
  const cutoff = new Date(referenceDate)
  cutoff.setDate(cutoff.getDate() - 1)

  // Many cities/counties renew business licenses January 31. Generate for next 2 years.
  const refYear = referenceDate.getFullYear()
  for (const year of [refYear, refYear + 1]) {
    const due = new Date(year, 0, 31) // January 31
    if (due <= cutoff) continue

    for (const days of [30, 7]) {
      deadlines.push({
        type: 'business_license_renewal',
        label: 'Business License Renewal',
        due_date: due,
        details:
          'Most cities and counties require an annual business license renewal, typically due in January. Check with your local city hall or county clerk to confirm your deadline and fee.',
        fee: '$25–$500 (varies by city)',
        link: 'https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits',
        send_days_before: days,
      })
    }
    break // only the next upcoming renewal
  }
  return deadlines
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function computeDeadlines(
  profile: FounderProfile,
  formationDate: Date,
  referenceDate: Date = new Date()
): ComputedDeadline[] {
  const all: ComputedDeadline[] = []

  // Quarterly taxes (everyone who isn't a sole prop with no income, but include anyway)
  all.push(...quarterlyDeadlines(referenceDate))

  // Annual report
  all.push(...annualReportDeadlines(profile.state, formationDate, referenceDate))

  // CA franchise tax bonus
  if (profile.state === 'California' && profile.entityType === 'llc') {
    all.push(...caFranchiseTax(formationDate, referenceDate))
  }

  // Domain renewal (annual, based on formation date anniversary)
  all.push(...domainRenewalDeadlines(formationDate, referenceDate))

  // Business license renewal (annual, January 31 — most common city deadline)
  all.push(...businessLicenseDeadlines(formationDate, referenceDate))

  return all
}
