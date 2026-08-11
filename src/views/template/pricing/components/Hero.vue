<script setup lang="ts">
import type { BillingCycle, BillingOption } from '../types'

interface Props {
  billingCycle: BillingCycle
  billingOptions: BillingOption[]
  savedAmount: number
}

interface Emits {
  changeCycle: [cycle: BillingCycle]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleCycleChange(cycle: BillingCycle) {
  emit('changeCycle', cycle)
}
</script>

<template>
  <section
    class="pricing-hero dark:border-color-2 dark:bg-container"
    aria-labelledby="pricing-title"
  >
    <div class="pricing-hero__grid" aria-hidden="true" />
    <div class="pricing-hero__scan" aria-hidden="true" />
    <div class="pricing-hero__content">
      <div class="pricing-hero__copy">
        <div class="pricing-hero__eyebrow">
          <Icon name="i-lucide:panel-top" :size="15" />
          Pricing Command
        </div>
        <h1 id="pricing-title" class="pricing-hero__title">
          为不同阶段的团队选择合适席位
        </h1>
        <p class="pricing-hero__desc">
          面向后台管理、低代码搭建、数据分析与自动化协作场景，把价格、额度和治理能力放在一张清晰的决策图里。
        </p>
        <div class="pricing-hero__proof">
          <span>
            <Icon name="i-lucide:badge-check" :size="16" />
            推荐方案已标记
          </span>
          <span>
            <Icon name="i-lucide:plug-zap" :size="16" />
            API / Webhook
          </span>
          <span>
            <Icon name="i-lucide:receipt-text" :size="16" />
            支持报价导出
          </span>
        </div>
      </div>

      <div
        class="pricing-hero__panel dark:border-color-2"
        aria-label="计费周期"
      >
        <div class="pricing-hero__panel-head">
          <span>计费周期</span>
          <strong v-if="props.savedAmount > 0"
            >预计节省 ¥{{ props.savedAmount }}</strong
          >
        </div>
        <div class="pricing-hero__switch">
          <button
            v-for="option in props.billingOptions"
            :key="option.value"
            type="button"
            class="pricing-hero__switch-item"
            :class="{
              'pricing-hero__switch-item--active':
                props.billingCycle === option.value,
            }"
            :aria-pressed="props.billingCycle === option.value"
            @click="handleCycleChange(option.value)"
          >
            <span>{{ option.label }}</span>
            <small>{{ option.caption }}</small>
          </button>
        </div>
        <div class="pricing-hero__telemetry" aria-hidden="true">
          <span class="bg-primary dark:bg-primary" />
          <span class="bg-primary dark:bg-primary" />
          <span class="bg-primary dark:bg-primary" />
          <span class="bg-primary dark:bg-primary" />
        </div>
        <p class="pricing-hero__hint">
          年付价格以月均展示，实际结算按 12 个月计算。
        </p>
      </div>
    </div>
  </section>
</template>
