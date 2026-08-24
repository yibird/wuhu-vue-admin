<script setup lang="ts">
import { Icon } from '@/components/icon'
import { CodeEditor } from '@/components/code-editor'
import { inferFilePreviewKind, resolveFilePreviewUrl } from './source'
import { useTextPreview } from './useTextPreview'
import type { FilePreviewLocale, FilePreviewProps } from './types'

const defaultLocale: FilePreviewLocale = {
  defaultTitle: '文件预览',
  emptyText: '请选择要预览的文件',
  enterFullscreen: '全屏预览',
  exitFullscreen: '退出全屏',
  missingTextUrl: '当前文本文件没有可读取的地址。',
  pdfTitle: 'PDF 预览',
  textAriaSuffix: '文本内容',
  textLoadFailed: '文本内容读取失败，请下载后查看。',
  textLoading: '读取文本内容...',
  textTooLarge: (maxSize) => `文件超过 ${maxSize}，请下载后查看。`,
  unsupportedDescription: '当前文件没有可预览的地址。',
  unsupportedDescriptionWithUrl: '当前类型需要下载后查看。',
  unsupportedTitles: {
    archive: '压缩包暂不支持在线预览',
    excel: 'Excel 表格预览待接入',
    powerpoint: 'PPT 预览待接入',
    unknown: '暂不支持在线预览',
    word: 'Word 文档预览待接入',
  },
  unsupportedTypeDescriptions: {
    excel: '可以后续接入 xlsx 解析、表格渲染或后端转码服务。',
    powerpoint: '可以后续接入演示文稿解析或后端转图片/PDF 预览。',
    word: '可以后续接入 docx 解析、Office Online 或后端转码服务。',
  },
}

const props = withDefaults(defineProps<FilePreviewProps>(), {
  file: null,
  maxTextBytes: 2 * 1024 * 1024,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const fullscreen = shallowRef(false)
const locale = computed<FilePreviewLocale>(() => ({
  ...defaultLocale,
  ...props.locale,
  unsupportedTitles: {
    ...defaultLocale.unsupportedTitles,
    ...props.locale?.unsupportedTitles,
  },
  unsupportedTypeDescriptions: {
    ...defaultLocale.unsupportedTypeDescriptions,
    ...props.locale?.unsupportedTypeDescriptions,
  },
}))

const title = computed(() => props.file?.filename || locale.value.defaultTitle)
const open = computed(() => props.open)
const inferredKind = computed(() => inferFilePreviewKind(props.file))
const previewKind = computed(() => props.file?.kind ?? inferredKind.value)
const safeUrl = computed(() => resolveFilePreviewUrl(props.file))
const fileSize = computed(() => props.file?.size ?? 0)
const maxTextBytes = computed(() => props.maxTextBytes)
const hasUrl = computed(() => Boolean(safeUrl.value))
const canRenderPdf = computed(
  () =>
    previewKind.value === 'pdf' && inferredKind.value === 'pdf' && hasUrl.value
)
const {
  content: textContent,
  error: textError,
  loading: textLoading,
} = useTextPreview({
  open,
  kind: previewKind,
  url: safeUrl,
  size: fileSize,
  maxBytes: maxTextBytes,
  locale,
})

const unsupportedTitle = computed(() => {
  const kind = previewKind.value
  return locale.value.unsupportedTitles[
    kind === 'word' ||
    kind === 'excel' ||
    kind === 'powerpoint' ||
    kind === 'archive'
      ? kind
      : 'unknown'
  ]
})

const unsupportedDescription = computed(() => {
  const kind = previewKind.value
  if (kind === 'word' || kind === 'excel' || kind === 'powerpoint') {
    return locale.value.unsupportedTypeDescriptions[kind]
  }
  return hasUrl.value
    ? locale.value.unsupportedDescriptionWithUrl
    : locale.value.unsupportedDescription
})

const modalWidth = computed(() => (fullscreen.value ? '100vw' : 960))
const modalWrapClass = computed(() =>
  fullscreen.value
    ? 'w-file-preview-modal-wrap w-file-preview-modal-wrap--fullscreen'
    : 'w-file-preview-modal-wrap'
)

watch(open, (value) => {
  if (!value) fullscreen.value = false
})

function closeModal() {
  emit('update:open', false)
}

function toggleFullscreen() {
  fullscreen.value = !fullscreen.value
}
</script>

<template>
  <a-modal
    :open="open"
    :title="title"
    :footer="null"
    :width="modalWidth"
    :wrap-class-name="modalWrapClass"
    centered
    destroy-on-hidden
    @cancel="closeModal"
  >
    <template #closeIcon>
      <Icon name="i-lucide:x" :size="18" />
    </template>

    <template #title>
      <div class="min-w-0 flex items-center justify-between gap-12 pr-28">
        <div class="min-w-0 flex items-center gap-8">
          <Icon name="i-lucide:file-search" :size="18" class="text-primary" />
          <span class="truncate">{{ title }}</span>
        </div>
        <a-tooltip
          :title="fullscreen ? locale.exitFullscreen : locale.enterFullscreen"
        >
          <a-button
            type="text"
            size="small"
            :aria-label="
              fullscreen ? locale.exitFullscreen : locale.enterFullscreen
            "
            @click.stop="toggleFullscreen"
          >
            <template #icon>
              <Icon
                :name="
                  fullscreen ? 'i-lucide:minimize-2' : 'i-lucide:maximize-2'
                "
                :size="16"
              />
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </template>

    <div
      v-if="file"
      class="w-file-preview-shell overflow-hidden rounded-6 border-1 border-color-1 border-solid bg-fill-quaternary"
    >
      <div
        v-if="previewKind === 'image' && safeUrl"
        class="w-file-preview-stage"
      >
        <img
          :src="safeUrl"
          :alt="file.filename"
          class="w-file-preview-image"
          referrerpolicy="no-referrer"
        />
      </div>

      <div
        v-else-if="previewKind === 'video' && safeUrl"
        class="w-file-preview-stage bg-black"
      >
        <video :src="safeUrl" class="full" controls preload="metadata" />
      </div>

      <div
        v-else-if="previewKind === 'audio' && safeUrl"
        class="w-file-preview-stage px-24"
      >
        <div class="w-full max-w-560 flex flex-col items-center gap-18">
          <Icon name="i-lucide:audio-lines" :size="72" class="text-primary" />
          <audio :src="safeUrl" controls class="w-full" />
        </div>
      </div>

      <iframe
        v-else-if="canRenderPdf"
        :src="safeUrl ?? undefined"
        class="full min-h-560 border-0 bg-container"
        :title="locale.pdfTitle"
        loading="lazy"
        referrerpolicy="no-referrer"
        sandbox="allow-downloads"
      />

      <div
        v-else-if="previewKind === 'text'"
        class="h-full min-h-560 bg-container"
      >
        <div
          v-if="textLoading"
          class="h-full min-h-560 flex-center text-secondary"
        >
          <a-spin />
          <span class="ml-10">{{ locale.textLoading }}</span>
        </div>
        <div
          v-else-if="textError"
          class="h-full min-h-560 flex flex-col items-center justify-center gap-12 px-24 text-center text-secondary"
        >
          <Icon name="i-lucide:file-warning" :size="64" />
          <div>{{ textError }}</div>
        </div>
        <CodeEditor
          v-else
          v-model="textContent"
          class="h-full min-h-560 border-0"
          language="text"
          readonly
          :aria-label="`${title}${locale.textAriaSuffix}`"
        />
      </div>

      <div v-else class="w-file-preview-stage px-24 text-center">
        <Icon name="i-lucide:file-question" :size="76" class="text-secondary" />
        <div class="mt-14 text-lg text-main font-600">
          {{ unsupportedTitle }}
        </div>
        <div class="mt-8 max-w-480 text-sm text-secondary leading-22px">
          {{ unsupportedDescription }}
        </div>
      </div>
    </div>

    <a-empty v-else :description="locale.emptyText" />
  </a-modal>
</template>

<style scoped>
.w-file-preview-shell {
  height: min(70vh, 680px);
}

.w-file-preview-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 560px;
}

.w-file-preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

:global(.w-file-preview-modal-wrap--fullscreen .ant-modal) {
  top: 0;
  max-width: 100vw;
  padding-bottom: 0;
  margin: 0;
}

:global(.w-file-preview-modal-wrap--fullscreen .ant-modal-content) {
  min-height: 100vh;
  border-radius: 0;
}

:global(.w-file-preview-modal-wrap--fullscreen .w-file-preview-shell) {
  height: calc(100vh - 112px);
}
</style>
