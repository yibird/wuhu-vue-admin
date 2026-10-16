<script setup lang="ts">
import type { ApprovalFieldPermission, FieldPermissionMode } from '../types'

defineProps<{
  fields: readonly ApprovalFieldPermission[]
  options: readonly { label: string; value: FieldPermissionMode }[]
}>()

const emit = defineEmits<{
  update: [field: ApprovalFieldPermission, value: FieldPermissionMode]
}>()
</script>

<template>
  <div class="mt-12 rounded-7 bg-fill p-10">
    <strong class="text-12px text-primary">字段权限</strong>
    <div
      v-for="field in fields"
      :key="field.field"
      class="mt-8 grid grid-cols-[minmax(0,1fr)_112px] items-center gap-8"
    >
      <span class="truncate text-12px text-secondary">{{ field.label }}</span>
      <a-select
        size="small"
        :value="field.mode"
        :options="options"
        @change="(value: FieldPermissionMode) => emit('update', field, value)"
      />
    </div>
  </div>
</template>
