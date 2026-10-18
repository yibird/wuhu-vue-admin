import { message, Modal } from 'antdv-next'
import {
  deleteApprovalDefinitionApi,
  duplicateApprovalDefinitionApi,
  getApprovalCategoryListApi,
  getApprovalDefinitionPageListApi,
} from '@/apis'
import { usePagination, useRequest } from '@/hooks'
import { useAuthStore } from '@/store'
import type {
  ApprovalDefinitionQuery,
  ApprovalDefinitionResp,
  ApprovalDefinitionState,
} from '@/apis'

export function useApprovalList() {
  const { user } = useAuthStore()
  const keyword = shallowRef('')
  const categoryId = shallowRef<string>()
  const state = shallowRef<ApprovalDefinitionState>()

  const { data: categoryData } = useRequest(() => getApprovalCategoryListApi())
  const categories = computed(() => categoryData.value?.data ?? [])

  const { list, loading, pagination, run, refreshAsync } = usePagination(
    (query: ApprovalDefinitionQuery) => getApprovalDefinitionPageListApi(query),
    {
      defaultPageSize: 12,
      defaultParams: { ownerId: user.value?.id },
    }
  )

  const { current, pageSize, total, changePage } = pagination

  function buildQuery(): Partial<ApprovalDefinitionQuery> {
    const text = keyword.value.trim()
    return {
      ...(user.value?.id ? { ownerId: user.value.id } : {}),
      ...(text ? { keyword: text } : {}),
      ...(categoryId.value ? { categoryId: categoryId.value } : {}),
      ...(state.value ? { state: state.value } : {}),
    }
  }

  function search() {
    run(buildQuery())
  }

  function reset() {
    keyword.value = ''
    categoryId.value = undefined
    state.value = undefined
    run(buildQuery())
  }

  function onPageChange(page: number, size: number) {
    changePage(page, size)
  }

  function duplicateDefinition(definition: ApprovalDefinitionResp) {
    Modal.confirm({
      title: '创建副本',
      content: `确定复制「${definition.name}」吗？`,
      okText: '复制',
      cancelText: '取消',
      onOk: async () => {
        await duplicateApprovalDefinitionApi(definition.id)
        message.success('副本已创建')
        await refreshAsync()
      },
    })
  }

  function removeDefinition(definition: ApprovalDefinitionResp) {
    Modal.confirm({
      title: '删除审批流',
      content: `确定删除「${definition.name}」吗？删除后无法恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await deleteApprovalDefinitionApi([definition.id])
        message.success('删除成功')
        await refreshAsync()
      },
    })
  }

  return {
    categories,
    categoryId,
    current,
    keyword,
    list,
    loading,
    pageSize,
    state,
    total,
    duplicateDefinition,
    onPageChange,
    removeDefinition,
    reset,
    search,
  }
}
