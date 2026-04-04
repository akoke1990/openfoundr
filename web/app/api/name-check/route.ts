export const runtime = 'edge'

// State business name search URLs (Secretary of State / equivalent)
const STATE_SEARCH: Record<string, { url: string; label: string }> = {
  AL: { url: 'https://arc-sos.state.al.us/cgi/corpname.mbr/input', label: 'Alabama SOS' },
  AK: { url: 'https://www.commerce.alaska.gov/cbp/main/search/entities', label: 'Alaska Commerce' },
  AZ: { url: 'https://ecorp.azcc.gov/EntitySearch/Index', label: 'Arizona ACC' },
  AR: { url: 'https://www.sos.arkansas.gov/corps/search_all.php', label: 'Arkansas SOS' },
  CA: { url: 'https://bizfileonline.sos.ca.gov/search/business', label: 'California BizFile' },
  CO: { url: 'https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do', label: 'Colorado SOS' },
  CT: { url: 'https://service.ct.gov/business/s/onlinebusinesssearch', label: 'Connecticut Business' },
  DE: { url: 'https://icis.corp.delaware.gov/Ecorp/EntitySearch/NameSearch.aspx', label: 'Delaware Corp Search' },
  FL: { url: 'https://search.sunbiz.org/Inquiry/CorporationSearch/ByName', label: 'Florida SunBiz' },
  GA: { url: 'https://ecorp.sos.ga.gov/BusinessSearch', label: 'Georgia SOS' },
  HI: { url: 'https://hbe.ehawaii.gov/documents/search.html', label: 'Hawaii Business Express' },
  ID: { url: 'https://sosbiz.idaho.gov/search/business', label: 'Idaho SOS' },
  IL: { url: 'https://apps.ilsos.gov/corporatellc/', label: 'Illinois SOS' },
  IN: { url: 'https://bsd.sos.in.gov/publicbusinesssearch', label: 'Indiana Business Search' },
  IA: { url: 'https://sos.iowa.gov/search/business/search.aspx', label: 'Iowa SOS' },
  KS: { url: 'https://www.sos.ks.gov/corps/busn_srch.html', label: 'Kansas SOS' },
  KY: { url: 'https://web.sos.ky.gov/ftsearch/', label: 'Kentucky SOS' },
  LA: { url: 'https://coraweb.sos.la.gov/commercialsearch/commercialsearch.aspx', label: 'Louisiana SOS' },
  ME: { url: 'https://icrs.informe.org/nei-sos-icrs/ICRS?MainPage=x', label: 'Maine Business' },
  MD: { url: 'https://egov.maryland.gov/BusinessExpress/EntitySearch', label: 'Maryland Business Express' },
  MA: { url: 'https://corp.sec.state.ma.us/CorpWeb/CorpSearch/CorpSearch.aspx', label: 'Massachusetts Corp Search' },
  MI: { url: 'https://cofs.lara.state.mi.us/CorpWeb/CorpSearch/CorpSearch.aspx', label: 'Michigan LARA' },
  MN: { url: 'https://mblsportal.sos.state.mn.us/Business/Search', label: 'Minnesota Business Search' },
  MS: { url: 'https://business.sos.ms.gov/corp-web/CorpSearch.aspx', label: 'Mississippi SOS' },
  MO: { url: 'https://bsd.sos.mo.gov/BusinessEntity/BESearch.aspx', label: 'Missouri SOS' },
  MT: { url: 'https://biz.sosmt.gov/search', label: 'Montana Business Search' },
  NE: { url: 'https://www.nebraska.gov/sos/corp/corpsearch.cgi', label: 'Nebraska SOS' },
  NV: { url: 'https://esos.nv.gov/EntitySearch/OnlineEntitySearch', label: 'Nevada SOS' },
  NH: { url: 'https://quickstart.sos.nh.gov/online/Account/LandingPage', label: 'New Hampshire SOS' },
  NJ: { url: 'https://www.njportal.com/DOR/BusinessNameSearch', label: 'New Jersey Business Name' },
  NM: { url: 'https://portal.sos.state.nm.us/BFS/online/CorporationBusinessSearch', label: 'New Mexico SOS' },
  NY: { url: 'https://apps.dos.ny.gov/publicInquiry/', label: 'New York DOS' },
  NC: { url: 'https://www.sosnc.gov/online_services/search/by_title/_Business_Registration', label: 'North Carolina SOS' },
  ND: { url: 'https://firststop.sos.nd.gov/search/business', label: 'North Dakota SOS' },
  OH: { url: 'https://businesssearch.ohiosos.gov', label: 'Ohio SOS' },
  OK: { url: 'https://www.sos.ok.gov/corp/corpsearch.aspx', label: 'Oklahoma SOS' },
  OR: { url: 'https://sos.oregon.gov/business/pages/find.aspx', label: 'Oregon SOS' },
  PA: { url: 'https://www.corporations.pa.gov/search/corpsearch', label: 'Pennsylvania Business Search' },
  RI: { url: 'https://business.sos.ri.gov/corpsearch/corpsearch.aspx', label: 'Rhode Island SOS' },
  SC: { url: 'https://businessfilings.sc.gov/BusinessFiling/Entity/Search', label: 'South Carolina Business' },
  SD: { url: 'https://sosenterprise.sd.gov/BusinessServices/Business/FilingSearch.aspx', label: 'South Dakota SOS' },
  TN: { url: 'https://tnbear.tn.gov/Ecommerce/FilingSearch.aspx', label: 'Tennessee BEAR' },
  TX: { url: 'https://mycpa.cpa.state.tx.us/coa/Index.html', label: 'Texas Comptroller' },
  UT: { url: 'https://secure.utah.gov/bes/index.html', label: 'Utah Business Entity' },
  VT: { url: 'https://bizfilings.vermont.gov/online/DatabrokerInquiry/', label: 'Vermont Business Filings' },
  VA: { url: 'https://cis.scc.virginia.gov/', label: 'Virginia SCC' },
  WA: { url: 'https://ccfs.sos.wa.gov/#/', label: 'Washington SOS' },
  WV: { url: 'https://apps.wv.gov/wvsos/corp-onlineresource/business-entity/', label: 'West Virginia SOS' },
  WI: { url: 'https://www.wdfi.org/apps/CorpSearch/Results.aspx', label: 'Wisconsin DFI' },
  WY: { url: 'https://wyobiz.wyo.gov/Business/FilingSearch.aspx', label: 'Wyoming Business' },
}

// TLDs to check with their RDAP endpoints
const TLDS = [
  { tld: 'com', rdap: (slug: string) => `https://rdap.verisign.com/com/v1/domain/${slug}.com` },
  { tld: 'co',  rdap: (slug: string) => `https://rdap.nic.co/domain/${slug}.co` },
  { tld: 'io',  rdap: (slug: string) => `https://rdap.nic.io/domain/${slug}.io` },
  { tld: 'net', rdap: (slug: string) => `https://rdap.verisign.com/net/v1/domain/${slug}.net` },
]

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+(llc|inc|corp|ltd|co\.?|limited|incorporated)\.?$/i, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 63)
}

async function checkDomain(url: string): Promise<'available' | 'taken' | 'unknown'> {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/rdap+json' },
      signal: AbortSignal.timeout(6000),
    })
    if (res.status === 404) return 'available'
    if (res.status === 200) return 'taken'
    return 'unknown'
  } catch {
    return 'unknown'
  }
}

export async function POST(req: Request) {
  const { name, stateAbbr } = await req.json() as { name: string; stateAbbr: string }

  if (!name?.trim()) {
    return Response.json({ error: 'name is required' }, { status: 400 })
  }

  const slug = toSlug(name.trim())

  if (!slug) {
    return Response.json({ error: 'Could not generate a valid domain slug from that name' }, { status: 400 })
  }

  // Check all TLDs in parallel
  const domainResults = await Promise.all(
    TLDS.map(async ({ tld, rdap }) => ({
      tld,
      domain: `${slug}.${tld}`,
      status: await checkDomain(rdap(slug)),
    }))
  )

  const stateSearch = STATE_SEARCH[stateAbbr?.toUpperCase()] ?? null

  return Response.json({ slug, domains: domainResults, stateSearch })
}
