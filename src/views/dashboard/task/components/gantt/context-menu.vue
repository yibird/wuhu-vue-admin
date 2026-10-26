<template>
  <Teleport to="body">
    <div
      v-if="open && task"
      class="fixed left-0 top-0 z-3000 w-188 overflow-hidden rounded-8 b-1-regular bg-container p-5 shadow-2xl shadow-ink/22 will-change-transform"
      :style="menuStyle"
      role="menu"
      @click.stop
      @contextmenu.prevent
    >
      <div class="b-b-1-muted px-8 py-7">
        <div class="truncate text-sm font-600 text-main">
          {{ task.title }}
        </div>
        <div class="mt-2 text-xs text-secondary">
          {{ taskProgress(task) }}% ·
          {{ getTaskDueMeta(task.dueDate, task.status).fullText }}
        </div>
      </div>

      <button
        class="mt-4 h-34 w-full flex items-center gap-8 rounded-6 border-0 bg-transparent px-9 text-left text-13px text-main cursor-pointer transition-colors hover:bg-hover"
        type="button"
        role="menuitem"
        @click="emits('edit')"
      >
        <Icon name="i-lucide:pencil" :size="15" />
        编辑任务
      </button>
      <button
        class="h-34 w-full flex items-center gap-8 rounded-6 border-0 bg-transparent px-9 text-left text-13px text-main cursor-pointer transition-colors hover:bg-hover"
        type="button"
        role="menuitem"
        @click="emits('duplicate')"
      >
        <Icon name="i-lucide:copy-plus" :size="15" />
        复制任务
      </button>
      <button
        class="h-34 w-full flex items-center gap-8 rounded-6 border-0 bg-transparent px-9 text-left text-13px text-main cursor-pointer transition-colors hover:bg-hover"
        type="button"
        role="menuitem"
        @click="emits('markDone')"
      >
        <Icon name="i-lucide:circle-check" :size="15" />
        标记完成
      </button>
      <div class="my-4 h-1px bg-muted" />
      <button
        class="h-34 w-full flex items-center gap-8 rounded-6 border-0 bg-transparent px-9 text-left text-13px text-error cursor-pointer transition-colors hover:bg-error/10"
        type="button"
        role="menuitem"
        @click="emits('delete')"
      >
        <Icon name="i-lucide:trash-2" :size="15" />
        删除任务
      </button>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { getTaskDueMeta } from '../../constants'
import { taskProgress } from './utils'
import type { Task } from '../types'
import type { TaskGanttMenuPosition } from './utils'

interface Props {
  readonly open: boolean
  readonly task: Task | null
  readonly position: TaskGanttMenuPosition
}

interface Emits {
  edit: []
  duplicate: []
  markDone: []
  delete: []
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const menuStyle = computed(() => ({
  transform: `translate3d(${props.position.x}px, ${props.position.y}px, 0)`,
}))
</script>
