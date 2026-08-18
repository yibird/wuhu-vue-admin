<template>
  <WView :full="false" :padding="false" class="bg-page">
    <Scrollbar content-class="min-h-full">
      <Skeleton v-if="isLoading" />
      <div
        v-else
        class="min-h-full min-w-0 w-full p-12 flex flex-col gap-12 overflow-x-hidden lg:p-16"
      >
        <section
          class="workbench-header page-enter page-enter--1 min-w-0 flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between"
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
            <button
              type="button"
              class="size-34 flex items-center justify-center rounded-6 border-1 border-color-2 border-solid bg-container text-regular transition-[border-color,background-color,box-shadow,transform,color] duration-motion-base hover:(border-color-primary bg-hover shadow-all -translate-y-1) active:translate-y-0 disabled:cursor-not-allowed disabled:text-disabled disabled:hover:(border-color-2 bg-container shadow-none translate-y-0)"
              :class="{
                'border-color-primary bg-primary-tint text-primary shadow-all':
                  dragEnabled,
              }"
              :disabled="isMobile"
              :title="isMobile ? '移动端不支持拖拽布局' : '拖拽布局'"
              @click="toggleDrag"
            >
              <Icon
                name="i-lucide:grid-3x3"
                :class="{ 'text-primary': dragEnabled }"
                :size="18"
              />
            </button>
          </div>
        </section>

        <Overview class="workbench-overview page-enter page-enter--2" />

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
                :projects="projects"
                @open-settings="openEditProjectSettings"
              />
              <Dynamic />
              <DataAnalysis />
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
              <Action @create-project="openCreateProjectSettings" />
              <Announcement />
              <Team />
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
import { useMediaQuery } from '@vueuse/core'
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
import Skeleton from './components/Skeleton.vue'
import { initialProjects, workbenchMembers } from './data'
import type {
  Project as WorkbenchProject,
  ProjectSettingsMode,
  ProjectSettingsPayload,
} from './components/types'

const swapy = shallowRef<Swapy>()
const container = useTemplateRef<HTMLDivElement>('container')
const enabled = shallowRef(false)
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
const isMobile = useMediaQuery('(max-width: 767px)')
const { isLoading } = useLoading()
const dragEnabled = computed(() => enabled.value && !isMobile.value)

const setupSwapy = () => {
  if (swapy.value || !container.value || !dragEnabled.value) return

  swapy.value = createSwapy(container.value, { enabled: true })
}

const destroySwapy = () => {
  swapy.value?.destroy()
  swapy.value = undefined
}

const toggleDrag = () => {
  if (isMobile.value) return
  enabled.value = !enabled.value
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

watch(isLoading, (value) => {
  if (!value) {
    setupSwapy()
  }
})
</script>

<style scoped>
.workbench-grid :deep([data-swapy-item]) {
  transition:
    transform var(--w-motion-duration-base) var(--w-motion-ease-standard),
    box-shadow var(--w-motion-duration-base) var(--w-motion-ease-standard),
    border-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.workbench-grid--drag :deep([data-swapy-item]) {
  cursor: grab;
  outline: 1px dashed rgb(var(--w-color-primary) / 22%);
  outline-offset: 3px;
}

.workbench-grid--drag :deep([data-swapy-item]:active) {
  cursor: grabbing;
}
</style>
