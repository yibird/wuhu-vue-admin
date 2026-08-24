<script setup lang="ts">
import { useTheme } from '@/composables'
import { themeColorOptions } from '@/config'
import type { Color } from 'antdv-next'

const presets = [
  {
    label: '主题色',
    colors: themeColorOptions.map((item) => `rgb(${item.value})`),
    defaultOpen: true,
  },
]

const { themeColor, changeThemeColor } = useTheme()

const colorPickerValue = computed(() => `rgb(${themeColor.value})`)
const colorOptions = computed(() =>
  themeColorOptions.map((item) => ({
    ...item,
    selected: themeColor.value === item.value,
    style: { backgroundColor: `rgb(${item.value})` },
  }))
)
const selectedPreset = computed(() =>
  themeColorOptions.find((item) => item.value === themeColor.value)
)
const selectedColorLabel = computed(
  () => selectedPreset.value?.label ?? '自定义颜色'
)
const colorDisplayValue = computed(() => `RGB ${themeColor.value}`)
const isCustomColor = computed(() => !selectedPreset.value)

function onComplete(value: Color) {
  const { r, g, b } = value.toRgb()
  changeThemeColor(`${r}, ${g}, ${b}`)
}
</script>

<template>
  <section>
    <a-divider>主题</a-divider>

    <div class="mb-12 flex items-center justify-between gap-12">
      <div class="min-w-0">
        <div class="text-sm text-main font-700">主题色</div>
        <div class="mt-3 truncate text-xs text-secondary">
          {{ selectedColorLabel }} · {{ colorDisplayValue }}
        </div>
      </div>
      <span
        class="shrink-0 inline-flex items-center gap-6 rounded-full border-1 border-color-1 border-solid bg-fill-2 px-8 py-4 text-11px text-secondary font-600"
      >
        <span
          class="size-8 rounded-full border-1 border-color-2 border-solid shadow-[0_0_0_2px_rgb(var(--w-bg-container))] transition-colors duration-motion-base motion-reduce:transition-none"
          :style="{ backgroundColor: colorPickerValue }"
        />
        当前
      </span>
    </div>

    <div class="grid grid-cols-4 gap-7" role="radiogroup" aria-label="主题颜色">
      <button
        v-for="item in colorOptions"
        :key="item.value"
        type="button"
        :class="[
          'group min-w-0 flex cursor-pointer items-center justify-center gap-7 rounded-8 border-1 border-solid bg-container px-5 pb-8 pt-9 outline-none transition-[background-color,border-color,box-shadow,transform] duration-motion-base ease-motion-enter hover:(-translate-y-1 border-primary bg-hover shadow-[0_7px_18px_rgb(var(--w-shadow-color-1))]) focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] active:translate-y-0 motion-reduce:(transform-none transition-none)',
          item.selected
            ? 'border-primary bg-primary/10 shadow-[0_6px_16px_rgb(var(--w-color-primary)_/_13%)]'
            : 'border-color-1',
        ]"
        role="radio"
        :aria-checked="item.selected"
        :aria-label="`切换主题色：${item.label}`"
        @click="changeThemeColor(item.value)"
      >
        <span
          :class="[
            'relative size-24 shrink-0 flex items-center justify-center rounded-full border-2 border-color-2 border-solid transition-[box-shadow,transform] duration-motion-base ease-motion-enter group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
            item.selected
              ? 'scale-105 shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_28%)]'
              : 'shadow-[0_0_0_1px_rgb(var(--w-border-color-1))]',
          ]"
          :style="item.style"
        >
          <Transition
            enter-active-class="transition-[opacity,transform] duration-motion-base ease-motion-enter motion-reduce:transition-none"
            enter-from-class="scale-60 -rotate-10 opacity-0 motion-reduce:(scale-100 rotate-0)"
            leave-active-class="transition-[opacity,transform] duration-motion-fast ease-motion-exit motion-reduce:transition-none"
            leave-to-class="scale-60 -rotate-10 opacity-0 motion-reduce:(scale-100 rotate-0)"
          >
            <span
              v-if="item.selected"
              class="size-18 flex items-center justify-center rounded-full text-white"
            >
              <Icon name="i-lucide:check" :size="13" />
            </span>
          </Transition>
        </span>
        <span class="truncate text-xs text-secondary">{{ item.label }}</span>
      </button>
    </div>

    <div
      :class="[
        'mt-8 min-h-52 flex items-center justify-between gap-12 rounded-8 border-1 border-solid bg-container px-10 py-8 transition-[background-color,border-color,box-shadow] duration-motion-base ease-motion-enter hover:(border-primary bg-hover) motion-reduce:transition-none',
        isCustomColor
          ? 'border-primary bg-primary/8 shadow-[0_6px_16px_rgb(var(--w-color-primary)_/_10%)]'
          : 'border-color-1',
      ]"
    >
      <div class="flex min-w-0 items-center gap-9">
        <span
          class="size-30 shrink-0 flex items-center justify-center rounded-7 bg-primary/10 text-primary transition-colors duration-motion-base motion-reduce:transition-none"
        >
          <Icon name="i-lucide:pipette" :size="15" />
        </span>
        <div class="min-w-0">
          <div class="truncate text-sm text-main font-600">自定义颜色</div>
          <div class="mt-2 truncate text-xs text-secondary">
            {{ isCustomColor ? '正在使用自定义值' : '精确调整主题色' }}
          </div>
        </div>
      </div>
      <a-color-picker
        :value="colorPickerValue"
        :presets="presets"
        :show-text="true"
        disabled-alpha
        @change-complete="onComplete"
      >
        <template #showText>
          <span class="text-xs text-secondary">{{ colorDisplayValue }}</span>
        </template>
      </a-color-picker>
    </div>
  </section>
</template>
