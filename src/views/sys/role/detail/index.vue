<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Modal, message } from 'antdv-next'
import {
  deleteRoleApi,
  getRoleRecordApi,
  updateRoleApi,
  type RoleResp,
  type UpdateRoleReq,
} from '@/apis'
import {
  FormPlus,
  Icon,
  type FormPlusInstance,
  type FormPlusModel,
} from '@/components'
import { useRequest, useTabs } from '@/hooks'
import { toRouteTabKey } from '@/store'
import { dataScopeMap, schemas } from '../list/config'

const route = useRoute()
const { closeTab, openTabByPath } = useTabs()

const roleId = computed(() =>
  typeof route.query.id === 'string' ? route.query.id : ''
)
const formOpen = shallowRef(false)
const submitting = shallowRef(false)
const formRef = shallowRef<FormPlusInstance>()
/** 编辑表单模型,直接交给 FormPlus 读写,避免二次同步 */
const form = reactive<FormPlusModel>({ roleName: '', dataScope: undefined })
/** 弹窗内单列铺满,保证一行一个字段 */
const formGrid = { cols: 1 }

const { data, loading, run } = useRequest(
  (params: { id: string }) => getRoleRecordApi(params),
  { defaultParams: [{ id: roleId.value }], manual: !roleId.value }
)

const role = computed<RoleResp | undefined>(() => data.value?.data ?? undefined)

const title = computed(() => role.value?.roleName || '角色详情')

const dataScopeText = computed(() => {
  const scope = role.value ? dataScopeMap[role.value.dataScope] : undefined
  return scope?.label ?? '-'
})

function goBack() {
  openTabByPath('/sys/role/list')
}

function openEdit() {
  const record = role.value
  if (!record) return

  form.roleName = record.roleName
  form.dataScope = record.dataScope
  formOpen.value = true
}

/** 弹窗确认按钮触发 FormPlus 校验,校验通过后才派发 submit */
function handleSubmit() {
  formRef.value?.submit()
}

async function onSubmit(values: FormPlusModel) {
  const record = role.value
  if (!record) return

  const payload: UpdateRoleReq = { id: record.id }
  if (typeof values.roleName === 'string') {
    payload.roleName = values.roleName.trim()
  }
  if (typeof values.dataScope === 'number') {
    payload.dataScope = values.dataScope
  }

  submitting.value = true
  try {
    await updateRoleApi(payload)
    message.success('角色编辑成功')
    formOpen.value = false
    run({ id: roleId.value })
  } catch {
    // 业务错误已由请求层统一提示，保持弹窗打开便于重试
  } finally {
    submitting.value = false
  }
}

function onDelete() {
  const record = role.value
  if (!record) return

  Modal.confirm({
    title: '删除角色',
    content: `确定删除角色「${record.roleName}」吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteRoleApi([record.id])
        message.success('角色删除成功')
        await openTabByPath('/sys/role/list')
        closeTab(toRouteTabKey('/sys/role/detail', { id: record.id }))
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

      <div
        class="size-42 flex-none flex-center rounded-4 bg-primary-tint text-primary"
      >
        <Icon name="i-lucide:shield-check" :size="20" />
      </div>

      <div class="min-w-0 flex-1">
        <h1 class="m-0 truncate text-base text-main font-700">{{ title }}</h1>
        <p class="m-0 mt-2 truncate text-xs text-secondary">
          {{ role ? dataScopeText : '加载中...' }}
        </p>
      </div>

      <div class="flex flex-none items-center gap-8">
        <a-button :disabled="!role" @click="openEdit">
          <template #icon><Icon name="i-lucide:pencil" /></template>
          编辑
        </a-button>
        <a-button danger :disabled="!role" @click="onDelete">
          <template #icon><Icon name="i-lucide:trash-2" /></template>
          删除
        </a-button>
      </div>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <a-spin :spinning="loading">
        <section v-if="role" class="rounded-4 bg-container p-16">
          <h2 class="mb-12 text-sm text-main font-600">基础信息</h2>
          <a-descriptions
            bordered
            size="middle"
            :column="{ xs: 1, sm: 2, xl: 3 }"
            :label-style="{ width: '110px' }"
          >
            <a-descriptions-item label="角色名称">
              {{ role.roleName }}
            </a-descriptions-item>
            <a-descriptions-item label="数据权限">
              <a-tag
                :bordered="false"
                :color="dataScopeMap[role.dataScope]?.color"
              >
                {{ dataScopeText }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="角色 ID">
              {{ role.id }}
            </a-descriptions-item>
            <a-descriptions-item label="备注" :span="3">
              {{ role.remark || '-' }}
            </a-descriptions-item>
          </a-descriptions>
        </section>

        <a-empty
          v-else-if="!loading"
          class="py-80"
          description="角色不存在或已被删除"
        >
          <a-button type="primary" @click="goBack">返回列表</a-button>
        </a-empty>
      </a-spin>
    </div>

    <a-modal
      v-model:open="formOpen"
      title="编辑角色"
      :confirm-loading="submitting"
      ok-text="保存"
      cancel-text="取消"
      destroy-on-hidden
      @ok="handleSubmit"
    >
      <FormPlus
        ref="formRef"
        :schemas="schemas"
        :model="form"
        :grid="formGrid"
        mode="edit"
        :label-width="80"
        @submit="onSubmit"
      />
    </a-modal>
  </div>
</template>
