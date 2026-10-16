<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <FormPlus
      class="rounded-4 bg-container p-16"
      mode="query"
      :collapse="false"
      :grid="{
        cols: { sm: 1, md: 2, lg: 3, xl: 4, xxl: 6 },
        xGap: 10,
        yGap: 10,
      }"
      :schemas="querySchemas"
      @reset="onReset"
      @submit="onSearch"
    />

    <div class="flex flex-wrap items-center gap-8">
      <a-upload
        :before-upload="onBeforeUpload"
        :disabled="uploading"
        :show-upload-list="false"
        multiple
      >
        <a-button :loading="uploading" type="primary">
          <template #icon><Icon name="i-lucide:upload" /></template>
          上传文件
        </a-button>
      </a-upload>
      <a-button
        danger
        ghost
        type="primary"
        :disabled="selectedRowKeys.length === 0"
        @click="onBatchDelete"
      >
        <template #icon><Icon name="i-lucide:trash-2" /></template>
        批量删除
      </a-button>
      <span class="text-xs text-muted">
        支持多选上传,单个文件不超过 {{ MAX_FILE_SIZE_TEXT }}
      </span>
    </div>

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      :scroll="{ x: 1070, y: TABLE_SCROLL_Y }"
      row-key="id"
      @change="onTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div class="min-w-0 flex items-center gap-8">
            <Icon
              class="shrink-0 text-muted"
              :name="resolveFileKindMeta(record.kind).icon"
              :size="16"
            />
            <span class="truncate" :title="record.name">{{ record.name }}</span>
          </div>
        </template>
        <template v-else-if="column.key === 'kind'">
          <a-tag
            :bordered="false"
            :color="resolveFileKindMeta(record.kind).color"
          >
            {{ resolveFileKindMeta(record.kind).label }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'size'">
          {{ formatFileSize(record.size) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space :size="2">
            <a-button size="small" type="link" @click="openPreview(record)">
              预览
            </a-button>
            <a-button size="small" type="link" @click="onDownload(record)">
              下载
            </a-button>
            <a-button size="small" type="link" @click="openRename(record)">
              重命名
            </a-button>
            <a-button danger size="small" type="link" @click="onDelete(record)">
              删除
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <FileRenameModal
      v-model:open="renameOpen"
      :file="renameFile"
      @success="reload"
    />
    <FilePreview v-model:open="previewOpen" :file="previewFile" />
  </div>
</template>

<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs'
import { Modal, message } from 'antdv-next'
import {
  createFileApi,
  deleteFileApi,
  getFilePageListApi,
  type FileKind,
  type FileQuery,
  type FileResp,
} from '@/apis'
import { FilePreview, FormPlus, Icon } from '@/components'
import { useRequest } from '@/hooks'
import { useAuthStore } from '@/store'
import { FileRenameModal } from './components'
import {
  fileKindOptions,
  formatFileSize,
  inferFileKind,
  readFileAsDataUrl,
  resolveFileKindMeta,
} from './data'

import type { FilePreviewSource } from '@/components/file-preview'
import type { FormPlusModel, FormPlusProps } from '@/components/form-plus'
import type {
  TableColumnsType,
  TablePaginationConfig,
  TableRowSelection,
  UploadProps,
} from 'antdv-next'

const PAGE_SIZE = 10
const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_FILE_SIZE_TEXT = '10 MB'
/** 表格纵向滚动高度,扣掉应用头部、标签页与页面自身内容所占空间 */
const TABLE_SCROLL_Y = 'calc(100vh - 310px)'

const { user } = useAuthStore()

const query = shallowRef<FileQuery>({ current: 1, pageSize: PAGE_SIZE })
const selectedRowKeys = shallowRef<(string | number)[]>([])
const uploadingCount = shallowRef(0)
const renameOpen = shallowRef(false)
const renameFile = shallowRef<FileResp>()
const previewOpen = shallowRef(false)
const previewFile = shallowRef<FilePreviewSource | null>(null)

const uploading = computed(() => uploadingCount.value > 0)

const querySchemas = shallowRef<FormPlusProps['schemas']>([
  {
    field: 'name',
    label: '文件名',
    component: 'input',
    componentProps: {
      allowClear: true,
      placeholder: '请输入文件名',
    },
  },
  {
    field: 'kind',
    label: '文件类型',
    component: 'select',
    componentProps: {
      allowClear: true,
      placeholder: '请选择文件类型',
      options: fileKindOptions,
    },
  },
  {
    field: 'range',
    label: '上传时间',
    component: 'dateRangePicker',
    componentProps: {
      allowClear: true,
      placeholder: ['开始日期', '结束日期'],
    },
  },
])

const columns: TableColumnsType<FileResp> = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    width: 80,
    render: (_value, _record, index) => index + 1,
  },
  { title: '文件名', dataIndex: 'name', key: 'name', width: 260 },
  { title: '类型', dataIndex: 'kind', key: 'kind', width: 100 },
  { title: '大小', dataIndex: 'size', key: 'size', width: 110 },
  { title: '上传人', dataIndex: 'createdBy', width: 120 },
  { title: '上传时间', dataIndex: 'createdAt', width: 180 },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 240,
  },
]

const { data, loading, run } = useRequest(
  (params: FileQuery) => getFilePageListApi(params),
  { defaultParams: [query.value] }
)

const dataSource = computed(() => data.value?.data?.list ?? [])

const pagination = computed<TablePaginationConfig>(() => ({
  current: query.value.current,
  pageSize: query.value.pageSize,
  total: data.value?.data?.total ?? 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
}))

const rowSelection = computed<TableRowSelection<FileResp>>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
}))

function onTableChange(page: TablePaginationConfig) {
  query.value = {
    ...query.value,
    current: page.current ?? 1,
    pageSize: page.pageSize ?? PAGE_SIZE,
  }
  run(query.value)
}

function reload() {
  run(query.value)
}

function onSearch(values: FormPlusModel) {
  const [start, end] = (values.range as [Dayjs, Dayjs] | undefined) ?? []
  query.value = {
    ...query.value,
    current: 1,
    name: (values.name as string)?.trim() || undefined,
    kind: values.kind as FileKind | undefined,
    startTime: start ? dayjs(start).startOf('day').toISOString() : undefined,
    endTime: end ? dayjs(end).endOf('day').toISOString() : undefined,
  }
  run(query.value)
}

function onReset() {
  query.value = { current: 1, pageSize: query.value.pageSize }
  run(query.value)
}

const onBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
  if (file.size > MAX_FILE_SIZE) {
    message.error(`「${file.name}」超过 ${MAX_FILE_SIZE_TEXT},请压缩后再上传`)
    return false
  }

  uploadingCount.value += 1
  try {
    const url = await readFileAsDataUrl(file)
    await createFileApi({
      name: file.name,
      url,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      kind: inferFileKind(file.type, file.name),
      createdBy: user.value?.name ?? '当前用户',
    })
    message.success(`「${file.name}」上传成功`)
    query.value = { ...query.value, current: 1 }
    run(query.value)
  } catch {
    // 业务错误已由请求层统一提示
  } finally {
    uploadingCount.value -= 1
  }

  return false
}

function onDownload(record: FileResp) {
  const link = document.createElement('a')
  link.href = record.url
  link.download = record.name
  document.body.appendChild(link)
  link.click()
  link.remove()
}

let previewObjectUrl: string | null = null

function releasePreviewUrl() {
  if (!previewObjectUrl) return
  URL.revokeObjectURL(previewObjectUrl)
  previewObjectUrl = null
}

/**
 * 预览组件只接受 blob/http(s) 资源,mock 里存的是 dataURL,预览前转成 blob URL
 *
 * @param url 文件地址
 */
async function toPreviewUrl(url: string) {
  if (!url.startsWith('data:')) return url

  const blob = await (await fetch(url)).blob()
  previewObjectUrl = URL.createObjectURL(blob)
  return previewObjectUrl
}

async function openPreview(record: FileResp) {
  releasePreviewUrl()
  previewFile.value = {
    filename: record.name,
    url: await toPreviewUrl(record.url),
    mimeType: record.mimeType,
    size: record.size,
  }
  previewOpen.value = true
}

watch(previewOpen, (open) => {
  if (!open) releasePreviewUrl()
})

function openRename(record: FileResp) {
  renameFile.value = record
  renameOpen.value = true
}

function onDelete(record: FileResp) {
  Modal.confirm({
    title: '删除文件',
    content: `确定删除「${record.name}」吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteFileApi([record.id])
        message.success('文件删除成功')
        selectedRowKeys.value = selectedRowKeys.value.filter(
          (key) => key !== record.id
        )
        reload()
      } catch {
        // 业务错误已由请求层统一提示
      }
    },
  })
}

function onBatchDelete() {
  if (selectedRowKeys.value.length === 0) return

  Modal.confirm({
    title: '删除文件',
    content: `确定删除选中的 ${selectedRowKeys.value.length} 个文件吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteFileApi(selectedRowKeys.value)
        message.success('文件删除成功')
        selectedRowKeys.value = []
        reload()
      } catch {
        // 业务错误已由请求层统一提示
      }
    },
  })
}

onBeforeUnmount(releasePreviewUrl)
</script>
