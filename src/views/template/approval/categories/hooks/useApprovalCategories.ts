import { message, Modal } from 'antdv-next'
import {
  createApprovalCategoryApi,
  deleteApprovalCategoryApi,
  deleteApprovalDefinitionApi,
  duplicateApprovalDefinitionApi,
  getApprovalCategoryListApi,
  getApprovalDefinitionPageListApi,
  updateApprovalCategoryApi,
} from '@/apis'
import { usePagination, useRequest } from '@/hooks'
import type {
  ApprovalCategoryResp,
  ApprovalDefinitionQuery,
  ApprovalDefinitionResp,
  CreateApprovalCategoryReq,
  UpdateApprovalCategoryReq,
} from '@/apis'

export function useApprovalCategories() {
  const selectedCategoryId = shallowRef<string>()

  const {
    data: categoryData,
    loading: categoryLoading,
    refreshAsync: refreshCategoriesAsync,
  } = useRequest(() => getApprovalCategoryListApi())

  const categories = computed(() => categoryData.value?.data ?? [])

  const currentCategory = computed(() =>
    categories.value.find((item) => item.id === selectedCategoryId.value)
  )

  const {
    list,
    loading,
    pagination,
    run,
    refreshAsync: refreshDefinitionsAsync,
  } = usePagination(
    (query: ApprovalDefinitionQuery) => getApprovalDefinitionPageListApi(query),
    { defaultPageSize: 12, manual: true }
  )

  const { current, pageSize, total, changePage } = pagination

  watch(
    categories,
    (value) => {
      if (!value.length) {
        selectedCategoryId.value = undefined
        return
      }
      if (
        !selectedCategoryId.value ||
        !value.some((item) => item.id === selectedCategoryId.value)
      ) {
        selectedCategoryId.value = value[0].id
      }
      run({ categoryId: selectedCategoryId.value })
    },
    { immediate: true }
  )

  function selectCategory(id: string) {
    if (selectedCategoryId.value === id) return
    selectedCategoryId.value = id
    run({ categoryId: id })
  }

  function onPageChange(page: number, size: number) {
    changePage(page, size)
  }

  async function createCategory(data: CreateApprovalCategoryReq) {
    await createApprovalCategoryApi(data)
    message.success('分组已创建')
    await refreshCategoriesAsync()
  }

  async function updateCategory(data: UpdateApprovalCategoryReq) {
    await updateApprovalCategoryApi(data)
    message.success('分组已更新')
    await refreshCategoriesAsync()
    await refreshDefinitionsAsync()
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
        await refreshDefinitionsAsync()
        await refreshCategoriesAsync()
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
        await refreshDefinitionsAsync()
        await refreshCategoriesAsync()
      },
    })
  }

  function removeCategory(category: ApprovalCategoryResp) {
    Modal.confirm({
      title: '删除分组',
      content: `确定删除「${category.name}」吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await deleteApprovalCategoryApi([category.id])
        message.success('删除成功')
        await refreshCategoriesAsync()
      },
    })
  }

  return {
    categories,
    categoryLoading,
    current,
    currentCategory,
    list,
    loading,
    pageSize,
    selectedCategoryId,
    total,
    createCategory,
    duplicateDefinition,
    onPageChange,
    removeCategory,
    removeDefinition,
    selectCategory,
    updateCategory,
  }
}
