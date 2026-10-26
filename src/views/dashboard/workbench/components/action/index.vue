<template>
  <ActionSkeleton v-if="loading" />
  <section v-else class="page-enter page-enter--5 min-w-0">
    <a-border-beam :duration="6" :line-width="3">
      <Card class="shadow-none!" :styles="{ body: { padding: 0 } }">
        <template #title>
          <span class="text-base text-main font-700">快捷操作</span>
        </template>
        <template #extra>
          <a-button type="link" size="small" @click="managerOpen = true">
            管理
          </a-button>
        </template>

        <div
          class="grid grid-cols-2 gap-8 p-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <button
            v-for="item in items"
            :key="item.id"
            type="button"
            class="group min-w-0 rounded-8 b-1-secondary bg-container p-12 text-left outline-none transition-all hover:(-translate-y-1 border-primary bg-primary/5 shadow-sm) active:translate-y-0"
            @click="handleActionClick(item)"
          >
            <span
              class="size-34 flex items-center justify-center rounded-8 transition-transform duration-200 group-hover:scale-108"
              :class="[item.tone, item.text]"
            >
              <Icon :name="item.icon" :size="18" />
            </span>
            <span class="mt-10 block truncate text-sm text-main font-600">
              {{ item.name }}
            </span>
            <span class="mt-4 block truncate text-xs text-secondary">
              {{ item.desc }}
            </span>
          </button>

          <button
            type="button"
            class="group min-w-0 rounded-8 b-dashed-1-regular bg-container p-12 text-left outline-none transition-[border-color,background-color,box-shadow,transform] duration-200 hover:(-translate-y-1 border-primary bg-hover shadow-sm) focus-visible:(border-primary ring-2 ring-primary/12) active:translate-y-0"
            @click="managerOpen = true"
          >
            <span
              class="size-34 flex items-center justify-center rounded-8 bg-muted text-secondary transition-transform duration-200 group-hover:(rotate-90 scale-108)"
            >
              <Icon name="i-lucide:plus" :size="18" />
            </span>
            <span class="mt-10 block truncate text-sm text-main font-600">
              添加入口
            </span>
            <span class="mt-4 block truncate text-xs text-secondary">
              自定义常用操作
            </span>
          </button>
        </div>
      </Card>
    </a-border-beam>
  </section>

  <QuickActionManagerModal
    v-model:open="managerOpen"
    v-model:selected-ids="selectedActionIds"
    :actions="workbenchActions"
  />
</template>

<script lang="ts" setup>
import { useTabs } from '@/hooks'
import { Card } from '@/components/card'
import { defaultWorkbenchActionIds, workbenchActions } from './data.ts'
import ActionSkeleton from './skeleton.vue'
import QuickActionManagerModal from './modal.vue'
import type { WorkbenchAction } from './types.ts'

const { loading = false } = defineProps<{
  loading?: boolean
}>()

const emits = defineEmits<{
  createProject: []
}>()

const { openTabByPath } = useTabs()
const managerOpen = shallowRef(false)
const selectedActionIds = shallowRef<WorkbenchAction['id'][]>([
  ...defaultWorkbenchActionIds,
])

const items = computed(() => {
  const selected = new Set(selectedActionIds.value)
  return workbenchActions.filter((item) => selected.has(item.id))
})

async function handleActionClick(item: WorkbenchAction) {
  if (item.action === 'create-project') {
    emits('createProject')
    return
  }

  if (item.path) {
    await openTabByPath(item.path)
  }
}
</script>
