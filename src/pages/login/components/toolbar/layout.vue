<template>
  <n-dropdown :options="options" :value="placement" @select="onSelect">
    <button
      class="flex size-40 cursor-pointer items-center justify-center rounded-8 transition hover:bg-[#f5f5f5]"
      type="button"
    >
      <Icon name="i-lucide:rows-3" :size="20" />
    </button>
  </n-dropdown>
</template>
<script setup lang="ts">
const options = [
  {
    key: 'left',
    label: '居左',
  },
  {
    key: 'center',
    label: '居中',
  },
  {
    key: 'right',
    label: '居右',
  },
]
const emits = defineEmits<{ (e: 'placement', value: string): void }>()
const placement = ref('right')

const onSelect = (value: string) => {
  placement.value = value
  emits('placement', value)
}
</script>
