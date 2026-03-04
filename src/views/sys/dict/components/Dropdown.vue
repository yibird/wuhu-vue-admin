<template>
  <n-dropdown :options="options" placement="bottom-start" @select="onSelect">
    <span class="size-25 grid-center rounded-4 hover:bg-white">
      <Icon name="i-lucide:ellipsis" :size="18" />
    </span>
  </n-dropdown>
</template>
<script lang="ts" setup>
import { useDialog } from 'naive-ui'
import type { DropdownProps, DropdownEmits } from './types'

const props = defineProps<DropdownProps>()
const emits = defineEmits<DropdownEmits>()

const options = [
  {
    key: 'update',
    label: '修改',
    props: { class: 'w-100' }
  },
  {
    key: 'del',
    label: '删除',
    props: { class: 'w-100' }
  }
]
const dialog = useDialog()

const onSelect = (key: string) => {
  switch (key) {
    case 'update':
      break
    case 'del':
      dialog.warning({
        title: '删除',
        content: '确定删除吗？',
        positiveText: '确定',
        negativeText: '取消',
        draggable: true,
        onNegativeClick: () => {
          emits('del')
        }
      })
      break
  }
}
</script>
