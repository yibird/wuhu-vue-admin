<template>
  <div data-swapy-slot="analysis">
    <n-card
      size="small"
      :segmented="{
        content: true,
      }"
      content-class="p-0!"
      data-swapy-item="analysis"
    >
      <template #header>
        <span class="text-md font-bold">数据分析</span>
      </template>
      <div class="min-h-260 flex items-center justify-center">
        <n-empty />
      </div>
    </n-card>
  </div>
</template>
<script lang="ts" setup></script>
