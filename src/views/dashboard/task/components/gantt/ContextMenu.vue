<script lang="ts" setup>
import { computed } from 'vue'
import { getTaskDueMeta } from '../../constants'
import type { Task } from '../types'
import type { TaskGanttMenuPosition } from './utils'
import { taskProgress } from './utils'

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
const emit = defineEmits<Emits>()

const menuStyle = computed(() => ({
  transform: `translate3d(${props.position.x}px, ${props.position.y}px, 0)`,
}))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && task"
      class="fixed left-0 top-0 z-3000 w-188 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container p-5 shadow-[0_18px_50px_rgb(15_23_42_/_22%)] will-change-transform"
      :style="menuStyle"
      role="menu"
      @click.stop
      @contextmenu.prevent
    >
      <div class="border-b-1 border-b-color-1 border-b-solid px-8 py-7">
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
        @click="emit('edit')"
      >
        <Icon name="i-lucide:pencil" :size="15" />
        编辑任务
      </button>
      <button
        class="h-34 w-full flex items-center gap-8 rounded-6 border-0 bg-transparent px-9 text-left text-13px text-main cursor-pointer transition-colors hover:bg-hover"
        type="button"
        role="menuitem"
        @click="emit('duplicate')"
      >
        <Icon name="i-lucide:copy-plus" :size="15" />
        复制任务
      </button>
      <button
        class="h-34 w-full flex items-center gap-8 rounded-6 border-0 bg-transparent px-9 text-left text-13px text-main cursor-pointer transition-colors hover:bg-hover"
        type="button"
        role="menuitem"
        @click="emit('markDone')"
      >
        <Icon name="i-lucide:circle-check" :size="15" />
        标记完成
      </button>
      <div class="my-4 h-1px bg-fill-tertiary" />
      <button
        class="h-34 w-full flex items-center gap-8 rounded-6 border-0 bg-transparent px-9 text-left text-13px text-error cursor-pointer transition-colors hover:bg-error-tint"
        type="button"
        role="menuitem"
        @click="emit('delete')"
      >
        <Icon name="i-lucide:trash-2" :size="15" />
        删除任务
      </button>
    </div>
  </Teleport>
</template>
