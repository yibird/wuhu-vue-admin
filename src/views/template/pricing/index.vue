<script lang="ts" setup>
import {
  billingOptions,
  compareFeatures,
  pricingAddons,
  pricingFaqs,
  pricingPlans,
} from './data'
import {
  Compare as PricingCompare,
  Faq as PricingFaq,
  Hero as PricingHero,
  PlanCard as PricingPlanCard,
} from './components'
import type { BillingCycle, PlanKey, PricingPlan } from './types'

const billingCycle = shallowRef<BillingCycle>('yearly')
const selectedPlanKey = shallowRef<PlanKey>('scale')
const openFaqIndex = shallowRef(0)

const activePlan = computed(() => {
  return (
    pricingPlans.find((plan) => plan.key === selectedPlanKey.value) ??
    pricingPlans[1]
  )
})

const savedAmount = computed(() => {
  if (billingCycle.value !== 'yearly') return 0

  return pricingPlans.reduce((total, plan) => {
    if (!plan.monthlyPrice || !plan.yearlyPrice) return total
    return total + (plan.monthlyPrice - plan.yearlyPrice) * 12
  }, 0)
})

const activePlanEstimate = computed(() => {
  const plan = activePlan.value
  const price =
    billingCycle.value === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice

  if (price === null) return '按需报价'
  if (price === 0) return '免费'
  if (billingCycle.value === 'yearly') return `¥${price * 12} / 年`
  return `¥${price} / 月`
})

const billingLabel = computed(() => {
  return billingCycle.value === 'yearly' ? '年付' : '月付'
})

function updateBillingCycle(cycle: BillingCycle) {
  billingCycle.value = cycle
}

function selectPlan(plan: PricingPlan) {
  selectedPlanKey.value = plan.key
}

function toggleFaq(index: number) {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index
}
</script>

<template>
  <WView :padding="0">
    <Scrollbar class="h-full bg-page" content-class="min-h-full">
      <main
        class="mx-auto min-h-full w-full overflow-hidden p-18 text-main max-sm:p-8"
      >
        <PricingHero
          :billing-cycle="billingCycle"
          :billing-options="billingOptions"
          :saved-amount="savedAmount"
          @change-cycle="updateBillingCycle"
        />

        <section
          class="mt-20 grid grid-cols-3 gap-16 max-[980px]:grid-cols-1 max-[980px]:gap-12"
          aria-label="订阅方案"
        >
          <PricingPlanCard
            v-for="(plan, i) in pricingPlans"
            :key="plan.key"
            :plan="plan"
            :billing-cycle="billingCycle"
            :active="selectedPlanKey === plan.key"
            :class="`page-enter page-enter--${i + 2}`"
            @select="selectPlan"
          />
        </section>

        <section
          class="page-enter page-enter--4 mt-20 grid grid-cols-[minmax(0,1fr)_360px] gap-16 max-[1180px]:grid-cols-1"
        >
          <div class="grid min-w-0 gap-16">
            <PricingCompare
              :features="compareFeatures"
              :active-plan-key="selectedPlanKey"
            />

            <section
              class="overflow-hidden rounded-16 border-1 border-color-1 border-solid bg-container shadow-[0_10px_30px_rgb(15_23_42_/_5%)]"
              aria-label="扩展能力"
            >
              <div
                class="flex items-center justify-between gap-12 border-b-1 border-color-1 border-b-solid p-20"
              >
                <div>
                  <span
                    class="inline-flex items-center gap-8 rounded-full bg-primary/10 px-10 py-4 text-xs text-primary font-800 uppercase tracking-wider"
                  >
                    <Icon name="i-lucide:zap" :size="12" />
                    Add-ons
                  </span>
                  <h2 class="mt-8 text-xl text-main font-900 leading-26">
                    按需扩展
                  </h2>
                </div>
                <span
                  class="size-44 inline-flex items-center justify-center rounded-12 bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-[0_8px_24px_rgb(var(--w-color-primary)_/_15%)]"
                >
                  <Icon name="i-lucide:package-plus" :size="20" />
                </span>
              </div>

              <div class="grid grid-cols-3 gap-12 p-16 max-[980px]:grid-cols-1">
                <article
                  v-for="addon in pricingAddons"
                  :key="addon.name"
                  class="group relative grid min-w-0 grid-cols-[48px_minmax(0,1fr)] items-start gap-14 overflow-hidden rounded-12 border-1 border-color-1 border-solid bg-fill-tertiary/40 p-16 transition-[border-color,box-shadow,transform] duration-motion-base ease-motion-standard hover:(-translate-y-2 border-primary/30 shadow-[0_16px_36px_rgb(var(--w-color-primary)_/_10%)]) motion-reduce:transition-none"
                >
                  <span
                    class="size-48 inline-flex items-center justify-center rounded-12 bg-primary/8 text-primary transition-[background-color,transform] duration-motion-moderate ease-motion-standard group-hover:(scale-110 bg-primary/15) motion-reduce:transition-none"
                  >
                    <Icon :name="addon.icon" :size="22" />
                  </span>
                  <span class="min-w-0">
                    <strong class="block text-sm text-main font-700">
                      {{ addon.name }}
                    </strong>
                    <small class="mt-4 block text-xs text-secondary leading-18">
                      {{ addon.description }}
                    </small>
                    <em
                      class="mt-8 inline-block rounded-full bg-primary/10 px-10 py-3 text-xs text-primary font-800 not-italic"
                    >
                      {{ addon.value }}
                    </em>
                  </span>
                </article>
              </div>
            </section>
          </div>

          <aside
            class="sticky top-12 self-start overflow-hidden rounded-16 border-1 border-color-2/60 border-solid bg-container/80 p-20 shadow-[0_20px_50px_rgb(15_23_42_/_10%)] backdrop-blur-xl max-[1180px]:(relative top-auto)"
            aria-label="当前选择"
          >
            <div class="flex items-center justify-between gap-12">
              <div>
                <span class="text-xs text-secondary">当前方案</span>
                <Transition name="fade-slide" mode="out-in">
                  <h2
                    :key="activePlan.key"
                    class="mt-4 text-xl text-main font-900 leading-28"
                  >
                    {{ activePlan.name }}
                  </h2>
                </Transition>
              </div>
              <Transition name="fade-pop" mode="out-in">
                <span
                  :key="activePlan.key"
                  class="size-48 inline-flex items-center justify-center rounded-12 bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-[0_8px_24px_rgb(var(--w-color-primary)_/_20%)]"
                >
                  <Icon :name="activePlan.icon" :size="22" />
                </span>
              </Transition>
            </div>

            <div
              class="relative mt-16 overflow-hidden rounded-12 border-1 border-primary/20 border-solid bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-16"
            >
              <div
                class="pointer-events-none absolute -top-20 -right-20 size-40 rounded-full bg-primary/20 blur-3xl"
                aria-hidden="true"
              />
              <span class="relative text-xs text-secondary">预估费用</span>
              <Transition name="fade-slide" mode="out-in">
                <strong
                  :key="`${activePlan.key}-${billingCycle}`"
                  class="relative mt-6 block text-[38px] text-main font-900 tabular-nums leading-none tracking-tight"
                >
                  {{ activePlanEstimate }}
                </strong>
              </Transition>
              <Transition name="fade-slide" mode="out-in">
                <p
                  :key="activePlan.key"
                  class="relative mt-10 text-[13px] text-secondary leading-20"
                >
                  {{ activePlan.tagline }}
                </p>
              </Transition>
            </div>

            <div
              class="my-16 grid overflow-hidden rounded-10 border-1 border-color-1 border-solid"
            >
              <div
                class="flex items-center justify-between gap-12 border-b-1 border-color-1 border-b-solid px-14 py-11"
              >
                <span class="text-[13px] text-secondary">适用团队</span>
                <strong class="text-right text-[13px] text-main">
                  {{ activePlan.audience }}
                </strong>
              </div>
              <div
                class="flex items-center justify-between gap-12 border-b-1 border-color-1 border-b-solid px-14 py-11"
              >
                <span class="text-[13px] text-secondary">计费周期</span>
                <strong class="text-right text-[13px] text-main">
                  {{ billingLabel }}
                </strong>
              </div>
              <div class="flex items-center justify-between gap-12 px-14 py-11">
                <span class="text-[13px] text-secondary">上线支持</span>
                <strong class="text-right text-[13px] text-main">
                  {{
                    activePlan.key === 'enterprise' ? '专属陪跑' : '标准支持'
                  }}
                </strong>
              </div>
            </div>

            <a-button type="primary" size="large" block>
              <template #icon>
                <Icon name="i-lucide:arrow-right" />
              </template>
              {{ activePlan.cta }}
            </a-button>

            <div class="mt-14 flex items-start gap-10">
              <Icon
                name="i-lucide:info"
                :size="16"
                class="mt-1 shrink-0 text-secondary"
              />
              <p class="text-xs text-secondary leading-18">
                根据团队阶段先锁定核心席位，再按自动化额度和数据保留周期扩展。
              </p>
            </div>
          </aside>
        </section>

        <PricingFaq
          :faqs="pricingFaqs"
          :open-index="openFaqIndex"
          @toggle="toggleFaq"
        />
      </main>
    </Scrollbar>
  </WView>
</template>
