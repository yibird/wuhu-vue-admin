<template>
  <section>
    <a-divider>字体</a-divider>
    <div
      class="grid grid-cols-2 gap-8"
      role="radiogroup"
      aria-label="字体"
      @keydown="onKeydown"
    >
      <button
        v-for="(item, index) in fontFamilyOptions"
        :key="item.value"
        :ref="(element) => setButtonRef(element, index)"
        type="button"
        role="radio"
        :tabindex="index === activeIndex ? 0 : -1"
        :aria-checked="fontFamily === item.value"
        :aria-label="`切换字体：${item.label}`"
        :class="[
          'group relative min-w-0 h-80 flex-center flex-col cursor-pointer gap-4 rounded-8 border-1 border-solid bg-container px-8  outline-none transition-[background-color,border-color,box-shadow,transform] duration-motion-base ease-motion-enter hover:(-translate-y-1 border-primary bg-hover shadow-[0_7px_18px_var(--w-shadow-color-1)]) focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] active:translate-y-0 motion-reduce:(transform-none transition-none)',
          fontFamily === item.value
            ? 'border-primary bg-primary/10 shadow-[0_6px_16px_rgb(var(--w-color-primary)_/_13%)]'
            : 'border-color-1',
        ]"
        @click="changeFontFamily(item.value)"
      >
        <span
          :style="fontStyle(item)"
          class="whitespace-nowrap text-20px leading-none text-main"
        >
          Aa 字
        </span>
        <span
          :style="fontStyle(item)"
          :class="[
            'max-w-full truncate text-xs transition-colors duration-motion-base motion-reduce:transition-none',
            fontFamily === item.value
              ? 'text-primary'
              : 'text-secondary group-hover:text-main',
          ]"
        >
          {{ item.label }}
        </span>
        <span
          v-if="fontFamily === item.value"
          class="absolute right-6 top-6 size-16 flex items-center justify-center rounded-full bg-primary text-white"
        >
          <Icon name="i-lucide:check" :size="11" />
        </span>
      </button>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { useTheme } from '@/theme'
import { fontFamilyOptions } from '@/config'
import type { FontFamilyOption } from '@/config'

defineOptions({ name: 'AppearanceFont' })

const { fontFamily, changeFontFamily } = useTheme()

const buttonRefs: HTMLButtonElement[] = []
const navigationKeys = new Set([
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft',
  'ArrowUp',
  'Home',
  'End',
])

function setButtonRef(element: unknown, index: number) {
  if (element) buttonRefs[index] = element as HTMLButtonElement
}

function fontStyle(option: FontFamilyOption) {
  return {
    fontFamily: option.stack,
    fontWeight: option.fontWeight,
    letterSpacing: option.letterSpacing,
  }
}

/**
 * 按 ARIA radio 模式实现 roving tabindex + 方向键切换，
 * 保证键盘用户只需一个 Tab 停靠点即可浏览全部字体。
 */
function onKeydown(event: KeyboardEvent) {
  if (!navigationKeys.has(event.key)) return

  event.preventDefault()

  const total = fontFamilyOptions.length
  const current = fontFamilyOptions.findIndex(
    (item) => item.value === fontFamily.value
  )
  const index = current < 0 ? 0 : current

  let next = index
  if (event.key === 'Home') {
    next = 0
  } else if (event.key === 'End') {
    next = total - 1
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    next = (index + 1) % total
  } else {
    next = (index - 1 + total) % total
  }

  changeFontFamily(fontFamilyOptions[next].value)
  buttonRefs[next]?.focus()
}
</script>
