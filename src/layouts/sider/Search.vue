<template>
  <div class="h-48 flex items-center justify-center px-10" @click="onClick">
    <div
      :class="[
        'h-34 px-10 flex items-center justify-center bg-container text-main border-1 border-solid border-color-2 rounded-4 overflow-hidden',
        isCollapsed ? 'cursor-pointer' : '',
      ]"
    >
      <Icon name="i-lucide:search" :size="16" class="shrink-0 text-main" />
      <div
        v-if="!isCollapsed"
        class="relative h-full flex-1 flex items-center overflow-hidden"
      >
        <div class="h-full flex-1 flex overflow-hidden">
          <input
            v-model="value"
            @input="onChange"
            ref="inputRef"
            placeholder="请输入搜索内容"
            class="w-full mx-8 text-sm text-main bg-transparent border-none outline-none placeholder:text-placeholder"
          />
        </div>
        <Icon
          v-if="value.length > 0"
          name="i-lucide:x"
          :size="18"
          class="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-regular hover:text-main"
          @click="onClear"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useSearch } from './composables'
import type { SearchEmits, SearchProps } from './types'

const value = defineModel<string>('value', { default: '' })
const props = defineProps<SearchProps>()
const emits = defineEmits<SearchEmits>()

const { isCollapsed, onChange, onClear, onClick } = useSearch({
  value,
  collapsed: props.collapsed,
  onChange: (value: string) => {
    emits('change', value)
  },
  onClear: () => {
    emits('clear')
  },
})
</script>
