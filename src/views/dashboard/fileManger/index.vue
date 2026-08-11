<script lang="ts" setup>
import { Sider, Content } from './components'
import { useFileExplorer } from './composables/useFileExplorer'
import { useFileOperations } from './composables/useFileOperations'

const explorer = useFileExplorer()
const operations = useFileOperations(explorer)

const {
  activeCategory,
  categoryStats,
  currentBreadcrumb,
  currentDirectoryId,
  filteredFiles,
  keyword,
  previewFile,
  renameFile,
  renameValue,
  selectedKeys,
  sortBy,
  storageTotalSize,
  storageUsedSize,
  treeFiles,
  viewMode,
  visibleTotalCount,
  changeCategory,
  changeDirectory,
  clearSelection,
  getAccessLockedFile,
  getFileById,
  getFilePathText,
  resetFileView,
  selectAllVisible,
} = explorer

const {
  batchDownload,
  confirmBatchDelete,
  confirmDelete,
  copyFileLink,
  copySelectedNames,
  downloadFile,
  handleUpload,
  openRenameModal,
  restoreFile,
  restoreSelectedFiles,
  submitRename,
  toggleFavorite,
  updateEncryption,
} = operations
</script>

<template>
  <WView full :padding="false" class="bg-page">
    <div
      class="h-full bg-page min-h-full grid gap-10 p-10 grid-cols-[minmax(220px,280px)_minmax(0,1fr)] max-[1199px]:grid-cols-1 max-[1199px]:grid-rows-[auto_minmax(0,1fr)] max-[575px]:(gap-8 p-8)"
    >
      <aside
        class="min-h-0 min-w-0 overflow-hidden max-[1199px]:overflow-visible"
      >
        <Sider
          :active-category="activeCategory"
          :stats="categoryStats"
          :used-size="storageUsedSize"
          :total-size="storageTotalSize"
          @update:active-category="changeCategory"
        />
      </aside>

      <main
        class="min-h-0 min-w-0 overflow-hidden max-[1199px]:overflow-visible"
      >
        <Content
          v-model:active-category="activeCategory"
          v-model:current-directory-id="currentDirectoryId"
          v-model:keyword="keyword"
          v-model:sort-by="sortBy"
          v-model:view-mode="viewMode"
          v-model:selected-keys="selectedKeys"
          v-model:preview-file="previewFile"
          v-model:rename-file="renameFile"
          v-model:rename-value="renameValue"
          :files="filteredFiles"
          :tree-files="treeFiles"
          :breadcrumb-items="currentBreadcrumb"
          :total-count="visibleTotalCount"
          :get-file-by-id="getFileById"
          :get-access-locked-file="getAccessLockedFile"
          :get-file-path-text="getFilePathText"
          @upload="handleUpload"
          @rename="openRenameModal"
          @submit-rename="submitRename"
          @update-encryption="updateEncryption"
          @delete="confirmDelete"
          @batch-delete="confirmBatchDelete"
          @restore="restoreFile"
          @batch-restore="restoreSelectedFiles"
          @download="downloadFile"
          @batch-download="batchDownload"
          @copy-link="copyFileLink"
          @copy-selected-names="copySelectedNames"
          @toggle-favorite="toggleFavorite"
          @select-all-visible="selectAllVisible"
          @clear-selection="clearSelection"
          @change-category="changeCategory"
          @change-directory="changeDirectory"
          @reset-view="resetFileView"
        />
      </main>
    </div>
  </WView>
</template>
