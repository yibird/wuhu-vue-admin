<script setup lang="ts">
import type { CompareFeature, PlanKey } from '../types'

interface Props {
  features: CompareFeature[]
  activePlanKey: PlanKey
}

const props = defineProps<Props>()
const planColumns: { key: PlanKey; label: string }[] = [
  { key: 'launch', label: 'Launch' },
  { key: 'scale', label: 'Scale' },
  { key: 'enterprise', label: 'Enterprise' },
]
</script>

<template>
  <section class="pricing-compare" aria-label="功能对比">
    <div class="pricing-section-head">
      <div>
        <span>Capability Matrix</span>
        <h2>能力对比</h2>
      </div>
      <a-button size="small">
        <template #icon>
          <Icon name="i-lucide:download" />
        </template>
        导出报价
      </a-button>
    </div>

    <div class="pricing-compare__scroll">
      <div class="pricing-compare__table">
        <div class="pricing-compare__row pricing-compare__row--head">
          <div>能力模块</div>
          <div
            v-for="column in planColumns"
            :key="column.key"
            :class="{ 'is-active': props.activePlanKey === column.key }"
          >
            {{ column.label }}
          </div>
        </div>

        <div
          v-for="item in props.features"
          :key="`${item.group}-${item.name}`"
          class="pricing-compare__row"
        >
          <div>
            <small>{{ item.group }}</small>
            <strong>{{ item.name }}</strong>
          </div>
          <div
            v-for="column in planColumns"
            :key="column.key"
            :class="{ 'is-active': props.activePlanKey === column.key }"
          >
            <template v-if="typeof item[column.key] === 'string'">
              {{ item[column.key] }}
            </template>
            <Icon
              v-else-if="item[column.key]"
              name="i-lucide:check"
              :size="16"
              class="pricing-compare__check"
            />
            <span v-else class="pricing-compare__empty">-</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
