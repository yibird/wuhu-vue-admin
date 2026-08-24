<template>
  <ActionSkeleton v-if="loading" />
  <section
    v-else
    data-swapy-slot="action"
    class="page-enter page-enter--5 min-w-0"
  >
    <a-card :styles="{ body: { padding: 0 } }" data-swapy-item="action">
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
          class="group min-w-0 rounded-8 border-1 border-color-2 border-solid bg-container p-12 text-left outline-none transition-[border-color,background-color,box-shadow,transform] duration-motion-base hover:(-translate-y-1 border-color-primary bg-primary/5 shadow-all-sm) focus-visible:(border-color-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)/12%)]) active:translate-y-0"
          @click="handleActionClick(item)"
        >
          <span
            class="size-34 flex items-center justify-center rounded-8 transition-transform duration-motion-base group-hover:scale-108"
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
          class="group min-w-0 rounded-8 border-1 border-color-2 border-dashed bg-container p-12 text-left outline-none transition-[border-color,background-color,box-shadow,transform] duration-motion-base hover:(-translate-y-1 border-color-primary bg-hover shadow-all-sm) focus-visible:(border-color-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)/12%)]) active:translate-y-0"
          @click="managerOpen = true"
        >
          <span
            class="size-34 flex items-center justify-center rounded-8 bg-fill-tertiary text-secondary transition-transform duration-motion-base group-hover:rotate-90 group-hover:scale-108"
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
    </a-card>
  </section>

  <QuickActionManagerModal
    v-model:open="managerOpen"
    v-model:selected-ids="selectedActionIds"
    :actions="workbenchActions"
  />
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { defaultWorkbenchActionIds, workbenchActions } from '../data'
import ActionSkeleton from './ActionSkeleton.vue'
import QuickActionManagerModal from './QuickActionManagerModal.vue'
import type { WorkbenchAction } from './types'

const { loading = false } = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  createProject: []
}>()

const router = useRouter()
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
    emit('createProject')
    return
  }

  if (item.path) {
    await router.push(item.path)
  }
}
</script>
