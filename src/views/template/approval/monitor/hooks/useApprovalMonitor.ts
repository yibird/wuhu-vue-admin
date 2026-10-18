import { useIntervalFn } from '@vueuse/core'
import {
  getApprovalDefinitionPageListApi,
  getApprovalInstancePageListApi,
  getApprovalInstanceRecordApi,
  getApprovalMonitorSummaryApi,
} from '@/apis'
import { usePagination, useRequest } from '@/hooks'
import type {
  ApprovalInstanceQuery,
  ApprovalInstanceResp,
  ApprovalInstanceStatus,
} from '@/apis'

const REFRESH_INTERVAL = 15_000

export function useApprovalMonitor() {
  const keyword = shallowRef('')
  const definitionId = shallowRef<string>()
  const status = shallowRef<ApprovalInstanceStatus>()
  const drawerOpen = shallowRef(false)
  const detail = shallowRef<ApprovalInstanceResp>()
  const detailLoading = shallowRef(false)

  const { data: summaryData, refreshAsync: refreshSummaryAsync } = useRequest(
    () => getApprovalMonitorSummaryApi()
  )
  const summary = computed(() => summaryData.value?.data)

  const { data: definitionData } = useRequest(() =>
    getApprovalDefinitionPageListApi({ current: 1, pageSize: 100 })
  )
  const definitionOptions = computed(() =>
    (definitionData.value?.data?.list ?? []).map((item) => ({
      label: item.name,
      value: item.id,
    }))
  )

  const {
    list,
    loading,
    pagination,
    run,
    refreshAsync: refreshInstancesAsync,
  } = usePagination(
    (query: ApprovalInstanceQuery) => getApprovalInstancePageListApi(query),
    { defaultPageSize: 10 }
  )

  const { current, pageSize, total, changePage } = pagination

  function buildQuery(): Partial<ApprovalInstanceQuery> {
    const text = keyword.value.trim()
    return {
      ...(text ? { keyword: text } : {}),
      ...(definitionId.value ? { definitionId: definitionId.value } : {}),
      ...(status.value ? { status: status.value } : {}),
    }
  }

  function search() {
    run(buildQuery())
  }

  function reset() {
    keyword.value = ''
    definitionId.value = undefined
    status.value = undefined
    run(buildQuery())
  }

  function onPageChange(page: number, size: number) {
    changePage(page, size)
  }

  async function refreshAll() {
    await Promise.all([refreshInstancesAsync(), refreshSummaryAsync()])
  }

  async function openDetail(record: ApprovalInstanceResp) {
    drawerOpen.value = true
    detailLoading.value = true
    try {
      const response = await getApprovalInstanceRecordApi({ id: record.id })
      detail.value = response.data
    } finally {
      detailLoading.value = false
    }
  }

  function closeDetail() {
    drawerOpen.value = false
    detail.value = undefined
  }

  const { pause, resume } = useIntervalFn(
    () => void refreshAll(),
    REFRESH_INTERVAL,
    {
      immediate: false,
    }
  )

  onActivated(() => resume())
  onDeactivated(() => pause())
  onBeforeUnmount(() => pause())

  return {
    current,
    definitionId,
    definitionOptions,
    detail,
    detailLoading,
    drawerOpen,
    keyword,
    list,
    loading,
    pageSize,
    status,
    summary,
    total,
    closeDetail,
    onPageChange,
    openDetail,
    refreshAll,
    reset,
    search,
  }
}
