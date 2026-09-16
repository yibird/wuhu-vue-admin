<template>
  <div class="h-full min-h-0 flex flex-col overflow-x-hidden overflow-hidden">
    <div class="shrink-0 px-12 pt-12">
      <a-input v-model:value="keyword" placeholder="搜索组件" allow-clear>
        <template #prefix>
          <Icon name="i-lucide:search" :size="14" class="text-muted" />
        </template>
      </a-input>
    </div>

    <Scrollbar class="min-h-0 flex-1" :options="{ overflow: { x: 'hidden' } }">
      <div class="min-w-0 grid gap-4 p-12">
        <section
          v-for="group in filteredGroups"
          :key="group.category"
          class="grid gap-6"
        >
          <button
            class="flex-between-center w-full cursor-pointer border-0 bg-transparent px-4 py-6 text-sm text-secondary"
            type="button"
            @click="toggleCategory(group.category)"
          >
            <span class="font-600">{{ group.category }}</span>
            <Icon
              :name="
                collapsed.has(group.category)
                  ? 'i-lucide:chevron-right'
                  : 'i-lucide:chevron-down'
              "
              :size="16"
            />
          </button>
          <div
            v-if="!collapsed.has(group.category)"
            class="grid grid-cols-2 gap-6"
          >
            <button
              v-for="item in group.items"
              :key="item.definition.type"
              class="lc-palette-item"
              type="button"
              :draggable="true"
              :title="item.definition.description"
              @click="addToCanvas(item.definition.type)"
              @dragstart="onDragStart(item.definition.type, $event)"
              @dragend="endPaletteDrag"
            >
              <span class="lc-palette-item__icon">
                <Icon
                  :name="item.definition.icon ?? 'i-lucide:box'"
                  :size="16"
                />
              </span>
              <span class="lc-palette-item__title">{{
                item.definition.title
              }}</span>
              <span
                v-if="item.definition.kind === 2"
                class="lc-palette-item__badge"
                >物料</span
              >
            </button>
          </div>
        </section>
        <a-empty
          v-if="!filteredGroups.length"
          :image="Empty.PRESENTED_IMAGE_SIMPLE"
          description="未找到组件"
        />
      </div>
    </Scrollbar>
  </div>
</template>

<script setup lang="ts">
import { Empty } from 'antdv-next'
import { computed, ref } from 'vue'
import { Icon, Scrollbar } from '@/components'
import { MATERIAL_CATEGORY_ORDER } from '../../core/materials'
import { componentRegistry, registryVersion } from '../../core/registry'
import type { RegisteredComponent } from '../../core/registry'
import {
  endPaletteDrag,
  startPaletteDrag,
  useDesignerContext,
} from '../../composables'

const designer = useDesignerContext()
const keyword = ref('')
const collapsed = ref(new Set<string>())

const groups = computed(() => {
  registryVersion.value
  const groupMap = new Map<string, RegisteredComponent[]>()
  for (const item of componentRegistry.list()) {
    const list = groupMap.get(item.definition.category) ?? []
    list.push(item)
    groupMap.set(item.definition.category, list)
  }
  return [...groupMap.entries()]
    .map(([category, items]) => ({ category, items }))
    .sort(
      (a, b) =>
        MATERIAL_CATEGORY_ORDER.indexOf(a.category) -
        MATERIAL_CATEGORY_ORDER.indexOf(b.category)
    )
})

const filteredGroups = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  if (!text) return groups.value
  return groups.value
    .map((group) => ({
      category: group.category,
      items: group.items.filter(
        (item) =>
          item.definition.title.toLowerCase().includes(text) ||
          item.definition.type.toLowerCase().includes(text) ||
          item.definition.description?.toLowerCase().includes(text)
      ),
    }))
    .filter((group) => group.items.length > 0)
})

function toggleCategory(category: string) {
  const next = new Set(collapsed.value)
  if (next.has(category)) next.delete(category)
  else next.add(category)
  collapsed.value = next
}

function onDragStart(type: string, event: DragEvent) {
  startPaletteDrag(type, event)
}

function addToCanvas(type: string) {
  designer.addNode(type)
}
</script>

<style scoped lang="less">
.lc-palette-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  padding: 10px;
  overflow: hidden;
  cursor: grab;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
  transition:
    border-color var(--w-motion-duration-fast, 0.15s) ease,
    box-shadow var(--w-motion-duration-fast, 0.15s) ease,
    transform var(--w-motion-duration-fast, 0.15s) ease;

  &:hover {
    border-color: rgb(var(--w-color-primary) / 50%);
    box-shadow: var(--w-shadow-elevated);
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
  }
}

.lc-palette-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-bg-primary) / 8%);
  border-radius: 6px;
}

.lc-palette-item__title {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: rgb(var(--w-text-regular));
  white-space: nowrap;
}

.lc-palette-item__badge {
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 0 4px;
  font-size: 10px;
  line-height: 14px;
  color: rgb(var(--w-color-warning));
  background: rgb(var(--w-bg-warning) / 12%);
  border-radius: 3px;
}
</style>
