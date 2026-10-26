<template>
  <button
    type="button"
    class="size-34 inline-flex items-center justify-center rounded-full b-1-transparent bg-transparent text-regular cursor-pointer transition-colors hover:(border-muted bg-hover text-main) disabled:(cursor-not-allowed text-disabled)"
    title="优化提示词"
    :disabled="disabled"
    @click="emits('optimize', prompt)"
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

const emits = defineEmits<{
  optimize: [prompt: string]
}>()
</script>
