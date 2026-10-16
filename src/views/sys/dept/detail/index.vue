<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Modal, message } from 'antdv-next'
import {
  deleteDeptApi,
  getDeptPageListApi,
  getDeptRecordApi,
  type DeptResp,
} from '@/apis'
import { Icon } from '@/components'
import { useRequest, useTabs } from '@/hooks'
import { toRouteTabKey } from '@/store'
import { DeptForm } from '../list/components'

const route = useRoute()
const { closeTab, openTabByPath } = useTabs()

const deptId = computed(() =>
  typeof route.query.id === 'string' ? route.query.id : ''
)
const formOpen = shallowRef(false)

const { data, loading, run } = useRequest(
  (params: { id: string }) => getDeptRecordApi(params),
  { defaultParams: [{ id: deptId.value }], manual: !deptId.value }
)

/** 部门与岗位共用一个列表接口,这里按 id 映射上级部门名称 */
const { data: deptData } = useRequest(() =>
  getDeptPageListApi({ current: 1, pageSize: 1000 })
)

const deptNames = computed(() => {
  const names = new Map<string, string>()
  ;(deptData.value?.data?.list ?? []).forEach((item: DeptResp) => {
    names.set(item.id, item.name)
  })
  return names
})

const dept = computed<DeptResp | undefined>(() => data.value?.data ?? undefined)

const entityName = computed(() => (dept.value?.type === 2 ? '岗位' : '部门'))

const title = computed(() => dept.value?.name || `${entityName.value}详情`)

const iconName = computed(() =>
  dept.value?.type === 2 ? 'i-lucide:briefcase-business' : 'i-lucide:building-2'
)

const parentName = computed(() => {
  const parentId = dept.value?.parentId
  if (!parentId || parentId === '0') return '顶级部门'
  return deptNames.value.get(parentId) ?? parentId
})

function goBack() {
  openTabByPath('/sys/dept/list')
}

function openEdit() {
  formOpen.value = true
}

function onUpdated() {
  run({ id: deptId.value })
}

function onDelete() {
  const record = dept.value
  if (!record) return

  Modal.confirm({
    title: `删除${entityName.value}`,
    content: `确定删除${entityName.value}「${record.name}」吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteDeptApi([record.id])
        message.success(`${entityName.value}删除成功`)
        await openTabByPath('/sys/dept/list')
        closeTab(toRouteTabKey('/sys/dept/detail', { id: record.id }))
      } catch {
        // 业务错误已由请求层统一提示
      }
    },
  })
}
</script>

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
        <Icon :name="iconName" />
      </span>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-8">
          <h1 class="m-0 truncate text-base text-main font-700">{{ title }}</h1>
          <a-tag
            v-if="dept"
            :bordered="false"
            :color="dept.dataStatus ? 'success' : 'default'"
          >
            {{ dept.dataStatus ? '正常' : '停用' }}
          </a-tag>
        </div>
        <p class="m-0 mt-2 truncate text-xs text-secondary">
          {{ dept ? `${dept.code} · ${dept.leader}` : '加载中...' }}
        </p>
      </div>

      <div class="flex flex-none items-center gap-8">
        <a-button :disabled="!dept" @click="openEdit">
          <template #icon><Icon name="i-lucide:pencil" /></template>
          编辑
        </a-button>
        <a-button danger :disabled="!dept" @click="onDelete">
          <template #icon><Icon name="i-lucide:trash-2" /></template>
          删除
        </a-button>
      </div>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <a-spin :spinning="loading">
        <div v-if="dept" class="flex flex-col gap-10">
          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">基础信息</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="部门名称">
                {{ dept.name }}
              </a-descriptions-item>
              <a-descriptions-item label="部门编码">
                {{ dept.code }}
              </a-descriptions-item>
              <a-descriptions-item label="部门类型">
                <a-tag
                  :bordered="false"
                  :color="dept.type === 2 ? 'purple' : 'blue'"
                >
                  {{ dept.type === 2 ? '岗位' : '部门' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="负责人">
                {{ dept.leader || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="联系电话">
                {{ dept.phone || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="联系邮箱">
                {{ dept.email || '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">层级信息</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="上级部门">
                {{ parentName }}
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
                {{ dept.remark || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建人">
                {{ dept.createdBy || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建时间">
                {{ dept.createdAt || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="更新时间">
                {{ dept.updatedAt || '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </section>
        </div>

        <a-empty
          v-else-if="!loading"
          class="py-80"
          description="部门不存在或已被删除"
        >
          <a-button type="primary" @click="goBack">返回列表</a-button>
        </a-empty>
      </a-spin>
    </div>

    <DeptForm v-model:open="formOpen" :id="deptId" @success="onUpdated" />
  </div>
</template>
