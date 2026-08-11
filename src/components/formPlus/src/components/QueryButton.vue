<template>
  <div class="flex gap-16 justify-end items-center">
    <a-button type="primary" @click="onSearch">
      <template #icon>
        <Icon name="i-lucide:search" />
      </template>
      {{ searchText }}
    </a-button>
    <a-button @click="onReset">
      <template #icon>
        <Icon name="i-lucide:rotate-ccw" />
      </template>
      {{ resetText }}
    </a-button>
    <a-button type="link" class="px-0">
      展开
      <template #icon>
        <Icon name="i-lucide:chevron-down" />
      </template>
    </a-button>
  </div>
</template>
<script lang="ts" setup>
export interface QueryButtonProps {
  searchText?: string
  resetText?: string
}

const { searchText = '查询', resetText = '重置' } =
  defineProps<QueryButtonProps>()

const emits = defineEmits<{
  (e: 'search'): void
  (e: 'reset'): void
}>()

const onSearch = () => {
  emits('search')
}
const onReset = () => {
  emits('reset')
}
</script>
