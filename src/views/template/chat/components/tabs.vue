<template>
  <div
    class="flex gap-8 flex-wrap p-10 border-b-1 border-b-solid border-color-1"
    role="tablist"
    :aria-label="ariaLabel"
  >
    <button
      v-for="(item, index) in props.items"
      :key="item.key"
      ref="tabButtons"
      type="button"
      role="tab"
      class="button rounded-6 px-8 py-6 text-sm transition-colors focus-visible:(outline-none shadow-[0_0_0_2px_rgb(var(--w-color-primary)/24%)])"
      :aria-selected="activeKey === item.key"
      :tabindex="activeKey === item.key ? 0 : -1"
      :class="[
        activeKey === item.key
          ? 'bg-primary/10 text-primary font-500'
          : 'text-secondary hover:bg-hover',
      ]"
      @click="onChange(item, index)"
      @keydown="onKeydown($event, index)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
<script lang="ts" setup>
import type { TabItem, TabsEmits, TabsProps } from './types'

const activeKey = defineModel('activeKey')
const props = withDefaults(defineProps<TabsProps>(), {
  items: () => [],
  ariaLabel: '列表筛选',
})
const emits = defineEmits<TabsEmits>()
const tabButtons = useTemplateRef<HTMLButtonElement[]>('tabButtons')

const onChange = (item: TabItem, index: number) => {
  activeKey.value = item.key
  emits('change', item, index)
}

function onKeydown(event: KeyboardEvent, index: number) {
  let nextIndex: number | undefined

  switch (event.key) {
    case 'ArrowLeft':
      nextIndex = (index - 1 + props.items.length) % props.items.length
      break
    case 'ArrowRight':
      nextIndex = (index + 1) % props.items.length
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = props.items.length - 1
      break
  }

  if (nextIndex === undefined || !props.items[nextIndex]) return
  event.preventDefault()
  onChange(props.items[nextIndex], nextIndex)
  nextTick(() => tabButtons.value?.[nextIndex]?.focus())
}
</script>
