<template>
  <a-dropdown
    :menu="{ items: options }"
    placement="bottomLeft"
    @menu-click="onSelect"
  >
    <span class="size-25 grid-center rounded-4 hover:bg-white">
      <Icon name="i-lucide:ellipsis" :size="18" />
    </span>
  </a-dropdown>
</template>
<script lang="ts" setup>
import type { DropdownProps, DropdownEmits } from './types'

const props = defineProps<DropdownProps>()
const emits = defineEmits<DropdownEmits>()

const options = [
  {
    key: 'update',
    label: '修改',
    props: { class: 'w-100' },
  },
  {
    key: 'del',
    label: '删除',
    props: { class: 'w-100' },
  },
]
import Modal from 'antdv-next/dist/modal/index'

const onSelect = ({ key }: { key: string }) => {
  switch (key) {
    case 'update':
      break
    case 'del':
      Modal.confirm({
        title: '删除',
        content: '确定删除吗？',
        okText: '确定',
        cancelText: '取消',
        onCancel: () => {
          emits('del')
        },
      })
      break
  }
}
</script>
