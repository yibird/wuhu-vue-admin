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
    class="pricing-hero page-enter page-enter--1 relative overflow-hidden rounded-16 border-1 border-color-2 border-solid bg-container px-24 py-32 shadow-[0_24px_70px_rgb(var(--w-color-primary)_/_10%)] max-sm:px-16 max-sm:py-24"
  >
    <!-- 背景动态光晕 -->
    <div class="pricing-hero__glow pricing-hero__glow--1" aria-hidden="true" />
    <div class="pricing-hero__glow pricing-hero__glow--2" aria-hidden="true" />
    <div class="pricing-hero__glow pricing-hero__glow--3" aria-hidden="true" />
    <!-- 3D 透视网格地面 -->
    <div class="pricing-hero__floor" aria-hidden="true" />

    <div
      class="relative z-1 flex flex-wrap items-end justify-between gap-20 max-[980px]:flex-col max-[980px]:items-stretch"
    >
      <div class="min-w-0 flex-1">
        <div
          class="inline-flex items-center gap-8 rounded-full border-1 border-primary/25 border-solid bg-primary/10 px-12 py-6 text-xs text-primary font-800 backdrop-blur-sm"
        >
          <Icon name="i-lucide:sparkles" :size="14" class="animate-pulse" />
          灵活定价 · 随时升级
        </div>
        <h1
          class="pricing-hero__title mt-16 max-w-680 text-5xl text-main font-900 leading-[1.1] tracking-tight max-[980px]:text-4xl max-sm:text-3xl"
        >
          为不同阶段的团队
          <span class="pricing-hero__title-gradient">选择合适席位</span>
        </h1>
        <p class="mt-14 max-w-560 text-[15px] text-secondary leading-26">
          面向后台管理、低代码搭建、数据分析与自动化协作场景，把价格、额度和治理能力放在一张清晰的决策图里。
        </p>
      </div>

      <!-- 计费周期切换 pill -->
      <div class="shrink-0">
        <div
          class="inline-flex items-center rounded-full border-1 border-color-2 border-solid bg-fill-tertiary/80 p-4 backdrop-blur-sm"
          role="tablist"
          aria-label="计费周期"
        >
          <button
            v-for="option in props.billingOptions"
            :key="option.value"
            type="button"
            role="tab"
            class="relative min-w-100 cursor-pointer rounded-full px-16 py-9 text-sm transition-all duration-motion-base ease-motion-standard focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-2"
            :class="
              props.billingCycle === option.value
                ? 'bg-primary font-700 text-white shadow-[0_6px_24px_rgb(var(--w-color-primary)_/_45%)]'
                : 'font-600 text-secondary hover:text-primary'
            "
            :aria-selected="props.billingCycle === option.value"
            @click="handleCycleChange(option.value)"
          >
            {{ option.label }}
            <span
              v-if="option.value === 'yearly'"
              class="ml-6 inline-flex items-center rounded-full px-6 py-2 text-[10px] font-800"
              :class="
                props.billingCycle === option.value
                  ? 'bg-white/20 text-white'
                  : 'bg-primary/12 text-primary'
              "
            >
              省 20%
            </span>
          </button>
        </div>
        <p class="mt-10 text-xs text-secondary leading-18">
          年付以月均价展示，按 12 个月结算
          <span v-if="props.savedAmount > 0" class="text-success font-700">
            · 预计省 ¥{{ props.savedAmount }}
          </span>
        </p>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
.pricing-hero {
  overflow: hidden;
  perspective: 640px;
}

.pricing-hero__glow {
  position: absolute;
  pointer-events: none;
  border-radius: 9999px;
  filter: blur(90px);
}

.pricing-hero__glow--1 {
  top: -120px;
  right: -80px;
  width: 420px;
  height: 420px;
  background: rgb(var(--w-color-primary) / 18%);
  animation: pricing-glow-float 8s ease-in-out infinite;
}

.pricing-hero__glow--2 {
  bottom: -140px;
  left: -60px;
  width: 360px;
  height: 360px;
  background: rgb(var(--w-color-primary) / 10%);
  animation: pricing-glow-float 10s ease-in-out infinite reverse;
}

.pricing-hero__glow--3 {
  top: 50%;
  left: 50%;
  width: 280px;
  height: 280px;
  background: rgb(var(--w-color-primary) / 6%);
  transform: translate(-50%, -50%);
  animation: pricing-glow-pulse 6s ease-in-out infinite;
}

.pricing-hero__floor {
  position: absolute;
  right: -18%;
  bottom: 0;
  left: -18%;
  height: 110%;
  pointer-events: none;
  background-image:
    linear-gradient(
      90deg,
      rgb(var(--w-color-primary) / 16%) 1px,
      transparent 1px
    ),
    linear-gradient(
      0deg,
      rgb(var(--w-color-primary) / 16%) 1px,
      transparent 1px
    );
  background-size: 48px 48px;
  mask-image: linear-gradient(to top, rgb(0 0 0 / 72%) 0%, transparent 84%);
  transform: rotateX(58deg);
  transform-origin: 50% 100%;
}

.pricing-hero__title-gradient {
  background: linear-gradient(
    120deg,
    rgb(var(--w-color-primary)),
    rgb(var(--w-color-primary) / 60%),
    rgb(var(--w-color-primary)),
    rgb(var(--w-color-primary) / 60%),
    rgb(var(--w-color-primary))
  );
  background-clip: text;
  background-size: 200% auto;
  filter: drop-shadow(0 0 24px rgb(var(--w-color-primary) / 25%));
  animation: pricing-gradient-shine 4s linear infinite;
  -webkit-text-fill-color: transparent;
}

@keyframes pricing-glow-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(-30px, 20px) scale(1.08);
  }
}

@keyframes pricing-glow-pulse {
  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}

@keyframes pricing-gradient-shine {
  to {
    background-position: 200% center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pricing-hero__glow,
  .pricing-hero__title-gradient {
    animation: none;
  }
}
</style>
