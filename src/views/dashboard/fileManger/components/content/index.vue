<script lang="ts" setup>
import type { UploadFile } from 'antdv-next'
import { toRef } from 'vue'
import { Icon } from '@/components/icon'
import { useFileContentActions } from '../../composables/useFileContentActions'
import Breadcrumb from './Breadcrumb.vue'
import DetailModal from './DetailModal.vue'
import PreviewModal from './PreviewModal.vue'
import Tree from './Tree.vue'
import Grid from './Grid.vue'
import {
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

const {
  batchMenuItems,
  currentVisibleCount,
  detailFile,
  detailPathText,
  encryptionFile,
  encryptionPassword,
  encryptionTitle,
  isRecycleBin,
  selectedCountText,
  unlockError,
  unlockFile,
  unlockPassword,
  unlockTitle,
  beforeUpload,
  cancelEncryption,
  cancelUnlock,
  changeDirectoryWithAccess,
  copyFileLinkWithAccess,
  deleteFileWithAccess,
  detailFileWithAccess,
  downloadFileWithAccess,
  handleBatchAction,
  handleCategorySelect,
  openDirectoryWithAccess,
  openEncryptionModal,
  previewFileWithAccess,
  renameFileWithAccess,
  restoreFile,
  submitEncryption,
  submitUnlock,
  toggleFavoriteWithAccess,
} = useFileContentActions({
  activeCategory,
  files: toRef(props, 'files'),
  treeFiles: toRef(props, 'treeFiles'),
  selectedKeys,
  viewMode,
  previewFile,
  getFileById: props.getFileById,
  getAccessLockedFile: props.getAccessLockedFile,
  getFilePathText: props.getFilePathText,
  handlers: {
    upload: (file) => emit('upload', file),
    rename: (file) => emit('rename', file),
    updateEncryption: (file, password) =>
      emit('updateEncryption', file, password),
    delete: (file) => emit('delete', file),
    batchDelete: () => emit('batchDelete'),
    download: (file) => emit('download', file),
    batchDownload: () => emit('batchDownload'),
    copyLink: (file) => emit('copyLink', file),
    copySelectedNames: () => emit('copySelectedNames'),
    restore: (file) => emit('restore', file),
    batchRestore: () => emit('batchRestore'),
    toggleFavorite: (file) => emit('toggleFavorite', file),
    selectAllVisible: () => emit('selectAllVisible'),
    clearSelection: () => emit('clearSelection'),
    changeCategory: (category) => emit('changeCategory', category),
    changeDirectory: (id) => emit('changeDirectory', id),
  },
})
</script>

<template>
  <div
    class="file-manager-content h-full min-h-0 flex flex-col gap-10 overflow-hidden rounded-4 bg-container"
  >
    <div
      class="file-manager-content__header min-w-0 border-b-1 border-b-solid border-color-1 px-16 pt-14 transition-[background-color,border-color] duration-motion-base ease-motion-standard motion-reduce:transition-none max-[575px]:(px-12 pt-12)"
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
            <Transition name="fade" mode="out-in">
              <a-tag :key="totalCount" color="blue">
                {{ totalCount }} 个文件
              </a-tag>
            </Transition>
            <a-tag v-if="currentVisibleCount !== totalCount" color="cyan">
              当前 {{ currentVisibleCount }} 项
            </a-tag>
          </div>
          <Transition name="fade" mode="out-in">
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
      class="file-manager-content__toolbar flex flex-wrap items-center justify-between gap-10 px-16 transition-[background-color,border-color] duration-motion-base ease-motion-standard motion-reduce:transition-none max-[575px]:px-12"
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
          class="file-manager-search w-280 [&_.ant-input-prefix]:(transition-transform duration-motion-base ease-motion-standard) focus-within:[&_.ant-input-prefix]:(scale-108 text-primary) motion-reduce:[&_.ant-input-prefix]:transition-none max-[575px]:w-full"
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
      <div
        class="file-manager-content__view-stage relative h-full min-h-0 [&>*]:(absolute inset-0 h-full w-full) [&>.fade-scale-leave-active]:pointer-events-none"
      >
        <Transition name="fade-scale" appear>
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
            @download="downloadFileWithAccess"
            @copy-link="copyFileLinkWithAccess"
            @encrypt="openEncryptionModal"
            @restore="restoreFile"
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
            @download="downloadFileWithAccess"
            @copy-link="copyFileLinkWithAccess"
            @encrypt="openEncryptionModal"
            @restore="restoreFile"
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
    @cancel="cancelEncryption"
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
