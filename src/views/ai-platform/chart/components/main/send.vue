<template>
  <button
    type="button"
    data-agent-send-action
    data-testid="agent-send-button"
    class="size-36 inline-flex items-center justify-center rounded-full border-0 bg-[rgb(var(--w-text-main))] text-white cursor-pointer transition-[transform,colors] hover:(-translate-y-1 bg-[rgb(var(--w-text-regular))]) disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-fill disabled:text-placeholder"
    :data-agent-send-state="loading ? 'stop' : 'send'"
    :disabled="disabled && !loading"
    :aria-label="loading ? '停止生成' : '发送消息'"
    :title="loading ? '停止生成' : '发送'"
    @click="loading ? emit('stop') : emit('send')"
  >
    <Icon
      :name="loading ? 'i-lucide:square' : 'i-lucide:arrow-up'"
      :size="loading ? 16 : 22"
    />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    disabled: false,
    loading: false,
  }
)

const emit = defineEmits<{
  send: []
  stop: []
}>()
</script>
