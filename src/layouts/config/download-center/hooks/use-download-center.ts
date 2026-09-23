import { message } from 'antdv-next'
import { computed, shallowRef } from 'vue'
import dayjs from 'dayjs'
import { createGlobalState } from '@vueuse/core'
import { initialDownloadItems } from '../data'
import type {
  DownloadCategoryFilter,
  DownloadItem,
  DownloadStatus,
  DownloadStatusFilter,
} from '../types'

export const useDownloadCenter = createGlobalState(() => {
  const downloads = shallowRef<DownloadItem[]>(
    initialDownloadItems.map((item) => ({ ...item }))
  )
  const activeId = shallowRef(downloads.value[0]?.id ?? '')
  const keyword = shallowRef('')
  const statusFilter = shallowRef<DownloadStatusFilter>('all')
  const categoryFilter = shallowRef<DownloadCategoryFilter>('all')

  function isActiveDownload(item: DownloadItem) {
    return activeStatuses.has(item.status)
  }

  function isFinishedDownload(item: DownloadItem) {
    return finishedStatuses.has(item.status)
  }

  const activeStatuses = new Set<DownloadStatus>([
    'downloading',
    'waiting',
    'paused',
  ])
  const finishedStatuses = new Set<DownloadStatus>(['success', 'failed'])
  const filteredDownloads = computed(() => {
    const value = keyword.value.trim().toLowerCase()

    return downloads.value.filter((item) => {
      const statusMatched =
        statusFilter.value === 'all' || item.status === statusFilter.value
      const categoryMatched =
        categoryFilter.value === 'all' || item.category === categoryFilter.value
      const keywordMatched =
        !value ||
        [item.name, item.description, item.source, item.savePath]
          .join(' ')
          .toLowerCase()
          .includes(value)

      return statusMatched && categoryMatched && keywordMatched
    })
  })

  const activeDownload = computed(() => {
    return (
      downloads.value.find((item) => item.id === activeId.value) ??
      filteredDownloads.value[0] ??
      null
    )
  })

  const totalDownloadCount = computed(() => downloads.value.length)
  const activeDownloadCount = computed(
    () => downloads.value.filter(isActiveDownload).length
  )
  const finishedDownloadCount = computed(
    () => downloads.value.filter((item) => item.status === 'success').length
  )
  const failedDownloadCount = computed(
    () => downloads.value.filter((item) => item.status === 'failed').length
  )
  const attentionDownloadCount = computed(() => {
    return downloads.value.filter((item) =>
      ['downloading', 'waiting', 'failed'].includes(item.status)
    ).length
  })
  const overallProgress = computed(() => {
    if (!downloads.value.length) return 0

    const total = downloads.value.reduce((sum, item) => sum + item.progress, 0)
    return Math.round(total / downloads.value.length)
  })
  const hasFinishedDownloads = computed(() => {
    return downloads.value.some(isFinishedDownload)
  })

  const stats = computed(() => [
    {
      key: 'total',
      label: '全部下载',
      value: totalDownloadCount.value,
      icon: 'i-lucide:files',
      class: 'text-main bg-fill-quaternary',
    },
    {
      key: 'active',
      label: '队列中',
      value: activeDownloadCount.value,
      icon: 'i-lucide:download-cloud',
      class: 'text-primary bg-primary-tint',
    },
    {
      key: 'success',
      label: '已完成',
      value: finishedDownloadCount.value,
      icon: 'i-lucide:circle-check',
      class: 'text-success bg-success-tint',
    },
    {
      key: 'failed',
      label: '失败',
      value: failedDownloadCount.value,
      icon: 'i-lucide:circle-alert',
      class: 'text-error bg-error-tint',
    },
  ])

  function updateDownload(
    id: string,
    updater: (download: DownloadItem) => DownloadItem
  ) {
    downloads.value = downloads.value.map((item) =>
      item.id === id ? updater(item) : item
    )
  }

  function selectDownload(id: string) {
    activeId.value = id
  }

  function pauseDownload(item: DownloadItem) {
    if (item.status !== 'downloading') return
    updateDownload(item.id, (download) => ({
      ...download,
      status: 'paused',
      speed: '已暂停',
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }))
  }

  function resumeDownload(item: DownloadItem) {
    if (!['paused', 'waiting'].includes(item.status)) return
    updateDownload(item.id, (download) => ({
      ...download,
      status: 'downloading',
      speed: '2.6 MB/s',
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }))
  }

  function retryDownload(item: DownloadItem) {
    if (item.status !== 'failed') return
    updateDownload(item.id, (download) => ({
      ...download,
      progress: Math.max(download.progress, 28),
      speed: '1.9 MB/s',
      status: 'downloading',
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }))
  }

  function deleteDownload(item: DownloadItem) {
    downloads.value = downloads.value.filter(
      (download) => download.id !== item.id
    )
    if (activeId.value === item.id) {
      activeId.value =
        filteredDownloads.value[0]?.id ?? downloads.value[0]?.id ?? ''
    }
  }

  function clearFinishedDownloads() {
    downloads.value = downloads.value.filter(
      (item) => !isFinishedDownload(item)
    )
    activeId.value =
      filteredDownloads.value[0]?.id ?? downloads.value[0]?.id ?? ''
  }

  function resetFilters() {
    keyword.value = ''
    statusFilter.value = 'all'
    categoryFilter.value = 'all'
  }

  function openFile(item: DownloadItem) {
    message.success(`已打开：${item.name}`)
  }

  function copyPath(item: DownloadItem) {
    navigator.clipboard?.writeText(item.savePath)
    message.success('已复制保存路径')
  }

  return {
    activeDownload,
    activeDownloadCount,
    activeId,
    attentionDownloadCount,
    categoryFilter,
    downloads,
    failedDownloadCount,
    filteredDownloads,
    finishedDownloadCount,
    hasFinishedDownloads,
    keyword,
    overallProgress,
    stats,
    statusFilter,
    totalDownloadCount,
    clearFinishedDownloads,
    copyPath,
    deleteDownload,
    openFile,
    pauseDownload,
    resetFilters,
    resumeDownload,
    retryDownload,
    selectDownload,
  }
})
