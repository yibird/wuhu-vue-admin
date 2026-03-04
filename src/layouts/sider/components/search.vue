<template>
  <div class="px-10" @click="onClick">
    <div
      :class="[
        'h-36 px-10 flex items-center justify-center bg-white text-white border-1 border-solid border-[#eee] rounded-4 overflow-hidden dark:(bg-[#2e3033] border-none)',
        sider.collapsed ? 'cursor-pointer' : '',
      ]"
    >
      <Icon
        name="i-lucide:search"
        :size="16"
        class="shrink-0 text-black dark:text-[#ffffffe6]"
      />
      <div
        v-if="!sider.collapsed"
        class="h-full flex-1 flex items-center overflow-hidden"
      >
        <div class="h-full flex-1 flex overflow-hidden">
          <input
            v-model="value"
            @input="onChange"
            ref="inputRef"
            placeholder="请输入搜索内容"
            class="w-full mx-8 text-sm text-black bg-transparent border-none outline-none dark:text-[#ffffffe6]"
          />
        </div>
        <Icon
          v-if="value.length > 0"
          name="i-lucide:x"
          :size="18"
          class="shrink-0 text-regular cursor-pointer hover:text-black"
          @click="onClear"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'
import type { SearchEmits } from './types'
import { ref } from 'vue'

const { sider } = storeToRefs(appStore())

const value = defineModel<string>('value', { default: '' })
const emits = defineEmits<SearchEmits>()
const inputRef = ref<HTMLInputElement>()

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  value.value = target.value
  emits('change', target.value)
}

const onClear = () => {
  value.value = ''
  emits('clear')
}

const onClick = () => {
  if (!sider.value.collapsed) return
  sider.value.collapsed = !sider.value.collapsed
  setTimeout(() => {
    inputRef.value?.focus()
  })
}
</script>
