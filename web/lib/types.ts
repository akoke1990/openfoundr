export interface FounderProfile {
  state: string
  stateAbbr: string
  businessType: string
  businessTypeOther: string
  structure: 'solo' | 'partners'
  partnerCount: number
  entityType: string
  hasEmployees: boolean
  sellsProducts: boolean
  hasPhysicalLocation: boolean
  plansToRaiseVC: boolean
  revenueEstimate: string
  founderName: string
  businessName: string
  businessAddress: string
  partners: { name: string; ownership: number }[]
}
