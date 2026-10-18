import { message } from 'antdv-next'
import {
  deleteApprovalGroupApi,
  getApprovalGroupPageListApi,
  updateApprovalGroupApi,
} from '@/apis'
import { usePagination } from '@/hooks'
import type { ApprovalGroupQuery, ApprovalGroupResp } from '@/apis'

export function useApprovalGroups() {
  const { list, loading, pagination, run, refreshAsync } = usePagination(
    (query: ApprovalGroupQuery) => getApprovalGroupPageListApi(query),
    { defaultPageSize: 10 }
  )

  const { current, pageSize, total, changePage } = pagination

  function search(query: Omit<ApprovalGroupQuery, 'current' | 'pageSize'>) {
    run(query)
  }

  function reload() {
    run()
  }

  async function reloadAsync() {
    await refreshAsync()
  }

  function onPageChange(page: number, size: number) {
    changePage(page, size)
  }

  async function toggleEnabled(group: ApprovalGroupResp, enabled: boolean) {
    await updateApprovalGroupApi({ id: group.id, enabled })
    message.success(enabled ? '分组已启用' : '分组已停用')
    await reloadAsync()
  }

  async function removeGroup(group: ApprovalGroupResp) {
    await deleteApprovalGroupApi([group.id])
    message.success('分组已删除')
    await reloadAsync()
  }

  return {
    list,
    loading,
    current,
    pageSize,
    total,
    search,
    reload,
    reloadAsync,
    onPageChange,
    toggleEnabled,
    removeGroup,
  }
}
