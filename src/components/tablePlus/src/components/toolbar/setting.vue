<template>
  <a-popover
    placement="bottom"
    trigger="click"
    overlayClassName="setting-popover"
  >
    <template #content>
      <a-form layout="horizontal" class="min-w-100 py-10 flex flex-col gap-10">
        <a-form-item label="斑马线">
          <a-switch :checked="striped" @update:checked="striped = !striped" />
        </a-form-item>
        <a-form-item label="表格尺寸">
          <a-radio-group v-model:checked="size" size="small">
            <a-radio-button v-for="item in sizeOptions" :value="item.value">{{
              item.label
            }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </template>
    <a-button class="p-4" type="text">
      <template #icon>
        <Icon name="i-lucide:bolt" :size="16" />
      </template>
    </a-button>
  </a-popover>
</template>
<script lang="ts" setup>
import { useTablePlusInject } from '../../context'

const sizeOptions = [
  {
    label: '紧凑',
    value: 'small',
  },
  {
    label: '普通',
    value: 'medium',
  },
  {
    label: '宽松',
    value: 'large',
  },
]
const { striped, size } = useTablePlusInject()
</script>
