<script setup lang="ts">
import { onScopeDispose, shallowRef, watch } from 'vue'

interface Props {
  hours: string
  minutes: string
  seconds: string
  label: string
}

const props = defineProps<Props>()

const timeUnits = computed(() => [
  { key: 'hours', label: '时', value: props.hours },
  { key: 'minutes', label: '分', value: props.minutes },
  { key: 'seconds', label: '秒', value: props.seconds },
])

const flippingValues = shallowRef<Record<string, string>>({})
const flipTimers = new Map<string, ReturnType<typeof setTimeout>>()
const flipDuration = 680

function clearFlipTimer(key: string) {
  const timer = flipTimers.get(key)

  if (timer) {
    clearTimeout(timer)
    flipTimers.delete(key)
  }
}

function startFlip(key: string, previousValue: string) {
  clearFlipTimer(key)
  flippingValues.value = { ...flippingValues.value, [key]: previousValue }

  const timer = setTimeout(() => {
    const nextValues = { ...flippingValues.value }
    delete nextValues[key]
    flippingValues.value = nextValues
    flipTimers.delete(key)
  }, flipDuration)

  flipTimers.set(key, timer)
}

watch(
  () => timeUnits.value.map((unit) => unit.value),
  (values, previousValues) => {
    if (!previousValues) return

    timeUnits.value.forEach((unit, index) => {
      const previousValue = previousValues[index]

      if (previousValue && previousValue !== values[index]) {
        startFlip(unit.key, previousValue)
      }
    })
  }
)

onScopeDispose(() => {
  flipTimers.forEach((timer) => clearTimeout(timer))
  flipTimers.clear()
})
</script>

<template>
  <div
    class="flex items-start justify-center gap-8 sm:gap-12"
    role="timer"
    :aria-label="label"
  >
    <template v-for="(unit, index) in timeUnits" :key="unit.key">
      <div class="w-72 sm:w-96">
        <div
          class="flip-clock-card relative h-76 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-all-sm sm:h-104"
        >
          <div class="flip-clock-half flip-clock-half--top" aria-hidden="true">
            <span
              class="flip-clock-digit flex items-center justify-center text-38px text-main font-700 leading-none tabular-nums sm:text-56px"
            >
              {{ unit.value }}
            </span>
          </div>
          <div
            class="flip-clock-half flip-clock-half--bottom"
            aria-hidden="true"
          >
            <span
              class="flip-clock-digit flex items-center justify-center text-38px text-main font-700 leading-none tabular-nums sm:text-56px"
            >
              {{ unit.value }}
            </span>
          </div>

          <template v-if="flippingValues[unit.key]">
            <div
              :key="`${unit.key}-old-top-${flippingValues[unit.key]}`"
              class="flip-clock-flap flip-clock-flap--top"
              aria-hidden="true"
            >
              <span
                class="flip-clock-digit flex items-center justify-center text-38px text-main font-700 leading-none tabular-nums sm:text-56px"
              >
                {{ flippingValues[unit.key] }}
              </span>
            </div>
            <div
              :key="`${unit.key}-old-bottom-${flippingValues[unit.key]}`"
              class="flip-clock-flap flip-clock-flap--old-bottom"
              aria-hidden="true"
            >
              <span
                class="flip-clock-digit flex items-center justify-center text-38px text-main font-700 leading-none tabular-nums sm:text-56px"
              >
                {{ flippingValues[unit.key] }}
              </span>
            </div>
            <div
              :key="`${unit.key}-new-bottom-${unit.value}`"
              class="flip-clock-flap flip-clock-flap--new-bottom"
              aria-hidden="true"
            >
              <span
                class="flip-clock-digit flex items-center justify-center text-38px text-main font-700 leading-none tabular-nums sm:text-56px"
              >
                {{ unit.value }}
              </span>
            </div>
          </template>

          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 top-1/2 z-5 h-1px bg-[rgb(var(--w-border-color-2))]"
          />
        </div>
        <div class="mt-10 text-center text-xs text-muted">{{ unit.label }}</div>
      </div>

      <div
        v-if="index < timeUnits.length - 1"
        aria-hidden="true"
        class="h-76 w-8 flex flex-col items-center justify-center gap-10 sm:h-104 sm:w-12"
      >
        <span class="size-4 rounded-full bg-primary sm:size-5" />
        <span class="size-4 rounded-full bg-primary sm:size-5" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.flip-clock-card {
  isolation: isolate;
  transform-style: preserve-3d;
  perspective: 900px;
}

.flip-clock-half,
.flip-clock-flap {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
  background: rgb(var(--w-bg-container));
}

.flip-clock-half--top,
.flip-clock-flap--top {
  top: 0;
}

.flip-clock-half--bottom,
.flip-clock-flap--old-bottom,
.flip-clock-flap--new-bottom {
  bottom: 0;
}

.flip-clock-digit {
  position: absolute;
  left: 0;
  width: 100%;
  height: 200%;
}

.flip-clock-half--top .flip-clock-digit,
.flip-clock-flap--top .flip-clock-digit {
  top: 0;
}

.flip-clock-half--bottom .flip-clock-digit,
.flip-clock-flap--old-bottom .flip-clock-digit,
.flip-clock-flap--new-bottom .flip-clock-digit {
  bottom: 0;
}

.flip-clock-flap {
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;
}

.flip-clock-flap--top {
  z-index: 4;
  transform-origin: center bottom;
  animation: flip-clock-top 680ms cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
}

.flip-clock-flap--old-bottom {
  z-index: 3;
  animation: flip-clock-old-bottom 680ms linear forwards;
}

.flip-clock-flap--new-bottom {
  z-index: 4;
  transform: rotateX(90deg);
  transform-origin: center top;
  animation: flip-clock-new-bottom 680ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .flip-clock-flap {
    display: none;
    animation: none;
  }
}

@keyframes flip-clock-top {
  0% {
    transform: rotateX(0deg);
  }

  46%,
  100% {
    transform: rotateX(-90deg);
  }
}

@keyframes flip-clock-old-bottom {
  0%,
  46% {
    opacity: 1;
  }

  46.01%,
  100% {
    opacity: 0;
  }
}

@keyframes flip-clock-new-bottom {
  0%,
  46% {
    transform: rotateX(90deg);
  }

  100% {
    transform: rotateX(0deg);
  }
}
</style>
