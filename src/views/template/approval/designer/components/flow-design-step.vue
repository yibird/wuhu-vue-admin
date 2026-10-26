<template>
  <section class="h-full min-h-0 flex flex-col gap-10 overflow-hidden">
    <div
      class="flex flex-none flex-wrap items-center gap-8 rounded-8 b-1-regular bg-container px-12 py-9"
    >
      <div class="min-w-0 flex-1">
        <h2 class="m-0 text-sm text-main font-700">流程设计</h2>
        <p class="m-0 mt-2 text-xs text-secondary">
          添加节点并通过右键菜单调整顺序；选中节点后在右侧配置审批规则
        </p>
      </div>
      <a-tag :color="errors.length ? 'error' : 'success'">
        {{ errors.length ? `${errors.length} 个问题` : '校验通过' }}
      </a-tag>
      <a-button @click="previewOpen = true">
        <template #icon><Icon name="i-lucide:eye" /></template>
        流程预览
      </a-button>
    </div>

    <div
      v-if="errors.length"
      class="max-h-160 flex-none overflow-y-auto rounded-8 b-1-error/25 bg-error/6 px-12 py-10"
    >
      <strong class="text-xs text-error">设计校验未通过</strong>
      <ul class="mb-0 mt-6 grid gap-4 pl-16 text-xs text-secondary">
        <li v-for="issue in errors" :key="issue.id">
          {{ issue.title }}：{{ issue.description }}
        </li>
      </ul>
    </div>

    <div class="min-h-0 flex-1 overflow-hidden">
      <ApprovalDesigner
        v-model="schemaModel"
        embedded
        :initial-selected-node-id="'approver'"
        :templates="templates"
        :users="users"
      />
    </div>

    <a-modal
      v-model:open="previewOpen"
      :footer="null"
      :width="720"
      title="流程预览"
    >
      <div class="max-h-[64vh] overflow-y-auto">
        <a-empty v-if="previewItems.length === 0" description="暂无流程节点" />
        <div v-else class="grid gap-8">
          <div
            v-for="item in previewItems"
            :key="item.id"
            class="rounded-7 b-1-regular bg-secondary px-10 py-8"
            :style="{ marginLeft: `${item.depth * 18}px` }"
          >
            <div class="flex items-center gap-7">
              <Icon
                :name="item.icon"
                :size="15"
                :class="
                  item.kind === 'branch' ? 'text-warning' : 'text-primary'
                "
              />
              <strong class="text-xs text-main">{{ item.title }}</strong>
              <span class="rounded-4 bg-fill px-5 py-2 text-10px text-tertiary">
                {{ item.kindLabel }}
              </span>
            </div>
            <p v-if="item.detail" class="m-0 mt-4 text-11px text-secondary">
              {{ item.detail }}
            </p>
          </div>
        </div>
      </div>
    </a-modal>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@/components'
import {
  ApprovalDesigner,
  collectNodes,
  validateApprovalWorkflow,
} from '@/components'
import type {
  ApprovalBranch,
  ApprovalNode,
  ApprovalTemplateItem,
  ApprovalUserRef,
  ApprovalWorkflowSchema,
} from '@/components'

const props = defineProps<{
  schema: ApprovalWorkflowSchema
  users: readonly ApprovalUserRef[]
  templates: readonly ApprovalTemplateItem[]
}>()

const emits = defineEmits<{
  'update:schema': [schema: ApprovalWorkflowSchema]
}>()

const previewOpen = shallowRef(false)

const schemaModel = computed({
  get: () => props.schema,
  set: (value: ApprovalWorkflowSchema) => emits('update:schema', value),
})

const validation = computed(() =>
  validateApprovalWorkflow(props.schema, collectNodes(props.schema.nodes))
)

const errors = computed(() =>
  validation.value.issues.filter((issue) => issue.level !== 'success')
)

interface PreviewItem {
  id: string
  title: string
  kind: 'node' | 'branch'
  kindLabel: string
  icon: string
  detail?: string
  depth: number
}

function getBranchDetail(branch: ApprovalBranch) {
  if (!branch.rules.length) return '默认分支'
  return branch.rules
    .map((rule) => `${rule.label} ${rule.operator} ${rule.value}`)
    .join(' 或 ')
}

function getNodeDetail(node: ApprovalNode) {
  if (node.description) return node.description
  return undefined
}

const previewItems = computed(() => {
  const items: PreviewItem[] = []
  const walk = (nodes: readonly ApprovalNode[], depth: number) => {
    nodes.forEach((node) => {
      items.push({
        id: node.id,
        title: node.title,
        kind: 'node',
        kindLabel: getKindLabel(node.type),
        icon: node.icon,
        detail: getNodeDetail(node),
        depth,
      })
      node.children?.forEach((child) => walk([child], depth + 1))
      node.branches?.forEach((branch) => {
        items.push({
          id: branch.id,
          title: branch.title,
          kind: 'branch',
          kindLabel: '条件分支',
          icon: 'i-lucide:git-branch',
          detail: getBranchDetail(branch),
          depth: depth + 1,
        })
        walk(branch.nodes, depth + 2)
      })
    })
  }
  walk(props.schema.nodes, 0)
  return items
})

function getKindLabel(type: ApprovalNode['type']) {
  return (
    {
      start: '发起',
      approver: '审批',
      handler: '办理',
      cc: '抄送',
      condition: '条件',
      parallel: '并行',
      subProcess: '子流程',
      data: '数据',
      script: '脚本',
      message: '通知',
      end: '结束',
    }[type] ?? type
  )
}
</script>
