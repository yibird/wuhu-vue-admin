<script lang="ts" setup>
import { matchesOption } from '@/utils'
import type { UserPickerProps, UserPickerOption } from './types'

const props = withDefaults(defineProps<UserPickerProps>(), {
  options: () => [],
  placeholder: '请选择用户',
  disabled: false,
  allowClear: false,
  loading: false,
  popupMatchSelectWidth: true,
})

const model = defineModel<string | undefined>('value')

const selectedUser = computed(() => {
  return props.options.find((item) => item.value === model.value)
})

function getInitial(label?: string) {
  return (label || '?').slice(0, 1)
}

function getAvatarClass(option?: UserPickerOption) {
  return option?.avatarClass ?? 'bg-fill-secondary text-secondary'
}

function filterOption(inputValue: string, option?: UserPickerOption) {
  return matchesOption(
    inputValue,
    option?.label,
    option?.role,
    option?.department,
    option?.email
  )
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
    <template #labelRender="{ label, value }">
      <span class="inline-flex min-w-0 items-center gap-6">
        <span
          class="size-20 shrink-0 flex items-center justify-center rounded-full text-10px font-600"
          :class="getAvatarClass(selectedUser)"
        >
          {{ getInitial(selectedUser?.label ?? String(label ?? value)) }}
        </span>
        <span class="truncate">{{ selectedUser?.label ?? label }}</span>
      </span>
    </template>

    <template #optionRender="{ option }">
      <div class="flex items-center gap-8">
        <span
          class="size-26 shrink-0 flex items-center justify-center rounded-full text-xs font-600"
          :class="getAvatarClass(option.data)"
        >
          {{ getInitial(String(option.data.label)) }}
        </span>
        <div class="min-w-0">
          <div class="truncate text-xs text-main">
            {{ option.data.label }}
          </div>
          <div class="truncate text-11px text-secondary">
            {{
              option.data.role ||
              option.data.department ||
              option.data.email ||
              '成员'
            }}
          </div>
        </div>
      </div>
    </template>
  </a-select>
</template>
