"""
OpenFounder Tools
-----------------
All tool implementations for the agent.
Each tool is defined twice:
  1. As a schema (passed to Claude API)
  2. As a Python function (called when Claude invokes it)
"""

import json
import os
from datetime import datetime
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"
TEMPLATES_DIR = Path(__file__).parent.parent / "templates"
OUTPUTS_DIR = Path(__file__).parent.parent / "outputs"

# ─── Tool Schemas (sent to Claude) ───────────────────────────────────────────

TOOL_SCHEMAS = [
    {
        "name": "get_state_info",
        "description": (
            "Get accurate, current filing requirements, fees, and links for forming an LLC "
            "or sole proprietorship in a specific US state. Always use this tool for state-specific "
            "information — never guess at fees or requirements."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "state": {
                    "type": "string",
                    "description": "Full state name (e.g. 'New York') or 2-letter abbreviation (e.g. 'NY')",
                }
            },
            "required": ["state"],
        },
    },
    {
        "name": "recommend_entity_type",
        "description": (
            "Analyze a founder's situation and recommend the best business entity type "
            "(sole proprietorship, LLC, or S-Corp) with a clear explanation of why."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "solo_or_partners": {
                    "type": "string",
                    "enum": ["solo", "partners"],
                    "description": "Whether this is a solo venture or has multiple founders/partners",
                },
                "plans_to_raise_vc": {
                    "type": "boolean",
                    "description": "Whether the founder plans to raise venture capital",
                },
                "wants_liability_protection": {
                    "type": "boolean",
                    "description": "Whether personal liability protection is a priority",
                },
                "annual_profit_estimate": {
                    "type": "string",
                    "enum": ["under_40k", "40k_to_80k", "over_80k", "unknown"],
                    "description": "Rough estimate of expected annual profit",
                },
                "industry": {
                    "type": "string",
                    "description": "Type of business or industry",
                },
                "state": {
                    "type": "string",
                    "description": "State of formation",
                },
            },
            "required": ["solo_or_partners", "wants_liability_protection", "state"],
        },
    },
    {
        "name": "generate_operating_agreement",
        "description": (
            "Generate a complete, usable operating agreement for an LLC based on the founder's details. "
            "Returns a formatted document that can be saved and signed."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "company_name": {
                    "type": "string",
                    "description": "Full legal name of the LLC (e.g. 'Acme Plumbing LLC')",
                },
                "state": {
                    "type": "string",
                    "description": "State of formation",
                },
                "structure": {
                    "type": "string",
                    "enum": ["single_member", "multi_member"],
                    "description": "Single-member or multi-member LLC",
                },
                "members": {
                    "type": "array",
                    "description": "List of members with name and ownership percentage",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "ownership_percent": {"type": "number"},
                            "address": {"type": "string"},
                        },
                        "required": ["name", "ownership_percent"],
                    },
                },
                "management_structure": {
                    "type": "string",
                    "enum": ["member_managed", "manager_managed"],
                    "description": "Whether members manage the LLC directly or appoint a manager",
                },
                "business_purpose": {
                    "type": "string",
                    "description": "Brief description of the business purpose",
                },
                "principal_address": {
                    "type": "string",
                    "description": "Principal business address",
                },
            },
            "required": ["company_name", "state", "structure", "members", "management_structure"],
        },
    },
    {
        "name": "generate_launch_checklist",
        "description": (
            "Generate a personalized, prioritized launch checklist based on the founder's state, "
            "entity type, and industry. Includes time estimates and direct links."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "state": {"type": "string"},
                "entity_type": {
                    "type": "string",
                    "enum": ["sole_proprietorship", "llc", "s_corp"],
                },
                "industry": {"type": "string"},
                "has_employees": {"type": "boolean"},
                "sells_products": {"type": "boolean"},
                "has_physical_location": {"type": "boolean"},
                "founder_name": {"type": "string"},
                "business_name": {"type": "string"},
            },
            "required": ["state", "entity_type", "industry"],
        },
    },
    {
        "name": "get_ein_guide",
        "description": "Get a step-by-step guide for applying for an EIN (Employer Identification Number) from the IRS.",
        "input_schema": {
            "type": "object",
            "properties": {
                "entity_type": {
                    "type": "string",
                    "enum": ["sole_proprietorship", "llc", "s_corp"],
                },
                "solo_or_partners": {
                    "type": "string",
                    "enum": ["solo", "partners"],
                },
            },
            "required": ["entity_type"],
        },
    },
    {
        "name": "get_banking_guide",
        "description": "Get business banking recommendations and what to bring to open a business account.",
        "input_schema": {
            "type": "object",
            "properties": {
                "entity_type": {
                    "type": "string",
                    "enum": ["sole_proprietorship", "llc", "s_corp"],
                },
                "monthly_revenue_estimate": {
                    "type": "string",
                    "enum": ["under_5k", "5k_to_25k", "over_25k", "unknown"],
                },
                "needs_loans": {"type": "boolean"},
            },
            "required": ["entity_type"],
        },
    },
    {
        "name": "save_document",
        "description": "Save a generated document (operating agreement, checklist, etc.) to a file the user can download.",
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {"type": "string", "description": "Filename without extension"},
                "content": {"type": "string", "description": "Full document content in markdown"},
                "document_type": {
                    "type": "string",
                    "enum": ["operating_agreement", "checklist", "filing_guide", "other"],
                },
            },
            "required": ["filename", "content", "document_type"],
        },
    },
]


# ─── Tool Implementations ──────────────────────────────────────────────────────

def get_state_info(state: str) -> dict:
    """Load state data from JSON files."""
    state_map = {
        "ny": "new-york", "new york": "new-york",
        "ca": "california", "california": "california",
        "tx": "texas", "texas": "texas",
        "fl": "florida", "florida": "florida",
        "de": "delaware", "delaware": "delaware",
    }
    key = state.lower().strip()
    filename = state_map.get(key)

    if not filename:
        return {
            "error": f"State '{state}' not yet in OpenFounder's database.",
            "message": (
                f"We don't have detailed data for {state} yet — this is an open source project "
                f"and we're adding states continuously. "
                f"For now, visit your state's Secretary of State website to find filing requirements. "
                f"You can also contribute {state}'s data at https://github.com/openfoundr/openfoundr"
            ),
            "irs_ein_link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
            "sba_resource": "https://www.sba.gov/business-guide/launch-your-business/register-your-business",
        }

    path = DATA_DIR / "states" / f"{filename}.json"
    if not path.exists():
        return {"error": f"State data file not found for {state}"}

    with open(path) as f:
        return json.load(f)


def recommend_entity_type(
    solo_or_partners: str,
    wants_liability_protection: bool,
    state: str,
    plans_to_raise_vc: bool = False,
    annual_profit_estimate: str = "unknown",
    industry: str = "",
) -> dict:
    """Return a structured entity recommendation with reasoning."""

    recommendation = {}

    # VC track → C-Corp (Delaware)
    if plans_to_raise_vc:
        recommendation = {
            "recommended": "C-Corporation (Delaware)",
            "confidence": "high",
            "primary_reason": "Venture capitalists require C-Corps structured in Delaware. This is non-negotiable for most VC deals.",
            "key_benefits": [
                "Required by virtually all venture investors",
                "Allows issuance of preferred stock",
                "Strong legal precedent in Delaware courts",
                "Easy to grant stock options to employees (ISOs)",
            ],
            "watch_out_for": [
                "Double taxation (corporate tax + personal tax on dividends) — but VC-backed startups rarely pay dividends",
                "More complex accounting and compliance than an LLC",
                "Delaware annual franchise tax ($300+ for LLCs, more complex formula for C-Corps)",
            ],
            "next_step": "Form a Delaware C-Corp. Consider using Stripe Atlas, Clerky, or a startup lawyer.",
        }

    # Multi-member → LLC almost always
    elif solo_or_partners == "partners":
        recommendation = {
            "recommended": "Multi-Member LLC",
            "confidence": "high",
            "primary_reason": "Multiple founders need a structure that defines ownership, voting, and what happens if someone leaves. An LLC does this with less complexity than a corporation.",
            "key_benefits": [
                "Liability protection for all members",
                "Pass-through taxation (no double tax)",
                "Flexible profit/loss allocation",
                "Operating agreement defines ownership and exit terms",
            ],
            "watch_out_for": [
                "All members pay self-employment tax on their share of profits",
                "Need a solid operating agreement before anything else",
                f"State-specific costs and requirements in {state}",
            ],
            "next_step": "Form an LLC and draft your operating agreement before you do anything else together.",
        }

    # Solo + no liability protection needed → sole prop
    elif not wants_liability_protection and annual_profit_estimate == "under_40k":
        recommendation = {
            "recommended": "Sole Proprietorship (to start)",
            "confidence": "medium",
            "primary_reason": "If you're just testing an idea and profit is modest, the simplicity of a sole proprietorship is hard to beat. No formation costs, no annual fees, no paperwork.",
            "key_benefits": [
                "Zero cost to start",
                "No annual fees or reports",
                "Simple taxes (Schedule C)",
                "Can always upgrade to LLC later",
            ],
            "watch_out_for": [
                "NO liability protection — your personal assets are at risk",
                "Harder to open a business bank account",
                "Less credible to some clients and vendors",
                "If you get sued, everything you own is on the line",
            ],
            "next_step": "If you have any clients, contracts, or meaningful assets to protect, consider forming an LLC instead. The liability exposure of a sole prop is real.",
        }

    # Solo + high profit → S-Corp worth considering
    elif solo_or_partners == "solo" and annual_profit_estimate == "over_80k":
        recommendation = {
            "recommended": "LLC taxed as S-Corp",
            "confidence": "medium",
            "primary_reason": "At your income level, electing S-Corp taxation on your LLC can save significant self-employment taxes. This is the most tax-efficient structure for a solo operator earning $80k+ in profit.",
            "key_benefits": [
                "Pay yourself a 'reasonable salary' — only salary subject to SE tax",
                "Remaining profit distributed without 15.3% SE tax",
                "Can save $5,000–$15,000+/year in taxes at higher income levels",
                "Still has LLC liability protection",
            ],
            "watch_out_for": [
                "More complex — requires payroll, W-2, and separate corporate tax return",
                "Must pay yourself a 'reasonable salary' (IRS scrutinizes this)",
                "Additional accounting costs (~$1,000–$3,000/year)",
                "Only worthwhile once profit reliably exceeds ~$60k–$80k",
            ],
            "next_step": "Form an LLC first. Once you're earning consistently over $60k in profit, consult a CPA about filing Form 2553 to elect S-Corp taxation.",
        }

    # Default: LLC
    else:
        recommendation = {
            "recommended": "Single-Member LLC",
            "confidence": "high",
            "primary_reason": "An LLC gives you personal liability protection with minimal complexity. It's the right default for most small businesses.",
            "key_benefits": [
                "Personal assets protected from business debts and lawsuits",
                "Pass-through taxation — profits taxed on your personal return",
                "Simple to manage — no board meetings, no corporate formalities",
                "Credible to clients, banks, and vendors",
                "Easy to add members later if you bring on a partner",
            ],
            "watch_out_for": [
                "All profit subject to self-employment tax (15.3% on first ~$168k)",
                f"State filing fees and annual requirements in {state}",
                "Need to keep business and personal finances strictly separate",
            ],
            "next_step": f"File your Articles of Organization with {state}'s Secretary of State and get your EIN. Let's walk through both.",
        }

    return recommendation


def generate_operating_agreement(
    company_name: str,
    state: str,
    structure: str,
    members: list,
    management_structure: str,
    business_purpose: str = "to engage in any lawful business activity",
    principal_address: str = "",
) -> dict:
    """Generate a complete operating agreement."""
    today = datetime.now().strftime("%B %d, %Y")
    year = datetime.now().year

    # Build member list
    member_lines = "\n".join(
        [f"- {m['name']}: {m['ownership_percent']}% ownership interest"
         + (f", {m['address']}" if m.get('address') else "")
         for m in members]
    )

    member_signature_blocks = "\n\n".join([
        f"____________________________\n{m['name']}\nDate: ____________"
        for m in members
    ])

    management_text = (
        "The Company shall be managed by its Members in proportion to their ownership interests."
        if management_structure == "member_managed"
        else "The Company shall be managed by a Manager appointed by the Members."
    )

    agreement = f"""# OPERATING AGREEMENT
## {company_name}
### A {state} Limited Liability Company

**Effective Date:** {today}

---

> ⚠️ **IMPORTANT NOTICE:** This document was generated by OpenFounder as a starting point.
> It is not legal advice. For complex situations, significant assets, or multiple members
> with complicated arrangements, please have this reviewed by a licensed attorney in {state}.

---

## ARTICLE I — FORMATION

**1.1 Name.** The name of the limited liability company is {company_name} (the "Company").

**1.2 State of Formation.** The Company is organized under the laws of the State of {state}.

**1.3 Principal Office.** The principal office of the Company is located at:
{principal_address if principal_address else "[INSERT PRINCIPAL BUSINESS ADDRESS]"}

**1.4 Registered Agent.** The Company shall maintain a registered agent in {state} as required by law.

**1.5 Purpose.** The purpose of the Company is {business_purpose}, and to engage in any other lawful activity permitted under the laws of {state}.

**1.6 Term.** The Company shall continue until dissolved in accordance with this Agreement or applicable law.

---

## ARTICLE II — MEMBERS AND OWNERSHIP

**2.1 Members.** The following individuals are the initial Members of the Company:

{member_lines}

**2.2 Additional Members.** New Members may be admitted only upon unanimous written consent of all existing Members.

**2.3 No Transfer Without Consent.** No Member may transfer, sell, assign, or pledge their ownership interest without the prior written consent of all other Members. Any attempted transfer in violation of this section is void.

---

## ARTICLE III — CAPITAL CONTRIBUTIONS

**3.1 Initial Contributions.** Each Member has made or agrees to make an initial capital contribution as agreed among the Members.

**3.2 Additional Contributions.** No Member shall be required to make additional capital contributions without unanimous written consent.

**3.3 No Interest on Contributions.** No Member shall receive interest on capital contributions.

**3.4 No Return of Contributions.** No Member shall have the right to demand or receive the return of their capital contribution except upon dissolution or as otherwise unanimously agreed.

---

## ARTICLE IV — ALLOCATIONS AND DISTRIBUTIONS

**4.1 Allocation of Profits and Losses.** Profits and losses of the Company shall be allocated among the Members in proportion to their ownership interests as set forth in Section 2.1.

**4.2 Distributions.** Distributions shall be made to Members at such times and in such amounts as determined by {("the Members" if management_structure == "member_managed" else "the Manager")}, in proportion to their ownership interests. No distribution shall be made that would render the Company unable to pay its debts as they become due.

**4.3 Tax Distributions.** The Company shall, to the extent of available cash, make tax distributions to Members sufficient to cover their estimated income tax liability attributable to the Company's taxable income, calculated at a combined federal and state effective rate of 40%.

---

## ARTICLE V — MANAGEMENT

**5.1 Management Structure.** {management_text}

**5.2 Authority.** {"Each Member" if management_structure == "member_managed" else "The Manager"} has authority to bind the Company in the ordinary course of business.

**5.3 Major Decisions.** The following actions require unanimous written consent of all Members:
- Admission of new Members
- Sale, lease, or disposition of all or substantially all Company assets
- Merger, consolidation, or reorganization of the Company
- Amendment of this Operating Agreement
- Dissolution of the Company
- Taking on debt exceeding $[INSERT THRESHOLD]
- Any transaction between the Company and a Member or affiliate

**5.4 Voting.** On matters requiring Member approval, each Member shall have votes equal to their ownership percentage. Except where this Agreement requires unanimity, decisions shall be made by a majority of ownership interests.

**5.5 Meetings.** Meetings may be held in person, by telephone, or by video conference. Decisions may also be made by written consent without a meeting.

---

## ARTICLE VI — BOOKS, RECORDS, AND ACCOUNTING

**6.1 Books and Records.** The Company shall maintain complete and accurate books of account and other records at its principal office. Each Member shall have access to these records upon reasonable notice.

**6.2 Fiscal Year.** The fiscal year of the Company shall be the calendar year (January 1 – December 31).

**6.3 Tax Treatment.** The Company shall be treated as a {"disregarded entity" if structure == "single_member" else "partnership"} for federal income tax purposes unless the Members elect otherwise.

**6.4 Bank Accounts.** The Company shall maintain separate bank accounts in the Company's name. No Member shall commingle personal and Company funds.

---

## ARTICLE VII — WITHDRAWAL AND BUY-SELL

**7.1 Voluntary Withdrawal.** A Member may withdraw upon 90 days' written notice to all other Members. Upon withdrawal, the withdrawing Member is entitled to the fair market value of their interest, payable over 24 months.

**7.2 Death or Incapacity.** Upon the death or permanent incapacity of a Member, the remaining Members shall have the right to purchase the deceased or incapacitated Member's interest at fair market value within 180 days.

**7.3 Valuation.** Fair market value shall be determined by mutual agreement of the parties, or if no agreement is reached within 30 days, by an independent appraiser selected by mutual agreement.

**7.4 Right of First Refusal.** If a Member receives a bona fide offer to purchase their interest, the remaining Members shall have a right of first refusal to purchase that interest on the same terms within 30 days of written notice.

---

## ARTICLE VIII — DISSOLUTION

**8.1 Events of Dissolution.** The Company shall be dissolved upon:
(a) Unanimous written consent of all Members;
(b) Entry of a judicial dissolution order;
(c) Any other event required by {state} law.

**8.2 Winding Up.** Upon dissolution, the Company's affairs shall be wound up by the Members. Assets shall be applied in the following order: (1) creditors; (2) Members in proportion to their capital accounts; (3) Members in proportion to their ownership interests.

---

## ARTICLE IX — INDEMNIFICATION AND LIABILITY

**9.1 Liability Limitation.** No Member shall be personally liable for any debts, obligations, or liabilities of the Company solely by reason of being a Member.

**9.2 Indemnification.** The Company shall indemnify and hold harmless each Member and Manager from claims arising out of their actions on behalf of the Company, provided such actions were taken in good faith and in a manner reasonably believed to be in the best interests of the Company.

---

## ARTICLE X — MISCELLANEOUS

**10.1 Entire Agreement.** This Agreement constitutes the entire agreement among the Members with respect to the Company and supersedes all prior agreements.

**10.2 Amendments.** This Agreement may be amended only by unanimous written consent of all Members.

**10.3 Governing Law.** This Agreement shall be governed by the laws of the State of {state}.

**10.4 Severability.** If any provision of this Agreement is held invalid, the remaining provisions shall continue in full force.

**10.5 Counterparts.** This Agreement may be executed in counterparts, each of which shall be an original.

---

## SIGNATURES

IN WITNESS WHEREOF, the Members have executed this Operating Agreement as of the date first written above.

{member_signature_blocks}

---

*Generated by OpenFounder — open source business formation for everyone.*
*Review with a licensed attorney in {state} before signing. Not legal advice.*
*https://github.com/openfoundr/openfoundr*
"""

    return {
        "document": agreement,
        "company_name": company_name,
        "state": state,
        "structure": structure,
        "generated_date": today,
        "word_count": len(agreement.split()),
        "note": "Review with a licensed attorney before signing. This is a starting point, not legal advice.",
    }


def generate_launch_checklist(
    state: str,
    entity_type: str,
    industry: str,
    has_employees: bool = False,
    sells_products: bool = False,
    has_physical_location: bool = False,
    founder_name: str = "",
    business_name: str = "",
) -> dict:
    """Generate a personalized launch checklist."""
    state_info = get_state_info(state)
    state_name = state_info.get("name", state)
    has_state_data = "error" not in state_info

    checklist = {
        "title": f"Launch Checklist{' for ' + business_name if business_name else ''}",
        "generated_for": founder_name or "Founder",
        "state": state_name,
        "entity_type": entity_type,
        "generated_date": datetime.now().strftime("%B %d, %Y"),
        "phases": []
    }

    # Phase 1: Legal
    legal_items = []
    if entity_type == "llc":
        fee = state_info.get("llc", {}).get("filing_fee", "varies") if has_state_data else "varies"
        link = state_info.get("llc", {}).get("filing_link", state_info.get("secretary_of_state", {}).get("website", "")) if has_state_data else ""
        legal_items.append({
            "task": f"File Articles of Organization with {state_name} Secretary of State",
            "fee": f"${fee}" if isinstance(fee, int) else fee,
            "time": "30–60 minutes",
            "link": link,
            "priority": "critical",
        })
        if has_state_data and state_info.get("llc", {}).get("publication_requirement"):
            legal_items.append({
                "task": f"Complete newspaper publication requirement",
                "fee": state_info["llc"].get("publication_notes", "Cost varies"),
                "time": "6 weeks",
                "priority": "critical",
                "note": state_info["llc"].get("publication_notes", ""),
            })
        legal_items.append({
            "task": "Draft and sign Operating Agreement",
            "fee": "Free (use OpenFounder)",
            "time": "30 minutes",
            "priority": "critical",
            "note": "Even if not required by your state, your bank will ask for it.",
        })
    elif entity_type == "sole_proprietorship":
        legal_items.append({
            "task": f"File DBA ('Doing Business As') if using a business name",
            "fee": "Varies by county ($15–$75)",
            "time": "1 hour",
            "priority": "high",
            "note": "Required if operating under any name other than your legal name.",
        })

    legal_items.append({
        "task": "Apply for EIN (Employer Identification Number) from IRS",
        "fee": "Free",
        "time": "10 minutes — immediate online",
        "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
        "priority": "critical",
    })

    checklist["phases"].append({"name": "Legal Foundation", "items": legal_items})

    # Phase 2: Financial
    financial_items = [
        {
            "task": "Open a dedicated business checking account",
            "fee": "Free (Mercury, Relay) or varies",
            "time": "30–60 minutes",
            "priority": "critical",
            "note": "Keeping personal and business money separate is essential for liability protection and taxes.",
        },
        {
            "task": "Set up basic bookkeeping (Wave free, or QuickBooks)",
            "fee": "Free–$30/month",
            "time": "1–2 hours to set up",
            "priority": "high",
            "link": "https://www.waveapps.com/",
        },
        {
            "task": "Set up quarterly estimated tax payments",
            "fee": "Free",
            "time": "30 minutes",
            "link": "https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes",
            "priority": "high",
            "note": "Due April 15, June 15, September 15, January 15. Missing these leads to penalties.",
        },
    ]

    if has_state_data:
        annual_report = state_info.get("llc", {}).get("annual_report", {})
        if annual_report.get("required"):
            financial_items.append({
                "task": f"Mark calendar: {annual_report.get('name', 'Annual Report')} due {annual_report.get('due', 'annually')}",
                "fee": f"${annual_report.get('fee', 'varies')}",
                "time": "15 minutes when due",
                "priority": "high",
                "note": "Put this in your calendar now. Missing it can dissolve your LLC.",
            })

    checklist["phases"].append({"name": "Financial Infrastructure", "items": financial_items})

    # Phase 3: Digital
    digital_items = [
        {
            "task": "Register your domain name",
            "fee": "$10–$20/year",
            "time": "15 minutes",
            "link": "https://www.namecheap.com",
            "priority": "high",
        },
        {
            "task": "Set up professional email (Google Workspace or Microsoft 365)",
            "fee": "$6–$12/month",
            "time": "1–2 hours",
            "link": "https://workspace.google.com/",
            "priority": "high",
        },
        {
            "task": "Build your basic website",
            "fee": "$12–$40/month depending on platform",
            "time": "Half day",
            "priority": "medium",
        },
    ]
    checklist["phases"].append({"name": "Digital Presence", "items": digital_items})

    # Phase 4: Compliance
    compliance_items = [
        {
            "task": "Apply for local business license",
            "fee": "Varies by city/county ($25–$150)",
            "time": "30–60 minutes",
            "priority": "high",
            "note": "Most cities require this. Check your city's website.",
        },
        {
            "task": "Get general liability insurance",
            "fee": "$500–$1,500/year",
            "time": "30 minutes for a quote",
            "link": "https://www.next-insurance.com/",
            "priority": "high",
        },
    ]

    if sells_products:
        compliance_items.append({
            "task": "Register for sales tax collection",
            "fee": "Free",
            "time": "30 minutes",
            "priority": "critical",
            "note": f"If you sell taxable products in {state_name}, you must collect and remit sales tax.",
        })

    if has_employees:
        compliance_items.append({
            "task": "Register for state payroll taxes",
            "fee": "Free",
            "time": "1–2 hours",
            "priority": "critical",
        })
        compliance_items.append({
            "task": "Set up workers' compensation insurance",
            "fee": "Varies",
            "time": "1–2 hours",
            "priority": "critical",
            "note": "Required in most states once you have employees.",
        })

    checklist["phases"].append({"name": "Compliance & Operations", "items": compliance_items})

    # Summary stats
    total_items = sum(len(p["items"]) for p in checklist["phases"])
    critical_items = sum(
        1 for p in checklist["phases"]
        for item in p["items"]
        if item.get("priority") == "critical"
    )
    checklist["summary"] = {
        "total_items": total_items,
        "critical_items": critical_items,
        "estimated_total_cost": "Varies by state — see items above",
    }

    return checklist


def get_ein_guide(entity_type: str, solo_or_partners: str = "solo") -> dict:
    return {
        "title": "How to Get Your EIN (Employer Identification Number)",
        "what_is_it": "An EIN is your business's tax ID — like a Social Security Number but for your company. You need it to open a business bank account, hire employees, and file taxes.",
        "cost": "Free — the IRS issues EINs at no charge.",
        "time": "10 minutes online. Your EIN is issued immediately.",
        "link": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
        "steps": [
            "Go to the IRS EIN Online Application (link above). Only available Mon–Fri, 7am–10pm ET.",
            "Select your entity type: 'Limited Liability Company' for an LLC, or 'Sole Proprietor' for a sole prop.",
            f"For an LLC: select '{('1' if solo_or_partners == 'solo' else '2 or more')} member(s)'",
            "Enter the 'responsible party' — the person who controls the entity (usually you).",
            "Enter your Social Security Number when prompted (this is required — the IRS needs to link the EIN to a real person).",
            "Enter your business name and address.",
            "Submit. Your EIN is displayed immediately on screen.",
            "Download and save the PDF confirmation (EIN Assignment Letter). You'll need it forever.",
        ],
        "watch_out": [
            "Third-party services charge $50–$300 to 'help' you get an EIN. Don't pay — it's completely free directly from the IRS.",
            "Only apply through irs.gov — there are scam sites that look official.",
            "If you close your browser before saving the EIN, call the IRS Business line (800-829-4933) to retrieve it.",
        ],
        "after_you_get_it": [
            "Open your business bank account (they'll ask for it)",
            "Give it to clients who need to send you a 1099",
            "Use it on all business tax filings",
            "Never use your SSN on business documents if you have an EIN",
        ],
    }


def get_banking_guide(
    entity_type: str,
    monthly_revenue_estimate: str = "unknown",
    needs_loans: bool = False,
) -> dict:
    recommendations = []

    if monthly_revenue_estimate in ["under_5k", "unknown"]:
        recommendations.append({
            "name": "Mercury",
            "type": "Online bank",
            "monthly_fee": "$0",
            "why": "Best free business banking for early-stage founders. No monthly fees, excellent UI, instant account opening online. FDIC insured.",
            "link": "https://mercury.com/",
            "best_for": "Startups, freelancers, online businesses",
        })
        recommendations.append({
            "name": "Relay",
            "type": "Online bank",
            "monthly_fee": "$0 basic / $30 pro",
            "why": "Excellent for businesses that want to allocate money across multiple sub-accounts (great for setting aside taxes). No fees on basic plan.",
            "link": "https://relayfi.com/",
            "best_for": "Anyone who wants to budget by allocating to separate accounts",
        })

    if needs_loans or monthly_revenue_estimate in ["5k_to_25k", "over_25k"]:
        recommendations.append({
            "name": "Chase Business Complete Banking",
            "type": "Traditional bank",
            "monthly_fee": "$15 (waivable with $2,000 balance)",
            "why": "Best traditional bank for small businesses. Strong SBA loan access, physical branches, and the most widely accepted for business credit.",
            "link": "https://www.chase.com/business/banking/checking",
            "best_for": "Businesses that need loans, lines of credit, or physical branch access",
        })

    what_to_bring = [
        "Your EIN (Employer Identification Number)",
        "Government-issued ID (driver's license or passport)",
    ]

    if entity_type == "llc":
        what_to_bring += [
            "Articles of Organization (your LLC formation document from the state)",
            "Operating Agreement",
            "Any ownership resolution if you have multiple members",
        ]
    elif entity_type == "sole_proprietorship":
        what_to_bring += [
            "DBA certificate (if operating under a business name)",
            "Your SSN (for sole props without an EIN, though EIN is recommended)",
        ]

    return {
        "title": "Opening a Business Bank Account",
        "why_it_matters": "Keeping personal and business money separate is one of the most important things you can do. It protects your LLC's liability shield, makes taxes dramatically easier, and gives you a clear picture of your business finances.",
        "recommendations": recommendations,
        "what_to_bring": what_to_bring,
        "golden_rule": "Never, ever run business income or expenses through your personal account. This is called 'piercing the corporate veil' and it destroys the liability protection your LLC provides.",
    }


def save_document(filename: str, content: str, document_type: str) -> dict:
    """Save a document to the outputs directory."""
    OUTPUTS_DIR.mkdir(exist_ok=True)
    safe_filename = filename.replace(" ", "_").lower()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = OUTPUTS_DIR / f"{safe_filename}_{timestamp}.md"

    with open(filepath, "w") as f:
        f.write(content)

    return {
        "saved": True,
        "filepath": str(filepath),
        "filename": filepath.name,
        "message": f"Document saved to: {filepath}",
    }


# ─── Tool Dispatcher ───────────────────────────────────────────────────────────

def dispatch_tool(tool_name: str, tool_input: dict) -> str:
    """Route a tool call from Claude to the right implementation."""
    try:
        if tool_name == "get_state_info":
            result = get_state_info(**tool_input)
        elif tool_name == "recommend_entity_type":
            result = recommend_entity_type(**tool_input)
        elif tool_name == "generate_operating_agreement":
            result = generate_operating_agreement(**tool_input)
        elif tool_name == "generate_launch_checklist":
            result = generate_launch_checklist(**tool_input)
        elif tool_name == "get_ein_guide":
            result = get_ein_guide(**tool_input)
        elif tool_name == "get_banking_guide":
            result = get_banking_guide(**tool_input)
        elif tool_name == "save_document":
            result = save_document(**tool_input)
        else:
            result = {"error": f"Unknown tool: {tool_name}"}

        return json.dumps(result, indent=2)

    except Exception as e:
        return json.dumps({"error": str(e), "tool": tool_name})
