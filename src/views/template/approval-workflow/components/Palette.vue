<script setup lang="ts">
import type { ApprovalPaletteItem, ApprovalTemplateItem } from '../types'

defineProps<{
  palette: readonly ApprovalPaletteItem[]
  templates: readonly ApprovalTemplateItem[]
}>()

const emit = defineEmits<{
  add: [item: ApprovalPaletteItem]
  applyTemplate: [id: string]
}>()

const activePaletteTab = shallowRef<'components' | 'templates'>('components')
const paletteTabOptions = [
  { label: '审批组件', value: 'components' },
  { label: '流程模板', value: 'templates' },
]
</script>

<template>
  <aside
    class="min-h-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
  >
    <header class="border-b border-color-2 px-12 py-10">
      <h2 class="m-0 text-14px font-700 text-primary">审批组件</h2>
      <p class="m-0 mt-3 text-12px text-secondary">
        参考钉钉审批节点能力，点击插入到当前节点后
      </p>
    </header>

    <div class="min-h-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
      <div class="px-12 py-10">
        <a-segmented
          v-model:value="activePaletteTab"
          :options="paletteTabOptions"
          block
        />
      </div>

      <Scrollbar
        v-if="activePaletteTab === 'components'"
        class="min-h-0"
        content-class="p-12"
      >
        <div class="grid gap-10">
          <a-button
            v-for="item in palette"
            :key="item.type"
            class="h-auto min-h-58 w-full grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-10 rounded-8 border-1 border-color-2 border-solid bg-container p-10 text-left transition hover:(border-primary bg-hover)"
            @click="emit('add', item)"
          >
            <span
              class="size-32 flex items-center justify-center rounded-8 text-white"
              :style="{ backgroundColor: item.accent }"
            >
              <Icon :name="item.icon" :size="16" />
            </span>
            <span class="min-w-0">
              <strong class="block truncate text-13px text-primary">{{
                item.title
              }}</strong>
              <small class="mt-2 block truncate text-11px text-secondary">
                {{ item.description }}
              </small>
            </span>
            <Icon name="i-lucide:plus" :size="15" class="text-tertiary" />
          </a-button>
        </div>
      </Scrollbar>

      <Scrollbar v-else class="min-h-0" content-class="p-12">
        <div class="grid gap-8">
          <a-button
            v-for="template in templates"
            :key="template.id"
            class="block h-auto min-h-70 w-full rounded-8 border-1 border-color-2 border-solid bg-container p-10 text-left hover:(border-primary bg-hover)"
            @click="emit('applyTemplate', template.id)"
          >
            <div class="flex items-center gap-7">
              <span
                class="size-26 inline-flex items-center justify-center rounded-7 bg-primary/10 text-primary"
              >
                <Icon :name="template.icon" :size="15" />
              </span>
              <strong class="text-12px text-primary">{{
                template.title
              }}</strong>
            </div>
            <p
              class="m-0 mt-5 line-clamp-2 text-11px text-secondary leading-16px"
            >
              {{ template.description }}
            </p>
          </a-button>
        </div>
      </Scrollbar>
    </div>
  </aside>
</template>
