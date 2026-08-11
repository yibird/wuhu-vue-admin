<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'
import TaskCenterDetail from './components/TaskCenterDetail.vue'
import TaskCenterFilters from './components/TaskCenterFilters.vue'
import TaskCenterList from './components/TaskCenterList.vue'
import TaskCenterStats from './components/TaskCenterStats.vue'
import TaskCreateModal from './components/TaskCreateModal.vue'
import { useTaskCenter } from './composables/useTaskCenter'

const show = defineModel('show', { default: false })
const isNarrowScreen = useMediaQuery('(max-width: 768px)')
const drawerSize = computed(() => (isNarrowScreen.value ? '100%' : 960))

const {
  activeTask,
  activeTaskId,
  cancelTask,
  clearFinishedTasks,
  copyTaskInfo,
  createModalOpen,
  createTask,
  deleteTask,
  filteredTasks,
  formState,
  hasFinishedTasks,
  keyword,
  openCreateModal,
  pauseTask,
  resetFilters,
  resumeTask,
  retryTask,
  selectTask,
  statusFilter,
  stats,
  timeFilter,
  typeFilter,
} = useTaskCenter(show)
</script>

<template>
  <a-drawer
    v-model:open="show"
    title="任务中心"
    :size="drawerSize"
    placement="right"
    closable
    :classes="{ body: 'p-0! overflow-hidden!' }"
  >
    <div class="h-full min-h-0 overflow-hidden bg-page">
      <div class="h-full min-h-0 flex flex-col gap-12 p-14 max-sm:p-10">
        <TaskCenterStats :stats="stats" />

        <TaskCenterFilters
          v-model:keyword="keyword"
          v-model:status="statusFilter"
          v-model:type="typeFilter"
          v-model:time="timeFilter"
          :has-finished-tasks="hasFinishedTasks"
          @clear-finished="clearFinishedTasks"
          @create="openCreateModal"
          @reset="resetFilters"
        />

        <Scrollbar
          class="min-h-0 flex-1"
          content-class="min-h-full grid grid-cols-[360px_minmax(0,1fr)] gap-12 max-lg:grid-cols-1 max-lg:grid-rows-[minmax(280px,40vh)_minmax(420px,1fr)]"
        >
          <TaskCenterList
            :active-task-id="activeTaskId"
            :items="filteredTasks"
            @select="selectTask"
          />
          <TaskCenterDetail
            :task="activeTask"
            @cancel="cancelTask"
            @copy="copyTaskInfo"
            @delete="deleteTask"
            @pause="pauseTask"
            @resume="resumeTask"
            @retry="retryTask"
          />
        </Scrollbar>
      </div>
    </div>

    <TaskCreateModal
      v-model:open="createModalOpen"
      v-model:form-state="formState"
      @submit="createTask"
    />
  </a-drawer>
</template>
