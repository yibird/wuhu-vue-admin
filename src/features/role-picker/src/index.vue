<script lang="ts" setup>
import { matchesOption } from '@/utils'
import type { RolePickerProps, RolePickerOption } from './types'

const props = withDefaults(defineProps<RolePickerProps>(), {
  options: () => [],
  placeholder: '请选择角色',
  disabled: false,
  allowClear: true,
  loading: false,
  popupMatchSelectWidth: true,
})

const model = defineModel<string | undefined>('value')

function filterOption(inputValue: string, option?: RolePickerOption) {
  return matchesOption(inputValue, option?.label, option?.description)
}
</script>

<template>
  <a-select
    v-model:value="model"
    class="w-full"
    :allow-clear="allowClear"
    :disabled="disabled"
    :filter-option="filterOption"
    :loading="loading"
    option-filter-prop="label"
    :options="options"
    :placeholder="placeholder"
    :popup-match-select-width="popupMatchSelectWidth"
    show-search
    :size="size"
  >
    <template #prefix>
      <Icon name="i-lucide:shield-check" class="text-secondary" :size="14" />
    </template>
    <template #optionRender="{ option }">
      <div class="flex items-center gap-8">
        <span
          class="size-26 shrink-0 flex-center rounded-4 bg-primary-tint text-primary"
        >
          <Icon name="i-lucide:shield-check" :size="14" />
        </span>
        <div class="min-w-0">
          <div class="truncate text-sm text-main">{{ option.data.label }}</div>
          <div
            v-if="option.data.description"
            class="truncate text-xs text-secondary"
          >
            {{ option.data.description }}
          </div>
        </div>
      </div>
    </template>
  </a-select>
</template>
