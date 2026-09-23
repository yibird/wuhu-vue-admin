import type { Ref } from 'vue'
import type {
  ApprovalActionKey,
  ApprovalAssigneeMode,
  ApprovalBranch,
  ApprovalFieldPermission,
  ApprovalMultiMode,
  ApprovalNode,
  ApprovalNodeConfig,
  ApprovalTimeoutRule,
  ApprovalUserRef,
  FieldPermissionMode,
} from '../types'

export interface ApprovalInspectorActionEmit {
  addBranch: (nodeId: string) => void
  updateBranch: (
    nodeId: string,
    branchId: string,
    patch: Partial<ApprovalBranch>
  ) => void
  updateConfig: (id: string, patch: Partial<ApprovalNodeConfig>) => void
  updateNode: (id: string, patch: Partial<ApprovalNode>) => void
}

export function useApprovalInspectorActions(
  getNode: () => ApprovalNode | undefined,
  users: Readonly<Ref<readonly ApprovalUserRef[]>>,
  emit: ApprovalInspectorActionEmit
) {
  function updateNodeTitle(value: string) {
    const node = getNode()
    if (!node) return
    emit.updateNode(node.id, { title: value })
  }

  function updateNodeDescription(value: string) {
    const node = getNode()
    if (!node) return
    emit.updateNode(node.id, { description: value })
  }

  function updateAssigneeMode(value: ApprovalAssigneeMode) {
    const node = getNode()
    if (!node) return
    emit.updateConfig(node.id, {
      assignee: {
        ...node.config.assignee,
        mode: value,
      },
    })
  }

  function updateMultiMode(value: ApprovalMultiMode) {
    const node = getNode()
    if (!node) return
    emit.updateConfig(node.id, {
      assignee: {
        ...node.config.assignee,
        multiMode: value,
      },
    })
  }

  function updateAssigneeUsers(values: string[]) {
    const node = getNode()
    if (!node) return
    emit.updateConfig(node.id, {
      assignee: {
        ...node.config.assignee,
        users: users.value.filter((user) => values.includes(user.id)),
      },
    })
  }

  function updateSupervisorLevel(value: number | null) {
    const node = getNode()
    if (!node) return
    emit.updateConfig(node.id, {
      assignee: {
        ...node.config.assignee,
        supervisorLevel: Math.max(1, value ?? 1),
      },
    })
  }

  function updateActions(values: ApprovalActionKey[]) {
    const node = getNode()
    if (!node) return
    emit.updateConfig(node.id, { actions: values })
  }

  function updateTimeout(patch: Partial<ApprovalTimeoutRule>) {
    const node = getNode()
    if (!node) return
    emit.updateConfig(node.id, {
      timeout: {
        ...node.config.timeout,
        ...patch,
      },
    })
  }

  function updateTimeoutEnabled(checked: boolean) {
    updateTimeout({ enabled: checked })
  }

  function updateTimeoutHours(value: number | null) {
    updateTimeout({ hours: Math.max(1, value ?? 1) })
  }

  function updateTimeoutRemindEveryHours(value: number | null) {
    updateTimeout({ remindEveryHours: Math.max(1, value ?? 1) })
  }

  function updateFieldPermission(
    field: ApprovalFieldPermission,
    mode: ApprovalFieldPermission['mode']
  ) {
    const node = getNode()
    if (!node) return
    emit.updateConfig(node.id, {
      fieldPermissions: node.config.fieldPermissions.map((item) =>
        item.field === field.field ? { ...item, mode } : item
      ),
    })
  }

  function updateBranchTitle(branchId: string, title: string) {
    const node = getNode()
    if (!node) return
    emit.updateBranch(node.id, branchId, { title })
  }

  function updateFieldPermissionFromSelect(
    field: ApprovalFieldPermission,
    value: FieldPermissionMode
  ) {
    updateFieldPermission(field, value)
  }

  return {
    updateActions,
    updateAssigneeMode,
    updateAssigneeUsers,
    updateBranchTitle,
    updateFieldPermissionFromSelect,
    updateMultiMode,
    updateNodeDescription,
    updateNodeTitle,
    updateSupervisorLevel,
    updateTimeoutEnabled,
    updateTimeoutHours,
    updateTimeoutRemindEveryHours,
  }
}
