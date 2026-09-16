<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
}>()

const emit = defineEmits<{
  save: []
  reset: []
}>()
</script>

<template>
  <section class="h-full min-h-0 flex flex-col">
    <header class="shrink-0 border-b-1 border-b-solid border-color-2">
      <div
        class="mx-auto max-w-960 flex items-center gap-12 px-2 py-16 sm:px-4"
      >
        <span
          class="size-42 flex shrink-0 items-center justify-center rounded-8 bg-primary-tint text-primary"
        >
          <Icon :name="icon" :size="20" />
        </span>
        <div class="min-w-0">
          <h2 class="m-0 text-lg text-main font-700">{{ title }}</h2>
          <p class="m-0 mt-3 text-sm text-secondary">{{ description }}</p>
        </div>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-y-auto">
      <div class="mx-auto max-w-960 px-2 py-20 sm:px-4">
        <slot />
      </div>
      <div class="flex-center gap-12">
        <a-button danger @click="emit('reset')">恢复默认</a-button>
        <a-button type="primary" @click="emit('save')">
          <template #icon>
            <Icon name="i-lucide:save" :size="16" />
          </template>
          保存配置
        </a-button>
      </div>
    </main>
  </section>
</template>
