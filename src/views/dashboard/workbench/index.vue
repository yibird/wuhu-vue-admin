<template>
  <w-view :full="false" :padding="false" class="bg-page">
    <div class="min-h-full w-full h-full overflow-x-hidden overflow-y-auto">
      <div
        class="page-view min-h-full w-full p-12 flex flex-col gap-12 overflow-x-hidden lg:p-16"
      >
        <section
          class="page-enter page-enter--1 flex flex-wrap gap-12 justify-between"
        >
          <div class="min-w-0">
            <div class="mt-6 flex items-center gap-10">
              <h1 class="m-0 text-2md text-main font-700">工作台</h1>
              <span
                v-if="dragEnabled"
                class="rounded-full bg-primary/10 px-8 py-3 text-xs text-primary transition-colors duration-motion-base"
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
                class="size-34 flex-center rounded-6 b-1-regular bg-container text-regular cursor-pointer transition-[border-color,background-color,box-shadow,transform,color] duration-motion-base hover:(border-primary bg-primary/10 shadow-all -translate-y-1) active:translate-y-0"
                :class="{
                  'border-primary bg-primary/10 text-primary shadow-all':
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
          ref="gridRef"
          class="grid-stack workbench-grid min-w-0"
          :class="{ 'workbench-grid--drag': dragEnabled }"
        >
          <div
            class="grid-stack-item"
            gs-id="project"
            gs-x="0"
            gs-y="0"
            gs-w="8"
          >
            <div class="grid-stack-item-content">
              <Project
                :loading="isLoading"
                :projects="projects"
                @open-settings="openEditProjectSettings"
              />
            </div>
          </div>

          <div
            class="grid-stack-item"
            gs-id="dynamic"
            gs-x="0"
            gs-y="1"
            gs-w="8"
          >
            <div class="grid-stack-item-content">
              <Dynamic :loading="isLoading" />
            </div>
          </div>

          <div
            class="grid-stack-item"
            gs-id="analysis"
            gs-x="0"
            gs-y="2"
            gs-w="8"
          >
            <div class="grid-stack-item-content">
              <DataAnalysis :loading="isLoading" />
            </div>
          </div>

          <div
            class="grid-stack-item"
            gs-id="action"
            gs-x="8"
            gs-y="0"
            gs-w="4"
          >
            <div class="grid-stack-item-content">
              <Action
                :loading="isLoading"
                @create-project="openCreateProjectSettings"
              />
            </div>
          </div>

          <div
            class="grid-stack-item"
            gs-id="announcement"
            gs-x="8"
            gs-y="1"
            gs-w="4"
          >
            <div class="grid-stack-item-content">
              <Announcement :loading="isLoading" />
            </div>
          </div>

          <div class="grid-stack-item" gs-id="team" gs-x="8" gs-y="2" gs-w="4">
            <div class="grid-stack-item-content">
              <Team :loading="isLoading" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProjectSettingsModal
      v-model:open="projectSettingsOpen"
      :mode="projectSettingsMode"
      :project="selectedProject"
      @save="handleProjectSettingsSave"
    />
  </w-view>
</template>

<script lang="ts" setup>
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import { useLoading } from '@/hooks'
import {
  Overview,
  Project,
  Action,
  Announcement,
  Dynamic,
  Team,
  DataAnalysis,
} from './components'
import {
  getProjectStatusClass,
  initialProjects,
  ProjectSettingsModal,
  workbenchMembers,
} from './components/project'
import type {
  ProjectSettingsMode,
  ProjectSettingsPayload,
  WorkbenchProject,
} from './components/project'

const grid = shallowRef<GridStack | null>(null)
const contentObserver = shallowRef<ResizeObserver | null>(null)
let remeasureTimer = 0
const gridRef = useTemplateRef<HTMLDivElement>('gridRef')
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

const syncDragState = () => {
  grid.value?.enableMove(dragEnabled.value)
  grid.value?.enableResize(dragEnabled.value)
}

/**
 * 初始化网格
 *
 * - sizeToContent 让卡片高度跟随内容,cellHeight 取 8px 是为了让行数换算足够细
 * - gs-y 只表示列内初始顺序(0/1/2),真实高度交给 sizeToContent;
 *   若省略 gs-y,GridStack 会走 autoPosition 分支并忽略 gs-x,列归属就不确定了
 * - 默认 handle 是整块内容,GridStack 内置会取消 footer/button/input 等元素上的拖拽,
 *   所以卡片内部的按钮照常可点,不需要额外的抓手
 */
const setupGrid = () => {
  if (grid.value || !gridRef.value) return

  const instance = GridStack.init(
    {
      column: 12,
      cellHeight: 8,
      sizeToContent: true,
      // 相邻卡片间距 2 * 6 = 12px,对齐原来的 gutter 12 / gap-12
      margin: 6,
      // 992px 以下单列,对齐原来 a-col 的 md=24、lg=16-8 断点
      columnOpts: {
        breakpoints: [{ w: 992, c: 1 }],
        breakpointForWindow: true,
      },
      draggable: {
        handle: '.grid-stack-item-content',
        cancel: 'button, a[href], input, textarea, select, option',
      },
    },
    gridRef.value
  )
  grid.value = instance

  syncDragState()
  observeCardContents(instance)
  remeasureCards()
}

/**
 * 内容高度变化后重新测量
 *
 * sizeToContent 会把卡片内容的 overflow-y 设为 hidden,
 * 骨架屏换成真实卡片后不复测就会被裁切。
 */
const remeasureCards = async () => {
  await nextTick()

  const instance = grid.value
  if (!instance) return

  instance.getGridItems().forEach((item) => instance.resizeToContent(item))
}

/**
 * 卡片内容尺寸变化后重新测量
 *
 * 卡片内的列表用了 content-visibility:auto,离屏时按 contain-intrinsic-size
 * 上报占位高度,进视口后才收敛到真实高度。若只在加载完成时测一次,
 * GridStack 会拿偏大的占位高度定下格子高度,矮卡片下方就会留出一段空白。
 */
const observeCardContents = (instance: GridStack | null) => {
  contentObserver.value?.disconnect()
  contentObserver.value = null
  if (!instance) return

  const observer = new ResizeObserver(() => {
    // 卡片内容会经历「占位高度 -> 真实高度」的连续变化,去抖后再测一次,
    // 避免在同一批尺寸抖动里反复重排
    window.clearTimeout(remeasureTimer)
    remeasureTimer = window.setTimeout(() => void remeasureCards(), 150)
  })
  instance.getGridItems().forEach((item) => {
    const card = item.querySelector(
      '.grid-stack-item-content'
    )?.firstElementChild
    if (card) observer.observe(card)
  })
  contentObserver.value = observer
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
    createdAt: currentProject?.createdAt ?? formatProjectDate(),
    dueAt: payload.dueAt,
    progress: payload.progress,
    status,
    statusClass: getProjectStatusClass(status),
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
    return '有风险'
  }
  if (payload.progress >= 80) {
    return '收尾中'
  }
  if (payload.priority === 'high') {
    return '重点推进'
  }
  if (payload.priority === 'low') {
    return '计划中'
  }
  return '推进中'
}

function formatProjectDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE').format(date)
}

/**
 * 冻结 GridStack 写入的内联布局,返回还原函数
 *
 * GridStack 销毁时会清掉容器高度与 item 的定位,而页面此时可能仍在播放离场过渡:
 * 高度骤降会让内容区滚动位置被夹断,表现为整块内容生硬跳动。
 * 先快照内联样式,销毁后再还原,让离场过程保持原有布局。
 */
const freezeGridLayout = (root: HTMLElement) => {
  const elements = [
    root,
    ...root.querySelectorAll<HTMLElement>('.grid-stack-item'),
  ]
  const styles = elements.map((el) => el.getAttribute('style'))

  return () => {
    elements.forEach((el, index) => {
      const style = styles[index]
      if (style === null) el.removeAttribute('style')
      else el.setAttribute('style', style)
    })
  }
}

onMounted(() => {
  // 与加载态无关地先建网格:骨架屏也是网格 item,
  // 这样首屏就是两列排布,不会先竖排再跳到两列
  setupGrid()
})

onBeforeUnmount(() => {
  window.clearTimeout(remeasureTimer)
  contentObserver.value?.disconnect()
  contentObserver.value = null

  const gridEl = gridRef.value
  const restoreLayout = gridEl ? freezeGridLayout(gridEl) : null
  // DOM 归 Vue 管,销毁时不要把节点一起删掉
  grid.value?.destroy(false)
  grid.value = null
  restoreLayout?.()
})

watch(dragEnabled, () => {
  syncDragState()
})

watch(isLoading, async (value) => {
  if (!value) await remeasureCards()
})
</script>

<style lang="less" scoped>
.page-view {
  background-image:
    radial-gradient(
      1100px 520px at -10% -8%,
      rgb(var(--w-color-primary) / 12%),
      transparent 70%
    ),
    radial-gradient(
      900px 460px at 108% -6%,
      rgb(var(--w-color-primary) / 9%),
      transparent 72%
    );
  background-repeat: no-repeat;
}

.workbench-grid {
  &--drag {
    /* 编辑态:整块内容可拖(GridStack 已内置取消按钮等元素上的拖拽) */
    :deep(.grid-stack-item-content) {
      cursor: grab;
      outline: 1px dashed rgb(var(--w-color-primary) / 22%);
      outline-offset: 3px;
    }

    :deep(.grid-stack-item.ui-draggable-dragging .grid-stack-item-content) {
      cursor: grabbing;
    }
  }

  /* 拖拽落点占位 */
  :deep(.grid-stack-placeholder > .placeholder-content) {
    background-color: rgb(var(--w-color-primary) / 10%);
    border-radius: 12px;
  }
}
</style>
