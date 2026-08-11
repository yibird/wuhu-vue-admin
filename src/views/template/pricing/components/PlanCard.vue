<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { BillingCycle, PricingPlan } from '../types'

interface Props {
  plan: PricingPlan
  billingCycle: BillingCycle
  active: boolean
  index: number
}

interface Emits {
  select: [plan: PricingPlan]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const priceLabel = computed(() => {
  const price =
    props.billingCycle === 'yearly'
      ? props.plan.yearlyPrice
      : props.plan.monthlyPrice

  if (price === null) return '定制'
  if (price === 0) return '¥0'
  return `¥${price}`
})

const originalPriceLabel = computed(() => {
  if (
    props.billingCycle !== 'yearly' ||
    !props.plan.monthlyPrice ||
    !props.plan.yearlyPrice
  ) {
    return ''
  }

  return `¥${props.plan.monthlyPrice}`
})

const priceKey = computed(() => {
  return `${props.plan.key}-${props.billingCycle}-${priceLabel.value}`
})

const cardStyle = computed<CSSProperties>(() => ({
  animationDelay: `${props.index * 90}ms`,
}))

function handleSelect() {
  emit('select', props.plan)
}
</script>

<template>
  <article
    class="pricing-plan dark:border-color-2 dark:bg-container"
    :class="[
      `pricing-plan--${props.plan.accent}`,
      { 'pricing-plan--active': props.active },
    ]"
    :style="cardStyle"
    :aria-pressed="props.active"
    :aria-label="`选择 ${props.plan.name} 方案`"
    role="button"
    tabindex="0"
    @click="handleSelect"
    @keydown.enter="handleSelect"
    @keydown.space.prevent="handleSelect"
  >
    <div class="pricing-plan__top">
      <span
        class="pricing-plan__icon border-1 border-color-1 border-solid bg-fill text-primary dark:border-color-2 dark:bg-fill"
      >
        <Icon :name="props.plan.icon" :size="22" />
      </span>
      <span v-if="props.plan.badge" class="pricing-plan__badge">
        {{ props.plan.badge }}
      </span>
    </div>

    <div class="pricing-plan__copy">
      <span class="pricing-plan__eyebrow">{{ props.plan.eyebrow }}</span>
      <h2>{{ props.plan.name }}</h2>
      <strong>{{ props.plan.tagline }}</strong>
      <p>{{ props.plan.description }}</p>
    </div>

    <div class="pricing-plan__price">
      <Transition name="pricing-price-swap" mode="out-in">
        <strong :key="priceKey">{{ priceLabel }}</strong>
      </Transition>
      <Transition name="pricing-price-fade" mode="out-in">
        <del v-if="originalPriceLabel" :key="originalPriceLabel">
          {{ originalPriceLabel }}
        </del>
      </Transition>
      <span>{{ props.plan.unit }}</span>
    </div>

    <div class="pricing-plan__metrics">
      <div v-for="metric in props.plan.metrics" :key="metric.label">
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.label }}</span>
      </div>
    </div>

    <a-button
      class="pricing-plan__cta"
      :type="props.active ? 'primary' : 'default'"
      block
    >
      <template #icon>
        <Icon :name="props.active ? 'i-lucide:zap' : 'i-lucide:arrow-right'" />
      </template>
      {{ props.plan.cta }}
    </a-button>

    <ul class="pricing-plan__features">
      <li v-for="feature in props.plan.features" :key="feature">
        <Icon name="i-lucide:check" :size="15" />
        <span>{{ feature }}</span>
      </li>
    </ul>
  </article>
</template>
