<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <header
      class="flex flex-wrap items-center gap-12 rounded-4 bg-container px-16 py-12"
    >
      <a-button type="text" title="返回列表" @click="goBack">
        <template #icon><Icon name="i-lucide:arrow-left" /></template>
      </a-button>

      <a-avatar :size="42" :src="user?.big_avatar || user?.small_avatar">
        <template #icon><Icon name="i-lucide:user" /></template>
      </a-avatar>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-8">
          <h1 class="m-0 truncate text-base text-main font-700">{{ title }}</h1>
          <a-tag
            v-if="user"
            :bordered="false"
            :color="user.dataStatus ? 'success' : 'default'"
          >
            {{ user.dataStatus ? '正常' : '停用' }}
          </a-tag>
        </div>
        <p class="m-0 mt-2 truncate text-xs text-secondary">
          {{ user ? `${user.username} · ${user.realname}` : '加载中...' }}
        </p>
      </div>

      <div class="flex flex-none items-center gap-8">
        <a-button :disabled="!user" @click="openEdit">
          <template #icon><Icon name="i-lucide:pencil" /></template>
          编辑
        </a-button>
        <a-button danger :disabled="!user" @click="onDelete">
          <template #icon><Icon name="i-lucide:trash-2" /></template>
          删除
        </a-button>
      </div>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <a-spin :spinning="loading">
        <div v-if="user" class="flex flex-col gap-10">
          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">基础信息</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="登录账号">
                {{ user.username }}
              </a-descriptions-item>
              <a-descriptions-item label="用户昵称">
                {{ user.nickname }}
              </a-descriptions-item>
              <a-descriptions-item label="真实姓名">
                {{ user.realname }}
              </a-descriptions-item>
              <a-descriptions-item label="性别">
                {{ resolveOptionLabel(sexOptions, user.sex) }}
              </a-descriptions-item>
              <a-descriptions-item label="年龄">
                {{ user.age }}
              </a-descriptions-item>
              <a-descriptions-item label="生日">
                {{ user.birthday || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="手机号">
                {{ user.phone || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="邮箱">
                {{ user.email || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="微信号">
                {{ user.wechat || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="地址" :span="3">
                {{ user.address || '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">教育背景</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="学历">
                {{ resolveOptionLabel(educationOptions, user.education) }}
              </a-descriptions-item>
              <a-descriptions-item label="工作经验">
                {{
                  resolveOptionLabel(
                    workExperienceOptions,
                    user.work_experience
                  )
                }}
              </a-descriptions-item>
              <a-descriptions-item label="婚姻状态">
                {{
                  resolveOptionLabel(maritalStatusOptions, user.marital_status)
                }}
              </a-descriptions-item>
              <a-descriptions-item label="用户来源">
                {{ resolveOptionLabel(sourceOptions, user.source) }}
              </a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">组织与角色</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="所属部门">
                {{ resolveName(organizationMaps.deptNames, user.deptId) }}
              </a-descriptions-item>
              <a-descriptions-item label="岗位">
                {{ resolveName(organizationMaps.postNames, user.postId) }}
              </a-descriptions-item>
              <a-descriptions-item label="角色">
                {{ resolveName(organizationMaps.roleNames, user.roleId) }}
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
                {{ user.remark || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建人">
                {{ user.createdBy || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建时间">
                {{ user.createdAt || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="更新时间">
                {{ user.updatedAt || '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </section>
        </div>

        <a-empty
          v-else-if="!loading"
          class="py-80"
          description="用户不存在或已被删除"
        >
          <a-button type="primary" @click="goBack">返回列表</a-button>
        </a-empty>
      </a-spin>
    </div>

    <UserForm v-model:open="formOpen" :id="userId" @success="onUpdated" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Modal, message } from 'antdv-next'
import {
  deleteUserApi,
  getDeptPageListApi,
  getRolePageListApi,
  getUserRecordApi,
  type DeptResp,
  type RoleResp,
  type UserResp,
} from '@/apis'
import { Icon } from '@/components'
import { useRequest, useTabs } from '@/hooks'
import { toRouteTabKey } from '@/store'
import {
  educationOptions,
  maritalStatusOptions,
  resolveOptionLabel,
  sexOptions,
  sourceOptions,
  workExperienceOptions,
} from '../data'
import { UserForm } from '../list/components'

const route = useRoute()
const { closeTab, openTabByPath } = useTabs()

const userId = computed(() =>
  typeof route.query.id === 'string' ? route.query.id : ''
)
const formOpen = shallowRef(false)

const { data, loading, run } = useRequest(
  (params: { id: string }) => getUserRecordApi(params),
  { defaultParams: [{ id: userId.value }], manual: !userId.value }
)

/** 部门与岗位共用一个列表接口,按 type 区分 */
const { data: deptData } = useRequest(() =>
  getDeptPageListApi({ current: 1, pageSize: 1000 })
)
const { data: roleData } = useRequest(() =>
  getRolePageListApi({ current: 1, pageSize: 1000 })
)

const organizationMaps = computed(() => {
  const deptNames = new Map<string, string>()
  const postNames = new Map<string, string>()
  ;(deptData.value?.data?.list ?? []).forEach((item: DeptResp) => {
    if (item.type === 2) postNames.set(item.id, item.name)
    else deptNames.set(item.id, item.name)
  })

  const roleNames = new Map<string, string>()
  ;(roleData.value?.data?.list ?? []).forEach((item: RoleResp) => {
    roleNames.set(item.id, item.roleName)
  })

  return { deptNames, postNames, roleNames }
})

const user = computed<UserResp | undefined>(() => data.value?.data ?? undefined)

const title = computed(
  () => user.value?.nickname || user.value?.realname || '用户详情'
)

function resolveName(map: Map<string, string>, id?: string) {
  if (!id) return '-'
  return map.get(id) ?? id
}

function goBack() {
  openTabByPath('/sys/user/list')
}

function openEdit() {
  formOpen.value = true
}

function onUpdated() {
  run({ id: userId.value })
}

function onDelete() {
  const record = user.value
  if (!record) return

  Modal.confirm({
    title: '删除用户',
    content: `确定删除用户「${record.nickname || record.username}」吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteUserApi([record.id])
        message.success('用户删除成功')
        await openTabByPath('/sys/user/list')
        closeTab(toRouteTabKey('/sys/user/detail', { id: record.id }))
      } catch {
        // 业务错误已由请求层统一提示
      }
    },
  })
}
</script>
