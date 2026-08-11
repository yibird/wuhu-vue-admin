<template>
  <a-popover
    v-model:open="open"
    :show-arrow="false"
    placement="bottomLeft"
    :trigger="['click']"
  >
    <button
      type="button"
      data-agent-model-trigger
      class="h-34 max-w-220 inline-flex items-center gap-6 rounded-full border-1 border-transparent border-solid bg-transparent px-10 text-regular cursor-pointer transition-colors hover:border-color-muted hover:bg-hover hover:text-main max-sm:w-34 max-sm:px-0 max-sm:justify-center"
      :class="!selectedModel ? 'cursor-not-allowed text-disabled' : ''"
      :disabled="disabled || !selectedModel"
    >
      <Icon name="i-lucide:cpu" :size="16" />
      <span class="truncate text-13px max-sm:hidden">
        {{ selectedModel?.name ?? '选择模型' }}
      </span>
      <span
        v-if="selectedModel"
        class="shrink-0 rounded-full bg-fill-tertiary px-5 py-1 text-11px text-secondary max-sm:hidden"
      >
        {{ selectedModel.type }}
      </span>
      <Icon name="i-lucide:chevron-down" :size="16" class="max-sm:hidden" />
    </button>

    <template #content>
      <div class="w-280 p-8">
        <a-input
          v-model:value="keyword"
          allow-clear
          placeholder="搜索模型"
          size="small"
        />
        <Scrollbar class="mt-8 max-h-260">
          <div
            v-if="filteredModels.length === 0"
            class="min-h-96 flex flex-col items-center justify-center gap-6 text-center text-secondary"
          >
            <Icon name="i-lucide:circle-alert" :size="20" />
            <span class="text-xs">暂无可用模型</span>
          </div>
          <button
            v-for="item in filteredModels"
            :key="item.id"
            type="button"
            :data-agent-model-option="item.id"
            class="w-full flex items-center justify-between gap-10 rounded-7 border-0 bg-transparent p-9 text-left cursor-pointer transition-colors hover:bg-hover"
            :class="{ 'bg-hover': item.id === selectedModel?.id }"
            @click="selectModel(item.id)"
          >
            <span class="min-w-0">
              <strong class="block truncate text-13px text-main">
                {{ item.name }}
              </strong>
              <small class="mt-2 block truncate text-xs text-secondary">
                {{ item.desc }}
              </small>
              <span class="mt-5 flex flex-wrap items-center gap-5">
                <span
                  v-if="item.context"
                  class="rounded-full bg-fill-tertiary px-6 py-2 text-11px text-secondary"
                >
                  {{ item.context }}
                </span>
                <span
                  v-if="item.speed"
                  class="rounded-full bg-fill-tertiary px-6 py-2 text-11px text-secondary"
                >
                  {{ item.speed }}
                </span>
              </span>
            </span>
            <span class="shrink-0 text-11px text-secondary">
              {{ item.type }}
            </span>
          </button>
        </Scrollbar>
      </div>
    </template>
  </a-popover>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { AgentModel } from '../types'

const props = withDefaults(
  defineProps<{
    model?: AgentModel
    models?: AgentModel[]
    disabled?: boolean
  }>(),
  {
    models: () => [],
    disabled: false,
  }
)

const emit = defineEmits<{
  select: [id: string]
}>()

const open = shallowRef(false)
const keyword = shallowRef('')

const selectedModel = computed(() => props.model ?? props.models[0])
const filteredModels = computed(() => {
  const value = keyword.value.trim().toLowerCase()
  if (!value) return props.models
  return props.models.filter((item) =>
    [item.name, item.desc, item.type]
      .filter(Boolean)
      .some((text) => text.toLowerCase().includes(value))
  )
})

function selectModel(id: string) {
  if (!props.models.some((item) => item.id === id)) return

  emit('select', id)
  keyword.value = ''
  open.value = false
}
</script>
