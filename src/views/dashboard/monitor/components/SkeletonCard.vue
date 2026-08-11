<script setup lang="ts">
withDefaults(
  defineProps<{
    bodyClass?: string
  }>(),
  {
    bodyClass: undefined,
  }
)
</script>

<template>
  <div
    class="overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container shadow-[var(--w-shadow-card)]"
  >
    <div
      class="min-h-52 flex items-center justify-between gap-10 border-b-1 border-b-solid border-color-2 px-16 py-12"
    >
      <div class="min-w-0 flex items-center gap-10">
        <a-skeleton-avatar active shape="square" class="!rounded-8" />
        <div class="min-w-0">
          <a-skeleton-input active size="small" class="!w-104" />
          <a-skeleton-input active size="small" class="!mt-6 !w-150" />
        </div>
      </div>
      <a-skeleton-button active size="small" class="!w-76" />
    </div>

    <div :class="bodyClass ?? 'p-16'">
      <slot />
    </div>
  </div>
</template>
