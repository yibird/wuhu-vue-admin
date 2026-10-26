<template>
  <section>
    <a-divider>字体</a-divider>
    <div class="grid grid-cols-2 gap-8" role="radiogroup" aria-label="字体">
      <button
        v-for="item in fontOptions"
        :key="item.family"
        type="button"
        role="radio"
        :tabindex="item.family === font.family ? 0 : -1"
        :aria-checked="font.family === item.family"
        :aria-label="`切换字体：${item.label}`"
        :class="[
          'block-button group relative  h-80 flex-center flex-col cursor-pointer gap-4 rounded-8 border-1 border-solid px-8 outline-none transition-all   hover:(-translate-y-1 border-primary bg-primary/10)',
          font.family === item.family
            ? 'bg-primary/10 border-primary'
            : 'bg-container border-muted',
        ]"
        @click="changeFont(item)"
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
            'max-w-full truncate text-xs transition-colors duration-200 motion-reduce:transition-none',
            font.family === item.family
              ? 'text-primary'
              : 'text-secondary group-hover:text-main',
          ]"
        >
          {{ item.label }}
        </span>
        <span
          v-if="font.family === item.family"
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
import { fontOptions } from '@/config'
import type { FontOption } from '@/config'

const { font, changeFont } = useTheme()

function fontStyle(option: FontOption) {
  return {
    family: option.stack,
    weight: option.weight,
    letterSpacing: option.letterSpacing,
  }
}
</script>
