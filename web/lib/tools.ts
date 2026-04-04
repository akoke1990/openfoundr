// Edge-compatible tools — no fs/path imports, state data inlined
// Supports 15 states. Add more by editing /data/states/ and rebuilding.

const STATE_MAP: Record<string, string> = {
  "ca": "california",
  "california": "california",
  "co": "colorado",
  "colorado": "colorado",
  "de": "delaware",
  "delaware": "delaware",
  "fl": "florida",
  "florida": "florida",
  "ga": "georgia",
  "georgia": "georgia",
  "il": "illinois",
  "illinois": "illinois",
  "ma": "massachusetts",
  "massachusetts": "massachusetts",
  "mi": "michigan",
  "michigan": "michigan",
  "nj": "new-jersey",
  "new jersey": "new-jersey",
  "ny": "new-york",
  "new york": "new-york",
  "nc": "north-carolina",
  "north carolina": "north-carolina",
  "oh": "ohio",
  "ohio": "ohio",
  "tx": "texas",
  "texas": "texas",
  "va": "virginia",
  "virginia": "virginia",
  "wa": "washington",
  "washington": "washington",
  "ak": "alaska",
  "alaska": "alaska",
  "al": "alabama",
  "alabama": "alabama",
  "ar": "arkansas",
  "arkansas": "arkansas",
  "az": "arizona",
  "arizona": "arizona",
  "ct": "connecticut",
  "connecticut": "connecticut",
  "hi": "hawaii",
  "hawaii": "hawaii",
  "ia": "iowa",
  "iowa": "iowa",
  "id": "idaho",
  "idaho": "idaho",
  "in": "indiana",
  "indiana": "indiana",
  "ks": "kansas",
  "kansas": "kansas",
  "ky": "kentucky",
  "kentucky": "kentucky",
  "la": "louisiana",
  "louisiana": "louisiana",
  "md": "maryland",
  "maryland": "maryland",
  "me": "maine",
  "maine": "maine",
  "mn": "minnesota",
  "minnesota": "minnesota",
  "mo": "missouri",
  "missouri": "missouri",
  "ms": "mississippi",
  "mississippi": "mississippi",
  "mt": "montana",
  "montana": "montana",
  "nd": "north-dakota",
  "north dakota": "north-dakota",
  "ne": "nebraska",
  "nebraska": "nebraska",
  "nh": "new-hampshire",
  "new hampshire": "new-hampshire",
  "nm": "new-mexico",
  "new mexico": "new-mexico",
  "nv": "nevada",
  "nevada": "nevada",
  "ok": "oklahoma",
  "oklahoma": "oklahoma",
  "or": "oregon",
  "oregon": "oregon",
  "pa": "pennsylvania",
  "pennsylvania": "pennsylvania",
  "ri": "rhode-island",
  "rhode island": "rhode-island",
  "sc": "south-carolina",
  "south carolina": "south-carolina",
  "sd": "south-dakota",
  "south dakota": "south-dakota",
  "tn": "tennessee",
  "tennessee": "tennessee",
  "ut": "utah",
  "utah": "utah",
  "vt": "vermont",
  "vermont": "vermont",
  "wi": "wisconsin",
  "wisconsin": "wisconsin",
  "wv": "west-virginia",
  "west virginia": "west-virginia",
  "wy": "wyoming",
  "wyoming": "wyoming"
}

const STATE_DATA: Record<string, Record<string, unknown>> = {
  "california": {
    "name": "California",
    "abbreviation": "CA",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 70,
      "filing_link": "https://bizfileonline.sos.ca.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Statement of Information",
        "required": true,
        "fee": 20,
        "frequency": "Every 2 years",
        "due": "Within 90 days of formation, then every 2 years",
        "link": "https://bizfileonline.sos.ca.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent (called 'Agent for Service of Process') with a physical CA address."
      },
      "state_tax": {
        "annual_minimum_fee": 800,
        "notes": "IMPORTANT: California charges a minimum $800 franchise tax per year, due even if your LLC made no money. First year may be waived depending on formation date. This is the biggest cost surprise for CA LLCs."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk's office",
      "dba_fee_range": "$25\u2013$55 depending on county"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.ca.gov/business-programs/business-entities",
      "phone": "916-657-5448"
    },
    "notes": "California's $800 minimum franchise tax is a real cost that surprises many first-time founders. Budget for it every year. Also note that CA LLCs with income over $250,000 pay additional fees. The CA Franchise Tax Board (FTB) administers this, separate from the SOS."
  },
  "colorado": {
    "name": "Colorado",
    "abbreviation": "CO",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 50,
      "filing_link": "https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do",
      "online_filing_available": true,
      "processing_time_standard": "Immediate online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Periodic Report",
        "required": true,
        "fee": 10,
        "frequency": "Annual",
        "due": "During the anniversary month",
        "notes": "One of the lowest annual fees in the country. Very business-friendly.",
        "link": "https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical CO address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Colorado has a flat 4.4% income tax rate. No minimum franchise tax for LLCs."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk and Recorder",
      "dba_fee_range": "$20\u2013$35"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.state.co.us/biz/",
      "phone": "303-894-2200"
    },
    "notes": "Colorado is one of the most affordable and fastest states to form an LLC \u2014 $50 to file, immediate processing online, and only $10/year to maintain. Great for lean startups.",
    "_last_verified": "2025-01-01"
  },
  "delaware": {
    "name": "Delaware",
    "abbreviation": "DE",
    "llc": {
      "filing_name": "Certificate of Formation",
      "filing_fee": 90,
      "filing_link": "https://corp.delaware.gov/howtoform.shtml",
      "online_filing_available": true,
      "processing_time_standard": "1-3 business days",
      "processing_time_expedited": "Same day for $100, 1-hour for $1,000",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual LLC Tax",
        "required": true,
        "fee": 300,
        "frequency": "Annual",
        "due": "June 1 each year",
        "notes": "Flat $300/year regardless of revenue or activity. No separate annual report form needed.",
        "link": "https://corp.delaware.gov/paytaxes.shtml"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical DE address. Most founders use a commercial registered agent service (~$50\u2013$150/year) since they don't have a DE address."
      },
      "state_tax": {
        "annual_minimum_fee": 300,
        "notes": "Flat $300/year. Simple and predictable."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Prothonotary's office",
      "dba_fee_range": "$25 flat"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://corp.delaware.gov/",
      "phone": "302-739-3073"
    },
    "notes": "Delaware is the gold standard for startups planning to raise venture capital \u2014 investors expect it. However, if you're a small business operating locally and not raising VC, forming in your home state is usually simpler and cheaper (you'd need to register as a 'foreign LLC' in your home state anyway, paying fees twice). Delaware makes sense if: (1) you plan to raise VC, (2) you want strong legal precedent and privacy, or (3) you have multiple out-of-state members."
  },
  "florida": {
    "name": "Florida",
    "abbreviation": "FL",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 125,
      "filing_link": "https://dos.myflorida.com/sunbiz/manage-business/efile/fl-llc/",
      "online_filing_available": true,
      "processing_time_standard": "2-3 business days online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 138.75,
        "frequency": "Annual",
        "due": "May 1 each year (late fee after May 1: $400)",
        "notes": "Do NOT miss May 1. The late fee is $400 and if you miss the third Friday of September, your LLC is dissolved.",
        "link": "https://dos.myflorida.com/sunbiz/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical FL street address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Florida has no personal income tax. LLCs taxed as partnerships or sole props pay no FL income tax. Single-member LLCs are typically disregarded entities for FL tax purposes."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk's office",
      "dba_fee_range": "$50\u2013$75 depending on county"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://dos.myflorida.com/sunbiz/",
      "phone": "850-245-6052"
    },
    "notes": "Florida's Sunbiz portal is one of the most user-friendly state filing systems. Watch the May 1 annual report deadline carefully \u2014 the $400 late fee is a nasty surprise."
  },
  "georgia": {
    "name": "Georgia",
    "abbreviation": "GA",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 100,
      "filing_link": "https://ecorp.sos.ga.gov/",
      "online_filing_available": true,
      "processing_time_standard": "5-7 business days online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Registration",
        "required": true,
        "fee": 50,
        "frequency": "Annual",
        "due": "April 1 each year",
        "notes": "Late fee is $25. Due April 1 \u2014 easy to remember.",
        "link": "https://ecorp.sos.ga.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical GA address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Georgia has no minimum franchise tax for LLCs. Pass-through income taxed at the owner's personal rate."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Superior Court Clerk",
      "dba_fee_range": "$25\u2013$50"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sos.ga.gov/index.php/corporations",
      "phone": "404-656-2817"
    },
    "notes": "Georgia is one of the more affordable and straightforward states for LLC formation. The eCorp portal is well-designed and easy to use.",
    "_last_verified": "2025-01-01"
  },
  "illinois": {
    "name": "Illinois",
    "abbreviation": "IL",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 150,
      "filing_link": "https://www.ilsos.gov/departments/business_services/home.html",
      "online_filing_available": true,
      "processing_time_standard": "10-15 business days",
      "processing_time_expedited": "24 hours for $100 extra",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 75,
        "frequency": "Annual",
        "due": "Before the first day of the anniversary month",
        "notes": "Late fee is $300. Missing two years in a row dissolves your LLC.",
        "link": "https://www.ilsos.gov/departments/business_services/home.html"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical IL address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Illinois has a personal property replacement tax of 1.5% of net income for LLCs taxed as partnerships."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk's office",
      "dba_fee_range": "$25\u2013$50 depending on county"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.ilsos.gov/departments/business_services/home.html",
      "phone": "217-782-6961"
    },
    "notes": "Watch the annual report deadline carefully \u2014 the $300 late fee is steep. Illinois also has a personal property replacement tax that catches many LLC owners off guard.",
    "_last_verified": "2025-01-01"
  },
  "massachusetts": {
    "name": "Massachusetts",
    "abbreviation": "MA",
    "llc": {
      "filing_name": "Certificate of Organization",
      "filing_fee": 500,
      "filing_link": "https://corp.sec.state.ma.us/CorpWeb/CorpSearch/CorpSearch.aspx",
      "online_filing_available": true,
      "processing_time_standard": "5-7 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 500,
        "frequency": "Annual",
        "due": "March 15 each year (fiscal year = calendar year) or within 2.5 months of fiscal year end",
        "notes": "IMPORTANT: Massachusetts has one of the highest LLC fees in the country \u2014 $500 to form AND $500 every year to maintain. Budget $500/year ongoing.",
        "link": "https://corp.sec.state.ma.us/CorpWeb/CorpSearch/CorpSearch.aspx"
      },
      "registered_agent": {
        "required": true,
        "notes": "Called 'Resident Agent' in MA. Must have a physical MA address."
      },
      "state_tax": {
        "annual_minimum_fee": 500,
        "notes": "The $500 annual report fee is effectively a minimum annual cost. Massachusetts is one of the most expensive states for LLCs."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "City or Town Clerk",
      "dba_fee_range": "$20\u2013$50"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sec.state.ma.us/cor/coridx.htm",
      "phone": "617-727-9640"
    },
    "notes": "Massachusetts is one of the most expensive states to maintain an LLC \u2014 $500/year just in state fees. If you're an early-stage business with low revenue, factor this in carefully.",
    "_last_verified": "2025-01-01"
  },
  "michigan": {
    "name": "Michigan",
    "abbreviation": "MI",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 50,
      "filing_link": "https://www.michigan.gov/lara/bureau-list/bcs/corps",
      "online_filing_available": true,
      "processing_time_standard": "10-15 business days",
      "processing_time_expedited": "24 hours for $50 extra",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Statement",
        "required": true,
        "fee": 25,
        "frequency": "Annual",
        "due": "February 15 each year",
        "notes": "Due February 15 every year regardless of when you formed. Mark your calendar.",
        "link": "https://www.michigan.gov/lara/bureau-list/bcs/corps"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical MI address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Michigan has a flat 4.25% income tax. No minimum franchise tax for LLCs."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk",
      "dba_fee_range": "$10\u2013$25"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.michigan.gov/lara/bureau-list/bcs/corps",
      "phone": "517-241-6470"
    },
    "notes": "Michigan's February 15 annual statement deadline is fixed regardless of when you formed \u2014 don't miss it.",
    "_last_verified": "2025-01-01"
  },
  "new-jersey": {
    "name": "New Jersey",
    "abbreviation": "NJ",
    "llc": {
      "filing_name": "Certificate of Formation",
      "filing_fee": 125,
      "filing_link": "https://www.njportal.com/DOR/BusinessFormation/",
      "online_filing_available": true,
      "processing_time_standard": "5-10 business days",
      "processing_time_expedited": "Same day for $50 extra",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 75,
        "frequency": "Annual",
        "due": "Last day of anniversary month",
        "notes": "Due on the last day of the month your LLC was formed.",
        "link": "https://www.njportal.com/DOR/BusinessFormation/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Called 'Registered Agent' in NJ. Must have a physical NJ address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "NJ has a minimum Urban Enterprise Zone tax that may apply. Most small LLCs pay no minimum tax beyond the annual report fee."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk's office",
      "dba_fee_range": "$50"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.njconsumeraffairs.gov/blic/Pages/llc.aspx",
      "phone": "973-504-6200"
    },
    "notes": "New Jersey is a common state for businesses near NYC. Note that if you form in NJ but also operate in NY, you may need to register in both states.",
    "_last_verified": "2025-01-01"
  },
  "new-york": {
    "name": "New York",
    "abbreviation": "NY",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 200,
      "filing_link": "https://apps.dos.ny.gov/publicInquiry/",
      "online_filing_available": true,
      "processing_time_standard": "7-10 business days",
      "processing_time_expedited": "24 hours for $25 extra",
      "publication_requirement": true,
      "publication_notes": "IMPORTANT: New York requires you to publish a notice of formation in two newspapers in your county for 6 consecutive weeks. Estimated cost: $1,000\u2013$2,000 depending on county. Manhattan is the most expensive (~$2,000). This must be done within 120 days of formation or your LLC can be suspended.",
      "annual_report": {
        "name": "Biennial Statement",
        "required": true,
        "fee": 9,
        "frequency": "Every 2 years",
        "due": "During the month your LLC was formed",
        "link": "https://www.businessexpress.ny.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical NY address. You can be your own registered agent if you have a NY address."
      },
      "state_tax": {
        "annual_minimum_fee": 25,
        "notes": "NY LLCs pay an annual filing fee based on gross income, minimum $25. Separate from NYC's UBT (Unincorporated Business Tax) if you're in NYC."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk's office",
      "dba_fee_range": "$25\u2013$35 depending on county"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.dos.ny.gov/corps/",
      "phone": "518-473-2492"
    },
    "notes": "New York's publication requirement is the most expensive and confusing part of forming an LLC here. Budget for it upfront. Delaware LLCs can operate in NY as foreign entities but still need to register (and still have the publication requirement)."
  },
  "north-carolina": {
    "name": "North Carolina",
    "abbreviation": "NC",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 125,
      "filing_link": "https://www.sosnc.gov/online_services/business_registration/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 200,
        "frequency": "Annual",
        "due": "April 15 each year",
        "notes": "NC's $200 annual report fee is on the higher end. Due April 15 \u2014 same as Tax Day, easy to remember.",
        "link": "https://www.sosnc.gov/online_services/annual_report/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical NC address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "North Carolina has a flat 4.75% income tax rate (and dropping). No minimum franchise tax for LLCs."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Register of Deeds",
      "dba_fee_range": "$26"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sosnc.gov/divisions/business_registration",
      "phone": "919-814-5400"
    },
    "notes": "North Carolina's $200 annual report fee is worth knowing upfront. The state has been reducing its income tax rate consistently, making it increasingly business-friendly.",
    "_last_verified": "2025-01-01"
  },
  "ohio": {
    "name": "Ohio",
    "abbreviation": "OH",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 99,
      "filing_link": "https://www.ohiosos.gov/businesses/business-filings/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "No annual report required",
        "required": false,
        "fee": 0,
        "frequency": "None",
        "due": "N/A",
        "notes": "Ohio does not require LLCs to file annual reports. This is a significant advantage.",
        "link": ""
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical OH address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Ohio has a Commercial Activity Tax (CAT) on gross receipts over $150,000. Most small businesses are exempt or pay very little."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Recorder",
      "dba_fee_range": "$39"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.ohiosos.gov/businesses/",
      "phone": "877-767-3453"
    },
    "notes": "Ohio is very business-friendly: no annual report requirement saves time and money every year. One of the few states with no ongoing filing obligation.",
    "_last_verified": "2025-01-01"
  },
  "texas": {
    "name": "Texas",
    "abbreviation": "TX",
    "llc": {
      "filing_name": "Certificate of Formation",
      "filing_fee": 300,
      "filing_link": "https://www.sos.state.tx.us/corp/forms_option.shtml",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Franchise Tax Report",
        "required": true,
        "fee": 0,
        "frequency": "Annual",
        "due": "May 15 each year",
        "notes": "Most small LLCs (under ~$2.47M gross revenue) pay $0 in franchise tax but must still file the annual report. No fee for the report itself.",
        "link": "https://comptroller.texas.gov/taxes/franchise/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical TX street address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Texas has no personal income tax and most small LLCs pay $0 franchise tax. One of the most business-friendly states."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk's office",
      "dba_fee_range": "$15\u2013$25 depending on county"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.state.tx.us/corp/",
      "phone": "512-463-5555"
    },
    "notes": "Texas is one of the most founder-friendly states: no personal income tax, low franchise tax burden for small businesses, reasonable filing fees."
  },
  "virginia": {
    "name": "Virginia",
    "abbreviation": "VA",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 100,
      "filing_link": "https://www.scc.virginia.gov/clk/elecfil.aspx",
      "online_filing_available": true,
      "processing_time_standard": "1-3 business days online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Registration Fee",
        "required": true,
        "fee": 50,
        "frequency": "Annual",
        "due": "Last day of anniversary month",
        "notes": "Virginia calls it a registration fee, not a report \u2014 no form to fill out, just pay online.",
        "link": "https://www.scc.virginia.gov/clk/elecfil.aspx"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical VA address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Virginia has a 5.75% income tax rate. No minimum franchise tax for LLCs."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Circuit Court Clerk",
      "dba_fee_range": "$10\u2013$25"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.scc.virginia.gov/clk/",
      "phone": "804-371-9733"
    },
    "notes": "Virginia's SCC portal is one of the faster state filing systems. The annual fee is simple \u2014 just pay online, no form required.",
    "_last_verified": "2025-01-01"
  },
  "washington": {
    "name": "Washington",
    "abbreviation": "WA",
    "llc": {
      "filing_name": "Certificate of Formation",
      "filing_fee": 230,
      "filing_link": "https://ccfs.sos.wa.gov/",
      "online_filing_available": true,
      "processing_time_standard": "2-3 business days online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 71,
        "frequency": "Annual",
        "due": "End of anniversary month",
        "notes": "Washington's filing fee is one of the higher ones. Budget accordingly.",
        "link": "https://ccfs.sos.wa.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical WA address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Washington has no personal income tax \u2014 a major advantage. LLCs may owe Business & Occupation (B&O) tax based on gross receipts, not profit. Rates vary by industry (typically 0.471%\u20131.5%)."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Secretary of State",
      "dba_fee_range": "$5 (very affordable)"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.wa.gov/corps/",
      "phone": "360-725-0377"
    },
    "notes": "Washington's B&O tax is unusual \u2014 it taxes gross receipts, not profit, which means even unprofitable businesses can owe tax. Learn about it early so it doesn't surprise you.",
    "_last_verified": "2025-01-01"
  },
  "alaska": {
    "name": "Alaska",
    "abbreviation": "AK",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 250,
      "filing_link": "https://www.commerce.alaska.gov/cbp/",
      "online_filing_available": true,
      "processing_time_standard": "5-10 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Biennial Report",
        "required": true,
        "fee": 100,
        "frequency": "Biennial",
        "due": "January 2 of even-numbered years",
        "notes": "Alaska requires a report every two years, not annually.",
        "link": "https://www.commerce.alaska.gov/cbp/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical AK address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Alaska has no state income tax and no state sales tax \u2014 one of the most tax-friendly states for businesses."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Alaska DCCED",
      "dba_fee_range": "$25\u2013$50"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.commerce.alaska.gov/cbp/",
      "phone": "907-465-2550"
    },
    "notes": "Alaska has no state income tax or sales tax \u2014 great long-term savings. The biennial report (every 2 years) keeps ongoing compliance simple.",
    "_last_verified": "2025-01-01"
  },
  "alabama": {
    "name": "Alabama",
    "abbreviation": "AL",
    "llc": {
      "filing_name": "Certificate of Formation",
      "filing_fee": 200,
      "filing_link": "https://www.sos.alabama.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Business Privilege Tax Return",
        "required": true,
        "fee": 100,
        "frequency": "Annual",
        "due": "April 15",
        "notes": "Alabama's annual report is combined with the Business Privilege Tax, minimum $100 for LLCs.",
        "link": "https://myalabamataxes.alabama.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical AL address."
      },
      "state_tax": {
        "annual_minimum_fee": 100,
        "notes": "Alabama has a Business Privilege Tax with a minimum $100/year for LLCs, filed with the annual report."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Probate Court",
      "dba_fee_range": "$10\u2013$50"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.alabama.gov/",
      "phone": "334-242-5324"
    },
    "notes": "Alabama combines the annual report with the Business Privilege Tax \u2014 one filing, minimum $100, due April 15. Don't miss it or penalties accrue quickly.",
    "_last_verified": "2025-01-01"
  },
  "arkansas": {
    "name": "Arkansas",
    "abbreviation": "AR",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 45,
      "filing_link": "https://www.sos.arkansas.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Franchise Tax Report",
        "required": true,
        "fee": 150,
        "frequency": "Annual",
        "due": "May 1",
        "notes": "Arkansas charges a $150 flat franchise tax for LLCs, due May 1 each year.",
        "link": "https://www.arkansas.gov/atap/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical AR address."
      },
      "state_tax": {
        "annual_minimum_fee": 150,
        "notes": "Arkansas levies a $150 annual franchise tax on LLCs in addition to state income tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Arkansas Secretary of State",
      "dba_fee_range": "$22\u2013$30"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.arkansas.gov/",
      "phone": "501-682-3409"
    },
    "notes": "Arkansas has one of the lowest LLC formation fees ($45) but don't forget the $150 annual franchise tax due May 1 \u2014 it catches new founders off guard.",
    "_last_verified": "2025-01-01"
  },
  "arizona": {
    "name": "Arizona",
    "abbreviation": "AZ",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 50,
      "filing_link": "https://azcc.gov/",
      "online_filing_available": true,
      "processing_time_standard": "14-16 business days (expedited available)",
      "publication_requirement": true,
      "annual_report": {
        "name": "Annual Report",
        "required": false,
        "fee": 0,
        "frequency": "None",
        "due": "N/A",
        "notes": "Arizona LLCs do NOT file annual reports with the state \u2014 a significant advantage.",
        "link": "https://azcc.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a statutory agent with a physical AZ address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Arizona has a 4.9% flat corporate income tax rate for LLCs taxed as corporations. Pass-through LLCs pay personal income tax (2.5% flat rate)."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk",
      "dba_fee_range": "$10\u2013$30"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://azcc.gov/",
      "phone": "602-542-4285"
    },
    "notes": "Arizona's publication requirement means you must publish a notice in a local newspaper for 3 consecutive weeks after forming your LLC \u2014 typically costs $150\u2013$300 depending on the county. No annual reports after that.",
    "_last_verified": "2025-01-01"
  },
  "connecticut": {
    "name": "Connecticut",
    "abbreviation": "CT",
    "llc": {
      "filing_name": "Certificate of Organization",
      "filing_fee": 120,
      "filing_link": "https://portal.ct.gov/sots",
      "online_filing_available": true,
      "processing_time_standard": "5-7 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 80,
        "frequency": "Annual",
        "due": "March 31",
        "notes": "Connecticut annual reports are due March 31 each year, regardless of formation date.",
        "link": "https://portal.ct.gov/sots"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical CT address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Connecticut has a 6.99% pass-through entity tax plus a $250 minimum business entity tax for LLCs with gross receipts over $100K."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Town/City Clerk",
      "dba_fee_range": "$10\u2013$30"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://portal.ct.gov/sots",
      "phone": "860-509-6002"
    },
    "notes": "Connecticut has a fixed March 31 annual report deadline for all LLCs regardless of when you formed. Set a calendar reminder \u2014 late fees are $50.",
    "_last_verified": "2025-01-01"
  },
  "hawaii": {
    "name": "Hawaii",
    "abbreviation": "HI",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 50,
      "filing_link": "https://cca.hawaii.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 15,
        "frequency": "Annual",
        "due": "End of anniversary quarter",
        "notes": "Hawaii's $15 annual report fee is one of the lowest in the country.",
        "link": "https://cca.hawaii.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical HI address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Hawaii requires a General Excise Tax (GET) license \u2014 a 4% tax on gross business income, not just profit. Register with Hawaii DOR before you open."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Hawaii DCCA",
      "dba_fee_range": "$50"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://cca.hawaii.gov/",
      "phone": "808-586-2727"
    },
    "notes": "Hawaii's General Excise Tax (GET) is unique \u2014 it applies to virtually all business activity at 4%, including services. You must register for a GET license separately from your LLC formation.",
    "_last_verified": "2025-01-01"
  },
  "iowa": {
    "name": "Iowa",
    "abbreviation": "IA",
    "llc": {
      "filing_name": "Certificate of Organization",
      "filing_fee": 50,
      "filing_link": "https://sos.iowa.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Biennial Report",
        "required": true,
        "fee": 45,
        "frequency": "Biennial",
        "due": "April 1 of odd-numbered years",
        "notes": "Iowa only requires a report every two years, due April 1 in odd years (2025, 2027, etc.).",
        "link": "https://sos.iowa.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical IA address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Iowa has a flat 5.5% personal income tax rate (as of 2025). No separate LLC franchise tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Iowa Secretary of State",
      "dba_fee_range": "$5"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sos.iowa.gov/",
      "phone": "515-281-5204"
    },
    "notes": "Iowa only requires a biennial report (every 2 years), which keeps ongoing compliance minimal. One of the most affordable states to maintain an LLC.",
    "_last_verified": "2025-01-01"
  },
  "idaho": {
    "name": "Idaho",
    "abbreviation": "ID",
    "llc": {
      "filing_name": "Certificate of Organization",
      "filing_fee": 100,
      "filing_link": "https://sos.idaho.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 0,
        "frequency": "Annual",
        "due": "End of anniversary month",
        "notes": "Idaho requires an annual report but charges no fee \u2014 just file online to keep your LLC active.",
        "link": "https://sos.idaho.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical ID address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Idaho has a 5.8% flat corporate income tax rate. No separate LLC minimum tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Idaho Secretary of State",
      "dba_fee_range": "$25"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sos.idaho.gov/",
      "phone": "208-334-2300"
    },
    "notes": "Idaho's annual report has no filing fee \u2014 just submit it online to avoid administrative dissolution. Low overhead state for small businesses.",
    "_last_verified": "2025-01-01"
  },
  "indiana": {
    "name": "Indiana",
    "abbreviation": "IN",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 95,
      "filing_link": "https://inbiz.in.gov/",
      "online_filing_available": true,
      "processing_time_standard": "1-3 business days online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Business Entity Report",
        "required": true,
        "fee": 32,
        "frequency": "Biennial",
        "due": "End of anniversary month, every 2 years",
        "notes": "Indiana requires a Business Entity Report every 2 years, not annually. $32 online.",
        "link": "https://inbiz.in.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical IN address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Indiana has a low 3.15% flat personal income tax rate (2025). No separate LLC franchise tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Recorder",
      "dba_fee_range": "$7\u2013$35"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://inbiz.in.gov/",
      "phone": "317-232-6576"
    },
    "notes": "Indiana's biennial report ($32 every 2 years) and low income tax rate make it one of the more affordable states for ongoing LLC maintenance.",
    "_last_verified": "2025-01-01"
  },
  "kansas": {
    "name": "Kansas",
    "abbreviation": "KS",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 165,
      "filing_link": "https://www.sos.ks.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 55,
        "frequency": "Annual",
        "due": "April 15",
        "notes": "Kansas annual reports are due April 15 and filed with the Secretary of State.",
        "link": "https://www.sos.ks.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical KS address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Kansas has no LLC franchise tax. Pass-through income is taxed at individual rates (up to 5.7%)."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Kansas Secretary of State",
      "dba_fee_range": "$30"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.ks.gov/",
      "phone": "785-296-4564"
    },
    "notes": "Kansas has a straightforward LLC process. The April 15 annual report deadline aligns with tax season \u2014 easy to remember but easy to forget if you're overwhelmed with taxes.",
    "_last_verified": "2025-01-01"
  },
  "kentucky": {
    "name": "Kentucky",
    "abbreviation": "KY",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 40,
      "filing_link": "https://www.sos.ky.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 15,
        "frequency": "Annual",
        "due": "June 30",
        "notes": "Kentucky has one of the lowest annual report fees in the US at just $15.",
        "link": "https://www.sos.ky.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical KY address."
      },
      "state_tax": {
        "annual_minimum_fee": 175,
        "notes": "Kentucky has a $175 annual Limited Liability Entity Tax (LLET) minimum, even for small LLCs. This is separate from income tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk",
      "dba_fee_range": "$10\u2013$25"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.ky.gov/",
      "phone": "502-564-3490"
    },
    "notes": "Kentucky's LLC formation is very cheap ($40) and the $15 annual report is the lowest in the country. But watch out for the $175 Limited Liability Entity Tax \u2014 it's a hidden annual cost many founders miss.",
    "_last_verified": "2025-01-01"
  },
  "louisiana": {
    "name": "Louisiana",
    "abbreviation": "LA",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 100,
      "filing_link": "https://www.sos.la.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 30,
        "frequency": "Annual",
        "due": "Anniversary date",
        "notes": "Louisiana annual reports are due on the anniversary of your LLC's formation date.",
        "link": "https://www.sos.la.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical LA address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Louisiana has a tiered income tax with a top rate of 4.25%. No separate LLC franchise minimum."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Louisiana Secretary of State",
      "dba_fee_range": "$75"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.la.gov/",
      "phone": "225-925-4704"
    },
    "notes": "Louisiana's annual report ($30) is due on your LLC's anniversary date, which varies by business. Keep track of your exact formation date.",
    "_last_verified": "2025-01-01"
  },
  "maryland": {
    "name": "Maryland",
    "abbreviation": "MD",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 100,
      "filing_link": "https://dat.maryland.gov/",
      "online_filing_available": true,
      "processing_time_standard": "4-6 weeks (standard); 7 business days (expedited +$50)",
      "publication_requirement": false,
      "annual_report": {
        "name": "Personal Property Return",
        "required": true,
        "fee": 300,
        "frequency": "Annual",
        "due": "April 15",
        "notes": "Maryland's annual filing is a Personal Property Return filed with SDAT, minimum $300.",
        "link": "https://dat.maryland.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a resident agent with a physical MD address."
      },
      "state_tax": {
        "annual_minimum_fee": 300,
        "notes": "Maryland's Personal Property Return has a minimum $300 annual filing fee. Actual fees can be higher based on property value."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Circuit Court",
      "dba_fee_range": "$25\u2013$50"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://dat.maryland.gov/",
      "phone": "410-767-1184"
    },
    "notes": "Maryland's standard processing can take up to 6 weeks \u2014 plan ahead or pay for expedited service. The $300 annual Personal Property Return is filed with SDAT (not SoS), which confuses many founders.",
    "_last_verified": "2025-01-01"
  },
  "maine": {
    "name": "Maine",
    "abbreviation": "ME",
    "llc": {
      "filing_name": "Certificate of Formation",
      "filing_fee": 175,
      "filing_link": "https://www.maine.gov/sos/cec/corp/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 85,
        "frequency": "Annual",
        "due": "June 1",
        "notes": "Maine annual reports are due June 1 for all LLCs regardless of formation date.",
        "link": "https://www.maine.gov/sos/cec/corp/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical ME address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Maine has a graduated income tax rate up to 7.15%. No separate LLC minimum franchise tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Maine Secretary of State",
      "dba_fee_range": "$125"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.maine.gov/sos/cec/corp/",
      "phone": "207-624-7736"
    },
    "notes": "Maine has a fixed June 1 annual report deadline for all LLCs. Mark it on your calendar from day one.",
    "_last_verified": "2025-01-01"
  },
  "minnesota": {
    "name": "Minnesota",
    "abbreviation": "MN",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 155,
      "filing_link": "https://www.sos.state.mn.us/",
      "online_filing_available": true,
      "processing_time_standard": "5-7 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Renewal",
        "required": true,
        "fee": 25,
        "frequency": "Annual",
        "due": "December 31",
        "notes": "Minnesota's annual renewal is due December 31 each year \u2014 a fixed year-end deadline for all LLCs.",
        "link": "https://www.sos.state.mn.us/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical MN address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Minnesota has a graduated income tax with a top rate of 9.85%. No separate LLC minimum franchise tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Minnesota Secretary of State",
      "dba_fee_range": "$30"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.state.mn.us/",
      "phone": "651-296-2803"
    },
    "notes": "Minnesota's December 31 annual renewal deadline is easy to remember but easy to overlook during the holidays. Set a November reminder. The $25 fee is very reasonable.",
    "_last_verified": "2025-01-01"
  },
  "missouri": {
    "name": "Missouri",
    "abbreviation": "MO",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 50,
      "filing_link": "https://www.sos.mo.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": false,
        "fee": 0,
        "frequency": "None",
        "due": "N/A",
        "notes": "Missouri does NOT require LLCs to file annual reports \u2014 one of the most LLC-friendly states in this regard.",
        "link": "https://www.sos.mo.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical MO address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Missouri has a 4.95% flat income tax rate. No franchise tax or annual report fee for LLCs."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Recorder of Deeds",
      "dba_fee_range": "$7\u2013$15"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.mo.gov/",
      "phone": "573-751-4153"
    },
    "notes": "Missouri is one of the best states for low-overhead LLC maintenance \u2014 $50 to form, no annual report, no franchise tax. Just file your taxes and you're done.",
    "_last_verified": "2025-01-01"
  },
  "mississippi": {
    "name": "Mississippi",
    "abbreviation": "MS",
    "llc": {
      "filing_name": "Certificate of Formation",
      "filing_fee": 50,
      "filing_link": "https://www.sos.ms.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 0,
        "frequency": "Annual",
        "due": "April 15",
        "notes": "Mississippi requires an annual report but charges no fee \u2014 just file online by April 15.",
        "link": "https://www.sos.ms.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical MS address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Mississippi has a 5% flat income tax rate. No separate LLC franchise minimum tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Circuit Clerk",
      "dba_fee_range": "$10\u2013$25"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.ms.gov/",
      "phone": "601-359-1633"
    },
    "notes": "Mississippi has a $50 formation fee and no annual report fee \u2014 one of the cheapest states to form and maintain an LLC. Just file the free annual report by April 15.",
    "_last_verified": "2025-01-01"
  },
  "montana": {
    "name": "Montana",
    "abbreviation": "MT",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 70,
      "filing_link": "https://sos.mt.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 15,
        "frequency": "Annual",
        "due": "April 15",
        "notes": "Montana's annual report is just $15 \u2014 one of the most affordable in the country.",
        "link": "https://sos.mt.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical MT address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Montana has no state sales tax \u2014 a significant advantage for product-based businesses. Income tax tops out at 6.75%."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Montana Secretary of State",
      "dba_fee_range": "$20"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sos.mt.gov/",
      "phone": "406-444-2034"
    },
    "notes": "Montana has no sales tax, making it uniquely attractive for businesses selling products. The $15 annual report is among the lowest fees in the US.",
    "_last_verified": "2025-01-01"
  },
  "north-dakota": {
    "name": "North Dakota",
    "abbreviation": "ND",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 135,
      "filing_link": "https://sos.nd.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 50,
        "frequency": "Annual",
        "due": "November 15",
        "notes": "North Dakota annual reports are due November 15 for all LLCs.",
        "link": "https://sos.nd.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical ND address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "North Dakota has a flat 2.5% corporate income tax rate \u2014 one of the lowest in the country."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "North Dakota Secretary of State",
      "dba_fee_range": "$25"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sos.nd.gov/",
      "phone": "701-328-4284"
    },
    "notes": "North Dakota's November 15 annual report deadline is easy to track. Low corporate tax rate makes it attractive for profitable businesses.",
    "_last_verified": "2025-01-01"
  },
  "nebraska": {
    "name": "Nebraska",
    "abbreviation": "NE",
    "llc": {
      "filing_name": "Certificate of Organization",
      "filing_fee": 100,
      "filing_link": "https://sos.nebraska.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": true,
      "annual_report": {
        "name": "Biennial Report",
        "required": true,
        "fee": 10,
        "frequency": "Biennial",
        "due": "April 1 of odd-numbered years",
        "notes": "Nebraska only requires a report every 2 years. The fee is just $10, but the publication requirement adds cost.",
        "link": "https://sos.nebraska.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical NE address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Nebraska has a flat 5.84% corporate income tax. No separate LLC minimum franchise tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk",
      "dba_fee_range": "$10\u2013$25"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sos.nebraska.gov/",
      "phone": "402-471-4079"
    },
    "notes": "Nebraska requires publication in a local newspaper for 3 consecutive weeks after forming your LLC \u2014 this typically costs $150\u2013$300 and is easy to overlook. Budget for it upfront.",
    "_last_verified": "2025-01-01"
  },
  "new-hampshire": {
    "name": "New Hampshire",
    "abbreviation": "NH",
    "llc": {
      "filing_name": "Certificate of Formation",
      "filing_fee": 100,
      "filing_link": "https://www.sos.nh.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 100,
        "frequency": "Annual",
        "due": "April 1",
        "notes": "New Hampshire annual reports are due April 1 and cost $100.",
        "link": "https://www.sos.nh.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical NH address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "New Hampshire has no sales tax and no personal income tax on wages \u2014 great for founders who pay themselves a salary."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "New Hampshire Secretary of State",
      "dba_fee_range": "$50"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.nh.gov/",
      "phone": "603-271-3246"
    },
    "notes": "New Hampshire has no sales tax and no income tax on wages, making it attractive for founders. The $100 annual report due April 1 is the main ongoing compliance cost.",
    "_last_verified": "2025-01-01"
  },
  "new-mexico": {
    "name": "New Mexico",
    "abbreviation": "NM",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 50,
      "filing_link": "https://portal.sos.state.nm.us/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": false,
        "fee": 0,
        "frequency": "None",
        "due": "N/A",
        "notes": "New Mexico does NOT require LLCs to file annual reports \u2014 very low ongoing compliance burden.",
        "link": "https://portal.sos.state.nm.us/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical NM address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "New Mexico has a Gross Receipts Tax (GRT) instead of a traditional sales tax. The GRT applies to business receipts at varying rates \u2014 register with the NM Taxation and Revenue Department."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk",
      "dba_fee_range": "$10\u2013$20"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://portal.sos.state.nm.us/",
      "phone": "505-827-3600"
    },
    "notes": "New Mexico is very founder-friendly: $50 to form, no annual report. But register for the Gross Receipts Tax (GRT) early \u2014 it replaces sales tax and applies differently than you might expect.",
    "_last_verified": "2025-01-01"
  },
  "nevada": {
    "name": "Nevada",
    "abbreviation": "NV",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 425,
      "filing_link": "https://esos.nv.gov/",
      "online_filing_available": true,
      "processing_time_standard": "1-2 business days online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual List + State Business License",
        "required": true,
        "fee": 550,
        "frequency": "Annual",
        "due": "Last day of anniversary month",
        "notes": "Nevada charges $350 for the annual list of managers/members plus $200 for the state business license renewal, totaling $550/year.",
        "link": "https://esos.nv.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical NV address."
      },
      "state_tax": {
        "annual_minimum_fee": 550,
        "notes": "Nevada has no corporate income tax and no personal income tax, but the annual list + business license fees ($550) offset some of that savings."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk",
      "dba_fee_range": "$20\u2013$30"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://esos.nv.gov/",
      "phone": "775-684-5708"
    },
    "notes": "Nevada is often marketed as the best place to form an LLC for tax reasons, but the $425 formation fee + $550/year in ongoing fees makes it expensive. Only beneficial if you actually live and operate in Nevada.",
    "_last_verified": "2025-01-01"
  },
  "oklahoma": {
    "name": "Oklahoma",
    "abbreviation": "OK",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 100,
      "filing_link": "https://www.sos.ok.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Certificate",
        "required": true,
        "fee": 25,
        "frequency": "Annual",
        "due": "Anniversary date",
        "notes": "Oklahoma's $25 annual certificate is one of the more affordable ongoing costs.",
        "link": "https://www.sos.ok.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical OK address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Oklahoma has a 4% flat income tax rate. No separate LLC franchise minimum tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk",
      "dba_fee_range": "$10\u2013$25"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.ok.gov/",
      "phone": "405-522-4560"
    },
    "notes": "Oklahoma has straightforward LLC requirements at reasonable cost. The annual certificate is due on your anniversary date \u2014 note your formation date when you file.",
    "_last_verified": "2025-01-01"
  },
  "oregon": {
    "name": "Oregon",
    "abbreviation": "OR",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 100,
      "filing_link": "https://sos.oregon.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 100,
        "frequency": "Annual",
        "due": "Anniversary month",
        "notes": "Oregon annual reports cost $100 and are due in the anniversary month of your LLC formation.",
        "link": "https://sos.oregon.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical OR address."
      },
      "state_tax": {
        "annual_minimum_fee": 150,
        "notes": "Oregon has no sales tax but has a Corporate Activity Tax (CAT) on gross receipts above $1M, plus a minimum $150 LLC excise tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Oregon Secretary of State",
      "dba_fee_range": "$50"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sos.oregon.gov/",
      "phone": "503-986-2200"
    },
    "notes": "Oregon has no sales tax, which is great for product businesses. But the $150 minimum excise tax and $100 annual report add up. The Corporate Activity Tax kicks in at $1M in receipts.",
    "_last_verified": "2025-01-01"
  },
  "pennsylvania": {
    "name": "Pennsylvania",
    "abbreviation": "PA",
    "llc": {
      "filing_name": "Certificate of Organization",
      "filing_fee": 125,
      "filing_link": "https://www.dos.pa.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Decennial Report",
        "required": true,
        "fee": 70,
        "frequency": "Decennial (every 10 years)",
        "due": "December 31 of years ending in 1 (e.g., 2031, 2041)",
        "notes": "Pennsylvania only requires a report every 10 years \u2014 the most founder-friendly reporting schedule in the US.",
        "link": "https://www.dos.pa.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical PA address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Pennsylvania has a flat 8.99% corporate income tax rate. LLCs taxed as pass-through entities pay personal income tax at 3.07%."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Prothonotary",
      "dba_fee_range": "$50\u2013$70"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.dos.pa.gov/",
      "phone": "717-787-1057"
    },
    "notes": "Pennsylvania's decennial report (every 10 years, $70) is the most relaxed ongoing requirement of any state. Downside: high corporate income tax (8.99%) if you elect corporate taxation.",
    "_last_verified": "2025-01-01"
  },
  "rhode-island": {
    "name": "Rhode Island",
    "abbreviation": "RI",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 150,
      "filing_link": "https://www.sos.ri.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 50,
        "frequency": "Annual",
        "due": "November 1",
        "notes": "Rhode Island annual reports are due November 1 for all LLCs, regardless of formation date.",
        "link": "https://www.sos.ri.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical RI address."
      },
      "state_tax": {
        "annual_minimum_fee": 400,
        "notes": "Rhode Island has a minimum $400 corporate minimum tax for LLCs electing corporate treatment. Pass-through LLCs pay a $400 minimum for the Business Corporation Tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "City/Town Clerk",
      "dba_fee_range": "$10\u2013$30"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.ri.gov/",
      "phone": "401-222-3040"
    },
    "notes": "Rhode Island has a fixed November 1 annual report deadline for all LLCs. The $400 minimum tax applies to LLCs \u2014 factor this into your cost planning.",
    "_last_verified": "2025-01-01"
  },
  "south-carolina": {
    "name": "South Carolina",
    "abbreviation": "SC",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 110,
      "filing_link": "https://www.sos.sc.gov/",
      "online_filing_available": true,
      "processing_time_standard": "1-3 business days online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": false,
        "fee": 0,
        "frequency": "None",
        "due": "N/A",
        "notes": "South Carolina does NOT require LLCs to file annual reports with the Secretary of State.",
        "link": "https://www.sos.sc.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical SC address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "South Carolina has a 5% flat corporate income tax. Pass-through LLCs pay personal income tax (top rate 6.5%)."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Register of Deeds",
      "dba_fee_range": "$10\u2013$25"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.sos.sc.gov/",
      "phone": "803-734-2158"
    },
    "notes": "South Carolina is very LLC-friendly \u2014 no annual report requirement. Form your LLC, keep your taxes current, and you're largely done with ongoing state compliance.",
    "_last_verified": "2025-01-01"
  },
  "south-dakota": {
    "name": "South Dakota",
    "abbreviation": "SD",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 150,
      "filing_link": "https://sdsos.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 50,
        "frequency": "Annual",
        "due": "Anniversary month",
        "notes": "South Dakota annual reports are due in the anniversary month of your LLC formation.",
        "link": "https://sdsos.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical SD address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "South Dakota has no state income tax and no corporate income tax \u2014 one of the most tax-friendly states in the US."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Register of Deeds",
      "dba_fee_range": "$10\u2013$30"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sdsos.gov/",
      "phone": "605-773-4845"
    },
    "notes": "South Dakota has no state income tax or corporate income tax \u2014 extremely tax-friendly. A great state for businesses that can legitimately operate here.",
    "_last_verified": "2025-01-01"
  },
  "tennessee": {
    "name": "Tennessee",
    "abbreviation": "TN",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 300,
      "filing_link": "https://sos.tn.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 300,
        "frequency": "Annual",
        "due": "April 1",
        "notes": "Tennessee charges $300 minimum annually (or $50 per LLC member, whichever is greater, up to $3,000).",
        "link": "https://sos.tn.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical TN address."
      },
      "state_tax": {
        "annual_minimum_fee": 300,
        "notes": "Tennessee has no personal income tax on wages but has a Franchise and Excise Tax on business income (6.5% excise, 0.25% franchise on net worth)."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Register of Deeds",
      "dba_fee_range": "$10\u2013$30"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sos.tn.gov/",
      "phone": "615-741-2286"
    },
    "notes": "Tennessee's $300 minimum annual report fee is one of the higher ones. For multi-member LLCs, fees scale by member count ($50/member, max $3,000). Budget accordingly.",
    "_last_verified": "2025-01-01"
  },
  "utah": {
    "name": "Utah",
    "abbreviation": "UT",
    "llc": {
      "filing_name": "Certificate of Organization",
      "filing_fee": 76,
      "filing_link": "https://corporations.utah.gov/",
      "online_filing_available": true,
      "processing_time_standard": "1-3 business days online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Renewal",
        "required": true,
        "fee": 20,
        "frequency": "Annual",
        "due": "End of anniversary month",
        "notes": "Utah's $20 annual renewal is one of the most affordable in the country.",
        "link": "https://corporations.utah.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical UT address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Utah has a flat 4.65% income tax rate. No separate LLC franchise minimum tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Utah Division of Corporations",
      "dba_fee_range": "$22"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://corporations.utah.gov/",
      "phone": "801-530-4849"
    },
    "notes": "Utah is a great state for startups \u2014 fast online processing, $76 to form, and just $20/year to maintain. Low flat income tax rate of 4.65%.",
    "_last_verified": "2025-01-01"
  },
  "vermont": {
    "name": "Vermont",
    "abbreviation": "VT",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 125,
      "filing_link": "https://sos.vermont.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 35,
        "frequency": "Annual",
        "due": "March 15",
        "notes": "Vermont annual reports are due March 15 for all LLCs, regardless of formation date.",
        "link": "https://sos.vermont.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical VT address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Vermont has a graduated income tax with rates up to 8.75%. No separate LLC minimum franchise tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Vermont Secretary of State",
      "dba_fee_range": "$50"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sos.vermont.gov/",
      "phone": "802-828-2386"
    },
    "notes": "Vermont's $35 annual report (due March 15) is one of the more affordable in New England. Fixed deadline makes it easy to track.",
    "_last_verified": "2025-01-01"
  },
  "wisconsin": {
    "name": "Wisconsin",
    "abbreviation": "WI",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 130,
      "filing_link": "https://www.wdfi.org/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 25,
        "frequency": "Annual",
        "due": "End of anniversary quarter",
        "notes": "Wisconsin annual reports are due at the end of the quarter in which your LLC was formed.",
        "link": "https://www.wdfi.org/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical WI address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Wisconsin has a graduated income tax with a top rate of 7.65%. No separate LLC minimum franchise tax."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Wisconsin DFI",
      "dba_fee_range": "$15"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://www.wdfi.org/",
      "phone": "608-261-7577"
    },
    "notes": "Wisconsin's $25 annual report is very affordable. The due date is end of the quarter you formed in \u2014 note your exact formation date to track this correctly.",
    "_last_verified": "2025-01-01"
  },
  "west-virginia": {
    "name": "West Virginia",
    "abbreviation": "WV",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 100,
      "filing_link": "https://sos.wv.gov/",
      "online_filing_available": true,
      "processing_time_standard": "3-5 business days",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 25,
        "frequency": "Annual",
        "due": "July 1",
        "notes": "West Virginia annual reports are due July 1 for all LLCs, regardless of formation date.",
        "link": "https://sos.wv.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical WV address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "West Virginia has a 6.5% corporate income tax rate. Pass-through LLCs pay personal income tax (top rate 6.5%)."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "County Clerk",
      "dba_fee_range": "$10\u2013$25"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sos.wv.gov/",
      "phone": "304-558-8000"
    },
    "notes": "West Virginia has a fixed July 1 annual report deadline for all LLCs. Affordable to maintain with a $25 annual fee.",
    "_last_verified": "2025-01-01"
  },
  "wyoming": {
    "name": "Wyoming",
    "abbreviation": "WY",
    "llc": {
      "filing_name": "Articles of Organization",
      "filing_fee": 102,
      "filing_link": "https://sos.wyo.gov/",
      "online_filing_available": true,
      "processing_time_standard": "1-3 business days online",
      "publication_requirement": false,
      "annual_report": {
        "name": "Annual Report",
        "required": true,
        "fee": 60,
        "frequency": "Annual",
        "due": "Anniversary month",
        "notes": "Wyoming's annual report fee is $60 minimum (or $0.0002 per $1 of in-state assets if higher). Most small LLCs pay the $60 minimum.",
        "link": "https://sos.wyo.gov/"
      },
      "registered_agent": {
        "required": true,
        "notes": "Must have a registered agent with a physical WY address."
      },
      "state_tax": {
        "annual_minimum_fee": 0,
        "notes": "Wyoming has no state income tax and no corporate income tax \u2014 the original LLC-friendly state since 1977."
      }
    },
    "sole_proprietorship": {
      "dba_required_if_different_name": true,
      "dba_filing_location": "Wyoming Secretary of State",
      "dba_fee_range": "$100"
    },
    "ein": {
      "required_for_llc_with_employees": true,
      "recommended_for_all": true,
      "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      "processing_time": "Immediate online"
    },
    "secretary_of_state": {
      "website": "https://sos.wyo.gov/",
      "phone": "307-777-7311"
    },
    "notes": "Wyoming invented the LLC in 1977 and remains one of the most business-friendly states. No income tax, strong asset protection laws, and low fees. Great option if you're flexible on where to form.",
    "_last_verified": "2025-01-01"
  }
} as unknown as Record<string, Record<string, unknown>>

export function getStateInfo(state: string): Record<string, unknown> {
  const key = state.toLowerCase().trim()
  const dataKey = STATE_MAP[key]
  if (!dataKey || !STATE_DATA[dataKey]) {
    return {
      error: `State '${state}' not yet in OpenFounder's database.`,
      message: `We don't have detailed data for ${state} yet. Visit your state's Secretary of State website for filing requirements. You can contribute ${state}'s data at https://github.com/akoke1990/openfoundr`,
      irs_ein_link: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
      sba_resource: 'https://www.sba.gov/business-guide/launch-your-business/register-your-business',
    }
  }
  return STATE_DATA[dataKey]
}

export function recommendEntityType(args: {
  solo_or_partners: 'solo' | 'partners'
  wants_liability_protection: boolean
  state: string
  plans_to_raise_vc?: boolean
  annual_profit_estimate?: string
  industry?: string
}): Record<string, unknown> {
  const { solo_or_partners, wants_liability_protection, state, plans_to_raise_vc, annual_profit_estimate } = args

  if (plans_to_raise_vc) {
    return {
      recommended: 'C-Corporation (Delaware)',
      confidence: 'high',
      primary_reason: 'Venture capitalists require C-Corps structured in Delaware. This is non-negotiable for most VC deals.',
      key_benefits: ['Required by virtually all VCs', 'Allows preferred stock', 'Strong Delaware legal precedent', 'Easy stock options for employees'],
      watch_out_for: ['Double taxation', 'More complex accounting', 'Delaware franchise tax'],
      next_step: 'Form a Delaware C-Corp. Consider Stripe Atlas, Clerky, or a startup lawyer.',
    }
  }

  if (solo_or_partners === 'partners') {
    return {
      recommended: 'Multi-Member LLC',
      confidence: 'high',
      primary_reason: 'Multiple founders need a structure that defines ownership, voting, and what happens if someone leaves.',
      key_benefits: ['Liability protection for all members', 'Pass-through taxation', 'Flexible profit allocation', 'Operating agreement defines exit terms'],
      watch_out_for: ['All members pay SE tax on profit', 'Need a solid operating agreement first', `State costs in ${state}`],
      next_step: 'Form an LLC and draft your operating agreement before doing anything else together.',
    }
  }

  if (!wants_liability_protection && annual_profit_estimate === 'under_40k') {
    return {
      recommended: 'Sole Proprietorship (to start)',
      confidence: 'medium',
      primary_reason: "If you're testing an idea at modest profit, the simplicity of a sole prop is hard to beat.",
      key_benefits: ['Zero cost to start', 'No annual fees', 'Simple taxes (Schedule C)', 'Can upgrade to LLC later'],
      watch_out_for: ['NO liability protection', 'Harder to open business bank account', 'Personal assets at risk if sued'],
      next_step: 'If you have clients, contracts, or assets to protect, consider forming an LLC.',
    }
  }

  if (solo_or_partners === 'solo' && annual_profit_estimate === 'over_80k') {
    return {
      recommended: 'LLC taxed as S-Corp',
      confidence: 'medium',
      primary_reason: 'At your income level, S-Corp taxation can save significant self-employment taxes.',
      key_benefits: ['Only salary portion subject to SE tax', 'Remaining profit avoids 15.3% SE tax', 'Can save $5k–$15k+/year', 'Keeps LLC liability protection'],
      watch_out_for: ['Requires payroll and W-2', 'Must pay reasonable salary', 'Additional accounting costs ($1k–$3k/year)'],
      next_step: 'Form an LLC first. Once profit is reliably over $60k, consult a CPA about filing Form 2553.',
    }
  }

  return {
    recommended: 'Single-Member LLC',
    confidence: 'high',
    primary_reason: 'An LLC gives you personal liability protection with minimal complexity — the right default for most small businesses.',
    key_benefits: ['Personal assets protected', 'Pass-through taxation', 'Simple to manage', 'Credible to clients and banks'],
    watch_out_for: ['All profit subject to 15.3% SE tax', `State fees in ${state}`, 'Must keep finances strictly separate'],
    next_step: `File your Articles of Organization with ${state}'s Secretary of State and get your EIN.`,
  }
}

export function generateOperatingAgreement(args: {
  company_name: string
  state: string
  structure: 'single_member' | 'multi_member'
  members: Array<{ name: string; ownership_percent: number; address?: string }>
  management_structure: 'member_managed' | 'manager_managed'
  business_purpose?: string
  principal_address?: string
}): Record<string, unknown> {
  const { company_name, state, structure, members, management_structure, business_purpose, principal_address } = args
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const memberLines = members.map(m =>
    `- ${m.name}: ${m.ownership_percent}% ownership interest${m.address ? `, ${m.address}` : ''}`
  ).join('\n')

  const sigBlocks = members.map(m =>
    `____________________________\n${m.name}\nDate: ____________`
  ).join('\n\n')

  const mgmtText = management_structure === 'member_managed'
    ? 'The Company shall be managed by its Members in proportion to their ownership interests.'
    : 'The Company shall be managed by a Manager appointed by the Members.'

  const document = `# OPERATING AGREEMENT
## ${company_name}
### A ${state} Limited Liability Company

**Effective Date:** ${today}

---

> ⚠️ **NOTICE:** Generated by OpenFounder as a starting point. Not legal advice. For complex situations, have this reviewed by a licensed attorney in ${state}.

---

## ARTICLE I — FORMATION

**1.1 Name.** The name of the limited liability company is ${company_name} (the "Company").

**1.2 State of Formation.** The Company is organized under the laws of the State of ${state}.

**1.3 Principal Office.** ${principal_address || '[INSERT PRINCIPAL BUSINESS ADDRESS]'}

**1.4 Purpose.** The purpose of the Company is ${business_purpose || 'to engage in any lawful business activity'}.

**1.5 Term.** The Company shall continue until dissolved in accordance with this Agreement or applicable law.

---

## ARTICLE II — MEMBERS AND OWNERSHIP

**2.1 Members.** The initial Members of the Company are:

${memberLines}

**2.2 Additional Members.** New Members may be admitted only upon unanimous written consent of all existing Members.

**2.3 No Transfer Without Consent.** No Member may transfer, sell, or assign their ownership interest without prior written consent of all Members.

---

## ARTICLE III — CAPITAL CONTRIBUTIONS

**3.1 Initial Contributions.** Each Member has made or agrees to make an initial capital contribution as agreed.

**3.2 Additional Contributions.** No Member shall be required to make additional capital contributions without unanimous written consent.

**3.3 No Return of Contributions.** No Member shall have the right to demand the return of their contribution except upon dissolution.

---

## ARTICLE IV — ALLOCATIONS AND DISTRIBUTIONS

**4.1 Allocations.** Profits and losses shall be allocated among Members in proportion to their ownership interests.

**4.2 Distributions.** Distributions shall be made at such times and amounts as determined by ${management_structure === 'member_managed' ? 'the Members' : 'the Manager'}, proportional to ownership interests.

**4.3 Tax Distributions.** The Company shall, to the extent of available cash, make tax distributions to cover Members' estimated income tax liability at a combined rate of 40%.

---

## ARTICLE V — MANAGEMENT

**5.1 Management.** ${mgmtText}

**5.2 Major Decisions.** The following require unanimous written consent: admission of new members, sale of substantially all assets, merger or dissolution, amendment of this Agreement, debt exceeding $[INSERT THRESHOLD].

**5.3 Voting.** Except where unanimity is required, decisions shall be made by a majority of ownership interests.

---

## ARTICLE VI — BOOKS AND ACCOUNTING

**6.1 Books.** The Company shall maintain complete books at its principal office, accessible to all Members.

**6.2 Fiscal Year.** Calendar year (January 1 – December 31).

**6.3 Tax Treatment.** The Company shall be treated as a ${structure === 'single_member' ? 'disregarded entity' : 'partnership'} for federal income tax purposes unless otherwise elected.

**6.4 Bank Accounts.** The Company shall maintain separate accounts in the Company's name. No commingling of personal and Company funds.

---

## ARTICLE VII — WITHDRAWAL AND BUY-SELL

**7.1 Voluntary Withdrawal.** A Member may withdraw upon 90 days' written notice. The withdrawing Member is entitled to the fair market value of their interest, payable over 24 months.

**7.2 Death or Incapacity.** Remaining Members have the right to purchase the affected Member's interest at fair market value within 180 days.

**7.3 Right of First Refusal.** If a Member receives a bona fide purchase offer, remaining Members have 30 days to purchase on the same terms.

---

## ARTICLE VIII — DISSOLUTION

**8.1 Dissolution Events.** Unanimous written consent of all Members; judicial dissolution order; or as required by ${state} law.

**8.2 Winding Up.** Assets applied in order: (1) creditors; (2) Members per capital accounts; (3) Members per ownership interest.

---

## ARTICLE IX — INDEMNIFICATION

**9.1 Liability Limitation.** No Member shall be personally liable for Company debts solely by reason of membership.

**9.2 Indemnification.** The Company shall indemnify Members and Managers for actions taken in good faith on behalf of the Company.

---

## ARTICLE X — MISCELLANEOUS

**10.1 Entire Agreement.** This Agreement supersedes all prior agreements relating to the Company.

**10.2 Amendments.** By unanimous written consent only.

**10.3 Governing Law.** Laws of the State of ${state}.

---

## SIGNATURES

IN WITNESS WHEREOF, the Members have executed this Operating Agreement as of the date first written above.

${sigBlocks}

---
*Generated by OpenFounder — https://github.com/openfoundr/openfoundr*
*Not legal advice. Review with a licensed attorney in ${state} before signing.*`

  return { document, company_name, state, structure, generated_date: today }
}

export function generateLaunchChecklist(args: {
  state: string
  entity_type: string
  industry: string
  has_employees?: boolean
  sells_products?: boolean
  has_physical_location?: boolean
  founder_name?: string
  business_name?: string
}): Record<string, unknown> {
  const { state, entity_type, industry, has_employees, sells_products, founder_name, business_name } = args
  const stateInfo = getStateInfo(state) as Record<string, unknown>
  const stateName = (stateInfo.name as string) || state
  const hasData = !('error' in stateInfo)
  const llcInfo = hasData ? (stateInfo.llc as Record<string, unknown>) : null

  const phases = []

  // Legal
  const legalItems = []
  if (entity_type === 'llc') {
    const fee = llcInfo?.filing_fee || 'varies'
    legalItems.push({ task: `File Articles of Organization with ${stateName} Secretary of State`, fee: `$${fee}`, time: '30–60 min', priority: 'critical', link: (llcInfo?.filing_link as string) || '' })
    if (llcInfo?.publication_requirement) {
      legalItems.push({ task: 'Complete newspaper publication requirement', fee: 'See state notes', time: '6 weeks', priority: 'critical', note: llcInfo?.publication_notes })
    }
    legalItems.push({ task: 'Draft and sign Operating Agreement', fee: 'Free (use OpenFounder)', time: '30 min', priority: 'critical' })
  } else {
    legalItems.push({ task: 'File DBA if using a business name', fee: '$15–$75', time: '1 hour', priority: 'high' })
  }
  legalItems.push({ task: 'Get your EIN from the IRS', fee: 'Free', time: '10 min online', priority: 'critical', link: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online' })
  phases.push({ name: 'Legal Foundation', items: legalItems })

  // Financial
  const annualReport = llcInfo?.annual_report as Record<string, unknown> | undefined
  const financialItems = [
    { task: 'Open a business checking account', fee: 'Free (Mercury, Relay)', time: '30–60 min', priority: 'critical' },
    { task: 'Set up bookkeeping (Wave is free)', fee: 'Free–$30/mo', time: '1–2 hours', priority: 'high', link: 'https://www.waveapps.com/' },
    { task: 'Set up quarterly estimated tax payments', fee: 'Free', time: '30 min', priority: 'high', link: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes' },
  ]
  if (annualReport?.required) {
    financialItems.push({ task: `Calendar: ${annualReport.name} due ${annualReport.due}`, fee: `$${annualReport.fee}`, time: '15 min when due', priority: 'high' })
  }
  phases.push({ name: 'Financial Infrastructure', items: financialItems })

  // Digital
  phases.push({
    name: 'Digital Presence',
    items: [
      { task: 'Register your domain name', fee: '$10–$20/yr', time: '15 min', priority: 'high', link: 'https://www.namecheap.com' },
      { task: 'Set up professional email', fee: '$6–$12/mo', time: '1–2 hours', priority: 'high', link: 'https://workspace.google.com/' },
      { task: 'Launch your website', fee: '$12–$40/mo', time: 'Half day', priority: 'medium' },
    ]
  })

  // Compliance
  const complianceItems: Record<string, unknown>[] = [
    { task: 'Apply for local business license', fee: '$25–$150', time: '30–60 min', priority: 'high' },
    { task: 'Get general liability insurance', fee: '$500–$1,500/yr', time: '30 min for quote', priority: 'high', link: 'https://www.next-insurance.com/' },
  ]
  if (sells_products) complianceItems.push({ task: 'Register for sales tax collection', fee: 'Free', time: '30 min', priority: 'critical' })
  if (has_employees) {
    complianceItems.push({ task: 'Register for state payroll taxes', fee: 'Free', time: '1–2 hours', priority: 'critical' })
    complianceItems.push({ task: 'Set up workers\' compensation insurance', fee: 'Varies', time: '1–2 hours', priority: 'critical' })
  }
  phases.push({ name: 'Compliance & Operations', items: complianceItems })

  const total = phases.reduce((n, p) => n + p.items.length, 0)
  const critical = phases.reduce((n, p) => n + p.items.filter((i: Record<string, unknown>) => i.priority === 'critical').length, 0)

  return {
    title: `Launch Checklist${business_name ? ` for ${business_name}` : ''}`,
    for: founder_name || 'Founder',
    state: stateName,
    entity_type,
    industry,
    phases,
    summary: { total_items: total, critical_items: critical },
  }
}

export function getEINGuide(entity_type: string): Record<string, unknown> {
  return {
    title: 'How to get your EIN',
    what: 'Your business tax ID. Required to open a business bank account, hire employees, and file taxes.',
    cost: 'Free',
    time: '10 minutes — EIN issued immediately online',
    link: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
    steps: [
      'Go to the IRS EIN application (link above). Available Mon–Fri, 7am–10pm ET.',
      `Select entity type: "${entity_type === 'llc' ? 'Limited Liability Company' : 'Sole Proprietor'}"`,
      'Enter the responsible party — the person who controls the entity (usually you).',
      'Enter your SSN when prompted. The IRS needs to link the EIN to a real person.',
      'Enter your business name and address.',
      'Submit. Your EIN appears immediately on screen.',
      'Download the PDF confirmation. Save it — you\'ll need it forever.',
    ],
    warnings: [
      'Third-party services charge $50–$300 to "help" you get an EIN. It\'s free directly from the IRS. Don\'t pay.',
      'Only apply at irs.gov — there are convincing scam sites.',
    ],
  }
}

export function getBankingGuide(entity_type: string, monthly_revenue?: string): Record<string, unknown> {
  const recs = [
    { name: 'Mercury', type: 'Online', fee: '$0/mo', why: 'Best free business banking for early-stage founders. No fees, excellent UI, FDIC insured. Apply online in minutes.', link: 'https://mercury.com/', best_for: 'Most small businesses and startups' },
    { name: 'Relay', type: 'Online', fee: '$0 basic / $30 pro', why: 'Great for budgeting — lets you create sub-accounts to allocate for taxes, payroll, expenses.', link: 'https://relayfi.com/', best_for: 'Anyone who wants to organize money into buckets' },
  ]
  if (monthly_revenue === 'over_25k') {
    recs.push({ name: 'Chase Business Complete', type: 'Traditional', fee: '$15 (waivable)', why: 'Best traditional bank for small businesses. Strong for SBA loans and credit lines.', link: 'https://www.chase.com/business', best_for: 'Businesses needing loans or physical branch access' })
  }

  const docs = ['Your EIN', 'Government-issued ID']
  if (entity_type === 'llc') docs.push('Articles of Organization', 'Operating Agreement')
  else docs.push('DBA certificate (if applicable)')

  return {
    why_it_matters: 'Keeping business and personal money separate is the most important financial habit you can build. It protects your liability shield and makes taxes dramatically simpler.',
    recommendations: recs,
    what_to_bring: docs,
    golden_rule: 'Never run business income or expenses through your personal account.',
  }
}

// ─── Registered agent guide ──────────────────────────────────────────────────

export function getRegisteredAgentGuide(args: {
  state: string
  entity_type?: string
  business_name?: string
}): Record<string, unknown> {
  const { state, entity_type = 'LLC' } = args

  return {
    title: 'Registered Agent Guide',
    type: 'registered_agent_guide',
    state,
    what_is_it: `A registered agent (also called a statutory agent) is a person or company designated to receive official legal documents for your ${entity_type} — lawsuits, government notices, and compliance mail. Every ${entity_type} in ${state} must have one with a physical address in the state.`,
    requirements: [
      'Decide: be your own agent (free, but your address is public) or hire a service ($100–$125/year, private)',
      'If hiring a service: sign up before filing — they provide an address to use on your Articles of Organization',
      'Keep your registered agent current — a lapsed agent can trigger administrative dissolution',
      `In ${state}, file a Change of Registered Agent form if you ever switch ($10–$50 filing fee)`,
    ],
    services: [
      { name: 'Northwest Registered Agent', price: '$125/year', best_for: 'Best privacy policy, no upsells, includes 1 free year with LLC formation', link: 'https://www.northwestregisteredagent.com/' },
      { name: 'ZenBusiness', price: '$99/year', best_for: 'Popular with new founders, good dashboard', link: 'https://www.zenbusiness.com/' },
      { name: 'Registered Agents Inc', price: '$100/year', best_for: 'Flat fee, no hidden charges', link: 'https://www.registeredagentsinc.com/' },
      { name: 'Harbor Compliance', price: '$99/year', best_for: 'Best for multi-state businesses', link: 'https://www.harborcompliance.com/' },
    ],
    tip: 'For most founders, $100–$125/year for a registered agent service is worth every penny. Your home address stays private, you never miss a legal notice, and they send annual report reminders.',
  }
}

// ─── Accounting guide ─────────────────────────────────────────────────────────

export function getAccountingGuide(args: {
  entity_type?: string
  has_employees?: boolean
  sells_products?: boolean
  revenue_estimate?: string
  business_type?: string
}): Record<string, unknown> {
  const {
    entity_type = 'llc',
    has_employees = false,
    sells_products = false,
    revenue_estimate = 'unknown',
    business_type = 'business',
  } = args

  const isEarlyStage = revenue_estimate === 'under_40k' || revenue_estimate === 'unknown'

  const tools = [
    {
      name: 'Wave Accounting',
      price: 'Free',
      best_for: 'Freelancers and early-stage businesses with simple finances',
      pros: ['100% free for core accounting', 'Easy invoicing', 'Connects to your bank'],
      link: 'https://www.waveapps.com/',
    },
    {
      name: 'QuickBooks Online',
      price: '$30–$90/month',
      best_for: 'Growing businesses needing payroll, inventory, or accountant access',
      pros: ['Industry standard', 'Strong payroll', 'Best integrations', 'Accountant-friendly'],
      link: 'https://quickbooks.intuit.com/',
    },
    {
      name: 'FreshBooks',
      price: '$17–$55/month',
      best_for: 'Service businesses that invoice clients regularly',
      pros: ['Beautiful invoices', 'Easy time tracking', 'Great client portal'],
      link: 'https://www.freshbooks.com/',
    },
    {
      name: 'Xero',
      price: '$15–$78/month',
      best_for: 'Businesses working closely with a bookkeeper or accountant',
      pros: ['Accountant-friendly', 'Strong reporting', 'Good inventory management'],
      link: 'https://www.xero.com/',
    },
  ]

  // Surface best match first based on profile
  const sorted = isEarlyStage
    ? tools // Wave first
    : has_employees || sells_products
      ? [tools[1], tools[0], tools[2], tools[3]] // QuickBooks first
      : [tools[2], tools[0], tools[1], tools[3]] // FreshBooks first

  const taxObligation = entity_type === 'sole_proprietorship'
    ? 'File Schedule C with your personal return (Form 1040)'
    : entity_type === 's_corp'
      ? 'File Form 1120-S for the S-Corp; pay yourself a reasonable W-2 salary'
      : 'Single-member LLC: Schedule C. Multi-member: Form 1065 partnership return'

  return {
    title: 'Accounting Setup Guide',
    type: 'accounting_guide',
    tools: sorted,
    setup_checklist: [
      'Open a dedicated business checking account — never mix personal and business',
      'Apply for your EIN from the IRS (free, instant online)',
      'Sign up for accounting software and connect your bank account',
      taxObligation,
      'Pay quarterly estimated taxes: April 15, June 15, Sept 15, Jan 15',
      ...(has_employees ? ['Set up payroll (QuickBooks Payroll or Gusto recommended)'] : []),
      ...(sells_products ? ['Register for a sales tax permit in your state before your first sale'] : []),
      'Review your books for 30 minutes every month — don\'t wait until tax season',
    ],
    tip: isEarlyStage
      ? `For a solo ${business_type} just starting out: Wave (free) + a dedicated business bank account + 30 min/month of bookkeeping is all you need. Upgrade to QuickBooks around $5K/month in revenue.`
      : `With employees or products, QuickBooks Online is worth the cost — payroll errors are expensive and it integrates with nearly everything.`,
  }
}

// ─── Website guide ───────────────────────────────────────────────────────────

export function getWebsiteGuide(args: {
  business_type: string
  sells_products?: boolean
  needs_booking?: boolean
}): Record<string, unknown> {
  const { business_type, sells_products = false, needs_booking = false } = args
  const type = business_type.toLowerCase()

  const isRestaurant = type.includes('food') || type.includes('restaurant') || type.includes('cafe') || type.includes('catering')
  const isEcommerce = sells_products || type.includes('retail') || type.includes('shop') || type.includes('store')
  const isService = type.includes('service') || type.includes('consult') || type.includes('freelan') || needs_booking

  let builders
  if (isRestaurant) {
    builders = [
      { name: 'Squarespace', price: '$23/month', best_for: 'Beautiful menus + online ordering', link: 'https://squarespace.com', rating: 'Top pick' },
      { name: 'Wix', price: '$17/month', best_for: 'Most flexible, restaurant templates', link: 'https://wix.com', rating: 'Runner-up' },
      { name: 'GoDaddy Website Builder', price: '$10/month', best_for: 'Fastest to launch, lowest cost', link: 'https://godaddy.com', rating: 'Budget' },
    ]
  } else if (isEcommerce) {
    builders = [
      { name: 'Shopify', price: '$29–$299/month', best_for: 'Best e-commerce platform, period. Handles inventory, shipping, taxes.', link: 'https://shopify.com', rating: 'Top pick' },
      { name: 'Squarespace Commerce', price: '$23–$65/month', best_for: 'Fewer SKUs, beautiful brand presentation', link: 'https://squarespace.com', rating: 'Runner-up' },
      { name: 'WooCommerce', price: '$10/month (hosting) + free plugin', best_for: 'Most control, open source, needs more setup', link: 'https://woocommerce.com', rating: 'DIY' },
    ]
  } else if (isService || needs_booking) {
    builders = [
      { name: 'Squarespace', price: '$16–$23/month', best_for: 'Best design, built-in scheduling with Acuity', link: 'https://squarespace.com', rating: 'Top pick' },
      { name: 'Wix', price: '$17/month', best_for: 'Wix Bookings built in, very flexible', link: 'https://wix.com', rating: 'Runner-up' },
      { name: 'Webflow', price: '$14–$23/month', best_for: 'Most powerful, steeper learning curve', link: 'https://webflow.com', rating: 'Advanced' },
    ]
  } else {
    builders = [
      { name: 'Squarespace', price: '$16–$23/month', best_for: 'Cleanest templates, easiest to maintain', link: 'https://squarespace.com', rating: 'Top pick' },
      { name: 'Wix', price: '$17–$35/month', best_for: 'Most flexible drag-and-drop builder', link: 'https://wix.com', rating: 'Runner-up' },
      { name: 'WordPress.com', price: '$9–$45/month', best_for: 'Most powerful, best for blogs and SEO', link: 'https://wordpress.com', rating: 'Power user' },
    ]
  }

  const domainTips = [
    'Register your domain through Namecheap (~$10/year for .com) or directly through your website builder',
    'Get .com if at all possible — users trust it more and type it instinctively',
    'Keep it short, easy to spell, and easy to say out loud',
    'Avoid hyphens and numbers — they\'re hard to say in conversation',
  ]

  const launchChecklist = [
    'Register your domain',
    'Choose a website builder and sign up',
    'Connect your domain (takes 24–48 hours to propagate)',
    'Add: Home, About, Services/Products, Contact pages',
    'Add your Google Business Profile (free — critical for local SEO)',
    'Set up Google Analytics (free — know your traffic)',
    'Add your website to your email signature and social profiles',
  ]

  return { builders, domain_tips: domainTips, launch_checklist: launchChecklist, business_type }
}

// ─── Email guide ─────────────────────────────────────────────────────────────

export function getEmailGuide(args: {
  team_size?: number
  business_type?: string
}): Record<string, unknown> {
  const { team_size = 1 } = args

  const providers = [
    {
      name: 'Google Workspace',
      price: '$6/user/month (Business Starter)',
      best_for: 'Most founders — Gmail interface, Google Drive, Meet, Calendar all included',
      pros: ['Familiar Gmail interface', 'Google Drive + Docs + Meet included', 'Best mobile app', 'Easy to set up'],
      cons: ['$6/user/month adds up with a team'],
      link: 'https://workspace.google.com',
      recommended: team_size <= 10,
      rating: 'Top pick',
    },
    {
      name: 'Microsoft 365 Business Basic',
      price: '$6/user/month',
      best_for: 'Teams already using Windows or Office apps',
      pros: ['Outlook + Teams + SharePoint', 'Office apps (Word, Excel) included', 'Great for Windows-heavy teams'],
      cons: ['Outlook is less intuitive than Gmail for many'],
      link: 'https://microsoft.com/microsoft-365',
      recommended: false,
      rating: 'Alternative',
    },
    {
      name: 'Zoho Mail',
      price: 'Free up to 5 users · $1/user/month after',
      best_for: 'Solo founders and very small teams watching every dollar',
      pros: ['Free tier for up to 5 users', 'Clean interface', 'Zoho suite (CRM, invoices) integrates well'],
      cons: ['Less brand recognition than Google', 'Mobile app not as polished'],
      link: 'https://zoho.com/mail',
      recommended: team_size <= 3,
      rating: 'Budget',
    },
  ]

  const setupSteps = [
    'Buy your domain (if you haven\'t) — e.g. yourbusiness.com',
    'Sign up for Google Workspace (or your chosen provider)',
    'Verify your domain by adding a TXT record in your DNS settings',
    'Add MX records to route email to Google (they give you the exact values)',
    'Create your email address: you@yourbusiness.com',
    'Set up email on your phone and any other devices',
    'Update your email signature with name, title, phone, website',
  ]

  const emailTips = [
    'Use your own domain (you@yourbusiness.com) — never Gmail/Yahoo for business. It looks unprofessional.',
    'Set up SPF, DKIM, and DMARC records to prevent your emails going to spam',
    'Create a general inbox (hello@ or info@) to catch inquiries even if your name changes',
    'Google Workspace takes about 30 minutes to fully set up — plan accordingly',
  ]

  return { providers, setup_steps: setupSteps, tips: emailTips }
}

// ─── POS guide ───────────────────────────────────────────────────────────────

export function getPOSGuide(args: {
  business_type: string
  monthly_volume?: string
  has_physical_location?: boolean
}): Record<string, unknown> {
  const { business_type, monthly_volume = 'unknown', has_physical_location = true } = args
  const type = business_type.toLowerCase()

  const isRestaurant = type.includes('food') || type.includes('restaurant') || type.includes('cafe') || type.includes('bar') || type.includes('catering')
  const isRetail = type.includes('retail') || type.includes('shop') || type.includes('boutique') || type.includes('store')
  const isService = type.includes('service') || type.includes('salon') || type.includes('spa') || type.includes('fitness') || type.includes('gym')

  const allSystems = [
    {
      name: 'Square',
      monthly_cost: '$0–$60/month (free tier available)',
      transaction_fee: '2.6% + 10¢ in-person · 2.9% + 30¢ online',
      hardware: 'Free magstripe reader · $49 chip+tap reader · $149 Square Terminal',
      best_for: 'Most small businesses — zero monthly fee to start, scales well',
      pros: ['Free to start', 'No long-term contract', 'Great mobile app', 'Free online store included', 'Payroll add-on available'],
      cons: ['Holds funds for high-risk businesses', 'Transaction fees add up at volume'],
      link: 'https://squareup.com',
      good_for: ['service', 'retail', 'food', 'general'],
      rating: 'Top pick for most',
    },
    {
      name: 'Toast',
      monthly_cost: '$0–$165/month',
      transaction_fee: '2.49% + 15¢ per transaction',
      hardware: 'Toast terminal from $627',
      best_for: 'Restaurants — built for table management, kitchen tickets, tipping',
      pros: ['Restaurant-specific features', 'Kitchen display system', 'Online ordering built in', 'Strong reporting'],
      cons: ['Hardware lock-in', 'Monthly fees + setup fees', 'Overkill for non-restaurants'],
      link: 'https://pos.toasttab.com',
      good_for: ['food', 'restaurant', 'bar', 'cafe'],
      rating: 'Top pick for restaurants',
    },
    {
      name: 'Shopify POS',
      monthly_cost: '$29–$299/month (Shopify subscription)',
      transaction_fee: '2.4–2.7% in-person (lower on higher plans)',
      hardware: 'Shopify card reader from $49',
      best_for: 'Businesses with both a physical store and online store',
      pros: ['Unified inventory across physical + online', 'Best multi-channel retail', 'Strong analytics'],
      cons: ['Requires Shopify subscription', 'Extra fees if using non-Shopify payments'],
      link: 'https://shopify.com/pos',
      good_for: ['retail', 'ecommerce'],
      rating: 'Best for omnichannel',
    },
    {
      name: 'Clover',
      monthly_cost: '$14.95–$109.95/month',
      transaction_fee: '2.3% + 10¢ in-person',
      hardware: 'Clover Go from $49 · Clover Station from $599',
      best_for: 'Restaurants and retail that want a polished countertop setup',
      pros: ['Sleek hardware', 'App marketplace', 'Good for tips and tabs'],
      cons: ['Hardware is Clover-only', 'Monthly fees required', 'Can be pricey for small volume'],
      link: 'https://clover.com',
      good_for: ['food', 'retail', 'service'],
      rating: 'Premium option',
    },
    {
      name: 'Lightspeed',
      monthly_cost: '$89–$239/month',
      transaction_fee: '2.6% + 10¢ in-person',
      hardware: 'Works with iPad + supported readers',
      best_for: 'Retail with complex inventory (variants, suppliers, purchase orders)',
      pros: ['Best inventory management', 'Multi-location support', 'Strong reporting'],
      cons: ['Expensive for small businesses', 'Overkill unless inventory is complex'],
      link: 'https://lightspeedhq.com',
      good_for: ['retail'],
      rating: 'Enterprise retail',
    },
  ]

  // Filter to most relevant based on business type
  let recommended = allSystems.filter(s =>
    s.good_for.some(g => type.includes(g) || g === 'general')
  )
  if (recommended.length === 0) recommended = allSystems.filter(s => s.good_for.includes('general'))

  const questions = [
    'Do you need online ordering or an online store as well? (affects which platform)',
    'How many transactions per month? (affects whether flat monthly fee or % is better)',
    'Do you need to manage employees and tips?',
    'Multiple locations now or eventually?',
  ]

  return {
    recommended: recommended.slice(0, 3),
    all_systems: allSystems,
    key_questions: questions,
    business_type,
    monthly_volume,
    has_physical_location,
    tip: monthly_volume === 'high' ? 'At high volume, flat-rate monthly plans beat per-transaction fees. Run the math: monthly_cost / (volume * 0.026) to find your break-even.' : 'Start with Square\'s free plan — you can always upgrade when your volume justifies it.',
  }
}

// ─── Client contract ────────────────────────────────────────────────────────

export function generateClientContract(args: {
  business_name: string
  state: string
  founder_name: string
  client_name?: string
  services_description?: string
  rate?: string
  payment_terms?: string
  notice_days?: number
}): Record<string, unknown> {
  const {
    business_name, state, founder_name,
    client_name = '[CLIENT NAME]',
    services_description = '[DESCRIBE SERVICES]',
    rate = '[RATE / HOUR or FLAT FEE]',
    payment_terms = 'Net 30',
    notice_days = 14,
  } = args
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const document = `# CLIENT SERVICE AGREEMENT

**Date:** ${today}

---

## Parties

**Service Provider:** ${business_name} ("Provider")
State: ${state}
Contact: ${founder_name}

**Client:** ${client_name} ("Client")

---

## 1. Services

Provider agrees to perform the following services for Client:

${services_description}

Provider will perform services in a professional manner consistent with industry standards.

---

## 2. Compensation

**Rate:** ${rate}

**Payment terms:** ${payment_terms}

**Late fee:** 1.5% per month on balances unpaid after the due date.

**Expenses:** Client will reimburse pre-approved out-of-pocket expenses within 14 days of invoice.

---

## 3. Term and Termination

This Agreement begins on the date above and continues until services are complete. Either party may terminate with ${notice_days} days written notice. Client owes payment for all work completed before termination.

---

## 4. Intellectual Property

Upon full payment, all work product created under this Agreement becomes the exclusive property of Client. Until then, all rights remain with Provider.

---

## 5. Confidentiality

Each party agrees to keep the other's confidential business information private during and for 2 years after this Agreement.

---

## 6. Independent Contractor

Provider is an independent contractor. Nothing in this Agreement creates an employment, partnership, or joint venture relationship. Provider is responsible for their own taxes and benefits.

---

## 7. Limitation of Liability

Provider's total liability for any claim under this Agreement shall not exceed the total fees paid in the 3 months preceding the claim. Provider is not liable for indirect, consequential, or incidental damages.

---

## 8. Governing Law

This Agreement is governed by the laws of the State of ${state}. Disputes shall be resolved in ${state} courts.

---

## Signatures

**${business_name}**
By: ________________________________
Name: ${founder_name}
Date: _______________

**${client_name}**
By: ________________________________
Name: ___________________________
Title: ___________________________
Date: _______________`

  return {
    title: `Client Service Agreement — ${business_name}`,
    document,
    type: 'client_contract',
    instructions: 'Fill in the bracketed fields. Have both parties sign. Keep a copy for your records. For high-value contracts, consider having an attorney review.',
  }
}

// ─── NDA ────────────────────────────────────────────────────────────────────

export function generateNDA(args: {
  party_a_name: string
  state: string
  party_b_name?: string
  purpose?: string
  term_years?: number
}): Record<string, unknown> {
  const {
    party_a_name, state,
    party_b_name = '[COUNTERPARTY NAME]',
    purpose = 'evaluating a potential business relationship',
    term_years = 2,
  } = args
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const document = `# MUTUAL NON-DISCLOSURE AGREEMENT

**Date:** ${today}

---

## Parties

**Party A:** ${party_a_name}

**Party B:** ${party_b_name}

Together referred to as the "Parties."

---

## 1. Purpose

The Parties wish to explore ${purpose} and may need to share confidential information with each other.

---

## 2. Definition of Confidential Information

"Confidential Information" means any non-public information disclosed by one Party to the other, in any form, including but not limited to: business plans, financial projections, customer data, technical specifications, product roadmaps, pricing, and trade secrets.

Information is NOT confidential if it: (a) is or becomes publicly available through no breach of this Agreement; (b) was rightfully known before disclosure; (c) is received from a third party without restriction; or (d) is independently developed without use of the other Party's information.

---

## 3. Obligations

Each Party agrees to:
- Keep the other Party's Confidential Information strictly confidential
- Use it only for the Purpose above
- Not copy, reproduce, or distribute it without written consent
- Protect it with at least the same care as its own confidential information (minimum: reasonable care)
- Limit access to employees and contractors who need it and are bound by confidentiality obligations

---

## 4. Required Disclosure

If either Party is legally required to disclose Confidential Information, they will provide prompt written notice to allow the other Party to seek a protective order.

---

## 5. Term

This Agreement is effective for ${term_years} year${term_years !== 1 ? 's' : ''} from the date above. Confidentiality obligations survive termination for 2 additional years.

---

## 6. Return of Information

Upon request or termination, each Party will promptly return or destroy the other's Confidential Information and certify in writing that it has done so.

---

## 7. No License

Nothing in this Agreement grants any license, right, or interest in either Party's intellectual property.

---

## 8. Governing Law

This Agreement is governed by the laws of the State of ${state}.

---

## Signatures

**${party_a_name}**
By: ________________________________
Name: ___________________________
Date: _______________

**${party_b_name}**
By: ________________________________
Name: ___________________________
Date: _______________`

  return {
    title: `Mutual NDA — ${party_a_name} & ${party_b_name}`,
    document,
    type: 'nda',
    instructions: 'Both parties sign two copies — each keeps one. For sensitive deals involving IP or trade secrets, have an attorney review first.',
  }
}

// ─── Invoice template ────────────────────────────────────────────────────────

export function generateInvoiceTemplate(args: {
  business_name: string
  founder_name: string
  business_address?: string
  payment_methods?: string
  payment_days?: number
  tax_rate?: number
}): Record<string, unknown> {
  const {
    business_name, founder_name,
    business_address = '[YOUR BUSINESS ADDRESS]',
    payment_methods = 'Check, ACH, Venmo, Zelle',
    payment_days = 30,
    tax_rate = 0,
  } = args
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + payment_days)
  const dueDateStr = dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const document = `# INVOICE

**Invoice #:** [001]
**Date:** ${today}
**Due Date:** ${dueDateStr} (Net ${payment_days})

---

**FROM:**
${business_name}
${business_address}
${founder_name}
[your@email.com]
[your phone]

**BILL TO:**
[Client Name]
[Client Address]
[Client Email]

---

## Services

| Description                    | Qty / Hrs | Rate     | Amount   |
|-------------------------------|-----------|----------|----------|
| [Service or deliverable]       | [1]       | $[0.00]  | $[0.00]  |
| [Service or deliverable]       | [1]       | $[0.00]  | $[0.00]  |
| [Service or deliverable]       | [1]       | $[0.00]  | $[0.00]  |

---

**Subtotal:**  $[0.00]
${tax_rate > 0 ? `**Sales Tax (${tax_rate}%):** $[0.00]\n` : ''}**TOTAL DUE:** $[0.00]

---

**Payment Methods:** ${payment_methods}

**Make checks payable to:** ${business_name}

**Late payments:** A 1.5% monthly fee applies to balances unpaid after the due date.

---

*Thank you for your business!*`

  return {
    title: `Invoice Template — ${business_name}`,
    document,
    type: 'invoice_template',
    instructions: 'Duplicate this for each client. Fill in the bracketed fields, number invoices sequentially (001, 002...), and keep copies for your tax records.',
  }
}

// ─── Business insurance guide ─────────────────────────────────────────────────

export function getBusinessInsuranceGuide(args: {
  business_type: string
  has_employees?: boolean
  has_physical_location?: boolean
  state?: string
}): Record<string, unknown> {
  const { business_type, has_employees = false, has_physical_location = false, state = '' } = args
  const bt = business_type.toLowerCase()

  const isService = /consult|freelan|coach|agency|design|market|legal|account|counsel|therapist|counsel/.test(bt)
  const isRetail = /retail|shop|store|boutique|ecommerce|product/.test(bt)
  const isFood = /restaurant|food|cafe|bakery|catering|bar|coffee/.test(bt)
  const isContractor = /contractor|construct|plumb|electric|hvac|landscap|clean/.test(bt)

  const coverages: Record<string, unknown>[] = [
    {
      name: 'General Liability (GL)',
      required: true,
      typical_cost: '$400–$1,500/year',
      what_it_covers: 'Third-party bodily injury, property damage, and advertising injury. If a client slips in your office or you accidentally damage their property, GL pays.',
      who_needs_it: 'Every business — landlords require it, clients often require proof before signing contracts.',
    },
  ]

  if (isService) {
    coverages.push({
      name: 'Professional Liability (E&O)',
      required: false,
      typical_cost: '$500–$3,000/year',
      what_it_covers: 'Errors and omissions in your professional services. If a client claims your advice cost them money, E&O defends and pays settlements.',
      who_needs_it: 'Any service-based business: consultants, designers, marketers, accountants, coaches.',
    })
  }

  if (isFood || isRetail || has_physical_location) {
    coverages.push({
      name: 'Business Owner\'s Policy (BOP)',
      required: false,
      typical_cost: '$500–$2,000/year',
      what_it_covers: 'Bundles GL + commercial property insurance at a discount. Covers your building, equipment, and inventory against fire, theft, and vandalism.',
      who_needs_it: 'Businesses with a physical location or significant equipment/inventory.',
    })
  }

  if (has_employees) {
    coverages.push({
      name: "Workers' Compensation",
      required: true,
      typical_cost: '$0.75–$2.74 per $100 of payroll (varies by state + industry)',
      what_it_covers: "Medical bills and lost wages for employees injured on the job. Protects you from lawsuits by injured workers.",
      who_needs_it: `Required by law in most states once you have employees. ${state ? `Check ${state}'s specific threshold — some states require it from the first employee.` : ''}`,
    })
    coverages.push({
      name: 'Employment Practices Liability (EPL)',
      required: false,
      typical_cost: '$800–$3,000/year',
      what_it_covers: 'Wrongful termination, discrimination, harassment claims by employees. Even meritless claims are expensive to defend.',
      who_needs_it: 'Any business with employees — litigation risk rises sharply once you have staff.',
    })
  }

  if (isContractor) {
    coverages.push({
      name: 'Commercial Auto',
      required: false,
      typical_cost: '$1,200–$2,400/year',
      what_it_covers: 'Vehicles used for business. Your personal auto policy typically excludes business use — a gap that can leave you personally liable.',
      who_needs_it: 'Contractors, delivery businesses, anyone driving for work.',
    })
  }

  const providers = [
    { name: 'Hiscox', best_for: 'Freelancers and small service businesses, fast online quotes', link: 'https://www.hiscox.com/small-business-insurance' },
    { name: 'Next Insurance', best_for: 'Simple online purchase, tailored by industry, great for contractors', link: 'https://www.nextinsurance.com/' },
    { name: 'Thimble', best_for: 'Short-term or project-based coverage, pay by the month', link: 'https://www.thimble.com/' },
    { name: 'State Farm / Local Broker', best_for: 'Complex needs, bundling with other policies, relationship-based', link: 'https://www.statefarm.com/small-business' },
    ...(isFood ? [{ name: 'Restaurant365 / Food Liability', best_for: 'Restaurant-specific coverage including liquor liability', link: 'https://www.insureon.com/restaurant-insurance' }] : []),
  ]

  return {
    title: 'Business Insurance Guide',
    type: 'insurance_guide',
    summary: `For a ${business_type}, you'll want to prioritize ${isService ? 'General Liability and Professional Liability (E&O)' : has_physical_location ? 'a Business Owner\'s Policy (BOP)' : 'General Liability'} as your foundation.`,
    coverages,
    providers,
    tip: 'Get quotes from at least 2–3 providers. Hiscox and Next Insurance both offer instant online quotes and are popular with small businesses. Budget $500–$2,000/year for basic coverage.',
  }
}

// ─── Trademark guide ──────────────────────────────────────────────────────────

export function getTrademarkGuide(args: {
  business_name: string
  business_type?: string
  has_logo?: boolean
}): Record<string, unknown> {
  const { business_name, business_type = 'business', has_logo = false } = args

  return {
    title: 'Trademark Guide',
    type: 'trademark_guide',
    what_is_trademark: `A trademark protects your brand identity — your business name, logo, and slogan — from being used by competitors. Unlike an LLC name registration (which is state-only), a federal trademark gives you nationwide exclusive rights.`,
    llc_vs_trademark: `Registering an LLC does NOT protect your brand name. Your LLC name is only registered in your state and only prevents another LLC with that exact name in your state — it doesn't stop businesses in other states or different entity types from using the same name.`,
    search_first: {
      why: 'Before filing, verify your name is actually available as a trademark. Using a name that infringes an existing trademark can result in a lawsuit even if your LLC is registered.',
      how: [
        `Search the USPTO TESS database: https://tmsearch.uspto.gov/ — search for "${business_name}" and similar names`,
        'Search for common law trademarks via Google, social media, and industry directories',
        'Check domain availability (done separately)',
      ],
    },
    registration_options: [
      {
        option: 'Federal Trademark (USPTO)',
        cost: '$250–$350 per class (per category of goods/services)',
        protection: 'Nationwide',
        timeline: '8–12 months to register',
        best_for: 'Any business with real brand value or plans to scale',
        link: 'https://www.uspto.gov/trademarks/apply',
      },
      {
        option: 'State Trademark',
        cost: '$50–$150',
        protection: 'Single state only',
        timeline: '1–4 weeks',
        best_for: 'Very local businesses with no plans to expand',
        link: 'https://www.nolo.com/legal-encyclopedia/state-trademark-registration.html',
      },
    ],
    diy_vs_attorney: [
      { option: 'DIY via USPTO', cost: '$250–$350 filing fee only', risk: 'Higher rejection rate without legal guidance. USPTO rejects ~30% of applications.' },
      { option: 'LegalZoom / Trademark Engine', cost: '$200–$500 + filing fees', risk: 'Faster than DIY, but still no true legal advice. Good for straightforward names.' },
      { option: 'Trademark attorney', cost: '$500–$1,500 + filing fees', risk: 'Best protection, lowest rejection risk. Worth it for any meaningful brand.' },
    ],
    what_you_can_trademark: [
      `Your business name: "${business_name}"`,
      ...(has_logo ? ['Your logo (as a design mark)'] : []),
      'A slogan or tagline',
      'A distinctive product name',
    ],
    what_you_cannot_trademark: [
      'Generic or purely descriptive names (e.g., "Best Pizza", "Fast Plumber")',
      'Geographic names used descriptively',
      'Names already trademarked by others',
    ],
    tip: `Search USPTO TESS before spending a dollar on anything. If "${business_name}" is clear, file a federal trademark within the first year of business — it's cheap protection relative to the risk of losing your brand name.`,
  }
}

// ─── Hiring guide ─────────────────────────────────────────────────────────────

export function getHiringGuide(args: {
  worker_type?: 'employee' | 'contractor' | 'unsure'
  state?: string
  business_name?: string
  business_type?: string
}): Record<string, unknown> {
  const { worker_type = 'unsure', state = '', business_name = 'your business', business_type = 'business' } = args

  const classificationTest = {
    title: 'Employee vs. Independent Contractor — How to Decide',
    irs_rule: 'The IRS uses a Behavioral Control + Financial Control + Relationship Type test. If you control how, when, and where they work — they\'re probably an employee.',
    employee_indicators: [
      'You set their hours and schedule',
      'They work exclusively (or primarily) for you',
      'You provide tools, equipment, or workspace',
      'You train them on how to do the work',
      'The relationship is ongoing and indefinite',
    ],
    contractor_indicators: [
      'They set their own hours',
      'They work for multiple clients',
      'They use their own tools and equipment',
      'They control how the work is done',
      'The engagement is project-based with a defined end',
    ],
    risk: 'Misclassifying an employee as a contractor triggers back taxes, penalties, and potential lawsuits. The IRS can reclassify workers and assess back payroll taxes + interest.',
  }

  const employeeSteps = [
    { step: 'Get an EIN', detail: 'Required for payroll taxes. Free and instant at IRS.gov.', link: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online' },
    { step: 'Register for state payroll taxes', detail: `Register with ${state || 'your state'}\'s Department of Revenue/Labor for state income tax withholding and unemployment insurance (FUTA/SUTA).`, link: 'https://www.sba.gov/business-guide/launch-your-business/hire-your-first-employee' },
    { step: 'Set up payroll software', detail: 'Use Gusto ($46/month), Rippling, or QuickBooks Payroll. Never process payroll manually — the compliance risk is too high.', link: 'https://gusto.com/' },
    { step: 'Have them complete I-9 and W-4', detail: 'I-9 verifies work authorization (required by federal law). W-4 sets withholding.', link: 'https://www.uscis.gov/i-9' },
    { step: 'Report new hire to the state', detail: `Most states require reporting new hires within 20 days. Check ${state || 'your state'}\'s new hire reporting requirements.`, link: 'https://www.acf.hhs.gov/css/contact/state-new-hire-reporting-websites' },
    { step: 'Get workers\' compensation insurance', detail: 'Required in most states from the first employee. Get a quote from Next Insurance or Hiscox.', link: 'https://www.nextinsurance.com/' },
    { step: 'Post required labor law posters', detail: 'Federal and state labor law posters must be displayed in the workplace (or shared digitally for remote workers).', link: 'https://www.dol.gov/agencies/whd/posters' },
  ]

  const contractorSteps = [
    { step: 'Sign a written contractor agreement', detail: 'Defines scope, rate, IP ownership, confidentiality, and termination. Use the workspace to generate one.', link: '' },
    { step: 'Collect a W-9', detail: 'Before the first payment — this gives you their TIN for tax reporting purposes.', link: 'https://www.irs.gov/pub/irs-pdf/fw9.pdf' },
    { step: 'Pay without withholding', detail: 'Unlike employees, you do NOT withhold income or payroll taxes from contractor payments. They handle their own taxes.', link: '' },
    { step: 'File a 1099-NEC if you pay $600+', detail: 'For each contractor you pay $600 or more in a year, file Form 1099-NEC by January 31. Gusto or QuickBooks can automate this.', link: 'https://www.irs.gov/forms-pubs/about-form-1099-nec' },
  ]

  const payrollTools = [
    { name: 'Gusto', price: '$46/month + $6/person', best_for: 'Best overall for small businesses, handles taxes automatically, great UX', link: 'https://gusto.com/' },
    { name: 'Rippling', price: '$8/person/month', best_for: 'Best for growing teams, HR + payroll + IT in one', link: 'https://www.rippling.com/' },
    { name: 'QuickBooks Payroll', price: '$45–$125/month', best_for: 'If you\'re already on QuickBooks accounting', link: 'https://quickbooks.intuit.com/payroll/' },
    { name: 'OnPay', price: '$40/month + $6/person', best_for: 'Simple, affordable, good for restaurants and hourly workers', link: 'https://onpay.com/' },
  ]

  return {
    title: 'Hiring Guide',
    type: 'hiring_guide',
    classification_test: classificationTest,
    employee_steps: worker_type !== 'contractor' ? employeeSteps : [],
    contractor_steps: worker_type !== 'employee' ? contractorSteps : [],
    payroll_tools: worker_type !== 'contractor' ? payrollTools : [],
    key_deadlines: [
      'I-9: must complete within 3 days of start date',
      'New hire state reporting: within 20 days in most states',
      'W-2s: issue to employees by January 31',
      '1099-NEC: file for contractors paid $600+ by January 31',
      'Quarterly payroll returns (Form 941): due April 30, July 31, Oct 31, Jan 31',
    ],
    tip: `For ${business_type}, if someone works regular hours, uses your tools, and works mainly for you — they're almost certainly an employee. Gusto ($46/month) makes payroll compliance automatic and is the easiest way to stay legal from day one.`,
  }
}

// ─── Sales tax guide ──────────────────────────────────────────────────────────

const SALES_TAX_RATES: Record<string, { rate: number; notes: string }> = {
  California: { rate: 7.25, notes: 'Base rate — local add-ons bring most cities to 9–10.75%' },
  Texas: { rate: 6.25, notes: 'Plus up to 2% local; most areas ~8.25%' },
  Florida: { rate: 6.0, notes: 'Plus county surtax 0.5–1.5%; most areas ~7%' },
  'New York': { rate: 4.0, notes: 'Plus county/city tax — NYC total is 8.875%' },
  Washington: { rate: 6.5, notes: 'Plus local taxes; Seattle area ~10.1%' },
  Oregon: { rate: 0, notes: 'No state sales tax — one of 5 states with none' },
  Montana: { rate: 0, notes: 'No state sales tax' },
  Delaware: { rate: 0, notes: 'No state sales tax — very business-friendly' },
  'New Hampshire': { rate: 0, notes: 'No general sales tax' },
  Alaska: { rate: 0, notes: 'No state sales tax (some local taxes apply)' },
  Colorado: { rate: 2.9, notes: 'Very low state rate, but local taxes add up to ~9% in Denver' },
  Illinois: { rate: 6.25, notes: 'Plus local taxes; Chicago area up to 10.25%' },
  Georgia: { rate: 4.0, notes: 'Plus county taxes; most areas 7–8%' },
  Virginia: { rate: 5.3, notes: 'Plus 0.7% regional in Northern VA/Hampton Roads' },
}

export function getSalesTaxGuide(args: {
  state: string
  sells_products?: boolean
  sells_services?: boolean
  has_online_sales?: boolean
  business_type?: string
}): Record<string, unknown> {
  const { state, sells_products = true, sells_services = false, has_online_sales = false, business_type = 'business' } = args
  const taxInfo = SALES_TAX_RATES[state]
  const hasNoSalesTax = taxInfo?.rate === 0

  const nexusTypes = [
    { type: 'Physical nexus', description: `You have an office, store, warehouse, or employee in ${state} — you automatically owe sales tax there.` },
    { type: 'Economic nexus', description: 'Since 2018 (South Dakota v. Wayfair), most states require you to collect sales tax once you exceed $100K in sales OR 200 transactions in that state, even with no physical presence.' },
    { type: 'Click-through nexus', description: 'Having affiliates or referral partners in a state may create nexus in some states.' },
  ]

  const registrationSteps = [
    `Register for a ${state} sales tax permit at your state's Department of Revenue (usually free or ~$10–$50)`,
    'Set up your shopping cart or POS to collect the correct rate (product + location specific)',
    `File and remit sales tax to ${state} on the required schedule (monthly, quarterly, or annually based on volume)`,
    'Keep records of all taxable sales for at least 4 years',
  ]

  const softwareOptions = [
    { name: 'TaxJar', price: '$19–$99/month', best_for: 'Automated filing + multi-state compliance, great for ecommerce', link: 'https://www.taxjar.com/' },
    { name: 'Avalara', price: 'Custom pricing', best_for: 'Enterprise ecommerce, integrates with Shopify/WooCommerce/NetSuite', link: 'https://www.avalara.com/' },
    { name: 'Quaderno', price: '$49/month', best_for: 'SaaS / digital products, handles international VAT too', link: 'https://quaderno.io/' },
  ]

  return {
    title: 'Sales Tax Guide',
    type: 'sales_tax_guide',
    state,
    state_rate: taxInfo ? `${taxInfo.rate}%` : 'Varies',
    state_notes: taxInfo?.notes ?? `Check the ${state} Department of Revenue for current rates.`,
    no_sales_tax: hasNoSalesTax,
    taxable_in_state: !hasNoSalesTax,
    what_is_taxable: sells_services
      ? `In most states, physical products are taxable. Services are sometimes taxable too — ${state} has specific rules. Check your state's DOR for service taxability.`
      : 'Physical products are taxable in most states. Digital products (software, downloads) are taxable in ~30 states and rules vary significantly.',
    nexus_types: nexusTypes,
    economic_nexus_threshold: '$100,000 in sales OR 200 transactions in a state in a calendar year (threshold varies slightly by state)',
    online_sales_note: has_online_sales
      ? `You have online sales — you likely have economic nexus in ${state} and possibly other states once you cross $100K. Use TaxJar or Avalara to automate multi-state compliance.`
      : null,
    registration_steps: hasNoSalesTax ? [] : registrationSteps,
    software: softwareOptions,
    tip: hasNoSalesTax
      ? `Great news — ${state} has no state sales tax, which is a significant advantage for product businesses. Note: you may still owe sales tax in other states where you have customers (economic nexus).`
      : `Register for your ${state} sales tax permit before your first sale — collecting without a permit is a compliance violation. TaxJar ($19/month) automates the math and filing so you never miss a remittance deadline.`,
  }
}

// ─── S-Corp election guide ────────────────────────────────────────────────────

export function getSCorpElectionGuide(args: {
  entity_type?: string
  annual_profit_estimate?: string
  state?: string
  founder_name?: string
}): Record<string, unknown> {
  const { entity_type = 'llc', annual_profit_estimate = 'unknown', state = '', founder_name = 'you' } = args

  const profitMap: Record<string, number> = {
    under_40k: 30000,
    '40k_to_80k': 60000,
    over_80k: 100000,
    unknown: 0,
  }
  const annualProfit = profitMap[annual_profit_estimate] ?? 0
  const reasonableSalary = Math.round(annualProfit * 0.5)
  const distributionAmount = annualProfit - reasonableSalary
  const seSavings = Math.round(distributionAmount * 0.153)

  const worthIt = annualProfit >= 40000

  return {
    title: 'S-Corp Election Guide',
    type: 'scorp_guide',
    what_is_it: `An S-Corp election tells the IRS to tax your business as an S-Corporation. You can elect S-Corp status for an LLC or a C-Corp. The benefit: you split your income into a W-2 salary (subject to payroll taxes) and distributions (NOT subject to 15.3% self-employment tax).`,
    current_entity: entity_type.toUpperCase(),
    break_even: '$40,000–$50,000 in annual net profit — below this, the added complexity and cost of payroll typically outweigh the savings.',
    is_worth_it: worthIt,
    example_savings: annualProfit > 0 ? {
      annual_profit: `$${annualProfit.toLocaleString()}`,
      reasonable_salary: `$${reasonableSalary.toLocaleString()} W-2`,
      distributions: `$${distributionAmount.toLocaleString()} (no SE tax)`,
      estimated_annual_savings: `~$${seSavings.toLocaleString()}/year in self-employment tax`,
      note: 'Actual savings depend on your reasonable salary determination and state taxes.',
    } : null,
    downsides: [
      'Must pay yourself a "reasonable salary" (IRS scrutinizes this — use industry benchmarks)',
      'Adds payroll overhead: payroll software ($50+/month), payroll tax filings, W-2 issuance',
      'More complex tax return (Form 1120-S + personal return)',
      'Additional cost: accountant fees typically increase $500–$1,500/year',
      ...(state ? [`${state} may have its own S-Corp recognition rules — verify with a local CPA`] : []),
    ],
    how_to_elect: [
      { step: 'Form your LLC (or C-Corp) first', detail: 'S-Corp is a tax election, not a business structure — you still form an LLC or corporation first.' },
      { step: 'File IRS Form 2553', detail: 'File within 75 days of formation OR by March 15 for the current tax year to apply for that year. Download at IRS.gov.', link: 'https://www.irs.gov/pub/irs-pdf/f2553.pdf' },
      { step: 'Set up payroll', detail: `You must pay ${founder_name} a reasonable W-2 salary. Use Gusto or QuickBooks Payroll to stay compliant.`, link: 'https://gusto.com' },
      { step: 'File Form 1120-S annually', detail: 'S-Corps file their own tax return (1120-S) by March 15 each year. Hire a CPA — this is not DIY territory.', link: 'https://www.irs.gov/pub/irs-pdf/f1120s.pdf' },
    ],
    deadlines: {
      new_entity: 'File Form 2553 within 75 days of formation to apply for the current year',
      existing_entity: 'File Form 2553 by March 15 to apply for the current calendar year',
    },
    tip: worthIt
      ? `At ${annual_profit_estimate === 'over_80k' ? 'your profit level' : `$${annualProfit.toLocaleString()}/year in profit`}, the S-Corp election likely saves you ~$${seSavings.toLocaleString()}/year. Hire a CPA to do the election and first-year return — it pays for itself quickly.`
      : `Your current profit level doesn't yet justify the S-Corp overhead. Revisit this when you're consistently earning $50K+ in net profit — the savings start to significantly outpace the added costs.`,
  }
}

// ─── Funding guide ────────────────────────────────────────────────────────────

export function getFundingGuide(args: {
  stage?: string
  revenue_estimate?: string
  plans_to_raise_vc?: boolean
  business_type?: string
  amount_needed?: string
}): Record<string, unknown> {
  const {
    stage = 'pre-revenue',
    revenue_estimate = 'unknown',
    plans_to_raise_vc = false,
    business_type = 'business',
    amount_needed = 'unknown',
  } = args

  const isEarlyStage = revenue_estimate === 'unknown' || revenue_estimate === 'under_40k'
  const isVcTrack = plans_to_raise_vc || /tech|saas|software|app|platform/.test(business_type.toLowerCase())

  const options: Record<string, unknown>[] = [
    {
      name: 'Bootstrapping / Self-funding',
      type: 'non-dilutive',
      typical_amount: 'Whatever you can afford',
      best_for: 'Any business — starting lean forces good habits',
      pros: ['You keep 100% equity', 'No debt', 'Full control', 'Forces capital efficiency'],
      cons: ['Limited by personal funds', 'Slower growth'],
      how_to: 'Start lean, validate before scaling. Reinvest revenue. Keep personal expenses low.',
    },
    {
      name: 'Revenue-based / Customer funding',
      type: 'non-dilutive',
      typical_amount: 'Unlimited — depends on sales',
      best_for: 'Any product or service business',
      pros: ['No equity given up', 'No debt', 'Proof of demand'],
      cons: ['Requires customers first', 'Slow to scale initially'],
      how_to: 'Presell, take deposits, offer founding member pricing. Many businesses fund themselves this way.',
    },
    {
      name: 'SBA Loans',
      type: 'debt',
      typical_amount: '$5K–$5M (SBA 7(a)); $500–$50K (SBA Microloan)',
      best_for: 'Established businesses with some revenue history',
      pros: ['Low interest rates (10–15%)', 'Long repayment terms', 'No equity dilution'],
      cons: ['Requires personal guarantee', 'Lengthy application (2–3 months)', 'Usually need 2+ years in business'],
      how_to: 'Apply through an SBA-approved lender. Start with the SBA Microloan program for smaller amounts.',
      link: 'https://www.sba.gov/funding-programs/loans',
    },
    {
      name: 'Business Line of Credit / Term Loans',
      type: 'debt',
      typical_amount: '$10K–$500K',
      best_for: 'Businesses with 6+ months of revenue',
      pros: ['Flexible', 'Fast approval', 'Keeps equity intact'],
      cons: ['Higher rates than SBA (15–40%)', 'Often requires personal guarantee'],
      how_to: 'Try Bluevine, Fundbox, or your business bank for lines of credit.',
      link: 'https://www.bluevine.com/',
    },
    ...(isEarlyStage ? [{
      name: 'Grants',
      type: 'non-dilutive',
      typical_amount: '$1K–$50K for small business grants',
      best_for: 'Women-owned, minority-owned, veteran-owned, or rural businesses',
      pros: ['Free money — no repayment, no equity', 'Validates your business'],
      cons: ['Very competitive', 'Time-consuming applications', 'Restricted use'],
      how_to: 'Search Grants.gov, SBIR.gov, and local SBDC for federal/state programs.',
      link: 'https://www.grants.gov/',
    }] : []),
    ...(isVcTrack ? [
      {
        name: 'Angel Investors',
        type: 'equity',
        typical_amount: '$25K–$500K',
        best_for: 'Early-stage startups with high growth potential',
        pros: ['Faster than VC', 'Angels often provide mentorship and intros', 'Can close quickly'],
        cons: ['Give up equity (typically 10–25%)', 'Need a strong pitch + traction'],
        how_to: 'Find angels on AngelList, LinkedIn, local startup communities, and accelerator networks.',
        link: 'https://www.angellist.com/',
      },
      {
        name: 'Venture Capital (VC)',
        type: 'equity',
        typical_amount: '$500K–$10M+ (seed); $2M–$20M+ (Series A)',
        best_for: 'High-growth startups targeting large markets ($1B+)',
        pros: ['Large amounts of capital', 'VC network and expertise', 'Signals credibility'],
        cons: ['Significant equity dilution (20–35% per round)', 'Loss of control', 'Pressure for hypergrowth and exit', 'Most startups never get VC'],
        how_to: 'Build a track record (revenue, users, or strong team). Warm intros beat cold outreach. Apply to Y Combinator or other accelerators as a launching pad.',
        link: 'https://www.ycombinator.com/',
      },
    ] : []),
  ]

  const recommended = isEarlyStage
    ? options.slice(0, 2) // bootstrapping + customer funding first
    : isVcTrack
      ? options.filter(o => ['equity', 'non-dilutive'].includes(o.type as string))
      : options.filter(o => ['debt', 'non-dilutive'].includes(o.type as string))

  return {
    title: 'Funding Options Guide',
    type: 'funding_guide',
    summary: isVcTrack
      ? `For a ${business_type}, if you\'re planning to raise VC, start with customer traction and consider angels first. VCs invest in businesses that are already working.`
      : `For a ${business_type}, the best funding is usually customer revenue. Non-dilutive options (loans, grants) are the next best — preserve equity as long as possible.`,
    funding_options: options,
    recommended_path: recommended,
    equity_dilution_warning: 'Every dollar of equity you raise is permanent. Before taking outside investment, exhaust revenue-based and debt options — especially at early stages.',
    resources: [
      { name: 'SBA Lender Match', link: 'https://lendermatch.sba.gov/', description: 'Find SBA-approved lenders in minutes' },
      { name: 'Grants.gov', link: 'https://www.grants.gov/', description: 'Federal grants database' },
      { name: 'SBDC (Small Business Development Centers)', link: 'https://americassbdc.org/', description: 'Free business advisors + funding help, nationwide' },
      { name: 'AngelList', link: 'https://www.angellist.com/', description: 'Find angel investors' },
      ...(isVcTrack ? [{ name: 'Y Combinator', link: 'https://www.ycombinator.com/', description: 'Top startup accelerator, 2x/year' }] : []),
    ],
    tip: isEarlyStage
      ? 'The best funding source at your stage is a paying customer. Before pitching anyone, get your first 3–5 paying customers — it answers every investor\'s most important question.'
      : 'Talk to your local SBDC (free!) before applying for any loan. They help you prepare the application and often know which local lenders are actively lending.',
  }
}

// ─── Tool dispatcher ────────────────────────────────────────────────────────

function coerceBools(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(input)) {
    out[k] = v === 'true' ? true : v === 'false' ? false : v
  }
  return out
}

export function dispatchTool(name: string, input: Record<string, unknown>): string {
  try {
    input = coerceBools(input)
    let result: unknown
    if (name === 'get_state_info') result = getStateInfo(input.state as string)
    else if (name === 'recommend_entity_type') result = recommendEntityType(input as Parameters<typeof recommendEntityType>[0])
    else if (name === 'generate_operating_agreement') result = generateOperatingAgreement(input as Parameters<typeof generateOperatingAgreement>[0])
    else if (name === 'generate_launch_checklist') result = generateLaunchChecklist(input as Parameters<typeof generateLaunchChecklist>[0])
    else if (name === 'get_ein_guide') result = getEINGuide(input.entity_type as string)
    else if (name === 'get_banking_guide') result = getBankingGuide(input.entity_type as string, input.monthly_revenue_estimate as string)
    else if (name === 'get_website_guide') result = getWebsiteGuide(input as Parameters<typeof getWebsiteGuide>[0])
    else if (name === 'get_email_guide') result = getEmailGuide(input as Parameters<typeof getEmailGuide>[0])
    else if (name === 'get_pos_guide') result = getPOSGuide(input as Parameters<typeof getPOSGuide>[0])
    else if (name === 'generate_client_contract') result = generateClientContract(input as Parameters<typeof generateClientContract>[0])
    else if (name === 'generate_nda') result = generateNDA(input as Parameters<typeof generateNDA>[0])
    else if (name === 'generate_invoice_template') result = generateInvoiceTemplate(input as Parameters<typeof generateInvoiceTemplate>[0])
    else if (name === 'get_registered_agent_guide') result = getRegisteredAgentGuide(input as Parameters<typeof getRegisteredAgentGuide>[0])
    else if (name === 'get_accounting_guide') result = getAccountingGuide(input as Parameters<typeof getAccountingGuide>[0])
    else if (name === 'get_business_insurance_guide') result = getBusinessInsuranceGuide(input as Parameters<typeof getBusinessInsuranceGuide>[0])
    else if (name === 'get_trademark_guide') result = getTrademarkGuide(input as Parameters<typeof getTrademarkGuide>[0])
    else if (name === 'get_hiring_guide') result = getHiringGuide(input as Parameters<typeof getHiringGuide>[0])
    else if (name === 'get_sales_tax_guide') result = getSalesTaxGuide(input as Parameters<typeof getSalesTaxGuide>[0])
    else if (name === 'get_s_corp_election_guide') result = getSCorpElectionGuide(input as Parameters<typeof getSCorpElectionGuide>[0])
    else if (name === 'get_funding_guide') result = getFundingGuide(input as Parameters<typeof getFundingGuide>[0])
    else result = { error: `Unknown tool: ${name}` }
    return JSON.stringify(result, null, 2)
  } catch (e) {
    return JSON.stringify({ error: String(e) })
  }
}

// ─── Tool schemas (sent to Claude) ──────────────────────────────────────────

export const TOOL_SCHEMAS = [
  {
    name: 'get_state_info',
    description: 'Get accurate filing requirements, fees, and links for an LLC or sole proprietorship in a specific US state. Always use this — never guess at state fees.',
    input_schema: { type: 'object', properties: { state: { type: 'string', description: 'Full state name or 2-letter abbreviation' } }, required: ['state'] },
  },
  {
    name: 'recommend_entity_type',
    description: 'Recommend the best business entity type based on the founder\'s situation.',
    input_schema: {
      type: 'object',
      properties: {
        solo_or_partners: { type: 'string', enum: ['solo', 'partners'] },
        plans_to_raise_vc: { type: 'string' },
        wants_liability_protection: { type: 'string' },
        annual_profit_estimate: { type: 'string', enum: ['under_40k', '40k_to_80k', 'over_80k', 'unknown'] },
        industry: { type: 'string' },
        state: { type: 'string' },
      },
      required: ['solo_or_partners', 'wants_liability_protection', 'state'],
    },
  },
  {
    name: 'generate_operating_agreement',
    description: 'Generate a complete operating agreement for an LLC.',
    input_schema: {
      type: 'object',
      properties: {
        company_name: { type: 'string' },
        state: { type: 'string' },
        structure: { type: 'string', enum: ['single_member', 'multi_member'] },
        members: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, ownership_percent: { type: 'number' }, address: { type: 'string' } }, required: ['name', 'ownership_percent'] } },
        management_structure: { type: 'string', enum: ['member_managed', 'manager_managed'] },
        business_purpose: { type: 'string' },
        principal_address: { type: 'string' },
      },
      required: ['company_name', 'state', 'structure', 'members', 'management_structure'],
    },
  },
  {
    name: 'generate_launch_checklist',
    description: 'Generate a personalized launch checklist based on state, entity type, and industry.',
    input_schema: {
      type: 'object',
      properties: {
        state: { type: 'string' },
        entity_type: { type: 'string', enum: ['sole_proprietorship', 'llc', 's_corp'] },
        industry: { type: 'string' },
        has_employees: { type: 'string' },
        sells_products: { type: 'string' },
        has_physical_location: { type: 'string' },
        founder_name: { type: 'string' },
        business_name: { type: 'string' },
      },
      required: ['state', 'entity_type', 'industry'],
    },
  },
  {
    name: 'get_ein_guide',
    description: 'Get a step-by-step EIN application guide.',
    input_schema: { type: 'object', properties: { entity_type: { type: 'string' } }, required: ['entity_type'] },
  },
  {
    name: 'get_banking_guide',
    description: 'Get business banking recommendations and what to bring to open an account.',
    input_schema: { type: 'object', properties: { entity_type: { type: 'string' }, monthly_revenue_estimate: { type: 'string' }, needs_loans: { type: 'string' } }, required: ['entity_type'] },
  },
  {
    name: 'get_website_guide',
    description: 'Recommend website builders and provide a domain + launch checklist based on the business type. Use when someone asks about getting a website, domain, or online presence.',
    input_schema: {
      type: 'object',
      properties: {
        business_type: { type: 'string', description: 'e.g. restaurant, retail, service, consulting' },
        sells_products: { type: 'string', description:'Does the business sell physical products?' },
        needs_booking: { type: 'string', description:'Does the business need appointment booking?' },
      },
      required: ['business_type'],
    },
  },
  {
    name: 'get_email_guide',
    description: 'Recommend professional email providers and walk through setup. Use when someone asks about business email, professional email, or email setup.',
    input_schema: {
      type: 'object',
      properties: {
        team_size: { type: 'number', description: 'Number of people who need email accounts' },
        business_type: { type: 'string' },
      },
      required: [],
    },
  },
  {
    name: 'get_pos_guide',
    description: 'Research and compare POS (point of sale) systems based on business type and volume. Use when someone asks about taking payments, a cash register, POS, or payment processing in person.',
    input_schema: {
      type: 'object',
      properties: {
        business_type: { type: 'string', description: 'e.g. restaurant, retail, salon, food truck' },
        monthly_volume: { type: 'string', description: 'Estimated monthly sales volume: low (<$5k), medium ($5k-$50k), high (>$50k)' },
        has_physical_location: { type: 'string' },
      },
      required: ['business_type'],
    },
  },
  {
    name: 'generate_client_contract',
    description: 'Generate a client service agreement. Use when someone needs a contract for their clients.',
    input_schema: {
      type: 'object',
      properties: {
        business_name: { type: 'string' },
        state: { type: 'string' },
        founder_name: { type: 'string' },
        client_name: { type: 'string' },
        services_description: { type: 'string', description: 'What services will be provided' },
        rate: { type: 'string', description: 'e.g. $150/hour or $2,000 flat fee' },
        payment_terms: { type: 'string', description: 'e.g. Net 30, due on delivery' },
        notice_days: { type: 'number', description: 'Days notice required to terminate' },
      },
      required: ['business_name', 'state', 'founder_name'],
    },
  },
  {
    name: 'generate_nda',
    description: 'Generate a mutual non-disclosure agreement (NDA). Use when someone needs to protect confidential information.',
    input_schema: {
      type: 'object',
      properties: {
        party_a_name: { type: 'string', description: 'The user\'s business name' },
        state: { type: 'string' },
        party_b_name: { type: 'string', description: 'The other party\'s name' },
        purpose: { type: 'string', description: 'Why information is being shared' },
        term_years: { type: 'number', description: 'How many years the NDA lasts' },
      },
      required: ['party_a_name', 'state'],
    },
  },
  {
    name: 'generate_invoice_template',
    description: 'Generate an invoice template the user can reuse for all their clients.',
    input_schema: {
      type: 'object',
      properties: {
        business_name: { type: 'string' },
        founder_name: { type: 'string' },
        business_address: { type: 'string' },
        payment_methods: { type: 'string' },
        payment_days: { type: 'number', description: 'Net payment days e.g. 30' },
        tax_rate: { type: 'number', description: 'Sales tax rate as a percent, 0 if none' },
      },
      required: ['business_name', 'founder_name'],
    },
  },
  {
    name: 'get_business_insurance_guide',
    description: 'Recommend business insurance coverages and providers based on business type, employees, and location. Use when someone asks about insurance, liability, coverage, or protecting their business.',
    input_schema: {
      type: 'object',
      properties: {
        business_type: { type: 'string', description: 'e.g. restaurant, consulting, retail, contractor' },
        has_employees: { type: 'string' },
        has_physical_location: { type: 'string' },
        state: { type: 'string' },
      },
      required: ['business_type'],
    },
  },
  {
    name: 'get_trademark_guide',
    description: 'Guide the founder through trademark search and registration to protect their brand name and logo. Use when someone asks about trademarking, protecting their name, brand protection, or IP.',
    input_schema: {
      type: 'object',
      properties: {
        business_name: { type: 'string' },
        business_type: { type: 'string' },
        has_logo: { type: 'string', description:'Does the business have a logo to protect?' },
      },
      required: ['business_name'],
    },
  },
  {
    name: 'get_hiring_guide',
    description: 'Help founders navigate their first hire: employee vs contractor classification, payroll setup, required forms, and deadlines. Use when someone asks about hiring, employees, contractors, payroll, or 1099.',
    input_schema: {
      type: 'object',
      properties: {
        worker_type: { type: 'string', enum: ['employee', 'contractor', 'unsure'], description: 'What kind of worker they want to hire' },
        state: { type: 'string' },
        business_name: { type: 'string' },
        business_type: { type: 'string' },
      },
      required: [],
    },
  },
  {
    name: 'get_sales_tax_guide',
    description: 'Explain sales tax nexus, registration, collection, and filing for the founder\'s state. Use when someone asks about sales tax, nexus, collecting tax, or whether they need to register for sales tax.',
    input_schema: {
      type: 'object',
      properties: {
        state: { type: 'string', description: 'Primary state of operation' },
        sells_products: { type: 'string' },
        sells_services: { type: 'string' },
        has_online_sales: { type: 'string' },
        business_type: { type: 'string' },
      },
      required: ['state'],
    },
  },
  {
    name: 'get_s_corp_election_guide',
    description: 'Explain S-Corp election: what it is, when it saves money, how to file Form 2553, and the trade-offs. Use when someone asks about S-Corp, self-employment tax savings, or whether to elect S-Corp status.',
    input_schema: {
      type: 'object',
      properties: {
        entity_type: { type: 'string', enum: ['llc', 'c_corp', 'sole_proprietorship'] },
        annual_profit_estimate: { type: 'string', enum: ['under_40k', '40k_to_80k', 'over_80k', 'unknown'] },
        state: { type: 'string' },
        founder_name: { type: 'string' },
      },
      required: [],
    },
  },
  {
    name: 'get_funding_guide',
    description: 'Present funding options (bootstrapping, loans, grants, angels, VC) matched to the founder\'s stage and business type. Use when someone asks about funding, raising money, investors, loans, or grants.',
    input_schema: {
      type: 'object',
      properties: {
        stage: { type: 'string', description: 'e.g. idea, pre-revenue, early revenue, growth' },
        revenue_estimate: { type: 'string', enum: ['under_40k', '40k_to_80k', 'over_80k', 'unknown'] },
        plans_to_raise_vc: { type: 'string' },
        business_type: { type: 'string' },
        amount_needed: { type: 'string', description: 'e.g. $10K, $100K, $1M' },
      },
      required: [],
    },
  },
  {
    name: 'get_registered_agent_guide',
    description: 'Explain what a registered agent is, options (DIY vs service), and recommended services. Use when someone asks about registered agents, statutory agents, or needs to choose one.',
    input_schema: {
      type: 'object',
      properties: {
        state: { type: 'string', description: 'The state where the business is formed' },
        entity_type: { type: 'string', description: 'e.g. LLC, S-Corp, Corporation' },
        business_name: { type: 'string' },
      },
      required: ['state'],
    },
  },
  {
    name: 'get_accounting_guide',
    description: 'Provide accounting setup guidance: software recommendations, bookkeeping basics, tax obligations, and when to hire an accountant. Use when someone asks about accounting, bookkeeping, taxes, or financial tracking.',
    input_schema: {
      type: 'object',
      properties: {
        entity_type: { type: 'string', enum: ['sole_proprietorship', 'llc', 's_corp', 'corporation'] },
        has_employees: { type: 'string' },
        sells_products: { type: 'string' },
        revenue_estimate: { type: 'string', enum: ['under_40k', '40k_to_80k', 'over_80k', 'unknown'] },
        business_type: { type: 'string', description: 'e.g. consulting, retail, restaurant' },
      },
      required: [],
    },
  },
]
