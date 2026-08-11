export type BillingCycle = 'monthly' | 'yearly'
export type PlanAccent = 'mint' | 'electric' | 'carbon'
export type PlanKey = 'launch' | 'scale' | 'enterprise'

export interface BillingOption {
  label: string
  value: BillingCycle
  caption: string
}

export interface PlanMetric {
  label: string
  value: string
}

export interface PricingPlan {
  key: PlanKey
  name: string
  eyebrow: string
  tagline: string
  description: string
  icon: string
  accent: PlanAccent
  monthlyPrice: number | null
  yearlyPrice: number | null
  unit: string
  badge?: string
  cta: string
  audience: string
  metrics: PlanMetric[]
  features: string[]
}

export interface CompareFeature {
  group: string
  name: string
  launch: boolean | string
  scale: boolean | string
  enterprise: boolean | string
}

export interface PricingAddon {
  name: string
  description: string
  icon: string
  value: string
}

export interface PricingFaq {
  question: string
  answer: string
}
