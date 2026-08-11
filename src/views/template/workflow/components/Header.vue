<script setup lang="ts">
defineProps<{
  edgesCount: number
  isRunning: boolean
  nodesCount: number
  sourcePanelOpen: boolean
  title: string
}>()

defineEmits<{
  'copy-schema': []
  'download-schema': []
  'fit-view': []
  'toggle-source': []
  publish: []
  run: []
}>()
</script>

<template>
  <header
    class="min-w-0 grid grid-cols-[minmax(240px,1fr)_auto_auto] items-center gap-14 rounded-12 border-1 border-color-2 border-solid bg-main p-12 shadow-[0_10px_24px_rgb(15_23_42_/_8%)] max-lg:grid-cols-1"
  >
    <div class="min-w-0 flex items-center gap-10">
      <div
        class="size-40 inline-flex shrink-0 items-center justify-center rounded-10 icon-primary-soft"
      >
        <Icon name="i-lucide:git-branch-plus" :size="20" />
      </div>
      <div class="min-w-0 flex flex-col">
        <span class="truncate text-xs text-muted leading-18px">
          JSONSchema 工作流
        </span>
        <strong class="truncate text-17px text-main leading-24px">
          {{ title }}
        </strong>
      </div>
    </div>

    <div class="min-w-0 flex flex-wrap items-center gap-8 max-sm:flex-col">
      <a-button
        size="small"
        class="!h-34 max-sm:w-full"
        @click="$emit('fit-view')"
      >
        <Icon name="i-lucide:scan" :size="16" />
        适配画布
      </a-button>
      <a-button
        size="small"
        class="!h-34 max-sm:w-full"
        :type="sourcePanelOpen ? 'primary' : 'default'"
        @click="$emit('toggle-source')"
      >
        <Icon name="i-lucide:file-json" :size="16" />
        源码
      </a-button>
      <a-button
        size="small"
        class="!h-34 max-sm:w-full"
        @click="$emit('copy-schema')"
      >
        <Icon name="i-lucide:copy" :size="16" />
        复制
      </a-button>
      <a-button
        size="small"
        class="!h-34 max-sm:w-full"
        @click="$emit('download-schema')"
      >
        <Icon name="i-lucide:download" :size="16" />
        导出
      </a-button>
      <a-button
        type="primary"
        size="small"
        class="!h-34 max-sm:w-full"
        :disabled="isRunning"
        @click="$emit('run')"
      >
        <Icon
          :name="isRunning ? 'i-lucide:loader' : 'i-lucide:play'"
          :size="16"
          :class="{ 'animate-spin': isRunning }"
        />
        {{ isRunning ? '运行中' : '运行' }}
      </a-button>
      <a-button
        size="small"
        class="!h-34 max-sm:w-full"
        @click="$emit('publish')"
      >
        <Icon name="i-lucide:rocket" :size="16" />
        发布
      </a-button>
    </div>
  </header>
</template>
