<script setup lang="ts">
import { APPROVAL_WORKFLOW_SELECTORS } from '../constants'
import { useApprovalNodeContextMenu } from '../composables/useNodeContextMenu'
import { resolveApprovalNodeComponent } from './nodes'
import type { ApprovalBranch, ApprovalNode, ApprovalNodeType } from '../types'

const props = defineProps<{
  node: ApprovalNode
  selectedIds: readonly string[]
}>()

const emit = defineEmits<{
  addAfter: [id: string, type: ApprovalNodeType]
  duplicate: [id: string]
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
  addAfter: (id, type) => emit('addAfter', id, type),
  duplicate: (id) => emit('duplicate', id),
  remove: (id) => emit('remove', id),
  select: (id) => emit('select', id),
})

function handleChildAddAfter(id: string, type: ApprovalNodeType) {
  emit('addAfter', id, type)
}
</script>

<template>
  <div class="approval-node-wrap">
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

    <div
      class="approval-node group relative w-250 overflow-visible rounded-10 border-1 border-color-2 border-solid bg-container p-0 text-left shadow-[var(--w-shadow-card)] transition-[transform,border-color,box-shadow,background-color] duration-motion-base ease-motion-enter hover:(-translate-y-1 border-primary/60 shadow-[0_12px_28px_rgb(var(--w-shadow-color-1))]) motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      :class="{
        'z-10 -translate-y-1 border-primary bg-container shadow-[0_16px_34px_rgb(var(--w-color-primary)/16%)] ring-2 ring-primary/22':
          selected,
      }"
      :aria-selected="selected"
      :data-approval-node-id="node.id"
      :data-required="node.required ? 'true' : undefined"
      :data-selected="selected ? 'true' : undefined"
      :data-testid="APPROVAL_WORKFLOW_SELECTORS.nodeCard"
      role="button"
      tabindex="0"
      @click="emit('select', node.id)"
      @contextmenu="showContextMenu"
      @keydown.enter="emit('select', node.id)"
      @keydown.space.prevent="emit('select', node.id)"
    >
      <component :is="nodeComponent" :node="node" :selected="selected" />

      <div
        v-if="selected"
        class="pointer-events-none absolute -inset-1 z-20 rounded-12 border-1 border-primary/80 border-solid bg-primary/4 shadow-[0_0_0_3px_rgb(var(--w-color-primary)/10%),inset_0_0_0_1px_rgb(var(--w-color-primary)/18%)]"
      />
      <div
        v-if="selected"
        class="approval-node-selection-frame pointer-events-none absolute -inset-3 z-30"
      >
        <span class="approval-node-corner approval-node-corner--tl" />
        <span class="approval-node-corner approval-node-corner--tr" />
        <span class="approval-node-corner approval-node-corner--bl" />
        <span class="approval-node-corner approval-node-corner--br" />
        已选中
      </div>

      <div
        v-if="!node.required"
        class="absolute right-7 top-7 z-40 gap-5 rounded-7 bg-container/94 p-5 shadow-[var(--w-shadow-card)]"
        :class="selected ? 'flex' : 'hidden group-hover:flex'"
      >
        <a-button
          class="size-30 p-0 text-secondary"
          type="text"
          @click.stop="emit('duplicate', node.id)"
        >
          <Icon name="i-lucide:copy" :size="16" />
        </a-button>
        <a-button
          class="size-30 p-0 text-error"
          danger
          type="text"
          @click.stop="emit('remove', node.id)"
        >
          <Icon name="i-lucide:trash-2" :size="16" />
        </a-button>
      </div>
    </div>

    <button
      v-if="node.type !== 'end'"
      class="approval-add-btn grid h-46 w-44 cursor-pointer border-0 bg-transparent p-0 text-primary shadow-none outline-none [place-items:start_center]"
      :data-testid="APPROVAL_WORKFLOW_SELECTORS.addNode"
      type="button"
      @click="emit('addAfter', node.id, 'approver')"
    >
      <span
        class="approval-add-icon mt-0 inline-grid size-28 place-items-center rounded-full border-1 border-color-2 border-solid bg-container shadow-[0_6px_16px_rgb(15_23_42_/_10%)] transition"
      >
        <Icon name="i-lucide:plus" :size="15" />
      </span>
    </button>

    <div v-if="node.branches?.length" class="approval-branches">
      <div
        v-for="branch in node.branches"
        :key="branch.id"
        class="approval-branch min-w-250 rounded-10 border-1 border-color-2 border-solid bg-fill p-10"
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
          @duplicate="emit('duplicate', $event)"
          @remove="emit('remove', $event)"
          @select="emit('select', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.approval-node-wrap {
  display: grid;
  justify-items: center;
  min-width: 0;
}

.approval-node-wrap + .approval-node-wrap::before,
.approval-add-btn::before {
  display: block;
  width: 1px;
  height: 18px;
  margin: 0 auto;
  content: '';
  background: rgb(var(--w-border-color-2));
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

.approval-node-selection-frame {
  font-size: 0;
  color: transparent;
}

.approval-node-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: rgb(var(--w-color-primary));
  opacity: 0.92;
}

.approval-node-corner--tl {
  top: 0;
  left: 0;
  border-top: 2px solid;
  border-left: 2px solid;
  border-top-left-radius: 6px;
}

.approval-node-corner--tr {
  top: 0;
  right: 0;
  border-top: 2px solid;
  border-right: 2px solid;
  border-top-right-radius: 6px;
}

.approval-node-corner--bl {
  bottom: 0;
  left: 0;
  border-bottom: 2px solid;
  border-left: 2px solid;
  border-bottom-left-radius: 6px;
}

.approval-node-corner--br {
  right: 0;
  bottom: 0;
  border-right: 2px solid;
  border-bottom: 2px solid;
  border-bottom-right-radius: 6px;
}

.approval-branches {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  justify-content: center;
  margin: 2px 0 18px;
}
</style>
