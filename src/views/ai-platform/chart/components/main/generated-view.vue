<script lang="ts" setup>
import { JSONUIProvider, Renderer } from '@json-render/vue'
import { registry } from '../../json-render/registry'
import { parseRenderSpec } from '../../json-render/spec'

const props = defineProps<{
  raw: string
  pending?: boolean
}>()

const emit = defineEmits<{
  (e: 'ask', prompt: string): void
}>()

const result = computed(() => parseRenderSpec(props.raw))

const handlers = {
  ask: (params: Record<string, unknown>) => {
    const prompt = typeof params.prompt === 'string' ? params.prompt.trim() : ''
    if (prompt) emit('ask', prompt)
  },
}
</script>

<template>
  <div
    v-if="pending"
    class="rounded-12 border-1 border-color-2 border-solid bg-container p-14"
  >
    <div class="h-16 w-120 animate-pulse rounded-4 bg-fill-tertiary" />
    <div class="mt-10 h-160 w-full animate-pulse rounded-8 bg-fill-tertiary" />
  </div>

  <JSONUIProvider
    v-else-if="result.spec"
    :registry="registry"
    :handlers="handlers"
  >
    <Renderer :spec="result.spec" :registry="registry" />
  </JSONUIProvider>

  <div
    v-else
    class="rounded-12 border-1 border-color-2 border-solid bg-container overflow-hidden"
  >
    <div class="px-12 py-7 text-12px text-error">
      {{ result.error || '视图内容为空' }}
    </div>
    <pre
      class="m-0 max-h-240 overflow-auto bg-[rgb(15_23_42)] p-12 text-12px text-white leading-20px"
    ><code>{{ raw }}</code></pre>
  </div>
</template>
