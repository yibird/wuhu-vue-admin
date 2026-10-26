<template>
  <w-view :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col gap-10 p-10">
      <header
        class="flex flex-wrap items-center gap-12 rounded-4 bg-container px-16 py-12"
      >
        <span
          class="size-42 flex-none flex-center rounded-4 bg-primary/10 text-primary"
        >
          <Icon name="i-lucide:user-round-check" />
        </span>

        <div class="min-w-0 flex-1">
          <h1 class="m-0 text-base text-main font-700">我的项目</h1>
          <p class="m-0 mt-2 text-xs text-secondary">
            共 {{ total }} 个与我相关的项目
          </p>
        </div>

        <a-input-search
          v-model:value="keyword"
          class="w-full sm:w-260"
          allow-clear
          placeholder="搜索项目名称"
          @search="onSearch"
        />
        <a-button :loading="loading" @click="refresh">
          <template #icon><Icon name="i-lucide:refresh-cw" /></template>
          刷新
        </a-button>
      </header>

      <div class="min-h-0 flex-1 overflow-y-auto">
        <a-spin :spinning="loading">
          <div v-if="!list.length" class="h-full min-h-320 flex-center">
            <a-empty description="暂无与我相关的项目" />
          </div>

          <div
            v-else
            class="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          >
            <article
              v-for="item in list"
              :key="item.id"
              class="flex flex-col gap-12 rounded-4 bg-container p-16 transition-[transform,box-shadow] duration-300 ease-out hover:(-translate-y-1 shadow-md)"
            >
              <div class="flex items-start gap-10">
                <span
                  class="size-40 flex-none flex-center rounded-4 bg-primary/10 text-primary"
                >
                  <Icon name="i-lucide:folder-kanban" :size="20" />
                </span>
                <div class="min-w-0 flex-1">
                  <h2
                    class="m-0 truncate text-sm text-main font-700"
                    :title="item.name"
                  >
                    {{ item.name }}
                  </h2>
                  <div class="mt-2 truncate text-xs text-secondary">
                    {{ item.code }}
                  </div>
                </div>
                <a-tag :color="projectStatusMeta[item.status].color">
                  {{ projectStatusMeta[item.status].label }}
                </a-tag>
              </div>

              <p class="m-0 line-clamp-2 min-h-36 text-xs text-regular">
                {{ item.description || '暂无项目描述' }}
              </p>

              <div>
                <div
                  class="mb-6 flex items-center justify-between text-xs text-secondary"
                >
                  <span>项目进度</span>
                  <span class="text-main font-600">{{ item.progress }}%</span>
                </div>
                <a-progress
                  :percent="item.progress"
                  :show-info="false"
                  size="small"
                />
              </div>

              <div class="grid grid-cols-2 gap-6 text-xs text-secondary">
                <span class="flex items-center gap-6">
                  <Icon name="i-lucide:user-round" :size="14" />
                  {{ item.ownerName }}
                </span>
                <span class="flex items-center gap-6">
                  <Icon name="i-lucide:users-round" :size="14" />
                  {{ item.memberCount }} 成员
                </span>
                <span class="flex items-center gap-6">
                  <Icon name="i-lucide:square-check-big" :size="14" />
                  {{ item.taskCount }} 任务
                </span>
                <span class="flex items-center gap-6">
                  <Icon name="i-lucide:calendar-days" :size="14" />
                  {{ item.endDate }}
                </span>
              </div>

              <div
                class="mt-auto flex items-center justify-between b-t-1-regular pt-10"
              >
                <a-tag :color="priorityMeta[item.priority].color">
                  {{ priorityMeta[item.priority].label }}优先级
                </a-tag>
                <div class="flex items-center gap-4">
                  <a-button type="link" size="small" @click="openDetail(item)">
                    查看详情
                  </a-button>
                  <a-button
                    v-permission="'project:project:update'"
                    type="link"
                    size="small"
                    @click="openEdit(item)"
                  >
                    编辑
                  </a-button>
                </div>
              </div>
            </article>
          </div>
        </a-spin>
      </div>

      <footer v-if="total > 0" class="flex flex-none justify-center">
        <a-pagination
          :current="current"
          :page-size="pageSize"
          :total="total"
          :page-size-options="[12, 24, 36]"
          :show-total="paginationTotalText"
          show-size-changer
          @change="onPageChange"
        />
      </footer>

      <ProjectForm
        v-model:open="formOpen"
        :id="editingProjectId"
        @success="onFormSuccess"
      />
    </div>
  </w-view>
</template>

<script setup lang="ts">
import { getProjectPageListApi } from '@/apis'
import { Icon } from '@/components/icon'
import { WView } from '@/components/view'
import { usePagination, usePermission, useTabs } from '@/hooks'
import { useAuthStore } from '@/store'
import { ProjectForm } from '../list/components'
import { priorityMeta, projectStatusMeta } from '../data'
import { useProjectOptions } from '../hooks'

import type { ProjectQuery, ProjectResp } from '@/apis'

const PAGE_SIZE = 12

const { hasPermission } = usePermission()
const { openRouteTab } = useTabs()
const { refreshProjectOptions } = useProjectOptions()
const { userInfo } = useAuthStore()

const keyword = shallowRef('')
const formOpen = shallowRef(false)
const editingProjectId = shallowRef<string>()

const { list, loading, pagination, run, refresh } = usePagination(
  (query: ProjectQuery) => getProjectPageListApi(query),
  {
    defaultPageSize: PAGE_SIZE,
    defaultParams: userInfo.value?.id ? { memberId: userInfo.value.id } : {},
  }
)

const { current, pageSize, total, changePage } = pagination

function buildQuery(): Partial<ProjectQuery> {
  const name = keyword.value.trim()
  return {
    ...(userInfo.value?.id ? { memberId: userInfo.value.id } : {}),
    ...(name ? { name } : {}),
  }
}

function onSearch() {
  run(buildQuery())
}

function onPageChange(page: number, size: number) {
  changePage(page, size)
}

function paginationTotalText(value: number) {
  return `共 ${value} 个项目`
}

function openDetail(record: ProjectResp) {
  openRouteTab({
    path: '/project/detail',
    title: `项目详情-${record.name}`,
    icon: 'i-lucide:folder-open',
    query: { id: record.id, from: '/project/my-project' },
  })
}

function openEdit(record: ProjectResp) {
  if (!hasPermission('project:project:update')) return
  editingProjectId.value = record.id
  formOpen.value = true
}

function onFormSuccess() {
  refresh()
  void refreshProjectOptions()
}
</script>
