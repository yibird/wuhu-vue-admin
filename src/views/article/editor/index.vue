<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import DocumentSidebar from './components/DocumentSidebar.vue'
import Header from './components/Header.vue'
import Content from './components/Content.vue'
import DocumentInfoPanel from './components/DocumentInfoPanel.vue'
import DocumentPreview from './components/DocumentPreview.vue'
import { useEditor } from './composables/useEditor'

const route = useRoute()
const router = useRouter()

const {
  // refs
  activeMode,
  deviceMode,
  keyword,
  editingContent,
  sourceContent,
  previewOpen,
  outlineOpen,
  isRenaming,
  renameValue,
  importModalOpen,
  importContent,
  documentDrawerOpen,
  commentDraft,
  // computed
  activeDocument,
  filteredDocuments,
  safeContent,
  wordCount,
  paragraphCount,
  readingMinutes,
  documentStatusText,
  saveText,
  previewWidthClass,
  outline,
  activeVersions,
  activeComments,
  unresolvedCommentCount,
  // actions
  selectDocument,
  createDocument,
  getDocumentActionMenu,
  getSelectedDocumentClass,
  saveDocument,
  saveVersion,
  restoreVersion,
  addComment,
  toggleCommentResolved,
  resetDocument,
  updateStatus,
  startRename,
  confirmRename,
  insertTemplate,
  applyImportedContent,
  copyDocumentHtml,
  exportDocument,
  openFileDialog,
  handleSegmentedModeChange,
} = useEditor()

let createRequestHandled = false

watch(
  () => [route.query.id, route.query.create] as const,
  ([rawId, create]) => {
    const id = Array.isArray(rawId) ? rawId[0] : rawId
    if (id) {
      selectDocument(id)
      return
    }
    if (create !== '1' || createRequestHandled) return

    createRequestHandled = true
    const document = createDocument()
    void router.replace({ path: '/article/editor', query: { id: document.id } })
  },
  { immediate: true }
)
</script>

<template>
  <WView>
    <div class="full min-w-0 flex bg-page">
      <!-- Desktop document list -->
      <aside
        class="h-full w-300 shrink-0 border-r-1 border-r-solid border-color-1 bg-container max-xl:w-260 max-lg:hidden"
      >
        <DocumentSidebar
          :documents="filteredDocuments"
          :active-id="activeDocument?.id ?? ''"
          :keyword="keyword"
          :get-action-menu="getDocumentActionMenu"
          :get-selected-class="getSelectedDocumentClass"
          @select="selectDocument"
          @create="createDocument"
          @update:keyword="(v) => (keyword = v)"
        />
      </aside>

      <main class="min-w-0 flex flex-1 flex-col">
        <!-- Header actions -->
        <Header
          :active-document="activeDocument"
          :is-renaming="isRenaming"
          :rename-value="renameValue"
          :active-mode="activeMode"
          :document-status-text="documentStatusText"
          :save-text="saveText"
          :word-count="wordCount"
          :reading-minutes="readingMinutes"
          @mode-change="handleSegmentedModeChange"
          @save="saveDocument"
          @reset="resetDocument"
          @start-rename="startRename"
          @confirm-rename="confirmRename"
          @cancel-rename="isRenaming = false"
          @update:rename-value="(v) => (renameValue = v)"
          @open-drawer="documentDrawerOpen = true"
        />

        <div class="min-h-0 flex flex-1 bg-page px-12 pt-12 max-lg:flex-col">
          <!-- Editor area -->
          <Content
            ref="editorContent"
            :active-mode="activeMode"
            :device-mode="deviceMode"
            :editing-content="editingContent"
            :source-content="sourceContent"
            :safe-content="safeContent"
            :preview-width-class="previewWidthClass"
            @update:editing-content="(v) => (editingContent = v)"
            @update:source-content="(v) => (sourceContent = v)"
            @update:device-mode="(v) => (deviceMode = v)"
            @insert-template="insertTemplate"
            @open-preview="previewOpen = true"
          />

          <!-- Document details -->
          <DocumentInfoPanel
            :active-document="activeDocument"
            :word-count="wordCount"
            :paragraph-count="paragraphCount"
            :reading-minutes="readingMinutes"
            :outline-open="outlineOpen"
            :outline="outline"
            :active-versions="activeVersions"
            :active-comments="activeComments"
            :unresolved-comment-count="unresolvedCommentCount"
            :comment-draft="commentDraft"
            @toggle-outline="outlineOpen = !outlineOpen"
            @copy-html="copyDocumentHtml"
            @import="openFileDialog()"
            @export="exportDocument"
            @save-version="saveVersion"
            @restore-version="restoreVersion"
            @add-comment="addComment"
            @toggle-comment-resolved="toggleCommentResolved"
            @update-status="updateStatus"
            @update:comment-draft="(v) => (commentDraft = v)"
          />
        </div>
      </main>
    </div>

    <!-- Full-screen preview -->
    <a-modal
      v-model:open="previewOpen"
      title="全屏预览"
      :footer="null"
      :width="960"
      centered
    >
      <Scrollbar class="max-h-[72vh]" content-class="p-24">
        <DocumentPreview :html="safeContent" />
      </Scrollbar>
    </a-modal>

    <!-- Import dialog -->
    <a-modal
      v-model:open="importModalOpen"
      title="导入内容"
      ok-text="导入到当前文档"
      cancel-text="取消"
      :width="760"
      @ok="applyImportedContent"
    >
      <textarea
        v-model="importContent"
        class="box-border h-320 w-full resize-none rounded-6 border-1 border-solid border-color-1 bg-container p-12 font-mono text-sm text-main outline-none focus:border-color-primary"
      />
    </a-modal>

    <!-- Mobile document drawer -->
    <a-drawer
      v-model:open="documentDrawerOpen"
      title="文档"
      placement="left"
      :size="320"
      :styles="{ body: { padding: 0 } }"
    >
      <template #extra>
        <a-button type="primary" size="small" @click="createDocument">
          新建
        </a-button>
      </template>
      <DocumentSidebar
        :documents="filteredDocuments"
        :active-id="activeDocument?.id ?? ''"
        :keyword="keyword"
        :get-action-menu="getDocumentActionMenu"
        :get-selected-class="getSelectedDocumentClass"
        compact
        @select="selectDocument"
        @update:keyword="(v) => (keyword = v)"
      />
    </a-drawer>
  </WView>
</template>
