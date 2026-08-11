<script lang="ts" setup>
import type { MenuProps } from 'antdv-next'
import { h, ref, toRef, watch } from 'vue'
import { Motion } from 'motion-v'
import { Icon } from '@/components'
import type { FileSelectionKey, FileViewMode, IFile } from '../types'
import { FILE_NODE_TYPE } from '../types'
import {
  formatFileSize,
  getFileCategoryByType,
  getFileCategoryLabel,
  getFileExtension,
  getFileNameWithoutExtension,
} from '../utils'
import { useFileSelection } from './useFileSelection'
import textIcon from '@/assets/svg/text.svg'
import videoIcon from '@/assets/svg/video.svg'
import mp3Icon from '@/assets/svg/mp3.svg'
import zipIcon from '@/assets/svg/zip.svg'
import xlsIcon from '@/assets/svg/xls.svg'
import docIcon from '@/assets/svg/doc.svg'
import pptIcon from '@/assets/svg/ppt.svg'
import htmlIcon from '@/assets/svg/html.svg'
import cssIcon from '@/assets/svg/css.svg'
import jsIcon from '@/assets/svg/js.svg'
import unknownIcon from '@/assets/svg/unknown.svg'
import folderIcon from '@/assets/svg/folder.svg'
import type { ScrollbarInstance } from '@/components'

const selectedKeys = defineModel<FileSelectionKey[]>('selectedKeys', {
  required: true,
})

const props = defineProps<{
  items: IFile[]
  recycleBin?: boolean
  viewMode: FileViewMode
}>()

const emit = defineEmits<{
  openDirectory: [directory: IFile]
  preview: [file: IFile]
  detail: [file: IFile]
  rename: [file: IFile]
  delete: [file: IFile]
  download: [file: IFile]
  copyLink: [file: IFile]
  encrypt: [file: IFile]
  restore: [file: IFile]
  toggleFavorite: [file: IFile]
}>()

const itemTransition = {
  type: 'spring' as const,
  stiffness: 430,
  damping: 32,
  mass: 0.65,
}
const gridItemHover = { y: -3, scale: 1.01 }
const listItemHover = { x: 2 }
const itemPress = { scale: 0.985 }

const gridRef = ref<ScrollbarInstance | null>(null)
const {
  dragSelection,
  dragSelectionStyle,
  selectedKeySet,
  finishDragSelection,
  handleCheckboxChange,
  handleItemClick,
  handleKeyDown,
  handleSelectionPointerDown,
  handleSelectionPointerMove,
  syncAfterItemsChange,
} = useFileSelection({
  containerRef: gridRef,
  items: toRef(props, 'items'),
  selectedKeys,
  viewMode: toRef(props, 'viewMode'),
})

watch(
  () => props.items.map((item) => item.id).join('|'),
  syncAfterItemsChange,
  { immediate: true }
)

const icons: Record<string, string> = {
  txt: textIcon,
  text: textIcon,
  md: textIcon,
  mp4: videoIcon,
  avi: videoIcon,
  mkv: videoIcon,
  mov: videoIcon,
  wmv: videoIcon,
  flv: videoIcon,
  webm: videoIcon,
  m4v: videoIcon,
  mp3: mp3Icon,
  wav: mp3Icon,
  m4a: mp3Icon,
  flac: mp3Icon,
  zip: zipIcon,
  tar: zipIcon,
  tgz: zipIcon,
  rar: zipIcon,
  '7z': zipIcon,
  gz: zipIcon,
  xlsx: xlsIcon,
  xls: xlsIcon,
  xlsm: xlsIcon,
  csv: xlsIcon,
  doc: docIcon,
  docx: docIcon,
  ppt: pptIcon,
  pptx: pptIcon,
  css: cssIcon,
  html: htmlIcon,
  js: jsIcon,
  ts: jsIcon,
  vue: jsIcon,
}

function isDirectory(file: IFile) {
  return file.type === FILE_NODE_TYPE.DIRECTORY
}

function isFile(file: IFile) {
  return file.type === FILE_NODE_TYPE.FILE
}

function getIcon(file: IFile) {
  if (isDirectory(file)) return folderIcon
  if (getFileCategoryByType(file.fileType) === 'image' && file.fileUrl) {
    return file.fileUrl
  }
  return icons[getFileExtension(file.fileName)] ?? unknownIcon
}

function isSelected(file: IFile) {
  return selectedKeySet.value.has(file.id)
}

function handleDoubleClick(file: IFile) {
  if (isDirectory(file)) {
    emit('openDirectory', file)
    return
  }
  emit('preview', file)
}

function isImageFile(file: IFile) {
  return (
    getFileCategoryByType(file.fileType) === 'image' && Boolean(file.fileUrl)
  )
}

function getPreviewClass(file: IFile, size: 'grid' | 'list') {
  const classes =
    size === 'grid'
      ? 'file-grid__preview size-64 flex-center overflow-hidden rounded-4'
      : 'file-grid__preview size-42 flex-center shrink-0 overflow-hidden rounded-4'
  return isImageFile(file) && isFile(file)
    ? `${classes} bg-transparent`
    : classes
}

function getImageClass(file: IFile, size: 'grid' | 'list') {
  const classes =
    size === 'grid' ? 'file-grid__image size-58' : 'file-grid__image size-36'
  return isImageFile(file) && isFile(file)
    ? `${classes} rounded-4 object-cover`
    : `${classes} object-cover`
}

function getActionItems(file: IFile): MenuProps['items'] {
  if (props.recycleBin) {
    return [
      ...(isFile(file)
        ? [
            {
              key: 'preview',
              label: '预览',
              icon: renderMenuIcon('i-lucide:eye'),
            },
          ]
        : []),
      {
        key: 'detail',
        label: '详情',
        icon: renderMenuIcon('i-lucide:info'),
      },
      {
        type: 'divider',
      },
      {
        key: 'restore',
        label: '恢复',
        icon: renderMenuIcon('i-lucide:rotate-ccw'),
      },
      {
        key: 'delete',
        label: '彻底删除',
        danger: true,
        icon: renderMenuIcon('i-lucide:trash-2'),
      },
    ]
  }

  if (isDirectory(file)) {
    return [
      {
        key: 'open',
        label: '打开',
        icon: renderMenuIcon('i-lucide:folder-open'),
      },
      {
        key: 'detail',
        label: '详情',
        icon: renderMenuIcon('i-lucide:info'),
      },
      {
        type: 'divider',
      },
      {
        key: 'rename',
        label: '重命名',
        icon: renderMenuIcon('i-lucide:pencil'),
      },
      {
        key: 'encrypt',
        label: file.encrypted ? '取消加密' : '设置加密',
        icon: renderMenuIcon(
          file.encrypted ? 'i-lucide:lock-open' : 'i-lucide:lock-keyhole'
        ),
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: '删除',
        danger: true,
        icon: renderMenuIcon('i-lucide:trash-2'),
      },
    ]
  }

  return [
    {
      key: 'preview',
      label: '预览',
      icon: renderMenuIcon('i-lucide:eye'),
    },
    {
      key: 'detail',
      label: '详情',
      icon: renderMenuIcon('i-lucide:info'),
    },
    {
      type: 'divider',
    },
    {
      key: 'rename',
      label: '重命名',
      icon: renderMenuIcon('i-lucide:pencil'),
    },
    {
      key: 'favorite',
      label: file.favorite ? '取消收藏' : '收藏',
      icon: renderMenuIcon(
        file.favorite ? 'i-lucide:star-off' : 'i-lucide:star'
      ),
    },
    {
      key: 'encrypt',
      label: file.encrypted ? '取消加密' : '设置加密',
      icon: renderMenuIcon(
        file.encrypted ? 'i-lucide:lock-open' : 'i-lucide:lock-keyhole'
      ),
    },
    {
      key: 'copy',
      label: '复制链接',
      icon: renderMenuIcon('i-lucide:copy'),
    },
    {
      key: 'download',
      label: '下载',
      icon: renderMenuIcon('i-lucide:download'),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: '删除',
      danger: true,
      icon: renderMenuIcon('i-lucide:trash-2'),
    },
  ]
}

function getActionMenu(file: IFile) {
  return {
    items: getActionItems(file),
    onClick: (event: { key: string }) => handleAction(file, event),
  }
}

function renderMenuIcon(name: string) {
  return () => h(Icon, { name, size: 15 })
}

function handleAction(file: IFile, { key }: { key: string }) {
  switch (key) {
    case 'open':
      emit('openDirectory', file)
      break
    case 'preview':
      emit('preview', file)
      break
    case 'detail':
      emit('detail', file)
      break
    case 'rename':
      emit('rename', file)
      break
    case 'favorite':
      emit('toggleFavorite', file)
      break
    case 'encrypt':
      emit('encrypt', file)
      break
    case 'copy':
      emit('copyLink', file)
      break
    case 'download':
      emit('download', file)
      break
    case 'restore':
      emit('restore', file)
      break
    case 'delete':
      emit('delete', file)
      break
  }
}
</script>

<template>
  <Scrollbar
    ref="gridRef"
    class="file-grid min-h-0"
    :content-class="
      viewMode === 'grid'
        ? 'relative grid select-none grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-10 py-10 max-[575px]:grid-cols-[repeat(auto-fill,minmax(118px,1fr))] max-[575px]:gap-8'
        : 'relative flex select-none flex-col gap-8 py-10'
    "
    tabindex="0"
    @keydown="handleKeyDown"
    @pointerdown="handleSelectionPointerDown"
    @pointermove="handleSelectionPointerMove"
    @pointerup="finishDragSelection"
    @pointercancel="finishDragSelection"
  >
    <Teleport to="body">
      <div
        v-if="dragSelection"
        class="pointer-events-none rounded-4 border-1 border-primary border-solid bg-primary/12"
        :style="dragSelectionStyle"
      ></div>
    </Teleport>

    <a-empty
      v-if="items.length === 0"
      class="col-span-full py-72"
      description="暂无文件"
    />

    <template v-else-if="viewMode === 'grid'">
      <a-dropdown
        v-for="item in items"
        :key="item.id"
        :trigger="['contextmenu']"
        :menu="getActionMenu(item)"
      >
        <Motion
          as="div"
          layout="position"
          role="button"
          tabindex="-1"
          :initial="{ opacity: 0, y: 6 }"
          :animate="{ opacity: 1, y: 0 }"
          :while-hover="gridItemHover"
          :while-press="itemPress"
          :transition="itemTransition"
          :data-file-manager-item-id="item.id"
          :class="[
            'file-grid__card group relative min-w-0 cursor-pointer rounded-6 border-1 border-solid bg-container-secondary p-10 text-left outline-none transition-[background-color,border-color,box-shadow] duration-180 hover:(border-color-primary bg-selected shadow-all-sm) focus-visible:border-primary',
            isSelected(item)
              ? 'border-color-primary bg-selected text-primary'
              : 'border-color-1 text-main',
          ]"
          @click="handleItemClick(item, $event)"
          @dblclick="handleDoubleClick(item)"
          @keydown.enter.prevent="handleItemClick(item, $event)"
          @keydown.space.prevent="handleItemClick(item, $event)"
          @contextmenu.stop
        >
          <div class="absolute left-8 top-8 z-1">
            <a-checkbox
              v-if="isFile(item)"
              :checked="isSelected(item)"
              @click.stop
              @change="handleCheckboxChange(item, $event.target.checked)"
            />
          </div>
          <div class="absolute right-8 top-8 z-1 flex items-center gap-4">
            <Icon
              v-if="item.favorite"
              name="i-lucide:star"
              class="text-warning"
            />
            <Icon
              v-if="item.encrypted"
              name="i-lucide:lock-keyhole"
              class="text-warning"
            />
            <a-dropdown :trigger="['click']" :menu="getActionMenu(item)">
              <span
                data-file-manager-action
                class="size-26 translate-y-1 flex-center rounded-4 text-secondary opacity-0 transition-[background-color,color,opacity,transform] group-hover:translate-y-0 group-hover:opacity-100 hover:(bg-hover text-primary) focus:translate-y-0 focus:opacity-100"
                @click.stop
                @contextmenu.stop
              >
                <Icon name="i-lucide:more-horizontal" :size="16" />
              </span>
            </a-dropdown>
          </div>
          <div class="mt-18 flex flex-col items-center text-center">
            <span :class="getPreviewClass(item, 'grid')">
              <img
                :src="getIcon(item)"
                :alt="item.fileName"
                :class="getImageClass(item, 'grid')"
              />
            </span>
            <span class="mt-10 w-full truncate text-sm text-main">
              {{ getFileNameWithoutExtension(item.fileName) }}
            </span>
            <span class="mt-4 text-xs text-secondary">
              {{ isDirectory(item) ? '文件夹' : formatFileSize(item.fileSize) }}
            </span>
          </div>
        </Motion>
      </a-dropdown>
    </template>

    <template v-else>
      <a-dropdown
        v-for="item in items"
        :key="item.id"
        :trigger="['contextmenu']"
        :menu="getActionMenu(item)"
      >
        <Motion
          as="div"
          layout="position"
          :initial="{ opacity: 0, x: -4 }"
          :animate="{ opacity: 1, x: 0 }"
          :while-hover="listItemHover"
          :while-press="itemPress"
          :transition="itemTransition"
          :data-file-manager-item-id="item.id"
          :class="[
            'group min-w-0 flex cursor-pointer items-center gap-12 rounded-6 border-1 border-solid bg-container-secondary px-12 py-10 transition-colors hover:(border-color-primary bg-selected) max-[575px]:(items-start gap-10)',
            isSelected(item)
              ? 'border-color-primary bg-selected'
              : 'border-color-1',
          ]"
          @click="handleItemClick(item, $event)"
          @dblclick="handleDoubleClick(item)"
          @contextmenu.stop
        >
          <a-checkbox
            v-if="isFile(item)"
            :checked="isSelected(item)"
            @click.stop
            @change="handleCheckboxChange(item, $event.target.checked)"
          />
          <span :class="getPreviewClass(item, 'list')">
            <img
              :src="getIcon(item)"
              :alt="item.fileName"
              :class="getImageClass(item, 'list')"
            />
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-6">
              <span class="min-w-0 truncate text-sm text-main font-medium">
                {{ item.fileName }}
              </span>
              <Icon
                v-if="item.favorite"
                name="i-lucide:star"
                class="shrink-0 text-warning"
              />
              <Icon
                v-if="item.encrypted"
                name="i-lucide:lock-keyhole"
                class="shrink-0 text-warning"
              />
            </div>
            <div
              class="mt-4 flex flex-wrap items-center gap-x-12 gap-y-4 text-xs text-secondary"
            >
              <template v-if="isDirectory(item)">
                <span>文件夹</span>
                <span>双击打开</span>
              </template>
              <template v-else>
                <span>{{ getFileCategoryLabel(item.fileType) }}</span>
                <span>{{ formatFileSize(item.fileSize) }}</span>
                <span>{{ item.creator }}</span>
                <span>{{ item.updateTime }}</span>
              </template>
            </div>
          </div>
          <a-dropdown :trigger="['click']" :menu="getActionMenu(item)">
            <button
              type="button"
              data-file-manager-action
              class="button size-30 rounded-4 text-secondary transition hover:(bg-hover text-primary)"
              @click.stop
              @contextmenu.stop
            >
              <Icon name="i-lucide:more-horizontal" :size="16" />
            </button>
          </a-dropdown>
        </Motion>
      </a-dropdown>
    </template>
  </Scrollbar>
</template>

<style scoped>
.file-grid__preview,
.file-grid__image {
  transition:
    filter 220ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.file-grid__card:hover .file-grid__preview {
  transform: translateY(-2px) scale(1.04);
}

.file-grid__card:hover .file-grid__image {
  filter: saturate(1.06);
}

@media (prefers-reduced-motion: reduce) {
  .file-grid__preview,
  .file-grid__image {
    transition: none;
  }
}
</style>
