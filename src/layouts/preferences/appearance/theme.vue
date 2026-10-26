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
        class="shrink-0 inline-flex items-center gap-6 rounded-full b-1-muted bg-secondary px-8 py-4 text-11px text-secondary font-600"
      >
        <span
          class="size-8 rounded-full b-1-regular ring-2 ring-[rgb(var(--w-bg-container))] transition-colors duration-200 motion-reduce:transition-none"
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
          'group min-w-0 flex cursor-pointer items-center justify-center gap-7 rounded-8 border-1 border-solid bg-container px-5 pb-8 pt-9 outline-none transition-[background-color,border-color,box-shadow,transform] duration-200 ease-[var(--w-motion-ease-enter)] hover:(-translate-y-1 border-primary bg-hover shadow-lg shadow-ink/20) focus-visible:(ring-2 ring-primary/24) active:translate-y-0 motion-reduce:(transform-none transition-none)',
          item.selected
            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/13'
            : 'border-muted',
        ]"
        role="radio"
        :aria-checked="item.selected"
        :aria-label="`切换主题色：${item.label}`"
        @click="changeThemeColor(item.value)"
      >
        <span
          :class="[
            'relative size-24 shrink-0 flex items-center justify-center rounded-full b-2-regular transition-[box-shadow,transform] duration-200 ease-[var(--w-motion-ease-enter)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
            item.selected
              ? 'scale-105 ring-2 ring-primary/28'
              : 'ring-1 ring-[rgb(var(--w-border-muted))]',
          ]"
          :style="item.style"
        >
          <Transition name="fade-pop">
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
        'mt-8 min-h-52 flex items-center justify-between gap-12 rounded-8 border-1 border-solid bg-container px-10 py-8 transition-[background-color,border-color,box-shadow] duration-200 ease-[var(--w-motion-ease-enter)] hover:(border-primary bg-hover) motion-reduce:transition-none',
        isCustomColor
          ? 'border-primary bg-primary/8 shadow-lg shadow-primary/10'
          : 'border-muted',
      ]"
    >
      <div class="flex min-w-0 items-center gap-9">
        <span
          class="size-30 shrink-0 flex items-center justify-center rounded-7 bg-primary/10 text-primary transition-colors duration-200 motion-reduce:transition-none"
        >
          <Icon name="i-lucide:pipette" :size="15" />
        </span>
        <div class="min-w-0">
          <div class="truncate text-sm text-main font-600">自定义颜色</div>
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

<script setup lang="ts">
import { useTheme } from '@/theme'
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
  changeThemeColor(`${r} ${g} ${b}`)
}
</script>
