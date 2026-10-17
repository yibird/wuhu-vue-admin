<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <header
      class="flex flex-wrap items-center gap-12 rounded-4 bg-container px-16 py-12"
    >
      <a-button type="text" title="返回列表" @click="goBack">
        <template #icon><Icon name="i-lucide:arrow-left" /></template>
      </a-button>

      <span
        class="size-42 flex-none flex-center rounded-4 bg-primary-tint text-primary"
      >
        <Icon name="i-lucide:folder-kanban" />
      </span>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-8">
          <h1 class="m-0 truncate text-base text-main font-700">
            {{ project?.name ?? '项目详情' }}
          </h1>
          <a-tag
            v-if="project"
            :color="projectStatusMeta[project.status].color"
          >
            {{ projectStatusMeta[project.status].label }}
          </a-tag>
          <a-tag v-if="project" :color="priorityMeta[project.priority].color">
            {{ priorityMeta[project.priority].label }}优先级
          </a-tag>
        </div>
        <p class="m-0 mt-2 truncate text-xs text-secondary">
          {{
            project
              ? `${project.code} · 负责人 ${project.ownerName} · ${formatDateTime(project.startDate)} ~ ${formatDateTime(project.endDate)}`
              : '加载中...'
          }}
        </p>
      </div>

      <div class="flex flex-none items-center gap-8">
        <a-button
          v-permission="'project:project:update'"
          :disabled="!project"
          @click="openEdit"
        >
          <template #icon><Icon name="i-lucide:pencil" /></template>
          编辑
        </a-button>
        <a-button
          v-permission="'project:project:delete'"
          danger
          :disabled="!project"
          @click="onDelete"
        >
          <template #icon><Icon name="i-lucide:trash-2" /></template>
          删除
        </a-button>
      </div>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <a-spin :spinning="loading">
        <a-tabs
          v-if="project"
          v-model:active-key="activeTab"
          class="rounded-4 bg-container p-16"
        >
          <a-tab-pane key="overview" tab="概览">
            <section>
              <h2 class="mb-12 text-sm text-main font-600">基础信息</h2>
              <a-descriptions
                bordered
                size="middle"
                :column="3"
                :label-style="{ width: '110px' }"
              >
                <a-descriptions-item label="项目编码">
                  {{ project.code }}
                </a-descriptions-item>
                <a-descriptions-item label="负责人">
                  {{ project.ownerName }}
                </a-descriptions-item>
                <a-descriptions-item label="状态">
                  {{ projectStatusMeta[project.status].label }}
                </a-descriptions-item>
                <a-descriptions-item label="优先级">
                  {{ priorityMeta[project.priority].label }}
                </a-descriptions-item>
                <a-descriptions-item label="计划周期">
                  {{ formatDateTime(project.startDate) }} ~
                  {{ formatDateTime(project.endDate) }}
                </a-descriptions-item>
                <a-descriptions-item label="预算">
                  {{ formatMoney(project.budget) }}
                </a-descriptions-item>
                <a-descriptions-item label="成员数量">
                  {{ project.memberCount }}
                </a-descriptions-item>
                <a-descriptions-item label="任务数量">
                  {{ project.taskCount }}
                </a-descriptions-item>
                <a-descriptions-item label="更新时间">
                  {{ formatDateTime(project.updatedAt) }}
                </a-descriptions-item>
                <a-descriptions-item label="项目进度" :span="3">
                  <a-progress :percent="project.progress" />
                </a-descriptions-item>
                <a-descriptions-item label="项目描述" :span="3">
                  {{ project.description || '-' }}
                </a-descriptions-item>
              </a-descriptions>
            </section>
          </a-tab-pane>

          <a-tab-pane key="members" :tab="`成员 (${memberRows.length})`">
            <div class="mb-12 flex justify-end">
              <a-button
                v-permission="'project:member:create'"
                type="primary"
                @click="openMemberCreate"
              >
                <template #icon><Icon name="i-lucide:user-plus" /></template>
                添加成员
              </a-button>
            </div>
            <a-table
              size="small"
              :columns="memberColumns"
              :data-source="memberRows"
              :loading="membersLoading"
              :pagination="false"
              row-key="id"
            />
          </a-tab-pane>

          <a-tab-pane
            key="milestones"
            :tab="`里程碑 (${milestoneRows.length})`"
          >
            <div class="mb-12 flex justify-end">
              <a-button
                v-permission="'project:milestone:create'"
                type="primary"
                @click="openMilestoneCreate"
              >
                <template #icon><Icon name="i-lucide:plus" /></template>
                新增里程碑
              </a-button>
            </div>
            <a-table
              size="small"
              :columns="milestoneColumns"
              :data-source="milestoneRows"
              :loading="milestonesLoading"
              :pagination="false"
              row-key="id"
            />
          </a-tab-pane>

          <a-tab-pane key="tasks" :tab="`任务 (${taskRows.length})`">
            <div class="mb-12 flex justify-end">
              <a-button
                v-permission="'project:task:create'"
                type="primary"
                @click="openTaskCreate"
              >
                <template #icon><Icon name="i-lucide:plus" /></template>
                新增任务
              </a-button>
            </div>
            <a-table
              size="small"
              :columns="taskColumns"
              :data-source="taskRows"
              :loading="tasksLoading"
              :pagination="false"
              row-key="id"
            />
          </a-tab-pane>
        </a-tabs>

        <a-empty v-else-if="!loading" description="项目不存在或已被删除" />
      </a-spin>
    </div>

    <ProjectForm
      v-model:open="formOpen"
      :id="projectId"
      @success="reloadProject"
    />
    <MemberForm
      v-model:open="memberFormOpen"
      :id="editingMemberId"
      :project-id="projectId"
      @success="onMemberSuccess"
    />
    <MilestoneForm
      v-model:open="milestoneFormOpen"
      :id="editingMilestoneId"
      :project-id="projectId"
      @success="onMilestoneSuccess"
    />
    <TaskForm
      v-model:open="taskFormOpen"
      :id="editingTaskId"
      :project-id="projectId"
      @success="onTaskSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, Modal, Tag, message } from 'antdv-next'
import { useRoute } from 'vue-router'
import {
  deleteMilestoneApi,
  deleteProjectApi,
  deleteProjectMemberApi,
  deleteProjectTaskApi,
  getMilestonePageListApi,
  getProjectMemberPageListApi,
  getProjectRecordApi,
  getProjectTaskPageListApi,
} from '@/apis'
import { ProjectForm } from '../list/components'
import { MemberForm } from '../member/components'
import { MilestoneForm } from '../milestone/components'
import { TaskForm } from '../task/components'
import { Icon } from '@/components'
import { usePermission, useRequest, useTabs } from '@/hooks'
import {
  formatDate,
  formatDateTime,
  formatMoney,
  memberRoleMeta,
  milestoneStatusMeta,
  priorityMeta,
  projectStatusMeta,
  taskStatusMeta,
} from '../data'

import type {
  MilestoneResp,
  ProjectMemberResp,
  ProjectResp,
  ProjectTaskResp,
} from '@/apis'
import type { TableColumnsType } from 'antdv-next'

const route = useRoute()
const { hasPermission } = usePermission()
const { openTabByPath } = useTabs()

const projectId = computed(() => String(route.query.id ?? ''))
const activeTab = shallowRef('overview')

const formOpen = shallowRef(false)
const memberFormOpen = shallowRef(false)
const milestoneFormOpen = shallowRef(false)
const taskFormOpen = shallowRef(false)
const editingMemberId = shallowRef<string>()
const editingMilestoneId = shallowRef<string>()
const editingTaskId = shallowRef<string>()

const {
  data: projectData,
  loading,
  run: runProject,
} = useRequest(() => getProjectRecordApi({ id: projectId.value }), {
  manual: !projectId.value,
})
const {
  data: memberData,
  loading: membersLoading,
  run: runMembers,
} = useRequest(
  () =>
    getProjectMemberPageListApi({ projectId: projectId.value, pageSize: 100 }),
  { manual: !projectId.value }
)
const {
  data: milestoneData,
  loading: milestonesLoading,
  run: runMilestones,
} = useRequest(
  () => getMilestonePageListApi({ projectId: projectId.value, pageSize: 100 }),
  { manual: !projectId.value }
)
const {
  data: taskData,
  loading: tasksLoading,
  run: runTasks,
} = useRequest(
  () =>
    getProjectTaskPageListApi({ projectId: projectId.value, pageSize: 100 }),
  { manual: !projectId.value }
)

const project = computed<ProjectResp | undefined>(() => projectData.value?.data)
const memberRows = computed(() => memberData.value?.data?.list ?? [])
const milestoneRows = computed(() => milestoneData.value?.data?.list ?? [])
const taskRows = computed(() => taskData.value?.data?.list ?? [])

const memberColumns: TableColumnsType<ProjectMemberResp> = [
  { title: '成员', dataIndex: 'userName', width: 140 },
  {
    title: '部门',
    dataIndex: 'department',
    width: 150,
    render: (value?: string) => value || '-',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 200,
    render: (value?: string) => value || '-',
  },
  {
    title: '项目角色',
    dataIndex: 'role',
    width: 100,
    render: (value: ProjectMemberResp['role']) =>
      h(
        Tag,
        { color: memberRoleMeta[value].color },
        { default: () => memberRoleMeta[value].label }
      ),
  },
  {
    title: '加入时间',
    dataIndex: 'joinedAt',
    width: 130,
    render: (value: string) => formatDate(value),
  },
  {
    title: '操作',
    key: 'action',
    width: 140,
    render: (_value, record) =>
      h('div', { class: 'flex gap-2' }, [
        hasPermission('project:member:create')
          ? h(
              Button,
              { type: 'link', onClick: () => openMemberEdit(record) },
              { default: () => '编辑角色' }
            )
          : null,
        hasPermission('project:member:delete')
          ? h(
              Button,
              {
                type: 'link',
                danger: true,
                onClick: () => onMemberRemove(record),
              },
              { default: () => '移除' }
            )
          : null,
      ]),
  },
]

const milestoneColumns: TableColumnsType<MilestoneResp> = [
  { title: '里程碑', dataIndex: 'name', width: 200 },
  {
    title: '截止日期',
    dataIndex: 'dueDate',
    width: 130,
    render: (value: string) => formatDate(value),
  },
  {
    title: '负责人',
    dataIndex: 'ownerName',
    width: 120,
    render: (value?: string) => value || '-',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (value: MilestoneResp['status']) =>
      h(
        Tag,
        { color: milestoneStatusMeta[value].color },
        { default: () => milestoneStatusMeta[value].label }
      ),
  },
  {
    title: '操作',
    key: 'action',
    width: 140,
    render: (_value, record) =>
      h('div', { class: 'flex gap-2' }, [
        hasPermission('project:milestone:update')
          ? h(
              Button,
              { type: 'link', onClick: () => openMilestoneEdit(record) },
              { default: () => '编辑' }
            )
          : null,
        hasPermission('project:milestone:delete')
          ? h(
              Button,
              {
                type: 'link',
                danger: true,
                onClick: () => onMilestoneDelete(record),
              },
              { default: () => '删除' }
            )
          : null,
      ]),
  },
]

const taskColumns: TableColumnsType<ProjectTaskResp> = [
  { title: '任务', dataIndex: 'title', width: 220 },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (value: ProjectTaskResp['status']) =>
      h(
        Tag,
        { color: taskStatusMeta[value].color },
        { default: () => taskStatusMeta[value].label }
      ),
  },
  {
    title: '负责人',
    dataIndex: 'assigneeName',
    width: 120,
    render: (value?: string) => value || '-',
  },
  {
    title: '截止日期',
    dataIndex: 'dueDate',
    width: 130,
    render: (value?: string) => formatDate(value),
  },
  {
    title: '操作',
    key: 'action',
    width: 140,
    render: (_value, record) =>
      h('div', { class: 'flex gap-2' }, [
        hasPermission('project:task:update')
          ? h(
              Button,
              { type: 'link', onClick: () => openTaskEdit(record) },
              { default: () => '编辑' }
            )
          : null,
        hasPermission('project:task:delete')
          ? h(
              Button,
              {
                type: 'link',
                danger: true,
                onClick: () => onTaskDelete(record),
              },
              { default: () => '删除' }
            )
          : null,
      ]),
  },
]

function reloadProject() {
  runProject()
  runMembers()
}

/** 详情页来源列表，未携带或非法时回退到项目列表 */
const backPath = computed(() => {
  const from = route.query.from
  return typeof from === 'string' &&
    ['/project/list', '/project/my-project'].includes(from)
    ? from
    : '/project/list'
})

function goBack() {
  openTabByPath(backPath.value)
}

function openEdit() {
  formOpen.value = true
}

function onDelete() {
  if (!project.value) return
  const current = project.value
  Modal.confirm({
    title: '删除项目',
    content: `确定删除「${current.name}」吗?项目下的任务、里程碑与成员会一并删除。`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteProjectApi([current.id])
      message.success('删除成功')
      goBack()
    },
  })
}

function openMemberCreate() {
  editingMemberId.value = undefined
  memberFormOpen.value = true
}

function openMemberEdit(record: ProjectMemberResp) {
  editingMemberId.value = record.id
  memberFormOpen.value = true
}

function onMemberSuccess() {
  runMembers()
  runProject()
}

function onMemberRemove(record: ProjectMemberResp) {
  Modal.confirm({
    title: '移除成员',
    content: `确定将「${record.userName}」移出当前项目吗?`,
    okText: '移除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteProjectMemberApi([record.id])
      message.success('已移除')
      runMembers()
      runProject()
    },
  })
}

function openMilestoneCreate() {
  editingMilestoneId.value = undefined
  milestoneFormOpen.value = true
}

function openMilestoneEdit(record: MilestoneResp) {
  editingMilestoneId.value = record.id
  milestoneFormOpen.value = true
}

function onMilestoneSuccess() {
  runMilestones()
  runProject()
}

function onMilestoneDelete(record: MilestoneResp) {
  Modal.confirm({
    title: '删除里程碑',
    content: `确定删除「${record.name}」吗?`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteMilestoneApi([record.id])
      message.success('删除成功')
      runMilestones()
      runProject()
    },
  })
}

function openTaskCreate() {
  editingTaskId.value = undefined
  taskFormOpen.value = true
}

function openTaskEdit(record: ProjectTaskResp) {
  editingTaskId.value = record.id
  taskFormOpen.value = true
}

function onTaskSuccess() {
  runTasks()
  runProject()
}

function onTaskDelete(record: ProjectTaskResp) {
  Modal.confirm({
    title: '删除任务',
    content: `确定删除「${record.title}」吗?`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await deleteProjectTaskApi([record.id])
      message.success('删除成功')
      runTasks()
      runProject()
    },
  })
}
</script>
