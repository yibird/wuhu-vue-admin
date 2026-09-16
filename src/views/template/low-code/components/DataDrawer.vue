<template>
  <a-drawer
    :open="open"
    title="数据与逻辑"
    :width="680"
    :body-style="{ padding: 0 }"
    @close="emit('close')"
  >
    <div class="grid h-full grid-rows-[auto_minmax(0,1fr)]">
      <div
        class="flex gap-4 border-0 border-b-1 border-color-2 border-b-solid px-14 py-10"
      >
        <button
          v-for="item in tabs"
          :key="item.key"
          class="lc-data-tab"
          :class="{ 'is-active': activeTab === item.key }"
          type="button"
          @click="activeTab = item.key"
        >
          {{ item.label }}
          <span class="lc-data-tab__count">{{ countOf(item.key) }}</span>
        </button>
      </div>

      <Scrollbar class="min-h-0">
        <div class="grid gap-10 p-14">
          <!-- 变量 -->
          <template v-if="activeTab === 'variables'">
            <div
              v-for="(variable, index) in designer.schema.variables"
              :key="variable.id"
              class="lc-data-card"
            >
              <div class="flex-y-center gap-6">
                <a-input
                  :value="variable.name"
                  class="flex-1"
                  placeholder="变量名"
                  @change="updateVariable(index, 'name', $event)"
                />
                <a-select
                  :value="variable.type"
                  class="w-100px"
                  :options="variableTypeOptions"
                  @change="updateVariable(index, 'type', $event)"
                />
                <a-select
                  :value="variable.scope"
                  class="w-90px"
                  :options="[
                    { label: '应用级', value: 'app' },
                    { label: '页面级', value: 'page' },
                  ]"
                  @change="updateVariable(index, 'scope', $event)"
                />
                <button
                  class="lc-data-remove"
                  type="button"
                  @click="removeVariable(index)"
                >
                  <Icon name="i-lucide:trash-2" :size="13" />
                </button>
              </div>
              <JsonFieldEditor
                :model-value="variable.initial"
                :rows="2"
                @update:model-value="updateVariable(index, 'initial', $event)"
              />
            </div>
            <a-button type="dashed" block @click="addVariable">
              <Icon name="i-lucide:plus" :size="13" class="mr-4" /> 新增变量
            </a-button>
          </template>

          <!-- 数据源 -->
          <template v-else-if="activeTab === 'dataSources'">
            <div
              v-for="(source, index) in designer.schema.dataSources"
              :key="source.id"
              class="lc-data-card"
            >
              <div class="flex-y-center gap-6">
                <a-input
                  :value="source.name"
                  class="flex-1"
                  placeholder="数据源名称"
                  @change="updateDataSource(index, 'name', $event)"
                />
                <a-select
                  :value="source.type"
                  class="w-100px"
                  :options="[
                    { label: '静态数据', value: 'static' },
                    { label: 'REST', value: 'rest' },
                  ]"
                  @change="updateDataSourceType(index, $event)"
                />
                <button
                  class="lc-data-remove"
                  type="button"
                  @click="removeDataSource(index)"
                >
                  <Icon name="i-lucide:trash-2" :size="13" />
                </button>
              </div>
              <template v-if="source.type === 'rest'">
                <div class="flex-y-center gap-6">
                  <a-select
                    :value="source.config.method ?? 'GET'"
                    class="w-90px"
                    :options="methodOptions"
                    @change="updateDataSourceConfig(index, 'method', $event)"
                  />
                  <a-input
                    :value="source.config.url ?? ''"
                    class="flex-1"
                    placeholder="https://api.example.com/users"
                    @change="updateDataSourceConfig(index, 'url', $event)"
                  />
                </div>
              </template>
              <JsonFieldEditor
                v-else
                :model-value="source.config.value"
                :rows="2"
                @update:model-value="updateDataSourceValue(index, $event)"
              />
            </div>
            <a-button type="dashed" block @click="addDataSource">
              <Icon name="i-lucide:plus" :size="13" class="mr-4" /> 新增数据源
            </a-button>
          </template>

          <!-- 查询 -->
          <template v-else-if="activeTab === 'queries'">
            <div
              v-for="(query, index) in designer.schema.queries"
              :key="query.id"
              class="lc-data-card"
            >
              <div class="flex-y-center gap-6">
                <a-input
                  :value="query.name"
                  class="flex-1"
                  placeholder="查询名称"
                  @change="updateQuery(index, 'name', $event)"
                />
                <a-select
                  :value="query.dataSourceId"
                  class="w-150px"
                  :options="dataSourceOptions"
                  placeholder="数据源"
                  @change="updateQuery(index, 'dataSourceId', $event)"
                />
                <button
                  class="lc-data-remove"
                  type="button"
                  @click="removeQuery(index)"
                >
                  <Icon name="i-lucide:trash-2" :size="13" />
                </button>
              </div>
              <div class="flex-y-center gap-6">
                <a-select
                  :value="query.trigger ?? 'manual'"
                  class="w-120px"
                  :options="[
                    { label: '手动触发', value: 'manual' },
                    { label: '页面加载', value: 'pageLoad' },
                  ]"
                  @change="updateQuery(index, 'trigger', $event)"
                />
                <a-input-number
                  :value="query.interval"
                  class="w-120px"
                  :min="1000"
                  :step="1000"
                  placeholder="轮询间隔"
                  @change="updateQuery(index, 'interval', $event)"
                />
                <span class="text-11px text-muted"
                  >查询 id：{{ query.id }}</span
                >
              </div>
              <label class="grid gap-4">
                <span class="text-11px text-secondary"
                  >参数（JSON，值支持 ValueSchema）</span
                >
                <JsonFieldEditor
                  :model-value="query.params"
                  :rows="2"
                  @update:model-value="updateQuery(index, 'params', $event)"
                />
              </label>
              <label class="grid gap-4">
                <span class="text-11px text-secondary"
                  >结果转换表达式（可选，用 _ 表示原始结果）</span
                >
                <a-input
                  :value="query.transform ?? ''"
                  placeholder="例如 _.list.filter(item => item.enabled)"
                  @change="
                    updateQuery(
                      index,
                      'transform',
                      ($event.target as HTMLInputElement).value || undefined
                    )
                  "
                />
              </label>
            </div>
            <a-button type="dashed" block @click="addQuery">
              <Icon name="i-lucide:plus" :size="13" class="mr-4" /> 新增查询
            </a-button>
          </template>

          <!-- 动作 -->
          <template v-else-if="activeTab === 'actions'">
            <div
              v-for="(action, index) in designer.schema.actions"
              :key="action.id"
              class="lc-data-card"
            >
              <div class="flex-y-center gap-6">
                <a-input
                  :value="action.name ?? ''"
                  class="flex-1"
                  placeholder="动作名称"
                  @change="updateAction(index, 'name', $event)"
                />
                <a-select
                  :value="action.type"
                  class="w-140px"
                  :options="actionTypeOptions"
                  @change="updateActionType(index, $event)"
                />
                <button
                  class="lc-data-remove"
                  type="button"
                  @click="removeAction(index)"
                >
                  <Icon name="i-lucide:trash-2" :size="13" />
                </button>
              </div>
              <div
                v-if="paramsOf(action.type).length"
                class="grid gap-8 border-0 border-t-1 border-color-2 border-t-solid pt-8"
              >
                <ActionValueControl
                  v-for="param in paramsOf(action.type)"
                  :key="param.key"
                  :field="param"
                  :value="action.params?.[param.key]"
                  @update:value="updateActionParam(index, param.key, $event)"
                />
              </div>
              <div class="text-11px text-muted">动作 id：{{ action.id }}</div>
            </div>
            <a-button type="dashed" block @click="addAction">
              <Icon name="i-lucide:plus" :size="13" class="mr-4" /> 新增动作
            </a-button>
          </template>

          <!-- 工作流 -->
          <template v-else-if="activeTab === 'workflows'">
            <div
              v-for="(workflow, index) in designer.schema.workflows"
              :key="workflow.id"
              class="lc-data-card"
            >
              <div class="flex-y-center gap-6">
                <a-input
                  :value="workflow.name"
                  class="flex-1"
                  placeholder="工作流名称"
                  @change="updateWorkflow(index, 'name', $event)"
                />
                <a-select
                  :value="workflow.trigger?.type ?? 'manual'"
                  class="w-120px"
                  :options="triggerOptions"
                  @change="updateWorkflowTrigger(index, $event)"
                />
                <button
                  class="lc-data-remove"
                  type="button"
                  @click="removeWorkflow(index)"
                >
                  <Icon name="i-lucide:trash-2" :size="13" />
                </button>
              </div>
              <div class="text-11px text-muted">
                id：{{ workflow.id }} · 步骤支持 action / condition / parallel /
                loop
              </div>
              <JsonFieldEditor
                :model-value="workflow.steps"
                :rows="5"
                @update:model-value="updateWorkflowSteps(index, $event)"
              />
            </div>
            <a-button type="dashed" block @click="addWorkflow">
              <Icon name="i-lucide:plus" :size="13" class="mr-4" /> 新增工作流
            </a-button>
          </template>

          <!-- 权限 -->
          <template v-else>
            <div class="text-xs text-secondary">
              权限模型：User → Role → Permission(resource + actions)。
              页面权限独立管理，不写入 PageSchema。
            </div>
            <div
              v-for="(role, index) in roles"
              :key="role.id"
              class="lc-data-card"
            >
              <div class="flex-y-center gap-6">
                <a-input
                  :value="role.id"
                  class="w-140px"
                  placeholder="角色 id"
                  @change="updateRole(index, 'id', $event)"
                />
                <a-input
                  :value="role.name"
                  class="flex-1"
                  placeholder="角色名称"
                  @change="updateRole(index, 'name', $event)"
                />
                <button
                  class="lc-data-remove"
                  type="button"
                  @click="removeRole(index)"
                >
                  <Icon name="i-lucide:trash-2" :size="13" />
                </button>
              </div>
              <JsonFieldEditor
                :model-value="role.permissions"
                :rows="2"
                @update:model-value="updateRolePermissions(index, $event)"
              />
            </div>
            <a-button type="dashed" block @click="addRole">
              <Icon name="i-lucide:plus" :size="13" class="mr-4" /> 新增角色
            </a-button>

            <div class="mt-8 text-xs text-main font-600">
              页面权限（pageId → 允许角色）
            </div>
            <JsonFieldEditor
              :model-value="designer.schema.permissions?.pages ?? {}"
              :rows="3"
              @update:model-value="updatePagePermissions"
            />
          </template>
        </div>
      </Scrollbar>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon, Scrollbar } from '@/components'
import { actionRegistry } from '../core/runtime'
import { createNodeId } from '../core/schema'
import { useDesignerContext } from '../composables'
import ActionValueControl from './inspector/ActionValueControl.vue'
import JsonFieldEditor from './inspector/JsonFieldEditor.vue'
import type { ValueSchema } from '../core/schema/types'

type DataTab =
  | 'variables'
  | 'dataSources'
  | 'queries'
  | 'actions'
  | 'workflows'
  | 'permissions'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const designer = useDesignerContext()
const activeTab = ref<DataTab>('variables')

const tabs: { key: DataTab; label: string }[] = [
  { key: 'variables', label: '变量' },
  { key: 'dataSources', label: '数据源' },
  { key: 'queries', label: '查询' },
  { key: 'actions', label: '动作' },
  { key: 'workflows', label: '工作流' },
  { key: 'permissions', label: '权限' },
]

const variableTypeOptions = [
  { label: '文本', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '布尔', value: 'boolean' },
  { label: 'JSON', value: 'json' },
]
const methodOptions = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(
  (value) => ({
    label: value,
    value,
  })
)
const triggerOptions = [
  { label: '手动', value: 'manual' },
  { label: '页面事件', value: 'componentEvent' },
  { label: '页面加载', value: 'pageLoad' },
  { label: '定时', value: 'schedule' },
  { label: 'Webhook', value: 'webhook' },
]

const actionTypeOptions = computed(() =>
  actionRegistry.list().map((item) => ({ label: item.label, value: item.type }))
)
const dataSourceOptions = computed(() =>
  designer.schema.dataSources.map((source) => ({
    label: source.name,
    value: source.id,
  }))
)
const roles = computed(() => designer.schema.permissions?.roles ?? [])

function countOf(key: DataTab) {
  switch (key) {
    case 'variables':
      return designer.schema.variables.length
    case 'dataSources':
      return designer.schema.dataSources.length
    case 'queries':
      return designer.schema.queries.length
    case 'actions':
      return designer.schema.actions.length
    case 'workflows':
      return designer.schema.workflows.length
    default:
      return roles.value.length
  }
}

function paramsOf(type: string) {
  return actionRegistry.get(type)?.params ?? []
}

function text(event: Event) {
  return (event.target as HTMLInputElement).value
}

function numberOrNull(value: number | null) {
  return value === null ? undefined : value
}

/** 变量 */
function updateVariable(
  index: number,
  key: 'name' | 'type' | 'scope' | 'initial',
  event: Event | unknown
) {
  const value = key === 'initial' ? event : text(event as Event)
  designer.editSection(
    'variables',
    '修改变量',
    (variables) => {
      const variable = variables[index]
      if (!variable) return
      Object.assign(variable, { [key]: value })
    },
    `variable:${index}:${key}`
  )
}

function addVariable() {
  designer.editSection('variables', '新增变量', (variables) => {
    variables.push({
      id: createNodeId('var'),
      name: `variable${variables.length + 1}`,
      type: 'string',
      scope: 'page',
      initial: { type: 'value', value: '' },
    })
  })
}

function removeVariable(index: number) {
  designer.editSection('variables', '删除变量', (variables) => {
    variables.splice(index, 1)
  })
}

/** 数据源 */
function updateDataSource(index: number, key: 'name', event: Event) {
  designer.editSection(
    'dataSources',
    '修改数据源',
    (sources) => {
      const source = sources[index]
      if (source) source[key] = text(event)
    },
    `datasource:${index}:${key}`
  )
}

function updateDataSourceType(index: number, value: unknown) {
  designer.editSection('dataSources', '修改数据源类型', (sources) => {
    const source = sources[index]
    if (source) source.type = value as 'static' | 'rest'
  })
}

function updateDataSourceConfig(
  index: number,
  key: 'url' | 'method',
  value: unknown
) {
  designer.editSection(
    'dataSources',
    '修改数据源配置',
    (sources) => {
      const source = sources[index]
      if (!source) return
      if (key === 'method') source.config.method = value as 'GET'
      else source.config.url = String(value)
    },
    `datasource-config:${index}:${key}`
  )
}

function updateDataSourceValue(index: number, value: unknown) {
  designer.editSection(
    'dataSources',
    '修改静态数据',
    (sources) => {
      const source = sources[index]
      if (source) source.config.value = value as ValueSchema
    },
    `datasource-value:${index}`
  )
}

function addDataSource() {
  designer.editSection('dataSources', '新增数据源', (sources) => {
    sources.push({
      id: createNodeId('ds'),
      name: `数据源${sources.length + 1}`,
      type: 'static',
      config: { value: { type: 'value', value: [] } },
    })
  })
}

function removeDataSource(index: number) {
  designer.editSection('dataSources', '删除数据源', (sources) => {
    sources.splice(index, 1)
  })
}

/** 查询 */
function updateQuery(index: number, key: string, value: unknown) {
  designer.editSection(
    'queries',
    '修改查询',
    (queries) => {
      const query = queries[index]
      if (!query) return
      if (key === 'interval') {
        query.interval = numberOrNull(value as number | null)
        return
      }
      Object.assign(query, { [key]: value })
    },
    `query:${index}:${key}`
  )
}

function addQuery() {
  designer.editSection('queries', '新增查询', (queries) => {
    queries.push({
      id: `query${queries.length + 1}`,
      name: `查询${queries.length + 1}`,
      dataSourceId: designer.schema.dataSources[0]?.id ?? '',
      trigger: 'manual',
    })
  })
}

function removeQuery(index: number) {
  designer.editSection('queries', '删除查询', (queries) => {
    queries.splice(index, 1)
  })
}

/** 动作 */
function updateAction(index: number, key: 'name', event: Event) {
  designer.editSection(
    'actions',
    '修改动作',
    (actions) => {
      const action = actions[index]
      if (action) action[key] = text(event)
    },
    `action:${index}:${key}`
  )
}

function updateActionType(index: number, value: unknown) {
  designer.editSection('actions', '修改动作类型', (actions) => {
    const action = actions[index]
    if (!action) return
    action.type = String(value)
    const params: Record<string, ValueSchema> = {}
    for (const param of paramsOf(action.type)) {
      params[param.key] = { type: 'value', value: param.defaultValue ?? '' }
    }
    action.params = params
  })
}

function updateActionParam(index: number, key: string, value: ValueSchema) {
  designer.editSection(
    'actions',
    '修改动作参数',
    (actions) => {
      const action = actions[index]
      if (!action) return
      action.params = { ...action.params, [key]: value }
    },
    `action-param:${index}:${key}`
  )
}

function addAction() {
  const type = actionRegistry.list()[0]?.type ?? 'showMessage'
  designer.editSection('actions', '新增动作', (actions) => {
    actions.push({
      id: createNodeId('action'),
      name: `动作${actions.length + 1}`,
      type,
      params: {},
    })
  })
}

function removeAction(index: number) {
  designer.editSection('actions', '删除动作', (actions) => {
    actions.splice(index, 1)
  })
}

/** 工作流 */
function updateWorkflow(index: number, key: 'name', event: Event) {
  designer.editSection(
    'workflows',
    '修改工作流',
    (workflows) => {
      const workflow = workflows[index]
      if (workflow) workflow[key] = text(event)
    },
    `workflow:${index}:${key}`
  )
}

function updateWorkflowTrigger(index: number, value: unknown) {
  designer.editSection('workflows', '修改触发器', (workflows) => {
    const workflow = workflows[index]
    if (workflow) {
      workflow.trigger = {
        type: String(value) as 'manual',
        config: workflow.trigger?.config,
      }
    }
  })
}

function updateWorkflowSteps(index: number, value: unknown) {
  designer.editSection(
    'workflows',
    '修改工作流步骤',
    (workflows) => {
      const workflow = workflows[index]
      if (workflow && Array.isArray(value)) {
        workflow.steps = value as typeof workflow.steps
      }
    },
    `workflow-steps:${index}`
  )
}

function addWorkflow() {
  designer.editSection('workflows', '新增工作流', (workflows) => {
    workflows.push({
      id: createNodeId('workflow'),
      name: `工作流${workflows.length + 1}`,
      trigger: { type: 'manual' },
      steps: [],
    })
  })
}

function removeWorkflow(index: number) {
  designer.editSection('workflows', '删除工作流', (workflows) => {
    workflows.splice(index, 1)
  })
}

/** 权限 */
function ensurePermissions() {
  if (!designer.schema.permissions) {
    designer.schema.permissions = { roles: [], pages: {} }
  }
  return designer.schema.permissions
}

function updateRole(index: number, key: 'id' | 'name', event: Event) {
  designer.editSection(
    'permissions',
    '修改角色',
    () => {
      const permission = ensurePermissions()
      const role = permission.roles[index]
      if (role) role[key] = text(event)
    },
    `role:${index}:${key}`
  )
}

function updateRolePermissions(index: number, value: unknown) {
  designer.editSection(
    'permissions',
    '修改角色权限',
    () => {
      const permission = ensurePermissions()
      const role = permission.roles[index]
      if (role && Array.isArray(value)) {
        role.permissions = value as typeof role.permissions
      }
    },
    `role-permissions:${index}`
  )
}

function addRole() {
  designer.editSection('permissions', '新增角色', () => {
    const permission = ensurePermissions()
    permission.roles.push({
      id: `role${permission.roles.length + 1}`,
      name: `角色${permission.roles.length + 1}`,
      permissions: [],
    })
  })
}

function removeRole(index: number) {
  designer.editSection('permissions', '删除角色', () => {
    ensurePermissions().roles.splice(index, 1)
  })
}

function updatePagePermissions(value: unknown) {
  designer.editSection(
    'permissions',
    '修改页面权限',
    () => {
      const permission = ensurePermissions()
      permission.pages = (value ?? {}) as Record<string, string[]>
    },
    'page-permissions'
  )
}
</script>

<style scoped lang="less">
.lc-data-tab {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 5px 10px;
  font-size: 12px;
  color: rgb(var(--w-text-secondary));
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 6px;

  &:hover {
    color: rgb(var(--w-color-primary));
  }

  &.is-active {
    color: rgb(var(--w-color-primary));
    background: rgb(var(--w-bg-primary) / 8%);
  }

  &__count {
    font-size: 10px;
    color: rgb(var(--w-text-muted));
  }
}

.lc-data-card {
  display: grid;
  gap: 8px;
  padding: 10px;
  background: rgb(var(--w-bg-fill-quaternary));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

.lc-data-remove {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: rgb(var(--w-text-muted));
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 5px;

  &:hover {
    color: rgb(var(--w-color-error));
    background: rgb(var(--w-color-error) / 8%);
  }
}
</style>
