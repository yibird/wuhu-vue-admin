<template>
  <section class="grid gap-12 xl:grid-cols-2">
    <!-- 表单权限 -->
    <article class="rounded-10 b-1-regular bg-container p-14">
      <header class="mb-12 flex flex-wrap items-center gap-8">
        <div class="min-w-0 flex-1">
          <h2 class="m-0 text-sm text-main font-700">表单权限</h2>
          <p class="m-0 mt-2 text-xs text-secondary">
            配置不同角色在各节点对表单字段的查看、编辑与必填权限
          </p>
        </div>
        <a-segmented
          v-model:value="permissionRole"
          :options="permissionRoleOptions"
        />
      </header>

      <div class="grid gap-8">
        <div
          v-for="field in permissionFields"
          :key="field.key"
          class="grid grid-cols-[minmax(0,1fr)_110px_80px] items-center gap-8 rounded-7 bg-fill px-9 py-7"
        >
          <span class="min-w-0 truncate text-xs text-main">
            {{ field.label }}
          </span>
          <a-select
            size="small"
            :options="fieldPermissionOptions"
            :value="getPermission(field).mode"
            @change="
              (value: unknown) =>
                updatePermission(field, {
                  mode: value as FieldPermissionMode,
                })
            "
          />
          <span
            class="flex items-center justify-end gap-6 text-11px text-secondary"
          >
            必填
            <a-switch
              :checked="getPermission(field).required"
              @update:checked="
                (checked: boolean) =>
                  updatePermission(field, { required: checked })
              "
            />
          </span>
        </div>
        <a-empty
          v-if="schema.formFields.length === 0"
          description="请先在「表单设计」中添加字段"
        />
      </div>
    </article>

    <!-- 消息通知 -->
    <article class="rounded-10 b-1-regular bg-container p-14">
      <header class="mb-12">
        <h2 class="m-0 text-sm text-main font-700">消息通知</h2>
        <p class="m-0 mt-2 text-xs text-secondary">
          选择通知渠道与需要触发的流程事件
        </p>
      </header>

      <label class="block text-xs text-secondary">
        通知渠道
        <a-select
          mode="multiple"
          class="mt-6 w-full"
          :options="channelOptions"
          :value="extensions.notifications.channels"
          @change="
            (value: unknown) =>
              patchNotifications({
                channels: value as string[],
              })
          "
        />
      </label>

      <div class="mt-12 grid grid-cols-2 gap-8">
        <span
          v-for="item in notificationEvents"
          :key="item.key"
          class="flex items-center justify-between gap-8 rounded-7 bg-fill px-9 py-7 text-xs text-secondary"
        >
          {{ item.label }}
          <a-switch
            :checked="extensions.notifications[item.key]"
            @update:checked="
              (checked: boolean) => patchNotifications({ [item.key]: checked })
            "
          />
        </span>
      </div>
    </article>

    <!-- 时限与超时 -->
    <article class="rounded-10 b-1-regular bg-container p-14">
      <header class="mb-12 flex items-center justify-between gap-8">
        <div>
          <h2 class="m-0 text-sm text-main font-700">时限与超时处理</h2>
          <p class="m-0 mt-2 text-xs text-secondary">
            节点默认审批时限，可在流程节点中单独覆盖
          </p>
        </div>
        <a-switch
          :checked="extensions.timeout.enabled"
          @update:checked="
            (checked: boolean) => patchTimeout({ enabled: checked })
          "
        />
      </header>

      <div class="grid grid-cols-2 gap-8">
        <label class="block text-xs text-secondary">
          审批时限（小时）
          <a-input-number
            class="mt-6 w-full"
            :min="1"
            :value="extensions.timeout.hours"
            @update:value="
              (value: number | null) => patchTimeout({ hours: value ?? 1 })
            "
          />
        </label>
        <label class="block text-xs text-secondary">
          提醒间隔（小时）
          <a-input-number
            class="mt-6 w-full"
            :min="1"
            :value="extensions.timeout.remindEveryHours"
            @update:value="
              (value: number | null) =>
                patchTimeout({ remindEveryHours: value ?? 1 })
            "
          />
        </label>
      </div>

      <label class="mt-10 block text-xs text-secondary">
        超时升级
        <a-select
          class="mt-6 w-full"
          :options="timeoutEscalationOptions"
          :value="extensions.timeout.escalation"
          @change="
            (value: unknown) =>
              patchTimeout({
                escalation:
                  value as ApprovalGlobalTimeoutSettings['escalation'],
              })
          "
        />
      </label>
    </article>

    <!-- 异常处理 -->
    <article class="rounded-10 b-1-regular bg-container p-14">
      <header class="mb-12">
        <h2 class="m-0 text-sm text-main font-700">异常处理</h2>
        <p class="m-0 mt-2 text-xs text-secondary">
          无审批人、重复审批人与节点执行失败时的兜底策略
        </p>
      </header>

      <div class="grid gap-10">
        <label class="block text-xs text-secondary">
          审批人为空
          <a-select
            class="mt-6 w-full"
            :options="emptyApproverOptions"
            :value="extensions.exception.emptyApprover"
            @change="
              (value: unknown) =>
                patchException({
                  emptyApprover:
                    value as ApprovalExceptionPolicy['emptyApprover'],
                })
            "
          />
        </label>
        <label class="block text-xs text-secondary">
          重复审批人
          <a-select
            class="mt-6 w-full"
            :options="duplicateApproverOptions"
            :value="extensions.exception.duplicateApprover"
            @change="
              (value: unknown) =>
                patchException({
                  duplicateApprover:
                    value as ApprovalExceptionPolicy['duplicateApprover'],
                })
            "
          />
        </label>
        <label class="block text-xs text-secondary">
          节点执行失败
          <a-select
            class="mt-6 w-full"
            :options="nodeFailureOptions"
            :value="extensions.exception.nodeFailure"
            @change="
              (value: unknown) =>
                patchException({
                  nodeFailure: value as ApprovalExceptionPolicy['nodeFailure'],
                })
            "
          />
        </label>
      </div>
    </article>

    <!-- 发起与流转规则 -->
    <article class="rounded-10 b-1-regular bg-container p-14">
      <header class="mb-12">
        <h2 class="m-0 text-sm text-main font-700">发起与流转规则</h2>
        <p class="m-0 mt-2 text-xs text-secondary">
          控制撤回、重新提交、催办与流程终止
        </p>
      </header>

      <div class="grid grid-cols-2 gap-8">
        <span
          v-for="item in initiationOptions"
          :key="item.key"
          class="flex items-center justify-between gap-8 rounded-7 bg-fill px-9 py-7 text-xs text-secondary"
        >
          {{ item.label }}
          <a-switch
            :checked="extensions.initiation[item.key]"
            @update:checked="
              (checked: boolean) => patchInitiation({ [item.key]: checked })
            "
          />
        </span>
      </div>

      <label class="mt-10 block text-xs text-secondary">
        最大重新提交次数
        <a-input-number
          class="mt-6 w-full"
          :min="1"
          :max="20"
          :value="extensions.initiation.maxResubmitCount"
          @update:value="
            (value: number | null) =>
              patchInitiation({ maxResubmitCount: value ?? 1 })
          "
        />
      </label>
    </article>

    <!-- 数据权限 -->
    <article class="rounded-10 b-1-regular bg-container p-14">
      <header class="mb-12">
        <h2 class="m-0 text-sm text-main font-700">数据权限</h2>
        <p class="m-0 mt-2 text-xs text-secondary">
          控制审批实例的查询范围与管理权限
        </p>
      </header>

      <label class="block text-xs text-secondary">
        实例查询范围
        <a-select
          class="mt-6 w-full"
          :options="dataScopeOptions"
          :value="extensions.dataPermission.dataScope"
          @change="
            (value: unknown) =>
              patchDataPermission({
                dataScope: value as ApprovalDataPermission['dataScope'],
              })
          "
        />
      </label>

      <label class="mt-10 block text-xs text-secondary">
        流程管理员
        <a-select
          mode="multiple"
          class="mt-6 w-full"
          :max-tag-count="2"
          :options="userOptions"
          :value="extensions.dataPermission.adminUserIds"
          @change="
            (value: unknown) =>
              patchDataPermission({ adminUserIds: value as string[] })
          "
        />
      </label>
    </article>

    <!-- 自动化动作 -->
    <article class="rounded-10 b-1-regular bg-container p-14 xl:col-span-2">
      <header class="mb-12 flex flex-wrap items-center gap-8">
        <div class="min-w-0 flex-1">
          <h2 class="m-0 text-sm text-main font-700">自动化动作</h2>
          <p class="m-0 mt-2 text-xs text-secondary">
            配置流程开始、节点完成、流程结束时触发的业务动作。配置会随 Schema
            保存，待后端执行引擎接入后生效。
          </p>
        </div>
        <a-button @click="addAutomation">
          <template #icon><Icon name="i-lucide:plus" /></template>
          添加动作
        </a-button>
      </header>

      <a-empty
        v-if="extensions.automation.length === 0"
        description="暂无自动化动作"
      />

      <div v-else class="grid gap-9">
        <div
          v-for="(action, index) in extensions.automation"
          :key="action.id"
          class="grid gap-8 rounded-7 b-1-regular bg-fill p-10 md:grid-cols-[minmax(0,1fr)_120px_110px_minmax(0,1fr)_80px_32px]"
        >
          <a-input
            size="small"
            placeholder="动作名称"
            :value="action.name"
            @update:value="
              (value: string) =>
                updateAutomation(index, { name: String(value) })
            "
          />
          <a-select
            size="small"
            :options="automationTriggerOptions"
            :value="action.trigger"
            @change="
              (value: unknown) =>
                updateAutomation(index, {
                  trigger: value as ApprovalAutomationTrigger,
                })
            "
          />
          <a-select
            size="small"
            :options="automationTypeOptions"
            :value="action.type"
            @change="
              (value: unknown) =>
                updateAutomation(index, {
                  type: value as ApprovalAutomationType,
                })
            "
          />
          <a-input
            size="small"
            :placeholder="
              action.type === 'webhook' ? 'Webhook URL' : '目标状态值'
            "
            :value="action.target"
            @update:value="
              (value: string) =>
                updateAutomation(index, { target: String(value) })
            "
          />
          <span
            class="flex items-center justify-end gap-6 text-11px text-secondary"
          >
            启用
            <a-switch
              :checked="action.enabled"
              @update:checked="
                (checked: boolean) =>
                  updateAutomation(index, { enabled: checked })
              "
            />
          </span>
          <a-button
            danger
            size="small"
            type="text"
            @click="removeAutomation(index)"
          >
            <Icon name="i-lucide:trash-2" :size="14" />
          </a-button>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@/components/icon'
import { createDefaultApprovalExtensions } from '@/components/approval-designer'
import type {
  ApprovalAutomationAction,
  ApprovalAutomationTrigger,
  ApprovalAutomationType,
  ApprovalDataPermission,
  ApprovalExceptionPolicy,
  ApprovalFormField,
  ApprovalGlobalTimeoutSettings,
  ApprovalPermissionRole,
  ApprovalRoleFieldPermission,
  ApprovalUserRef,
  ApprovalWorkflowExtensions,
  ApprovalWorkflowSchema,
  FieldPermissionMode,
} from '@/components/approval-designer'

const props = defineProps<{
  schema: ApprovalWorkflowSchema
  users: readonly ApprovalUserRef[]
}>()

const emits = defineEmits<{
  'update:schema': [schema: ApprovalWorkflowSchema]
}>()

const permissionRole = shallowRef<ApprovalPermissionRole>('applicant')

const extensions = computed(
  () => props.schema.extensions ?? createDefaultApprovalExtensions()
)

const permissionFields = computed(() =>
  props.schema.formFields.filter((field) => field.type !== 'divider')
)

const permissionRoleOptions = [
  { label: '申请人', value: 'applicant' },
  { label: '审批人', value: 'approver' },
  { label: '办理人', value: 'handler' },
]

const fieldPermissionOptions: { label: string; value: FieldPermissionMode }[] =
  [
    { label: '只读', value: 'readonly' },
    { label: '可编辑', value: 'editable' },
    { label: '隐藏', value: 'hidden' },
  ]

const channelOptions = [
  { label: '站内信', value: '站内信' },
  { label: '邮件', value: '邮件' },
  { label: '短信', value: '短信' },
  { label: '钉钉工作通知', value: '钉钉工作通知' },
]

const notificationEvents = [
  { key: 'onSubmit', label: '提交成功' },
  { key: 'onPending', label: '待审批' },
  { key: 'onApproved', label: '审批通过' },
  { key: 'onRejected', label: '审批驳回' },
  { key: 'onCc', label: '抄送通知' },
  { key: 'onTimeout', label: '超时提醒' },
] as const

const timeoutEscalationOptions = [
  { label: '不升级', value: 'none' },
  { label: '升级到流程管理员', value: 'admin' },
  { label: '升级到上级主管', value: 'superior' },
]

const emptyApproverOptions = [
  { label: '自动通过', value: 'autoPass' },
  { label: '转交管理员', value: 'admin' },
  { label: '报错拦截', value: 'error' },
]

const duplicateApproverOptions = [
  { label: '自动去重', value: 'dedupe' },
  { label: '保留重复', value: 'keep' },
]

const nodeFailureOptions = [
  { label: '暂停流程', value: 'pause' },
  { label: '终止流程', value: 'terminate' },
  { label: '自动重试', value: 'retry' },
]

const initiationOptions = [
  { key: 'allowRevoke', label: '允许撤回' },
  { key: 'allowResubmit', label: '允许重新提交' },
  { key: 'allowUrge', label: '允许催办' },
  { key: 'allowTerminate', label: '允许终止流程' },
] as const

const dataScopeOptions = [
  { label: '仅本人发起', value: 'self' },
  { label: '本部门', value: 'department' },
  { label: '全部数据', value: 'all' },
]

const automationTriggerOptions = [
  { label: '流程开始', value: 'start' },
  { label: '节点完成', value: 'nodeComplete' },
  { label: '流程结束', value: 'end' },
]

const automationTypeOptions = [
  { label: 'Webhook', value: 'webhook' },
  { label: '更新状态', value: 'status' },
]

const userOptions = computed(() =>
  props.users.map((user) => ({
    label: user.dept ? `${user.name} / ${user.dept}` : user.name,
    value: user.id,
  }))
)

function patchExtensions(patch: Partial<ApprovalWorkflowExtensions>) {
  emits('update:schema', {
    ...props.schema,
    extensions: {
      ...extensions.value,
      ...patch,
    },
  })
}

function getPermission(field: ApprovalFormField): ApprovalRoleFieldPermission {
  return (
    extensions.value.roleFieldPermissions.find(
      (item) => item.role === permissionRole.value && item.field === field.key
    ) ?? {
      role: permissionRole.value,
      field: field.key,
      mode: field.required ? 'readonly' : 'editable',
      required: field.required,
    }
  )
}

function updatePermission(
  field: ApprovalFormField,
  patch: Partial<ApprovalRoleFieldPermission>
) {
  const next = extensions.value.roleFieldPermissions.filter(
    (item) => !(item.role === permissionRole.value && item.field === field.key)
  )
  next.push({ ...getPermission(field), ...patch })
  patchExtensions({ roleFieldPermissions: next })
}

function patchNotifications(
  patch: Partial<ApprovalWorkflowExtensions['notifications']>
) {
  patchExtensions({
    notifications: { ...extensions.value.notifications, ...patch },
  })
}

function patchTimeout(patch: Partial<ApprovalGlobalTimeoutSettings>) {
  patchExtensions({ timeout: { ...extensions.value.timeout, ...patch } })
}

function patchException(patch: Partial<ApprovalExceptionPolicy>) {
  patchExtensions({
    exception: { ...extensions.value.exception, ...patch },
  })
}

function patchInitiation(
  patch: Partial<ApprovalWorkflowExtensions['initiation']>
) {
  patchExtensions({
    initiation: { ...extensions.value.initiation, ...patch },
  })
}

function patchDataPermission(patch: Partial<ApprovalDataPermission>) {
  patchExtensions({
    dataPermission: { ...extensions.value.dataPermission, ...patch },
  })
}

function addAutomation() {
  const action: ApprovalAutomationAction = {
    id: `automation-${Date.now().toString(36)}`,
    name: '新自动化动作',
    trigger: 'end',
    type: 'webhook',
    target: '',
    enabled: true,
  }
  patchExtensions({ automation: [...extensions.value.automation, action] })
}

function updateAutomation(
  index: number,
  patch: Partial<ApprovalAutomationAction>
) {
  patchExtensions({
    automation: extensions.value.automation.map((item, current) =>
      current === index ? { ...item, ...patch } : item
    ),
  })
}

function removeAutomation(index: number) {
  patchExtensions({
    automation: extensions.value.automation.filter(
      (_, current) => current !== index
    ),
  })
}
</script>
