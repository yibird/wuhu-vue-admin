<script setup lang="ts">
import { computed } from 'vue'
import { Motion, MotionConfig } from 'motion-v'
import type { SiderEmits, SiderProps } from './types'
import Dropdown from './Dropdown.vue'

const props = withDefaults(defineProps<SiderProps>(), {
  loading: false,
})
const emit = defineEmits<SiderEmits>()
const keyword = shallowRef('')
const itemHover = { x: 2 }
const itemPress = { scale: 0.98 }
const itemTransition = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 24,
  mass: 0.45,
}

const visibleDictionaries = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase()
  if (!normalizedKeyword) return props.data

  return props.data.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedKeyword) ||
      item.type.toLowerCase().includes(normalizedKeyword)
  )
})
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden bg-white">
    <div class="shrink-0 border-b-1 border-color-1 border-b-solid p-12">
      <div class="flex items-center gap-8">
        <a-input
          v-model:value="keyword"
          allow-clear
          class="min-w-0"
          placeholder="搜索字典名称或编码"
        >
          <template #prefix>
            <Icon name="i-lucide:search" class="text-muted" :size="16" />
          </template>
        </a-input>
        <a-button type="primary" title="新建字典" @click="emit('create')">
          <template #icon><Icon name="i-lucide:plus" /></template>
        </a-button>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto p-8">
      <a-spin :spinning="loading">
        <MotionConfig reduced-motion="user">
          <div
            v-if="visibleDictionaries.length"
            class="flex flex-col gap-4"
            role="list"
            aria-label="字典列表"
          >
            <Motion
              v-for="item in visibleDictionaries"
              :key="item.id"
              as="div"
              :while-hover="itemHover"
              :while-press="itemPress"
              :transition="itemTransition"
              class="group min-h-56 flex items-center gap-8 rounded-6 px-10 py-8 transition-[background-color,color] duration-motion-base"
              :class="
                item.id === selectedId
                  ? 'bg-primary/10 text-primary'
                  : 'text-main hover:bg-hover'
              "
              role="listitem"
            >
              <button
                type="button"
                class="min-w-0 flex-1 flex items-center gap-8 text-left"
                :aria-current="item.id === selectedId ? 'true' : undefined"
                @click="emit('select', item)"
              >
                <span
                  class="size-30 shrink-0 flex items-center justify-center rounded-5"
                  :class="
                    item.id === selectedId
                      ? 'bg-primary text-white'
                      : 'bg-fill-quaternary text-secondary'
                  "
                >
                  <Icon name="i-lucide:book-type" :size="16" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-500">{{
                    item.name
                  }}</span>
                  <span class="mt-2 block truncate text-xs text-muted">{{
                    item.type
                  }}</span>
                </span>
                <a-tag v-if="!item.status" bordered color="default">
                  停用
                </a-tag>
              </button>
              <Dropdown
                :item="item"
                class="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                @delete="emit('delete', $event)"
                @edit="emit('edit', $event)"
              />
            </Motion>
          </div>
          <a-empty v-else class="py-80" description="暂无字典" />
        </MotionConfig>
      </a-spin>
    </div>
  </div>
</template>
