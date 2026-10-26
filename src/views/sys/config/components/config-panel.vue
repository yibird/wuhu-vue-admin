<template>
  <section class="h-full min-h-0 flex flex-col">
    <header class="shrink-0 b-b-1-regular">
      <div
        class="mx-auto max-w-960 flex items-center gap-12 px-20 py-16 sm:px-10"
      >
        <span
          class="size-42 flex shrink-0 items-center justify-center rounded-8 bg-primary/10 text-primary"
        >
          <Icon :name="icon" :size="20" />
        </span>
        <div class="min-w-0">
          <h2 class="text-lg text-main font-700">{{ title }}</h2>
          <p class="mt-3 text-sm text-secondary">{{ description }}</p>
        </div>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-y-auto">
      <div class="mx-auto max-w-960 p-20 sm:px-10">
        <slot />
      </div>
      <div class="flex-center gap-12">
        <a-button danger @click="emits('reset')">恢复默认</a-button>
        <a-button type="primary" @click="emits('save')">
          <template #icon>
            <Icon name="i-lucide:save" :size="16" />
          </template>
          保存配置
        </a-button>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
}>()

const emits = defineEmits<{
  save: []
  reset: []
}>()
</script>
