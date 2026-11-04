<template>
  <a-button
    v-bind="$attrs"
    :loading="loading || Boolean(attrs.loading)"
    @click="onClick"
  >
    <slot />
  </a-button>
</template>

<script lang="ts" setup>
import { ref, useAttrs } from 'vue'

defineOptions({
  name: 'ActionButton',
  inheritAttrs: false,
})

type ClickHandler = (event: MouseEvent) => unknown

const attrs = useAttrs()
const loading = ref(false)

const onClick = async (event: MouseEvent) => {
  if (loading.value || attrs.loading) return

  const handlers = Array.isArray(attrs.onClick)
    ? attrs.onClick
    : [attrs.onClick]
  const validHandlers = handlers.filter(
    (handler): handler is ClickHandler => typeof handler === 'function'
  )
  if (!validHandlers.length) return
  loading.value = true
  try {
    for (const handler of validHandlers) {
      await handler(event)
    }
  } finally {
    loading.value = false
  }
}
</script>
