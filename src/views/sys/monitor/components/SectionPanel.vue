<template>
  <section
    class="overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container shadow-[var(--w-shadow-card)]"
  >
    <header
      class="flex flex-wrap items-center justify-between gap-12 border-b-1 border-b-solid border-color-2 px-14 py-13 sm:px-16"
    >
      <div class="min-w-0 flex items-center gap-10">
        <span
          class="size-32 shrink-0 flex-center rounded-8 bg-primary-tint text-primary"
        >
          <Icon :name="icon" :size="16" />
        </span>
        <div class="min-w-0">
          <h2 class="m-0 truncate text-sm text-main font-700">{{ title }}</h2>
          <p
            v-if="description"
            class="m-0 mt-3 truncate text-xs text-secondary"
          >
            {{ description }}
          </p>
        </div>
      </div>
      <div v-if="$slots.extra" class="shrink-0">
        <slot name="extra" />
      </div>
    </header>
    <div class="p-14 sm:p-16">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    icon: string
    description?: string
  }>(),
  { description: '' }
)
</script>
