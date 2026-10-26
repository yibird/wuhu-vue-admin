<template>
  <div class="approval-node-wrap" :style="{ '--node-accent': node.accent }">
    <!-- 画布内容带 transform,固定定位锚点必须挂到 body 才能与鼠标坐标对齐 -->
    <Teleport to="body">
      <a-dropdown
        v-model:open="contextMenuOpen"
        :menu="{ items: contextMenuItems }"
        :trigger="['click']"
        placement="bottomLeft"
        @menu-click="handleContextMenuClick"
      >
        <span
          class="fixed size-0 pointer-events-none"
          :style="contextMenuAnchorStyle"
        />
      </a-dropdown>
    </Teleport>

    <div
      class="approval-node group relative w-250 overflow-visible rounded-10 b-1-regular bg-container p-0 text-left shadow-sm transition-[transform,border-color,box-shadow,background-color] duration-200 ease-[var(--w-motion-ease-enter)] hover:(-translate-y-1 border-primary/60 shadow-xl shadow-ink/20) motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      :aria-selected="selected"
      :data-approval-node-id="node.id"
      :data-required="node.required ? 'true' : undefined"
      :data-selected="selected ? 'true' : undefined"
      :data-testid="APPROVAL_WORKFLOW_SELECTORS.nodeCard"
      role="button"
      tabindex="0"
      @click="emits('select', node.id)"
      @contextmenu="handleContextMenu"
      @keydown.enter="emits('select', node.id)"
      @keydown.space.prevent="emits('select', node.id)"
    >
      <component :is="nodeComponent" :node="node" :selected="selected" />

      <div
        v-if="!node.required && !readonly"
        class="absolute right-7 top-7 z-40 hidden gap-5 rounded-10 b-1-muted bg-container/88 p-5 shadow-sm backdrop-blur-[6px] group-hover:flex"
      >
        <a-button
          class="approval-node-action approval-node-action--copy size-30 rounded-7 p-0 text-secondary"
          type="text"
          @click.stop="emits('duplicate', node.id)"
        >
          <Icon name="i-lucide:copy" :size="16" />
        </a-button>
        <a-button
          class="approval-node-action approval-node-action--remove size-30 rounded-7 p-0 text-error"
          danger
          type="text"
          @click.stop="emits('remove', node.id)"
        >
          <Icon name="i-lucide:trash-2" :size="16" />
        </a-button>
      </div>
    </div>

    <button
      v-if="node.type !== 'end' && !readonly && !node.branches?.length"
      class="approval-add-btn grid h-46 w-44 cursor-pointer border-0 bg-transparent p-0 text-primary shadow-none outline-none [place-items:start_center]"
      :data-testid="APPROVAL_WORKFLOW_SELECTORS.addNode"
      type="button"
      @click="emits('addAfter', node.id, 'approver')"
    >
      <span
        class="approval-add-icon mt-0 inline-grid size-28 place-items-center rounded-full b-1-regular bg-container shadow-lg shadow-ink/10 transition"
      >
        <Icon name="i-lucide:plus" :size="15" />
      </span>
    </button>

    <div v-if="node.branches?.length" class="approval-branches">
      <div
        v-for="branch in node.branches"
        :key="branch.id"
        class="approval-branch min-w-250 rounded-10 b-1-regular bg-fill p-10"
      >
        <div class="mb-10 flex items-start justify-between gap-8">
          <div class="min-w-0">
            <strong class="block truncate text-13px text-primary">
              {{ branch.title }}
            </strong>
            <small class="mt-3 block line-clamp-2 text-11px text-secondary">
              {{ getBranchSummary(branch) }}
            </small>
          </div>
          <span
            class="rounded-5 bg-container px-6 py-3 text-10px text-tertiary"
          >
            P{{ branch.priority }}
          </span>
        </div>

        <ApprovalNodeCard
          v-for="child in branch.nodes"
          :key="child.id"
          :node="child"
          :selected-ids="selectedIds"
          @add-after="handleChildAddAfter"
          @duplicate="emits('duplicate', $event)"
          @move-node="(id, offset) => emits('moveNode', id, offset)"
          @remove="emits('remove', $event)"
          @select="emits('select', $event)"
        />
      </div>
    </div>

    <button
      v-if="node.type !== 'end' && !readonly && node.branches?.length"
      class="approval-add-btn grid h-46 w-44 cursor-pointer border-0 bg-transparent p-0 text-primary shadow-none outline-none [place-items:start_center]"
      :data-testid="APPROVAL_WORKFLOW_SELECTORS.addNode"
      type="button"
      @click="emits('addAfter', node.id, 'approver')"
    >
      <span
        class="approval-add-icon mt-0 inline-grid size-28 place-items-center rounded-full b-1-regular bg-container shadow-lg shadow-ink/10 transition"
      >
        <Icon name="i-lucide:plus" :size="15" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { APPROVAL_WORKFLOW_SELECTORS } from '../constants'
import { useApprovalNodeContextMenu } from '../hooks'
import { resolveApprovalNodeComponent } from './nodes'
import type { ApprovalBranch, ApprovalNode, ApprovalNodeType } from '../types'

defineOptions({ name: 'ApprovalNodeCard' })

const props = withDefaults(
  defineProps<{
    node: ApprovalNode
    selectedIds: readonly string[]
    readonly?: boolean
  }>(),
  { readonly: false }
)

const emits = defineEmits<{
  addAfter: [id: string, type: ApprovalNodeType]
  duplicate: [id: string]
  moveNode: [id: string, offset: -1 | 1]
  remove: [id: string]
  select: [id: string]
}>()

function getBranchSummary(branch: ApprovalBranch) {
  if (!branch.rules.length) return '默认分支'
  return branch.rules
    .map((rule) => `${rule.label} ${rule.operator} ${rule.value}`)
    .join(' 或 ')
}

const selected = computed(() => props.selectedIds.includes(props.node.id))
const nodeComponent = computed(() =>
  resolveApprovalNodeComponent(props.node.type)
)
const {
  contextMenuAnchorStyle,
  contextMenuItems,
  contextMenuOpen,
  handleContextMenuClick,
  showContextMenu,
} = useApprovalNodeContextMenu(() => props.node, {
  addAfter: (id, type) => emits('addAfter', id, type),
  duplicate: (id) => emits('duplicate', id),
  move: (id, offset) => emits('moveNode', id, offset),
  remove: (id) => emits('remove', id),
  select: (id) => emits('select', id),
})

function handleContextMenu(event: MouseEvent) {
  if (props.readonly) {
    event.preventDefault()
    return
  }
  showContextMenu(event)
}

function handleChildAddAfter(id: string, type: ApprovalNodeType) {
  emits('addAfter', id, type)
}
</script>

<style scoped>
.approval-node-wrap {
  display: grid;
  justify-items: center;
  min-width: 0;
}

/**
 * 节点卡片渐变底色:左上角跟随节点主题色的柔光 + 纵向轻微渐变
 */
.approval-node {
  background-image:
    radial-gradient(
      120% 90% at 0% 0%,
      color-mix(in srgb, var(--node-accent) 9%, transparent),
      transparent 58%
    ),
    linear-gradient(
      180deg,
      rgb(var(--w-bg-container)) 0%,
      color-mix(in srgb, var(--node-accent) 4%, rgb(var(--w-bg-container))) 100%
    );
}

/* 节点操作按钮圆角与悬浮态 */
.approval-node .approval-node-action {
  border-radius: 7px;
}

/* 节点操作按钮:hover 时图标保持白色 */
.approval-node .approval-node-action.approval-node-action--copy:hover,
.approval-node .approval-node-action.approval-node-action--copy:focus-visible {
  color: #fff;
  background-color: rgb(var(--w-color-primary));
}

.approval-node .approval-node-action.approval-node-action--remove:hover,
.approval-node
  .approval-node-action.approval-node-action--remove:focus-visible {
  color: #fff;
  background-color: rgb(var(--w-color-error));
}

/**
 * 节点连接线:使用淡灰色细线
 */
.approval-node-wrap + .approval-node-wrap::before,
.approval-add-btn::before {
  display: block;
  width: 2px;
  height: 18px;
  margin: 0 auto;
  content: '';
  background: rgb(var(--w-border-main));
  border-radius: 999px;
}

/* 分支内节点之间的连接线略短 */
.approval-branch > .approval-node-wrap::before {
  display: block;
  width: 2px;
  height: 12px;
  margin: 0 auto;
  content: '';
  background: rgb(var(--w-border-main));
  border-radius: 999px;
}

.approval-add-btn:focus-visible .approval-add-icon {
  border-color: rgb(var(--w-color-primary));
  box-shadow:
    0 0 0 3px rgb(var(--w-color-primary) / 14%),
    0 6px 16px rgb(15 23 42 / 10%);
}

.approval-add-btn:hover .approval-add-icon {
  color: #fff;
  background: rgb(var(--w-color-primary));
  border-color: rgb(var(--w-color-primary));
}

.approval-branches {
  position: relative;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  justify-content: center;

  /* 与节点之间留出连接线空间,分支结束后直接衔接后续节点 */
  margin: 18px 0 0;
}

/* 条件/并行分支:主干 + 横向汇流线 + 分支竖线 */
.approval-branches::before {
  position: absolute;
  top: -18px;
  left: 50%;
  width: 2px;
  height: 9px;
  content: '';
  background: rgb(var(--w-border-main));
  border-radius: 999px;
  transform: translateX(-50%);
}

.approval-branches::after {
  position: absolute;
  top: -9px;
  right: 12%;
  left: 12%;
  height: 2px;
  content: '';
  background: rgb(var(--w-border-main));
  border-radius: 999px;
}

.approval-branch {
  position: relative;
  background-image: linear-gradient(
    180deg,
    color-mix(in srgb, var(--node-accent) 4%, transparent),
    transparent 42%
  );
  border-color: color-mix(
    in srgb,
    var(--node-accent) 22%,
    rgb(var(--w-border-regular))
  );
}

.approval-branch::before {
  position: absolute;
  top: -9px;
  left: 50%;
  width: 2px;
  height: 9px;
  content: '';
  background: rgb(var(--w-border-main));
  border-radius: 999px;
  transform: translateX(-50%);
}
</style>
