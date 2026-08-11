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
import { useAppStore } from '@/store'
import type { SearchEmits, SearchProps } from './types'

const { sider, setCollapsed } = useAppStore()
const props = defineProps<SearchProps>()

const value = defineModel<string>('value', { default: '' })
const emits = defineEmits<SearchEmits>()
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const isCollapsed = computed(() => props.collapsed ?? sider.value.collapsed)

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  value.value = target.value
  emits('change', target.value)
}

const onClear = () => {
  value.value = ''
  inputRef.value?.focus()
  emits('clear')
}

const onClick = () => {
  if (!sider.value.collapsed) return
  setCollapsed(false)
  setTimeout(() => {
    inputRef.value?.focus()
  })
}
</script>
