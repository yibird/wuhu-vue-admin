<template>
  <a-popover
    v-model:open="open"
    :show-arrow="false"
    placement="bottomLeft"
    :trigger="['click']"
  >
    <button
      type="button"
      data-agent-tool-trigger
      class="h-34 inline-flex items-center gap-6 rounded-full border-1 border-transparent border-solid bg-transparent px-10 text-regular cursor-pointer transition-colors hover:border-color-muted hover:bg-hover hover:text-main disabled:cursor-not-allowed disabled:text-disabled max-sm:w-34 max-sm:justify-center max-sm:px-0"
      :disabled="disabled"
    >
      <Icon name="i-lucide:wrench" :size="16" />
      <span>工具</span>
      <span
        class="h-18 min-w-18 inline-flex items-center justify-center rounded-full bg-fill-tertiary px-5 text-11px text-secondary"
      >
        {{ enabledTools.length }}
      </span>
      <Icon name="i-lucide:chevron-down" :size="16" />
    </button>

    <template #content>
      <div class="w-280 flex flex-col gap-4 p-8">
        <label
          v-for="tool in tools"
          :key="tool.key"
          class="min-h-46 flex items-center justify-between gap-10 rounded-7 p-8 transition-colors hover:bg-hover"
        >
          <span class="min-w-0 flex items-start gap-8">
            <Icon
              :name="tool.icon"
              :size="16"
              class="mt-2 shrink-0 text-main"
            />
            <span class="min-w-0">
              <strong class="block truncate text-13px text-main font-500">
                {{ tool.label }}
              </strong>
              <small class="mt-2 block truncate text-xs text-secondary">
                {{ tool.desc ?? '按需开启该能力' }}
              </small>
            </span>
          </span>
          <a-switch
            :checked="tool.enabled"
            :data-agent-tool-switch="tool.key"
            :disabled="disabled"
            size="small"
            @change="emit('toggle', { key: tool.key, enabled: !!$event })"
          />
        </label>
      </div>
    </template>
  </a-popover>
</template>

<script setup lang="ts">
import type { AgentTool } from '../types'

const props = withDefaults(
  defineProps<{
    tools?: AgentTool[]
    disabled?: boolean
  }>(),
  {
    tools: () => [],
    disabled: false,
  }
)

const emit = defineEmits<{
  toggle: [payload: { key: string; enabled: boolean }]
}>()

const open = shallowRef(false)
const enabledTools = computed(() => props.tools.filter((item) => item.enabled))
</script>
