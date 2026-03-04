<template>
  <n-popover placement="bottom" trigger="click">
    <template #trigger>
      <button class="toolbar-item">
        <Icon name="i-lucide:bolt" :size="16" />
      </button>
    </template>
    <n-form
      label-placement="left"
      label-width="auto"
      :show-feedback="false"
      class="min-w-100 py-10 flex flex-col gap-10"
    >
      <n-form-item label="斑马线">
        <n-switch :value="striped" @update:value="striped = !striped" />
      </n-form-item>
      <n-form-item label="表格尺寸">
        <n-radio-group v-model:value="size" size="small">
          <n-radio-button v-for="item in sizeOptions" :value="item.value">{{
            item.label
          }}</n-radio-button>
        </n-radio-group>
      </n-form-item>
    </n-form>
  </n-popover>
</template>
<script lang="ts" setup>
  import { useTablePlusInject } from '../../context'

  const sizeOptions = [
    {
      label: '紧凑',
      value: 'small'
    },
    {
      label: '普通',
      value: 'medium'
    },
    {
      label: '宽松',
      value: 'large'
    }
  ]
  const { striped, size } = useTablePlusInject()
  const innerStriped = ref(striped?.value)
</script>
