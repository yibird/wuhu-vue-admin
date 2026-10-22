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
        <Icon name="i-lucide:briefcase-business" />
      </span>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-8">
          <h1 class="m-0 truncate text-base text-main font-700">{{ title }}</h1>
          <a-tag
            v-if="post"
            :bordered="false"
            :color="post.dataStatus ? 'success' : 'default'"
          >
            {{ post.dataStatus ? '正常' : '停用' }}
          </a-tag>
        </div>
        <p class="m-0 mt-2 truncate text-xs text-secondary">
          {{ post ? `${post.code} · ${post.leader}` : '加载中...' }}
        </p>
      </div>

      <div class="flex flex-none items-center gap-8">
        <a-button :disabled="!post" @click="openEdit">
          <template #icon><Icon name="i-lucide:pencil" /></template>
          编辑
        </a-button>
        <a-button danger :disabled="!post" @click="onDelete">
          <template #icon><Icon name="i-lucide:trash-2" /></template>
          删除
        </a-button>
      </div>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <a-spin :spinning="loading">
        <div v-if="post" class="flex flex-col gap-10">
          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">基础信息</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="岗位名称">
                {{ post.name }}
              </a-descriptions-item>
              <a-descriptions-item label="岗位编码">
                {{ post.code }}
              </a-descriptions-item>
              <a-descriptions-item label="所属部门">
                {{ departmentName }}
              </a-descriptions-item>
              <a-descriptions-item label="岗位负责人">
                {{ post.leader || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="联系电话">
                {{ post.phone || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="联系邮箱">
                {{ post.email || '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">其他信息</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="备注" :span="3">
                {{ post.remark || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建人">
                {{ post.createdBy || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建时间">
                {{ post.createdAt || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="更新时间">
                {{ post.updatedAt || '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </section>
        </div>

        <a-empty
          v-else-if="!loading"
          class="py-80"
          description="岗位不存在或已被删除"
        >
          <a-button type="primary" @click="goBack">返回列表</a-button>
        </a-empty>
      </a-spin>
    </div>

    <PostForm
      v-model:open="formOpen"
      :dept-options="deptOptions"
      :id="postId"
      :options-loading="deptLoading"
      @success="onUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Modal, message } from 'antdv-next'
import {
  deleteDeptApi,
  getDeptPageListApi,
  getDeptRecordApi,
  type SysDept,
} from '@/apis'
import { Icon } from '@/components'
import type { DeptPickerOption } from '@/features'
import { useRequest, useTabs } from '@/hooks'
import { toRouteTabKey } from '@/store'
import { PostForm } from '../list/components'

const route = useRoute()
const { closeTab, openTabByPath } = useTabs()

const postId = computed(() =>
  typeof route.query.id === 'string' ? route.query.id : ''
)
const formOpen = shallowRef(false)

const { data, loading, run } = useRequest(
  (params: { id: string }) => getDeptRecordApi(params),
  { defaultParams: [{ id: postId.value }], manual: !postId.value }
)

/** 岗位的所属部门取部门列表,同时供编辑弹窗的下拉选择复用 */
const { data: deptData, loading: deptLoading } = useRequest(() =>
  getDeptPageListApi({ current: 1, pageSize: 1000, type: 1 })
)

const departmentList = computed(() => deptData.value?.data?.list ?? [])

const deptNames = computed(
  () => new Map(departmentList.value.map((item) => [item.id, item.name]))
)

const deptOptions = computed<DeptPickerOption[]>(() =>
  toTreeOptions(departmentList.value)
)

const post = computed<SysDept | undefined>(() => data.value?.data ?? undefined)

const title = computed(() => post.value?.name || '岗位详情')

const departmentName = computed(() => {
  const parentId = post.value?.parentId
  if (!parentId || parentId === '0') return '-'
  return deptNames.value.get(parentId) ?? parentId
})

function toTreeOptions(items: SysDept[]): DeptPickerOption[] {
  const options = new Map<string, DeptPickerOption>()
  const roots: DeptPickerOption[] = []

  items.forEach((item) => {
    options.set(item.id, {
      title: item.name,
      value: item.id,
      code: item.code,
      children: [],
    })
  })

  items.forEach((item) => {
    const option = options.get(item.id)
    if (!option) return
    const parent = options.get(item.parentId)
    if (parent) parent.children?.push(option)
    else roots.push(option)
  })

  return roots
}

function goBack() {
  openTabByPath('/sys/post/list')
}

function openEdit() {
  formOpen.value = true
}

function onUpdated() {
  run({ id: postId.value })
}

function onDelete() {
  const record = post.value
  if (!record) return

  Modal.confirm({
    title: '删除岗位',
    content: `确定删除岗位「${record.name}」吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteDeptApi([record.id])
        message.success('岗位删除成功')
        await openTabByPath('/sys/post/list')
        closeTab(toRouteTabKey('/sys/post/detail', { id: record.id }))
      } catch {
        // 业务错误已由请求层统一提示
      }
    },
  })
}
</script>
