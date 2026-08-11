<script setup lang="ts">
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
    <Scrollbar
      class="pricing-shell h-full bg-page dark:bg-container"
      content-class="min-h-full"
    >
      <main
        class="pricing-page relative w-full min-h-full mx-auto overflow-hidden p-18 text-main isolate max-[640px]:p-8 dark:text-main"
      >
        <PricingHero
          :billing-cycle="billingCycle"
          :billing-options="billingOptions"
          :saved-amount="savedAmount"
          @change-cycle="updateBillingCycle"
        />

        <section class="pricing-plans" aria-label="订阅方案">
          <PricingPlanCard
            v-for="(plan, index) in pricingPlans"
            :key="plan.key"
            :plan="plan"
            :billing-cycle="billingCycle"
            :active="selectedPlanKey === plan.key"
            :index="index"
            @select="selectPlan"
          />
        </section>

        <section class="pricing-workbench">
          <div class="pricing-workbench__main">
            <PricingCompare
              :features="compareFeatures"
              :active-plan-key="selectedPlanKey"
            />

            <section
              class="pricing-addons dark:border-color-2 dark:bg-container"
              aria-label="扩展能力"
            >
              <div class="pricing-section-head">
                <div>
                  <span>Capacity Dock</span>
                  <h2>按需扩展</h2>
                </div>
                <Icon name="i-lucide:package-plus" :size="22" />
              </div>

              <div class="pricing-addons__list">
                <article
                  v-for="addon in pricingAddons"
                  :key="addon.name"
                  class="pricing-addon dark:border-color-2 dark:bg-fill"
                >
                  <span
                    class="pricing-addon__icon border-1 border-color-1 border-solid bg-fill text-primary dark:border-color-2 dark:bg-fill"
                  >
                    <Icon :name="addon.icon" :size="19" />
                  </span>
                  <span class="pricing-addon__body">
                    <strong>{{ addon.name }}</strong>
                    <small>{{ addon.description }}</small>
                  </span>
                  <em>{{ addon.value }}</em>
                </article>
              </div>
            </section>
          </div>

          <aside
            class="pricing-summary dark:border-color-2 dark:bg-container"
            aria-label="当前选择"
          >
            <div class="pricing-summary__halo" aria-hidden="true" />
            <div class="pricing-summary__top">
              <div>
                <span>当前方案</span>
                <Transition name="pricing-summary-swap" mode="out-in">
                  <h2 :key="activePlan.key">{{ activePlan.name }}</h2>
                </Transition>
              </div>
              <Transition name="pricing-icon-pop" mode="out-in">
                <span
                  :key="activePlan.key"
                  class="pricing-summary__icon border-1 border-color-1 border-solid bg-fill text-primary dark:border-color-2 dark:bg-fill"
                >
                  <Icon :name="activePlan.icon" :size="24" />
                </span>
              </Transition>
            </div>

            <div class="pricing-summary__price">
              <span>预估费用</span>
              <Transition name="pricing-price-swap" mode="out-in">
                <strong :key="`${activePlan.key}-${billingCycle}`">
                  {{ activePlanEstimate }}
                </strong>
              </Transition>
              <Transition name="pricing-summary-swap" mode="out-in">
                <p :key="activePlan.key">{{ activePlan.tagline }}</p>
              </Transition>
            </div>

            <div class="pricing-summary__facts">
              <div>
                <span>适用团队</span>
                <strong>{{ activePlan.audience }}</strong>
              </div>
              <div>
                <span>计费周期</span>
                <strong>{{ billingLabel }}</strong>
              </div>
              <div>
                <span>上线支持</span>
                <strong>
                  {{
                    activePlan.key === 'enterprise' ? '专属陪跑' : '标准支持'
                  }}
                </strong>
              </div>
            </div>

            <a-button type="primary" block>
              <template #icon>
                <Icon name="i-lucide:arrow-up-right" />
              </template>
              {{ activePlan.cta }}
            </a-button>

            <div class="pricing-summary__signal">
              <span />
              <p>
                根据当前团队阶段，建议先锁定核心席位，再按自动化额度和数据保留周期扩展。
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

<style scoped>
.pricing-shell {
  background:
    radial-gradient(
      circle at 16% 0%,
      rgb(var(--w-color-primary) / 13%),
      transparent 31%
    ),
    radial-gradient(
      circle at 86% 8%,
      rgb(var(--w-color-success) / 10%),
      transparent 30%
    ),
    linear-gradient(180deg, rgb(var(--w-bg-page)), rgb(var(--w-bg-container)));
}

:global(.dark) .pricing-shell,
:global(.dark) .pricing-page {
  --w-bg-page: 10, 12, 18;
  --w-bg-container: 17, 21, 29;
  --w-fill-secondary: 24, 29, 39;
  --w-fill-tertiary: 31, 38, 50;
  --w-fill-quaternary: 15, 23, 42;
  --w-border-color-1: 42, 52, 65;
  --w-border-color-2: 51, 65, 85;
  --w-text-main: 241, 245, 249;
  --w-text-regular: 203, 213, 225;
  --w-text-secondary: 148, 163, 184;
  --w-text-placeholder: 100, 116, 139;
}

.pricing-page::before {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  content: '';
  background:
    linear-gradient(90deg, rgb(var(--w-border-color-1)) 1px, transparent 1px),
    linear-gradient(0deg, rgb(var(--w-border-color-1)) 1px, transparent 1px);
  background-size: 36px 36px;
  opacity: 0.52;
  mask-image: linear-gradient(180deg, rgb(0 0 0 / 70%), transparent 68%);
}

.pricing-page::after {
  position: absolute;
  inset: 28px 14% auto;
  z-index: -1;
  height: 180px;
  pointer-events: none;
  content: '';
  background: linear-gradient(
    90deg,
    transparent,
    rgb(var(--w-color-primary) / 18%),
    transparent
  );
  opacity: 0.58;
  filter: blur(22px);
  animation: pricing-orbit 8s ease-in-out infinite;
}

:deep(.pricing-hero) {
  position: relative;
  min-height: 292px;
  overflow: hidden;
  color: rgb(var(--w-text-main));
  background:
    linear-gradient(
      135deg,
      rgb(var(--w-bg-container)),
      rgb(var(--w-fill-tertiary))
    ),
    rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
  box-shadow: 0 22px 60px rgb(var(--w-color-primary) / 10%);
  transform: translateZ(0);
  transition:
    border-color 0.28s ease,
    box-shadow 0.28s ease,
    transform 0.28s cubic-bezier(0.2, 0.72, 0.18, 1);
  animation: pricing-rise 0.62s cubic-bezier(0.2, 0.72, 0.18, 1) both;
}

:deep(.pricing-hero:hover) {
  border-color: rgb(var(--w-color-primary) / 38%);
  box-shadow: 0 28px 72px rgb(var(--w-color-primary) / 14%);
  transform: translateY(-2px);
}

:deep(.pricing-hero::after) {
  position: absolute;
  inset: -40% auto -40% -30%;
  width: 32%;
  pointer-events: none;
  content: '';
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 20%),
    transparent
  );
  opacity: 0;
  transform: rotate(16deg) translateX(-30%);
  transition:
    opacity 0.28s ease,
    transform 0.72s cubic-bezier(0.2, 0.72, 0.18, 1);
}

:deep(.pricing-hero:hover::after) {
  opacity: 1;
  transform: rotate(16deg) translateX(420%);
}

:deep(.pricing-hero__grid) {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgb(var(--w-border-color-1)) 1px, transparent 1px),
    linear-gradient(0deg, rgb(var(--w-border-color-1)) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(
    circle at 26% 20%,
    rgb(0 0 0 / 82%),
    transparent 58%
  );
}

:deep(.pricing-hero__scan) {
  position: absolute;
  top: -38%;
  right: -12%;
  left: auto;
  width: 34%;
  height: 176%;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(var(--w-color-primary) / 17%),
    transparent
  );
  transform: rotate(14deg);
  animation: pricing-scan 5.8s cubic-bezier(0.22, 0.61, 0.36, 1) infinite;
}

:deep(.pricing-hero__content) {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 380px);
  gap: 24px;
  align-items: end;
  min-height: 292px;
  padding: 30px;
}

:deep(.pricing-hero__eyebrow),
.pricing-section-head > div > span,
:deep(.pricing-section-head > div > span) {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  font-weight: 850;
  line-height: 18px;
  color: rgb(var(--w-color-primary));
  text-transform: uppercase;
  letter-spacing: 0;
}

:deep(.pricing-hero__title) {
  max-width: 760px;
  margin: 14px 0 0;
  font-size: clamp(36px, 5vw, 58px);
  font-weight: 900;
  line-height: 1.06;
  color: rgb(var(--w-text-main));
  text-wrap: balance;
}

:deep(.pricing-hero__desc) {
  max-width: 680px;
  margin: 18px 0 0;
  font-size: 15px;
  line-height: 26px;
  color: rgb(var(--w-text-secondary));
}

:deep(.pricing-hero__proof) {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

:deep(.pricing-hero__proof span) {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  padding: 8px 11px;
  font-size: 12px;
  font-weight: 720;
  color: rgb(var(--w-text-regular));
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 999px;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 14%);
  backdrop-filter: blur(14px);
}

:deep(.pricing-hero__panel) {
  position: relative;
  overflow: hidden;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 16%),
    0 18px 42px rgb(var(--w-color-primary) / 11%);
  backdrop-filter: blur(18px);
}

:deep(.pricing-hero__panel-head) {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 0;
  font-size: 12px;
  color: rgb(var(--w-text-secondary));
}

:deep(.pricing-hero__panel-head strong) {
  font-weight: 850;
  color: rgb(var(--w-color-success));
}

:deep(.pricing-hero__switch) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 15px;
}

:deep(.pricing-hero__switch-item) {
  position: relative;
  min-height: 78px;
  padding: 13px;
  overflow: hidden;
  color: rgb(var(--w-text-secondary));
  text-align: left;
  cursor: pointer;
  outline: none;
  background: rgb(var(--w-fill-tertiary));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

:deep(.pricing-hero__switch-item::after) {
  position: absolute;
  inset: auto 12px 10px;
  height: 2px;
  content: '';
  background: rgb(var(--w-color-primary));
  border-radius: 999px;
  opacity: 0;
  transform: scaleX(0.2);
  transform-origin: left;
  transition:
    opacity 0.22s ease,
    transform 0.28s cubic-bezier(0.2, 0.72, 0.18, 1);
}

:deep(.pricing-hero__switch-item:hover),
:deep(.pricing-hero__switch-item--active) {
  color: rgb(var(--w-text-main));
  background: rgb(var(--w-color-primary) / 9%);
  border-color: rgb(var(--w-color-primary) / 42%);
  box-shadow: 0 10px 26px rgb(var(--w-color-primary) / 10%);
  transform: translateY(-2px);
}

:deep(.pricing-hero__switch-item:hover::after),
:deep(.pricing-hero__switch-item--active::after) {
  opacity: 1;
  transform: scaleX(1);
}

:deep(.pricing-hero__switch-item span) {
  display: block;
  font-size: 18px;
  font-weight: 900;
}

:deep(.pricing-hero__switch-item small) {
  display: block;
  margin-top: 7px;
  font-size: 12px;
  color: inherit;
  opacity: 0.72;
}

:deep(.pricing-hero__telemetry) {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 0 15px 15px;
}

:deep(.pricing-hero__telemetry span) {
  height: 34px;
  background: rgb(var(--w-color-primary));
  border-radius: 4px;
  transform-origin: bottom;
  animation: pricing-equalizer 1.8s ease-in-out infinite;
}

:deep(.pricing-hero__telemetry span:nth-child(2)) {
  animation-delay: 0.18s;
}

:deep(.pricing-hero__telemetry span:nth-child(3)) {
  animation-delay: 0.34s;
}

:deep(.pricing-hero__telemetry span:nth-child(4)) {
  animation-delay: 0.52s;
}

:deep(.pricing-hero__hint) {
  padding: 0 15px 15px;
  margin: 0;
  font-size: 12px;
  line-height: 20px;
  color: rgb(var(--w-text-secondary));
}

.pricing-plans {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
}

:deep(.pricing-plan) {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 462px;
  padding: 16px;
  overflow: hidden;
  cursor: pointer;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  box-shadow: 0 14px 36px rgb(15 23 42 / 6%);
  opacity: 0;
  transform: translateY(16px);
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease,
    transform 0.28s cubic-bezier(0.2, 0.72, 0.18, 1);
  animation: pricing-rise 0.62s cubic-bezier(0.2, 0.72, 0.18, 1) forwards;
  will-change: transform;
}

:deep(.pricing-plan::before) {
  position: absolute;
  top: -76px;
  right: -70px;
  width: 172px;
  height: 172px;
  pointer-events: none;
  content: '';
  background: radial-gradient(
    circle,
    rgb(var(--w-color-primary) / 24%) 0%,
    rgb(var(--w-color-primary) / 11%) 34%,
    transparent 70%
  );
  border-radius: 999px;
  opacity: 0.55;
  filter: blur(2px);
  transform: scale(0.86);
  transition:
    opacity 0.28s ease,
    transform 0.42s cubic-bezier(0.2, 0.72, 0.18, 1);
}

:deep(.pricing-plan::after) {
  position: absolute;
  right: 18px;
  bottom: -34px;
  left: 18px;
  height: 58px;
  pointer-events: none;
  content: '';
  background: radial-gradient(
    ellipse at center,
    rgb(var(--w-color-primary) / 28%),
    transparent 68%
  );
  opacity: 0;
  filter: blur(12px);
  transform: translateY(10px) scaleX(0.76);
  transition:
    opacity 0.28s ease,
    transform 0.34s cubic-bezier(0.2, 0.72, 0.18, 1);
}

:deep(.pricing-plan:hover),
:deep(.pricing-plan--active) {
  border-color: rgb(var(--w-color-primary) / 52%);
  box-shadow: 0 24px 58px rgb(var(--w-color-primary) / 13%);
  transform: translateY(-4px);
}

:deep(.pricing-plan:hover::before),
:deep(.pricing-plan--active::before) {
  opacity: 0.95;
  transform: scale(1.08);
}

:deep(.pricing-plan:hover::after),
:deep(.pricing-plan--active::after) {
  opacity: 0.9;
  transform: translateY(0) scaleX(1);
}

:deep(.pricing-plan--electric) {
  background:
    radial-gradient(
      circle at 88% 12%,
      rgb(var(--w-color-primary) / 18%),
      transparent 28%
    ),
    rgb(var(--w-bg-container));
}

:deep(.pricing-plan--carbon) {
  color: rgb(var(--w-text-main));
  background:
    linear-gradient(
      145deg,
      rgb(var(--w-fill-tertiary)),
      rgb(var(--w-bg-container))
    ),
    rgb(var(--w-bg-container));
}

:deep(.pricing-plan__top) {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

:deep(.pricing-plan__icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-fill-tertiary));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  box-shadow: none;
  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    color 0.22s ease,
    transform 0.28s cubic-bezier(0.2, 0.72, 0.18, 1);
}

:deep(.pricing-plan:hover .pricing-plan__icon),
:deep(.pricing-plan--active .pricing-plan__icon) {
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-color-primary) / 10%);
  border-color: rgb(var(--w-color-primary) / 32%);
  transform: translateY(-2px) rotate(-4deg) scale(1.04);
}

:deep(.pricing-plan__badge) {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 800;
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-color-primary) / 10%);
  border: 1px solid rgb(var(--w-color-primary) / 24%);
  border-radius: 4px;
  animation: pricing-badge-pulse 2.4s ease-in-out infinite;
}

:deep(.pricing-plan__copy) {
  position: relative;
  z-index: 1;
  margin-top: 18px;
}

:deep(.pricing-plan__eyebrow) {
  font-size: 12px;
  font-weight: 760;
  color: rgb(var(--w-text-secondary));
}

:deep(.pricing-plan__copy h2) {
  margin: 6px 0 0;
  font-size: 28px;
  font-weight: 900;
  line-height: 34px;
  color: rgb(var(--w-text-main));
}

:deep(.pricing-plan__copy strong) {
  display: block;
  margin-top: 8px;
  font-size: 15px;
  font-weight: 800;
  line-height: 22px;
  color: rgb(var(--w-text-main));
}

:deep(.pricing-plan__copy p) {
  min-height: 44px;
  margin: 9px 0 0;
  font-size: 13px;
  line-height: 22px;
  color: rgb(var(--w-text-secondary));
}

:deep(.pricing-plan__price) {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin-top: 18px;
  overflow: hidden;
}

:deep(.pricing-plan__price strong) {
  font-size: 38px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: rgb(var(--w-text-main));
}

:deep(.pricing-plan__price del) {
  font-size: 13px;
  color: rgb(var(--w-text-placeholder));
}

:deep(.pricing-plan__price span) {
  min-width: 0;
  font-size: 12px;
  color: rgb(var(--w-text-secondary));
}

:deep(.pricing-plan__metrics) {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 18px;
  background: rgb(var(--w-fill-tertiary));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

:deep(.pricing-plan__metrics div) {
  min-width: 0;
  padding: 10px;
  border-right: 1px solid rgb(var(--w-border-color-1));
}

:deep(.pricing-plan__metrics div:last-child) {
  border-right: 0;
}

:deep(.pricing-plan__metrics strong),
:deep(.pricing-plan__metrics span) {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.pricing-plan__metrics strong) {
  font-size: 15px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  color: rgb(var(--w-text-main));
}

:deep(.pricing-plan__metrics span) {
  margin-top: 3px;
  font-size: 12px;
  color: rgb(var(--w-text-secondary));
}

:deep(.pricing-plan__cta) {
  position: relative;
  z-index: 1;
  margin-top: 16px;
}

:deep(.pricing-plan__features) {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 9px;
  padding: 0;
  margin: 16px 0 0;
  list-style: none;
}

:deep(.pricing-plan__features li) {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-size: 13px;
  line-height: 20px;
  color: rgb(var(--w-text-regular));
  transition:
    color 0.2s ease,
    transform 0.22s ease;
}

:deep(.pricing-plan:hover .pricing-plan__features li) {
  transform: translateX(2px);
}

:deep(.pricing-plan:hover .pricing-plan__features li:nth-child(2)) {
  transition-delay: 35ms;
}

:deep(.pricing-plan:hover .pricing-plan__features li:nth-child(3)) {
  transition-delay: 70ms;
}

:deep(.pricing-plan:hover .pricing-plan__features li:nth-child(4)) {
  transition-delay: 105ms;
}

:deep(.pricing-plan:hover .pricing-plan__features li:nth-child(5)) {
  transition-delay: 140ms;
}

:deep(.pricing-plan__features svg) {
  flex: 0 0 auto;
  margin-top: 2px;
  color: rgb(var(--w-color-success));
}

:deep(.pricing-price-swap-enter-active),
:deep(.pricing-price-swap-leave-active),
:deep(.pricing-price-fade-enter-active),
:deep(.pricing-price-fade-leave-active),
:deep(.pricing-summary-swap-enter-active),
:deep(.pricing-summary-swap-leave-active),
:deep(.pricing-icon-pop-enter-active),
:deep(.pricing-icon-pop-leave-active) {
  transition:
    opacity 0.24s ease,
    transform 0.28s cubic-bezier(0.2, 0.72, 0.18, 1);
}

:deep(.pricing-price-swap-enter-from),
:deep(.pricing-summary-swap-enter-from) {
  opacity: 0;
  transform: translateY(10px);
}

:deep(.pricing-price-swap-leave-to),
:deep(.pricing-summary-swap-leave-to) {
  opacity: 0;
  transform: translateY(-8px);
}

:deep(.pricing-price-fade-enter-from),
:deep(.pricing-price-fade-leave-to) {
  opacity: 0;
  transform: translateX(-6px);
}

:deep(.pricing-icon-pop-enter-from),
:deep(.pricing-icon-pop-leave-to) {
  opacity: 0;
  transform: scale(0.78) rotate(-8deg);
}

.pricing-workbench {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 12px;
  margin-top: 12px;
}

.pricing-workbench__main {
  display: grid;
  gap: 12px;
  min-width: 0;
}

:deep(.pricing-compare),
.pricing-addons,
.pricing-summary,
:deep(.pricing-faq) {
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  box-shadow: 0 14px 36px rgb(15 23 42 / 6%);
  backdrop-filter: blur(16px);
}

:deep(.pricing-compare),
.pricing-addons {
  animation: pricing-rise 0.62s 0.12s cubic-bezier(0.2, 0.72, 0.18, 1) both;
}

.pricing-section-head,
:deep(.pricing-section-head) {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgb(var(--w-border-color-1));
}

.pricing-section-head h2,
:deep(.pricing-section-head h2) {
  margin: 5px 0 0;
  font-size: 19px;
  font-weight: 850;
  line-height: 24px;
  color: rgb(var(--w-text-main));
}

:deep(.pricing-compare__scroll) {
  overflow-x: auto;
}

:deep(.pricing-compare__table) {
  min-width: 760px;
}

:deep(.pricing-compare__row) {
  display: grid;
  grid-template-columns: minmax(210px, 1.35fr) repeat(3, minmax(150px, 1fr));
  border-top: 1px solid rgb(var(--w-border-color-1));
  transition: background 0.2s ease;
}

:deep(.pricing-compare__row:first-child) {
  border-top: 0;
}

:deep(.pricing-compare__row > div) {
  min-width: 0;
  padding: 12px 16px;
  font-size: 14px;
  color: rgb(var(--w-text-regular));
  text-align: center;
  border-left: 1px solid rgb(var(--w-border-color-1));
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.22s ease;
}

:deep(.pricing-compare__row > div:first-child) {
  text-align: left;
  border-left: 0;
}

:deep(.pricing-compare__row--head > div) {
  font-weight: 850;
  color: rgb(var(--w-text-main));
  background: rgb(var(--w-fill-tertiary));
}

:deep(.pricing-compare__row small) {
  display: block;
  font-size: 12px;
  color: rgb(var(--w-text-secondary));
}

:deep(.pricing-compare__row strong) {
  display: block;
  margin-top: 3px;
  font-weight: 780;
  color: rgb(var(--w-text-main));
}

:deep(.pricing-compare__row .is-active) {
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-color-primary) / 8%);
}

:deep(.pricing-compare__row:not(.pricing-compare__row--head):hover) {
  background: rgb(var(--w-color-primary) / 4%);
}

:deep(.pricing-compare__row:not(.pricing-compare__row--head):hover > div) {
  transform: translateY(-1px);
}

:deep(.pricing-compare__check) {
  color: rgb(var(--w-color-success));
}

:deep(.pricing-compare__empty) {
  color: rgb(var(--w-text-placeholder));
}

.pricing-addons__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 12px;
}

.pricing-addon {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 11px;
  align-items: start;
  min-width: 0;
  padding: 13px;
  background: rgb(var(--w-fill-tertiary));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 10%);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
  animation: pricing-rise 0.54s cubic-bezier(0.2, 0.72, 0.18, 1) both;
}

.pricing-addon:nth-child(2) {
  animation-delay: 90ms;
}

.pricing-addon:nth-child(3) {
  animation-delay: 180ms;
}

.pricing-addon:hover {
  border-color: rgb(var(--w-color-primary) / 38%);
  box-shadow: 0 12px 28px rgb(var(--w-color-primary) / 9%);
  transform: translateY(-2px);
}

.pricing-addon__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-fill-tertiary));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    transform 0.24s cubic-bezier(0.2, 0.72, 0.18, 1);
}

.pricing-addon:hover .pricing-addon__icon {
  background: rgb(var(--w-color-primary) / 10%);
  border-color: rgb(var(--w-color-primary) / 32%);
  transform: rotate(-4deg) scale(1.04);
}

.pricing-addon__body {
  min-width: 0;
}

.pricing-addon__body strong,
.pricing-addon__body small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pricing-addon__body strong {
  font-size: 14px;
  color: rgb(var(--w-text-main));
}

.pricing-addon__body small {
  margin-top: 4px;
  font-size: 12px;
  color: rgb(var(--w-text-secondary));
}

.pricing-addon em {
  grid-column: 2;
  font-size: 13px;
  font-style: normal;
  font-weight: 850;
  color: rgb(var(--w-text-main));
}

.pricing-summary {
  position: sticky;
  top: 12px;
  align-self: start;
  padding: 16px;
  overflow: hidden;
  transform: translateZ(0);
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.28s cubic-bezier(0.2, 0.72, 0.18, 1);
  animation: pricing-rise 0.62s 0.18s cubic-bezier(0.2, 0.72, 0.18, 1) both;
}

.pricing-summary:hover {
  border-color: rgb(var(--w-color-primary) / 38%);
  box-shadow: 0 24px 58px rgb(var(--w-color-primary) / 12%);
  transform: translateY(-3px);
}

.pricing-summary__halo {
  position: absolute;
  top: -90px;
  right: -90px;
  width: 190px;
  height: 190px;
  pointer-events: none;
  background: radial-gradient(
    circle,
    rgb(var(--w-color-primary) / 20%),
    transparent 70%
  );
  animation: pricing-pulse 3.8s ease-in-out infinite;
}

.pricing-summary__top {
  position: relative;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.pricing-summary__top > div > span {
  font-size: 12px;
  font-weight: 760;
  color: rgb(var(--w-text-secondary));
}

.pricing-summary__top h2 {
  margin: 5px 0 0;
  font-size: 28px;
  font-weight: 900;
  line-height: 34px;
  color: rgb(var(--w-text-main));
}

.pricing-summary__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-fill-tertiary));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  box-shadow: none;
}

.pricing-summary__price {
  position: relative;
  padding: 14px;
  margin-top: 16px;
  overflow: hidden;
  background: rgb(var(--w-color-primary) / 8%);
  border: 1px solid rgb(var(--w-color-primary) / 20%);
  border-radius: 8px;
}

.pricing-summary__price::after {
  position: absolute;
  inset: 0 auto 0 -46%;
  width: 42%;
  pointer-events: none;
  content: '';
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 20%),
    transparent
  );
  opacity: 0;
  transform: skewX(-16deg);
}

.pricing-summary:hover .pricing-summary__price::after {
  animation: pricing-shine 0.84s cubic-bezier(0.2, 0.72, 0.18, 1);
}

.pricing-summary__price span {
  font-size: 12px;
  font-weight: 780;
  color: rgb(var(--w-color-primary));
}

.pricing-summary__price strong {
  display: block;
  margin-top: 5px;
  font-size: 34px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: rgb(var(--w-text-main));
}

.pricing-summary__price p {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 21px;
  color: rgb(var(--w-text-secondary));
}

.pricing-summary__facts {
  display: grid;
  gap: 0;
  margin: 16px 0;
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.pricing-summary__facts div {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  padding: 12px;
  border-bottom: 1px solid rgb(var(--w-border-color-1));
}

.pricing-summary__facts div:last-child {
  border-bottom: 0;
}

.pricing-summary__facts span {
  flex: 0 0 auto;
  font-size: 13px;
  color: rgb(var(--w-text-secondary));
}

.pricing-summary__facts strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  color: rgb(var(--w-text-main));
  text-align: right;
  white-space: nowrap;
}

.pricing-summary__signal {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  margin-top: 15px;
}

.pricing-summary__signal span {
  width: 22px;
  height: 22px;
  background: radial-gradient(
    circle,
    rgb(var(--w-color-primary)) 0 32%,
    transparent 34%
  );
  border: 1px solid rgb(var(--w-color-primary) / 46%);
  border-radius: 999px;
  animation: pricing-ping 1.8s ease-out infinite;
}

.pricing-summary__signal p {
  margin: 0;
  font-size: 12px;
  line-height: 20px;
  color: rgb(var(--w-text-secondary));
}

:deep(.pricing-faq) {
  margin-top: 12px;
  animation: pricing-rise 0.62s 0.28s cubic-bezier(0.2, 0.72, 0.18, 1) both;
}

:deep(.pricing-faq__list) {
  display: grid;
}

:deep(.pricing-faq__item) {
  width: 100%;
  padding: 0;
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgb(var(--w-border-color-1));
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.22s ease;
}

:deep(.pricing-faq__item:hover) {
  background: rgb(var(--w-color-primary) / 5%);
  transform: translateX(2px);
}

:deep(.pricing-faq__item:last-child) {
  border-bottom: 0;
}

:deep(.pricing-faq__question) {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 15px 16px;
  font-size: 14px;
  font-weight: 760;
  color: rgb(var(--w-text-main));
}

:deep(.pricing-faq__question svg) {
  transition: transform 0.24s ease;
}

:deep(.pricing-faq__item--open .pricing-faq__question svg) {
  transform: rotate(180deg);
}

:deep(.pricing-faq__answer) {
  display: block;
  padding: 0 16px 15px;
  font-size: 14px;
  line-height: 23px;
  color: rgb(var(--w-text-secondary));
  transform: translateY(-2px);
}

:deep(.pricing-faq__item:focus-visible),
:deep(.pricing-plan:focus-visible),
:deep(.pricing-hero__switch-item:focus-visible) {
  outline: 2px solid rgb(var(--w-color-primary) / 70%);
  outline-offset: 2px;
}

@keyframes pricing-rise {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pricing-scan {
  0% {
    transform: translateX(-55%) rotate(14deg);
  }

  60%,
  100% {
    transform: translateX(250%) rotate(14deg);
  }
}

@keyframes pricing-equalizer {
  0%,
  100% {
    opacity: 0.44;
    transform: scaleY(0.34);
  }

  45% {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes pricing-orbit {
  0%,
  100% {
    transform: translateX(-18%);
  }

  50% {
    transform: translateX(18%);
  }
}

@keyframes pricing-pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes pricing-ping {
  0% {
    box-shadow: 0 0 0 0 rgb(var(--w-color-primary) / 34%);
  }

  100% {
    box-shadow: 0 0 0 12px transparent;
  }
}

@keyframes pricing-badge-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgb(var(--w-color-primary) / 0%);
  }

  50% {
    box-shadow: 0 0 0 4px rgb(var(--w-color-primary) / 10%);
  }
}

@keyframes pricing-shine {
  0% {
    opacity: 0;
    transform: translateX(0) skewX(-16deg);
  }

  24% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(350%) skewX(-16deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pricing-page::after,
  .pricing-addon,
  .pricing-addons,
  .pricing-summary,
  .pricing-summary__halo,
  .pricing-summary__signal span,
  :deep(.pricing-hero__scan),
  :deep(.pricing-hero__telemetry span),
  :deep(.pricing-compare),
  :deep(.pricing-plan),
  :deep(.pricing-plan__badge),
  :deep(.pricing-faq) {
    animation: none;
  }

  .pricing-addon,
  .pricing-summary,
  .pricing-summary__price::after,
  :deep(.pricing-compare__row),
  :deep(.pricing-compare__row > div),
  :deep(.pricing-hero),
  :deep(.pricing-hero::after),
  :deep(.pricing-hero__switch-item),
  :deep(.pricing-hero__switch-item::after),
  :deep(.pricing-plan),
  :deep(.pricing-plan::before),
  :deep(.pricing-plan__features li),
  :deep(.pricing-plan__icon),
  :deep(.pricing-faq__item),
  :deep(.pricing-faq__question svg) {
    transition: none;
  }
}

@media (width <= 1180px) {
  .pricing-workbench {
    grid-template-columns: 1fr;
  }

  .pricing-summary {
    position: relative;
    top: auto;
  }
}

@media (width <= 980px) {
  :deep(.pricing-hero__content) {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 22px;
  }

  .pricing-plans,
  .pricing-addons__list {
    grid-template-columns: 1fr;
  }
}

@media (width <= 640px) {
  :deep(.pricing-hero) {
    min-height: 0;
  }

  :deep(.pricing-hero__content) {
    gap: 14px;
    padding: 14px;
  }

  :deep(.pricing-hero__title) {
    font-size: 26px;
    line-height: 1.18;
  }

  :deep(.pricing-hero__desc) {
    margin-top: 12px;
    font-size: 14px;
    line-height: 23px;
  }

  :deep(.pricing-hero__proof span) {
    padding: 7px 9px;
    border-radius: 6px;
  }

  :deep(.pricing-hero__panel-head) {
    display: grid;
    gap: 4px;
  }

  :deep(.pricing-hero__switch-item) {
    min-height: 56px;
    padding: 10px;
  }

  :deep(.pricing-hero__switch-item span) {
    font-size: 16px;
  }

  :deep(.pricing-hero__telemetry) {
    display: none;
  }

  :deep(.pricing-hero__proof) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  :deep(.pricing-hero__switch) {
    grid-template-columns: 1fr;
  }

  :deep(.pricing-plan) {
    min-height: 0;
    padding: 14px;
  }

  :deep(.pricing-plan__copy h2) {
    font-size: 24px;
    line-height: 30px;
  }

  :deep(.pricing-plan__copy p) {
    min-height: 0;
  }

  :deep(.pricing-plan__price strong) {
    font-size: 30px;
  }

  :deep(.pricing-plan__metrics) {
    grid-template-columns: 1fr;
  }

  :deep(.pricing-plan__metrics div) {
    border-right: 0;
    border-bottom: 1px solid rgb(var(--w-border-color-1));
  }

  :deep(.pricing-plan__metrics div:last-child) {
    border-bottom: 0;
  }

  .pricing-addon {
    grid-template-columns: 1fr;
  }

  .pricing-addon em {
    grid-column: 1;
  }

  .pricing-summary__top,
  .pricing-summary__facts div {
    align-items: flex-start;
  }

  .pricing-summary__top {
    display: grid;
  }

  .pricing-summary__facts div {
    display: grid;
  }

  .pricing-summary__facts strong {
    text-align: left;
    white-space: normal;
  }
}
</style>
