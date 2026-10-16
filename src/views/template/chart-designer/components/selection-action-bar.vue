<script setup lang="ts">
defineProps<{
  selectedCount: number
}>()

const emit = defineEmits<{
  copy: []
  remove: []
}>()
</script>

<template>
  <div
    class="absolute right-14 top-14 z-20 inline-flex items-center gap-6 rounded-7 border-1 border-white/14 border-solid bg-[rgb(15_23_42_/_82%)] px-8 py-6 text-12px text-white shadow-[0_12px_32px_rgb(0_0_0_/_24%)] backdrop-blur"
  >
    <span class="pr-4 text-white/74">{{ selectedCount }} 已选</span>
    <a-button
      class="chart-selection-icon-button"
      data-chart-selection-action="copy"
      size="small"
      @click.stop="emit('copy')"
    >
      <template #icon>
        <Icon name="i-lucide:copy" :size="14" />
      </template>
    </a-button>
    <a-button
      danger
      class="chart-selection-icon-button"
      data-chart-selection-action="remove"
      size="small"
      @click.stop="emit('remove')"
    >
      <template #icon>
        <Icon name="i-lucide:trash-2" :size="14" />
      </template>
    </a-button>
  </div>
</template>

<style scoped>
.chart-selection-icon-button {
  width: 26px;
  padding-inline: 0;
}
</style>
