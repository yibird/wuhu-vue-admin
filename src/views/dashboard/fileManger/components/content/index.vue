<script lang="ts" setup>
import type { UploadFile } from 'antdv-next'
import { message } from 'antdv-next'
import { computed, h, shallowRef } from 'vue'
import { Icon } from '@/components'
import Breadcrumb from './Breadcrumb.vue'
import DetailModal from './DetailModal.vue'
import PreviewModal from './PreviewModal.vue'
import Tree from './Tree.vue'
import Grid from './Grid.vue'
import {
  FILE_NODE_TYPE,
  type FileBreadcrumbItem,
  type FileCategory,
  type FileSelectionKey,
  type FileSortBy,
  type FileViewMode,
  type IFile,
} from '../types'
import {
  fileCategoryOptions,
  fileSortOptions,
  fileViewOptions,
  getFileCategoryLabel,
} from '../utils'

const activeCategory = defineModel<FileCategory>('activeCategory', {
  required: true,
})
defineModel<string>('currentDirectoryId', { required: true })
const keyword = defineModel<string>('keyword', { required: true })
const sortBy = defineModel<FileSortBy>('sortBy', { required: true })
const viewMode = defineModel<FileViewMode>('viewMode', { required: true })
const selectedKeys = defineModel<FileSelectionKey[]>('selectedKeys', {
  required: true,
})
const previewFile = defineModel<IFile | null>('previewFile', {
  required: true,
})
const renameFile = defineModel<IFile | null>('renameFile', {
  required: true,
})
const renameValue = defineModel<string>('renameValue', { required: true })

const props = defineProps<{
  files: IFile[]
  treeFiles: IFile[]
  breadcrumbItems: FileBreadcrumbItem[]
  totalCount: number
  getFileById: (id: string) => IFile | undefined
  getAccessLockedFile: (file: IFile) => IFile | undefined
  getFilePathText: (file: IFile) => string
}>()

const emit = defineEmits<{
  upload: [file: UploadFile | File]
  rename: [file: IFile]
  submitRename: []
  updateEncryption: [file: IFile, password?: string]
  delete: [file: IFile]
  batchDelete: []
  download: [file: IFile]
  batchDownload: []
  copyLink: [file: IFile]
  copySelectedNames: []
  restore: [file: IFile]
  batchRestore: []
  toggleFavorite: [file: IFile]
  selectAllVisible: []
  clearSelection: []
  changeCategory: [category: FileCategory]
  changeDirectory: [id: string]
  resetView: []
}>()

const hasSelection = computed(() => selectedKeys.value.length > 0)
const isRecycleBin = computed(() => activeCategory.value === 'trash')
const detailFile = shallowRef<IFile | null>(null)
const encryptionFile = shallowRef<IFile | null>(null)
const encryptionPassword = shallowRef('')
const unlockFile = shallowRef<IFile | null>(null)
const unlockPassword = shallowRef('')
const unlockError = shallowRef('')
const pendingAccessAction = shallowRef<(() => void) | null>(null)
const detailPathText = computed(() =>
  detailFile.value ? props.getFilePathText(detailFile.value) : ''
)
const encryptionTitle = computed(() =>
  encryptionFile.value
    ? `设置「${encryptionFile.value.fileName}」加密`
    : '设置加密'
)
const unlockTitle = computed(() =>
  unlockFile.value ? `访问「${unlockFile.value.fileName}」` : '输入密码'
)
const selectedFileCount = computed(() => {
  const selectedKeySet = new Set(selectedKeys.value)
  const sourceFiles = viewMode.value === 'list' ? props.treeFiles : props.files
  return sourceFiles.filter(
    (item) => item.type === FILE_NODE_TYPE.FILE && selectedKeySet.has(item.id)
  ).length
})
const selectedVisibleFiles = computed(() => {
  const selectedKeySet = new Set(selectedKeys.value)
  const sourceFiles = viewMode.value === 'list' ? props.treeFiles : props.files
  return sourceFiles.filter(
    (item) => item.type === FILE_NODE_TYPE.FILE && selectedKeySet.has(item.id)
  )
})
const hasFileSelection = computed(() => selectedFileCount.value > 0)
const selectedCountText = computed(() =>
  hasSelection.value ? `已选 ${selectedKeys.value.length} 项` : '未选择文件'
)
const currentVisibleCount = computed(() =>
  viewMode.value === 'list' ? props.treeFiles.length : props.files.length
)

const batchMenuItems = computed(() => [
  ...(isRecycleBin.value
    ? [
        {
          key: 'restore',
          label: '恢复选中',
          disabled: !hasFileSelection.value,
          icon: renderMenuIcon('i-lucide:rotate-ccw'),
        },
      ]
    : [
        {
          key: 'download',
          label: '下载选中',
          disabled: !hasFileSelection.value,
          icon: renderMenuIcon('i-lucide:download'),
        },
        {
          key: 'copy',
          label: '复制文件名',
          disabled: !hasFileSelection.value,
          icon: renderMenuIcon('i-lucide:copy'),
        },
      ]),
  {
    key: 'select-all',
    label: '全选当前结果',
    disabled: currentVisibleCount.value === 0,
    icon: renderMenuIcon('i-lucide:check-check'),
  },
  {
    key: 'clear',
    label: '清空选择',
    disabled: !hasSelection.value,
    icon: renderMenuIcon('i-lucide:x'),
  },
  {
    type: 'divider',
  },
  {
    key: 'delete',
    label: isRecycleBin.value ? '彻底删除选中' : '删除选中',
    danger: true,
    disabled: !hasFileSelection.value,
    icon: renderMenuIcon('i-lucide:trash-2'),
  },
])

function renderMenuIcon(name: string) {
  return () => h(Icon, { name, size: 15 })
}

function beforeUpload(file: UploadFile | File) {
  emit('upload', file)
  return false
}

function changeCategory(category: FileCategory) {
  emit('changeCategory', category)
}

function handleCategorySelect(value: unknown) {
  if (
    typeof value === 'string' &&
    fileCategoryOptions.some((item) => item.value === value)
  ) {
    changeCategory(value as FileCategory)
  }
}

function handleBatchAction({ key }: { key: string }) {
  switch (key) {
    case 'download':
      requestBatchDownload()
      break
    case 'copy':
      emit('copySelectedNames')
      break
    case 'restore':
      emit('batchRestore')
      break
    case 'select-all':
      emit('selectAllVisible')
      break
    case 'clear':
      emit('clearSelection')
      break
    case 'delete':
      requestBatchDelete()
      break
  }
}

function requestBatchDownload() {
  const lockedFile = selectedVisibleFiles.value
    .map((file) => props.getAccessLockedFile(file))
    .find((file): file is IFile => Boolean(file))

  if (!lockedFile) {
    emit('batchDownload')
    return
  }

  requestAccess(lockedFile, () => emit('batchDownload'))
}

function requestBatchDelete() {
  const lockedFile = selectedVisibleFiles.value
    .map((file) => props.getAccessLockedFile(file))
    .find((file): file is IFile => Boolean(file))

  if (!lockedFile) {
    emit('batchDelete')
    return
  }

  requestAccess(lockedFile, () => emit('batchDelete'))
}

function requestAccess(file: IFile, action: () => void) {
  const lockedFile = props.getAccessLockedFile(file)
  if (!lockedFile) {
    action()
    return
  }

  unlockFile.value = lockedFile
  unlockPassword.value = ''
  unlockError.value = ''
  pendingAccessAction.value = action
}

function showEncryptionModal(file: IFile) {
  encryptionFile.value = file
  encryptionPassword.value = ''
}

function submitUnlock() {
  const target = unlockFile.value
  if (!target) return

  if (unlockPassword.value !== target.encryptPassword) {
    unlockError.value = '密码错误，请重新输入'
    return
  }

  const action = pendingAccessAction.value
  unlockFile.value = null
  unlockPassword.value = ''
  unlockError.value = ''
  pendingAccessAction.value = null
  action?.()
}

function cancelUnlock() {
  unlockFile.value = null
  unlockPassword.value = ''
  unlockError.value = ''
  pendingAccessAction.value = null
}

function openEncryptionModal(file: IFile) {
  requestAccess(file, () => {
    if (file.encrypted) {
      emit('updateEncryption', file, undefined)
      return
    }

    showEncryptionModal(file)
  })
}

function submitEncryption() {
  const target = encryptionFile.value
  const password = encryptionPassword.value.trim()
  if (!target) return

  if (!password) {
    message.warning('请输入加密密码')
    return
  }

  emit('updateEncryption', target, password)
  encryptionFile.value = null
  encryptionPassword.value = ''
}

function previewFileWithAccess(file: IFile) {
  requestAccess(file, () => {
    previewFile.value = file
  })
}

function openDirectoryWithAccess(file: IFile) {
  requestAccess(file, () => emit('changeDirectory', file.id))
}

function emitWithAccess(file: IFile, action: () => void) {
  requestAccess(file, action)
}

function detailFileWithAccess(file: IFile) {
  requestAccess(file, () => {
    detailFile.value = file
  })
}

function renameFileWithAccess(file: IFile) {
  emitWithAccess(file, () => emit('rename', file))
}

function deleteFileWithAccess(file: IFile) {
  emitWithAccess(file, () => emit('delete', file))
}

function toggleFavoriteWithAccess(file: IFile) {
  emitWithAccess(file, () => emit('toggleFavorite', file))
}

function changeDirectoryWithAccess(id: string) {
  const directory = props.getFileById(id)
  if (!directory) {
    emit('changeDirectory', id)
    return
  }

  openDirectoryWithAccess(directory)
}
</script>

<template>
  <div
    class="file-manager-content h-full min-h-0 flex flex-col gap-10 overflow-hidden rounded-4 bg-container"
  >
    <div
      class="file-manager-content__header min-w-0 border-b-1 border-b-solid border-color-1 px-16 pt-14 max-[575px]:(px-12 pt-12)"
    >
      <Breadcrumb
        v-if="viewMode === 'grid'"
        :items="breadcrumbItems"
        @change-directory="changeDirectoryWithAccess"
        @reset-view="emit('resetView')"
      />
      <div
        class="mt-12 flex flex-wrap items-center justify-between gap-10 pb-12 max-[575px]:mt-0"
      >
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-8">
            <h2 class="m-0 text-md text-main font-600">文件管理</h2>
            <Transition name="file-count" mode="out-in">
              <a-tag :key="totalCount" color="blue">
                {{ totalCount }} 个文件
              </a-tag>
            </Transition>
            <a-tag v-if="currentVisibleCount !== totalCount" color="cyan">
              当前 {{ currentVisibleCount }} 项
            </a-tag>
          </div>
          <Transition name="file-status" mode="out-in">
            <p
              :key="`${activeCategory}-${selectedCountText}`"
              class="m-0 mt-4 text-xs text-secondary"
            >
              {{ getFileCategoryLabel(activeCategory) }} ·
              {{ selectedCountText }}
            </p>
          </Transition>
        </div>
        <div
          class="flex flex-wrap items-center justify-end gap-8 max-[575px]:w-full"
        >
          <a-upload
            v-if="!isRecycleBin"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            multiple
          >
            <a-button type="primary" class="max-[575px]:w-full">
              <template #icon>
                <Icon name="i-lucide:upload" />
              </template>
              上传文件
            </a-button>
          </a-upload>
          <a-dropdown
            :trigger="['click']"
            :menu="{ items: batchMenuItems, onClick: handleBatchAction }"
          >
            <a-button class="max-[575px]:w-full">
              <template #icon>
                <Icon name="i-lucide:list-checks" />
              </template>
              批量操作
            </a-button>
          </a-dropdown>
        </div>
      </div>
    </div>

    <div
      class="file-manager-content__toolbar flex flex-wrap items-center justify-between gap-10 px-16 max-[575px]:px-12"
    >
      <div class="flex flex-1 flex-wrap items-center gap-8">
        <a-select
          :value="activeCategory"
          class="w-132 max-[575px]:w-full"
          :options="fileCategoryOptions"
          @change="handleCategorySelect"
        />
        <a-input
          v-model:value="keyword"
          allow-clear
          class="file-manager-search w-280 max-[575px]:w-full"
          placeholder="搜索文件名、创建人、更新人、扩展名"
        >
          <template #prefix>
            <Icon name="i-lucide:search" class="text-secondary" />
          </template>
        </a-input>
      </div>
      <div
        class="flex flex-wrap items-center justify-end gap-8 max-[575px]:w-full"
      >
        <a-select
          v-model:value="sortBy"
          class="w-126 max-[575px]:w-full"
          :options="fileSortOptions"
        />
        <a-radio-group v-model:value="viewMode" class="whitespace-nowrap">
          <a-radio-button
            v-for="item in fileViewOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <div
      class="file-manager-content__viewport min-h-0 flex-1 overflow-hidden px-16 pb-16 max-[575px]:(px-12 pb-12)"
    >
      <div class="file-manager-content__view-stage relative h-full min-h-0">
        <Transition name="file-view" appear>
          <Grid
            v-if="viewMode === 'grid'"
            key="grid"
            v-model:selected-keys="selectedKeys"
            :items="files"
            :recycle-bin="isRecycleBin"
            :view-mode="viewMode"
            @open-directory="openDirectoryWithAccess"
            @preview="previewFileWithAccess"
            @detail="detailFileWithAccess"
            @rename="renameFileWithAccess"
            @delete="deleteFileWithAccess"
            @download="
              (file) => emitWithAccess(file, () => emit('download', file))
            "
            @copy-link="
              (file) => emitWithAccess(file, () => emit('copyLink', file))
            "
            @encrypt="openEncryptionModal"
            @restore="emit('restore', $event)"
            @toggle-favorite="toggleFavoriteWithAccess"
          />
          <Tree
            v-else
            key="tree"
            v-model:selected-keys="selectedKeys"
            :items="treeFiles"
            :recycle-bin="isRecycleBin"
            @open-directory="openDirectoryWithAccess"
            @preview="previewFileWithAccess"
            @detail="detailFileWithAccess"
            @rename="renameFileWithAccess"
            @delete="deleteFileWithAccess"
            @download="
              (file) => emitWithAccess(file, () => emit('download', file))
            "
            @copy-link="
              (file) => emitWithAccess(file, () => emit('copyLink', file))
            "
            @encrypt="openEncryptionModal"
            @restore="emit('restore', $event)"
            @toggle-favorite="toggleFavoriteWithAccess"
          />
        </Transition>
      </div>
    </div>
  </div>

  <PreviewModal v-model:file="previewFile" />
  <DetailModal v-model:file="detailFile" :path-text="detailPathText" />

  <a-modal
    :open="!!encryptionFile"
    :title="encryptionTitle"
    ok-text="保存"
    cancel-text="取消"
    destroy-on-hidden
    @ok="submitEncryption"
    @cancel="encryptionFile = null"
  >
    <a-input-password
      v-model:value="encryptionPassword"
      placeholder="请输入加密密码"
      @press-enter="submitEncryption"
    />
  </a-modal>

  <a-modal
    :open="!!unlockFile"
    :title="unlockTitle"
    ok-text="确认"
    cancel-text="取消"
    destroy-on-hidden
    @ok="submitUnlock"
    @cancel="cancelUnlock"
  >
    <a-alert
      v-if="unlockError"
      type="error"
      show-icon
      class="mb-10"
      :message="unlockError"
    />
    <a-input-password
      v-model:value="unlockPassword"
      placeholder="请输入访问密码"
      @press-enter="submitUnlock"
    />
  </a-modal>

  <a-modal
    :open="!!renameFile"
    title="重命名文件"
    ok-text="保存"
    cancel-text="取消"
    destroy-on-hidden
    @ok="emit('submitRename')"
    @cancel="renameFile = null"
  >
    <a-input
      v-model:value="renameValue"
      placeholder="请输入文件名称"
      @press-enter="emit('submitRename')"
    />
  </a-modal>
</template>

<style scoped>
.file-manager-content__header,
.file-manager-content__toolbar {
  transition:
    background-color 180ms ease,
    border-color 180ms ease;
}

.file-manager-search :deep(.ant-input-prefix) {
  transition: transform 180ms ease;
}

.file-manager-search:focus-within :deep(.ant-input-prefix) {
  color: rgb(var(--w-color-primary));
  transform: scale(1.08);
}

.file-manager-content__view-stage > * {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.file-view-enter-active {
  transition:
    opacity 180ms ease-out,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.file-view-leave-active {
  pointer-events: none;
  transition:
    opacity 100ms ease-in,
    transform 100ms ease-in;
}

.file-view-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.995);
}

.file-view-leave-to {
  opacity: 0;
  transform: translateY(-3px) scale(0.998);
}

.file-count-enter-active,
.file-count-leave-active,
.file-status-enter-active,
.file-status-leave-active {
  transition:
    opacity 140ms ease,
    transform 160ms ease;
}

.file-count-enter-from,
.file-status-enter-from {
  opacity: 0;
  transform: translateY(3px);
}

.file-count-leave-to,
.file-status-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}

@media (prefers-reduced-motion: reduce) {
  .file-manager-content__header,
  .file-manager-content__toolbar,
  .file-manager-search :deep(.ant-input-prefix),
  .file-view-enter-active,
  .file-view-leave-active,
  .file-count-enter-active,
  .file-count-leave-active,
  .file-status-enter-active,
  .file-status-leave-active {
    transition: none;
  }
}
</style>
