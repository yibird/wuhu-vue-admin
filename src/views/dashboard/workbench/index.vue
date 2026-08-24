<template>
  <WView :full="false" :padding="false" class="bg-page">
    <Scrollbar content-class="min-h-full">
      <div
        class="min-h-full w-full p-12 flex flex-col gap-12 overflow-x-hidden lg:p-16"
      >
        <section
          class="page-enter page-enter--1 flex flex-wrap gap-12 justify-between"
        >
          <div class="min-w-0">
            <div class="mt-6 flex items-center gap-10">
              <h1 class="m-0 text-2md text-main font-700">工作台</h1>
              <span
                v-if="dragEnabled"
                class="rounded-full bg-primary-tint px-8 py-3 text-xs text-primary transition-colors duration-motion-base"
              >
                布局编辑中
              </span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-8">
            <a-button>
              <template #icon>
                <Icon name="i-lucide:calendar-days" :size="16" />
              </template>
              今日任务
            </a-button>
            <a-button type="primary" @click="openCreateProjectSettings">
              <template #icon>
                <Icon name="i-lucide:plus" :size="16" />
              </template>
              新建项目
            </a-button>
            <a-tooltip
              :title="dragEnabled ? '退出布局' : '开启布局'"
              fresh
              placement="bottom"
            >
              <button
                type="button"
                class="size-34 flex items-center justify-center rounded-6 border-1 border-color-2 border-solid bg-container text-regular transition-[border-color,background-color,box-shadow,transform,color] duration-motion-base hover:(border-color-primary bg-hover shadow-all -translate-y-1) active:translate-y-0"
                :class="{
                  'border-color-primary bg-primary-tint text-primary shadow-all':
                    dragEnabled,
                }"
                :aria-label="dragEnabled ? '退出布局' : '开启布局'"
                :aria-pressed="dragEnabled"
                @click="toggleDrag"
              >
                <Icon
                  name="i-lucide:grid-3x3"
                  :class="{ 'text-primary': dragEnabled }"
                  :size="18"
                />
              </button>
            </a-tooltip>
          </div>
        </section>

        <Overview
          :loading="isLoading"
          class="workbench-overview page-enter page-enter--2"
        />

        <div
          ref="container"
          class="workbench-grid min-w-0 [&_[data-swapy-highlighted]]:(bg-primary-tint outline-1 outline-primary outline-dashed)"
          :class="{ 'workbench-grid--drag': dragEnabled }"
        >
          <a-row
            :gutter="[{ xs: 0, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 }, 12]"
          >
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="16"
              :xl="17"
              :xxl="17"
              class="min-w-0 flex flex-col gap-12"
            >
              <Project
                :loading="isLoading"
                :projects="projects"
                @open-settings="openEditProjectSettings"
              />
              <Dynamic :loading="isLoading" />
              <DataAnalysis :loading="isLoading" />
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="8"
              :xl="7"
              :xxl="7"
              class="min-w-0 flex flex-col gap-12"
            >
              <Action
                :loading="isLoading"
                @create-project="openCreateProjectSettings"
              />
              <Announcement :loading="isLoading" />
              <Team :loading="isLoading" />
            </a-col>
          </a-row>
        </div>
      </div>
    </Scrollbar>

    <ProjectSettingsModal
      v-model:open="projectSettingsOpen"
      :mode="projectSettingsMode"
      :project="selectedProject"
      @save="handleProjectSettingsSave"
    />
  </WView>
</template>

<script lang="ts" setup>
import { createSwapy, type Swapy } from 'swapy'
import { useLoading } from '@/composables'
import {
  Overview,
  Project,
  Action,
  Announcement,
  Dynamic,
  Team,
  DataAnalysis,
} from './components'
import ProjectSettingsModal from './components/ProjectSettingsModal.vue'
import { initialProjects, workbenchMembers } from './data'
import type {
  Project as WorkbenchProject,
  ProjectSettingsMode,
  ProjectSettingsPayload,
} from './components/types'

const swapy = shallowRef<Swapy>()
const container = useTemplateRef<HTMLDivElement>('container')
const dragEnabled = shallowRef(false)
const projectSettingsOpen = shallowRef(false)
const projectSettingsMode = shallowRef<ProjectSettingsMode>('create')
const selectedProject = shallowRef<WorkbenchProject | null>(null)
const projects = shallowRef<WorkbenchProject[]>(
  initialProjects.map((project) => ({
    ...project,
    logo: { ...project.logo },
    members: [...project.members],
  }))
)
const { isLoading } = useLoading()

const setupSwapy = () => {
  if (swapy.value || !container.value || !dragEnabled.value) return

  // Animate once on drop; hover swapping repeatedly animates these deep cards.
  swapy.value = createSwapy(container.value, {
    animation: 'dynamic',
    enabled: true,
    swapMode: 'drop',
  })
}

const destroySwapy = () => {
  swapy.value?.destroy()
  swapy.value = undefined
}

const toggleDrag = () => {
  dragEnabled.value = !dragEnabled.value
}

const openCreateProjectSettings = () => {
  selectedProject.value = null
  projectSettingsMode.value = 'create'
  projectSettingsOpen.value = true
}

const openEditProjectSettings = (project: WorkbenchProject) => {
  selectedProject.value = project
  projectSettingsMode.value = 'edit'
  projectSettingsOpen.value = true
}

const handleProjectSettingsSave = (payload: ProjectSettingsPayload) => {
  const currentProject = selectedProject.value
  const status = getProjectPresentation(payload)
  const masterRole = currentProject?.master.split('：')[0] || '项目负责人'
  const project: WorkbenchProject = {
    id: currentProject?.id ?? `project-${Date.now().toString(36)}`,
    logo: { ...payload.logo },
    name: payload.name.trim(),
    describe: payload.describe.trim(),
    master: `${masterRole}：${payload.master.trim()}`,
    createAt: currentProject?.createAt ?? formatProjectDate(),
    dueAt: payload.dueAt,
    progress: payload.progress,
    status: status.label,
    statusClass: status.class,
    members: currentProject?.members ?? workbenchMembers.slice(0, 3),
  }

  projects.value = currentProject
    ? projects.value.map((item) =>
        item.id === currentProject.id ? project : item
      )
    : [project, ...projects.value]
  selectedProject.value = null
}

function getProjectPresentation(payload: ProjectSettingsPayload) {
  if (payload.riskWatch || payload.priority === 'urgent') {
    return { label: '有风险', class: 'bg-error-tint text-error' }
  }
  if (payload.progress >= 80) {
    return { label: '收尾中', class: 'bg-success-tint text-success' }
  }
  if (payload.priority === 'high') {
    return { label: '重点推进', class: 'bg-warning-tint text-warning' }
  }
  if (payload.priority === 'low') {
    return { label: '计划中', class: 'bg-info-tint text-info' }
  }
  return { label: '推进中', class: 'bg-primary-tint text-primary' }
}

function formatProjectDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE').format(date)
}

onMounted(() => {
  if (!isLoading.value) {
    setupSwapy()
  }
})

onBeforeUnmount(() => {
  destroySwapy()
})

watch(dragEnabled, (value) => {
  if (isLoading.value) {
    return
  }

  if (value) {
    setupSwapy()
    return
  }

  destroySwapy()
})

watch(isLoading, async (value) => {
  if (!value) {
    await nextTick()
    setupSwapy()
  }
})
</script>

<style scoped>
.workbench-grid :deep([data-swapy-item]) {
  transition:
    box-shadow var(--w-motion-duration-base) var(--w-motion-ease-standard),
    border-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.workbench-grid--drag :deep([data-swapy-item]) {
  cursor: grab;
  outline: 1px dashed rgb(var(--w-color-primary) / 22%);
  outline-offset: 3px;
}

.workbench-grid--drag :deep([data-swapy-dragging]) {
  z-index: 1001 !important;
  cursor: grabbing;
  transition: none;
  will-change: transform;
}

.workbench-grid--drag :deep([data-swapy-slot]:has(> [data-swapy-dragging])) {
  position: relative;
  z-index: 1000;
}
</style>
