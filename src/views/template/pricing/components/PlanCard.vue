<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import type { BillingCycle, PricingPlan } from '../types'

interface Props {
  plan: PricingPlan
  billingCycle: BillingCycle
  active: boolean
}

interface Emits {
  select: [plan: PricingPlan]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const MAX_TILT = 12

const cardRef = useTemplateRef<HTMLElement>('cardRef')
const tilting = shallowRef(false)
const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

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

const isRecommended = computed(() => props.plan.accent === 'electric')

function handleSelect() {
  emit('select', props.plan)
}

function handlePointerMove(event: PointerEvent) {
  if (reduceMotion.value || event.pointerType !== 'mouse') return

  const card = cardRef.value
  if (!card) return

  const rect = card.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width - 0.5
  const py = (event.clientY - rect.top) / rect.height - 0.5
  const style = card.style

  style.setProperty('--pricing-rx', (-py * MAX_TILT).toFixed(2))
  style.setProperty('--pricing-ry', (px * MAX_TILT).toFixed(2))
  style.setProperty('--pricing-gx', `${((px + 0.5) * 100).toFixed(1)}%`)
  style.setProperty('--pricing-gy', `${((py + 0.5) * 100).toFixed(1)}%`)
}

function handlePointerEnter(event: PointerEvent) {
  if (reduceMotion.value || event.pointerType !== 'mouse') return
  tilting.value = true
}

function handlePointerLeave() {
  tilting.value = false

  const card = cardRef.value
  if (!card) return

  card.style.removeProperty('--pricing-rx')
  card.style.removeProperty('--pricing-ry')
  card.style.removeProperty('--pricing-gx')
  card.style.removeProperty('--pricing-gy')
}
</script>

<template>
  <article
    ref="cardRef"
    class="pricing-card group relative flex cursor-pointer flex-col overflow-hidden rounded-16 border-1 border-solid p-20 outline-none transition-[box-shadow,transform] duration-motion-moderate ease-motion-enter hover:-translate-y-3 focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-2 motion-reduce:transition-none max-sm:p-16"
    :class="{
      // 普通卡
      'border-color-1 pricing-card--normal shadow-[0_10px_30px_rgb(15_23_42_/_5%)] hover:shadow-[0_20px_50px_rgb(var(--w-color-primary)_/_10%)]':
        !isRecommended,
      // 推荐卡：渐变边框 + 发光
      'pricing-card--featured border-transparent shadow-[0_24px_60px_rgb(var(--w-color-primary)_/_18%)] hover:shadow-[0_32px_80px_rgb(var(--w-color-primary)_/_25%)]':
        isRecommended,
      // 选中态
      '-translate-y-3': props.active,
      // 指针跟随倾斜
      'pricing-card--tilting': tilting,
    }"
    :aria-pressed="props.active"
    :aria-label="`选择 ${props.plan.name} 方案`"
    role="button"
    tabindex="0"
    @click="handleSelect"
    @keydown.enter="handleSelect"
    @keydown.space.prevent="handleSelect"
    @pointerenter="handlePointerEnter"
    @pointermove="handlePointerMove"
    @pointerleave="handlePointerLeave"
  >
    <!-- hover 光泽扫过 -->
    <div class="pricing-card__shine" aria-hidden="true" />
    <!-- 指针跟随高光 -->
    <div class="pricing-card__glare" aria-hidden="true" />

    <div class="pricing-card__content relative z-1 flex flex-col">
      <!-- 头部：图标 + 徽章 -->
      <div class="flex items-start justify-between gap-12">
        <span
          class="pricing-card__icon size-46 inline-flex items-center justify-center rounded-12 transition-transform duration-motion-moderate ease-motion-standard group-hover:scale-110 group-hover:-rotate-3"
          :class="{
            'bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-[0_8px_24px_rgb(var(--w-color-primary)_/_20%)]':
              isRecommended,
            'bg-fill-tertiary text-secondary': !isRecommended,
          }"
        >
          <Icon :name="props.plan.icon" :size="22" />
        </span>
        <span
          v-if="props.plan.badge"
          class="inline-flex items-center gap-4 rounded-full bg-primary px-12 py-5 text-xs text-white font-800 shadow-[0_4px_16px_rgb(var(--w-color-primary)_/_40%)]"
        >
          <Icon name="i-lucide:crown" :size="12" />
          {{ props.plan.badge }}
        </span>
      </div>

      <!-- 名称与描述 -->
      <div class="mt-20">
        <span class="text-xs text-secondary font-600 tracking-wide uppercase">
          {{ props.plan.eyebrow }}
        </span>
        <h2 class="mt-5 text-2xl text-main font-900 tracking-tight leading-30">
          {{ props.plan.name }}
        </h2>
        <p class="mt-8 text-[13px] text-secondary leading-20">
          {{ props.plan.description }}
        </p>
      </div>

      <!-- 价格 -->
      <div class="mt-20 flex items-baseline gap-6">
        <Transition name="fade-slide" mode="out-in">
          <strong
            :key="priceKey"
            class="pricing-card__price text-[52px] font-900 tabular-nums leading-none tracking-tight"
            :class="{
              'pricing-card__price--featured': isRecommended,
            }"
          >
            {{ priceLabel }}
          </strong>
        </Transition>
        <Transition name="fade-slide-inline" mode="out-in">
          <del
            v-if="originalPriceLabel"
            :key="originalPriceLabel"
            class="text-sm text-placeholder"
          >
            {{ originalPriceLabel }}
          </del>
        </Transition>
        <span class="text-xs text-secondary">{{ props.plan.unit }}</span>
      </div>

      <!-- 指标三栏 -->
      <div
        class="mt-20 grid grid-cols-3 overflow-hidden rounded-12 border-1"
        :class="
          isRecommended
            ? 'border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5'
            : 'border-color-1 bg-fill-tertiary/50'
        "
      >
        <div
          v-for="(metric, i) in props.plan.metrics"
          :key="metric.label"
          class="min-w-0 p-10 text-center"
          :class="[
            'border-r-1',
            i < props.plan.metrics.length - 1
              ? isRecommended
                ? 'border-primary/15'
                : 'border-color-1'
              : 'border-r-0',
          ]"
        >
          <strong
            class="block text-base font-900 tabular-nums"
            :class="isRecommended ? 'text-primary' : 'text-main'"
          >
            {{ metric.value }}
          </strong>
          <span class="mt-2 block text-[11px] text-secondary">
            {{ metric.label }}
          </span>
        </div>
      </div>

      <!-- CTA 按钮 -->
      <a-button
        class="pricing-card__cta mt-16 w-full"
        :class="{ 'pricing-card__cta--featured': isRecommended }"
        :type="isRecommended || props.active ? 'primary' : 'default'"
        size="large"
        block
      >
        {{ props.plan.cta }}
      </a-button>

      <!-- 功能列表 -->
      <ul class="mt-18 grid list-none gap-9 p-0">
        <li
          v-for="feature in props.plan.features"
          :key="feature"
          class="flex items-center gap-10 text-[13px] text-regular leading-20"
        >
          <span
            class="size-18 flex shrink-0 items-center justify-center rounded-full transition-transform duration-motion-base ease-motion-standard group-hover:scale-110"
            :class="
              isRecommended
                ? 'bg-primary text-white shadow-[0_2px_8px_rgb(var(--w-color-primary)_/_40%)]'
                : 'bg-success/12 text-success'
            "
          >
            <Icon name="i-lucide:check" :size="11" :stroke-width="3" />
          </span>
          <span>{{ feature }}</span>
        </li>
      </ul>
    </div>
  </article>
</template>

<style lang="less" scoped>
.pricing-card {
  isolation: isolate;
  transform: perspective(1200px) rotateX(calc(var(--pricing-rx, 0) * 1deg))
    rotateY(calc(var(--pricing-ry, 0) * 1deg));
  transition:
    transform var(--w-motion-duration-slower) var(--w-motion-ease-spring),
    box-shadow var(--w-motion-duration-moderate) var(--w-motion-ease-standard);
  will-change: transform;
}

// 指针跟随期间取消回弹，保证跟手
.pricing-card--tilting {
  transition:
    transform 90ms ease-out,
    box-shadow var(--w-motion-duration-moderate) var(--w-motion-ease-standard);
}

.pricing-card__content {
  transform: translate3d(
    calc(var(--pricing-ry, 0) * 1.6px),
    calc(var(--pricing-rx, 0) * -1.6px),
    0
  );
}

.pricing-card__icon {
  transform: translate3d(
    calc(var(--pricing-ry, 0) * 2.6px),
    calc(var(--pricing-rx, 0) * -2.6px),
    0
  );
}

// 指针跟随高光
.pricing-card__glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    420px circle at var(--pricing-gx, 50%) var(--pricing-gy, 0%),
    rgb(var(--w-color-primary) / 18%),
    transparent 62%
  );
  opacity: 0;
  transition: opacity var(--w-motion-duration-moderate)
    var(--w-motion-ease-standard);
}

.pricing-card:hover .pricing-card__glare {
  opacity: 1;
}

// 普通卡微妙渐变背景
.pricing-card--normal {
  background: linear-gradient(
    180deg,
    rgb(var(--w-bg-container)) 0%,
    rgb(var(--w-bg-container) / 96%) 100%
  );
}

// 价格渐变文字
.pricing-card__price {
  background: linear-gradient(
    180deg,
    rgb(var(--w-text-main)),
    color-mix(in srgb, rgb(var(--w-text-main)) 68%, transparent)
  );
  background-clip: text;
  transform: translate3d(
    calc(var(--pricing-ry, 0) * 2px),
    calc(var(--pricing-rx, 0) * -2px),
    0
  );
  -webkit-text-fill-color: transparent;
}

.pricing-card__price--featured {
  background: linear-gradient(
    135deg,
    rgb(var(--w-color-primary)),
    rgb(var(--w-color-primary) / 70%)
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

// 推荐卡 CTA 按钮发光
.pricing-card__cta--featured {
  box-shadow: 0 8px 24px rgb(var(--w-color-primary) / 35%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.pricing-card__cta--featured:hover {
  box-shadow: 0 12px 32px rgb(var(--w-color-primary) / 45%);
  transform: translateY(-1px);
}

// 推荐卡渐变发光边框
.pricing-card--featured {
  background:
    linear-gradient(rgb(var(--w-bg-container)), rgb(var(--w-bg-container)))
      padding-box,
    linear-gradient(
        135deg,
        rgb(var(--w-color-primary) / 70%),
        rgb(var(--w-color-primary) / 20%),
        rgb(var(--w-color-primary) / 70%)
      )
      border-box;
  background-size:
    100% 100%,
    200% 200%;
  animation: pricing-border-flow 4s ease infinite;
}

// hover 光泽扫过
.pricing-card__shine {
  position: absolute;
  top: 0;
  left: -80%;
  width: 60%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(
    100deg,
    transparent,
    rgb(255 255 255 / 35%),
    transparent
  );
  transform: skewX(-20deg);
  transition: left 0.7s ease;
}

.pricing-card:hover .pricing-card__shine {
  left: 120%;
}

@keyframes pricing-border-flow {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pricing-card {
    transform: none;
  }

  .pricing-card--featured {
    animation: none;
  }

  .pricing-card__shine {
    transition: none;
  }

  .pricing-card__glare {
    transition: none;
  }
}
</style>
