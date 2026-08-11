<template>
  <button
    type="button"
    class="size-34 inline-flex items-center justify-center rounded-full border-1 border-transparent border-solid bg-transparent text-regular cursor-pointer transition-colors hover:border-color-muted hover:bg-hover hover:text-main disabled:cursor-not-allowed disabled:text-disabled"
    title="优化提示词"
    :disabled="disabled"
    @click="emit('optimize', prompt)"
  >
    <Icon name="i-lucide:sparkles" :size="18" />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    prompt?: string
    disabled?: boolean
  }>(),
  {
    prompt: '',
    disabled: false,
  }
)

const emit = defineEmits<{
  optimize: [prompt: string]
}>()
</script>
