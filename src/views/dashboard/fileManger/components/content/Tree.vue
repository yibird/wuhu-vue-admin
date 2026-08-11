<script lang="ts" setup>
import type { MenuProps, TreeDataNode } from 'antdv-next'
import { computed, h, shallowRef, watch } from 'vue'
import { Motion } from 'motion-v'
import { Icon } from '@/components'
import {
  FILE_NODE_TYPE,
  ROOT_PARENT_ID,
  type FileSelectionKey,
  type IFile,
} from '../types'
import {
  formatFileSize,
  getFileCategoryByType,
  getFileCategoryLabel,
  getFileExtension,
} from '../utils'
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

interface FileTreeNode extends TreeDataNode {
  children?: FileTreeNode[]
  file: IFile
  isLeaf: boolean
  key: string
  title: string
}

const selectedKeys = defineModel<FileSelectionKey[]>('selectedKeys', {
  required: true,
})

const props = defineProps<{
  items: IFile[]
  recycleBin?: boolean
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

const rowHover = { x: 2 }
const rowPress = { scale: 0.995 }
const rowTransition = {
  type: 'spring' as const,
  stiffness: 440,
  damping: 34,
  mass: 0.6,
}

const expandedKeys = shallowRef<FileSelectionKey[]>([])

const treeData = computed<FileTreeNode[]>(() => {
  const nodeMap = new Map<string, FileTreeNode>()

  for (const file of props.items) {
    nodeMap.set(file.id, {
      key: file.id,
      title: file.fileName,
      file,
      isLeaf: isFile(file),
      children: [],
    })
  }

  const roots: FileTreeNode[] = []
  for (const node of nodeMap.values()) {
    const parent = nodeMap.get(node.file.parentId)
    if (parent) {
      parent.children?.push(node)
      continue
    }

    if (node.file.parentId === ROOT_PARENT_ID || props.recycleBin) {
      roots.push(node)
    }
  }

  sortNodes(roots)
  return pruneEmptyChildren(roots)
})

watch(
  () => props.items.map((item) => item.id).join('|'),
  () => {
    expandedKeys.value = props.items
      .filter((item) => isDirectory(item))
      .map((item) => item.id)
    const visibleKeys = new Set(props.items.map((item) => item.id))
    selectedKeys.value = selectedKeys.value.filter((key) =>
      visibleKeys.has(key)
    )
  },
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

function sortNodes(nodes: FileTreeNode[]) {
  nodes.sort((a, b) => {
    if (a.file.type !== b.file.type) return a.file.type - b.file.type
    return a.file.fileName.localeCompare(b.file.fileName, 'zh-CN')
  })

  for (const node of nodes) {
    if (node.children?.length) sortNodes(node.children)
  }
}

function pruneEmptyChildren(nodes: FileTreeNode[]): FileTreeNode[] {
  return nodes.map((node) => {
    if (!node.children?.length) {
      return { ...node, children: undefined }
    }
    return { ...node, children: pruneEmptyChildren(node.children) }
  })
}

function handleDoubleClick(file: IFile) {
  if (isDirectory(file)) {
    emit('openDirectory', file)
    return
  }
  emit('preview', file)
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
  <div class="file-tree h-full min-h-0 overflow-hidden">
    <a-empty
      v-if="treeData.length === 0"
      class="py-72"
      description="暂无文件"
    />
    <div v-else class="h-full min-h-0 flex flex-col overflow-hidden">
      <div
        class="grid grid-cols-[minmax(260px,1fr)_104px_104px_116px_168px_44px] items-center gap-12 border-b-1 border-b-solid border-color-1 px-12 pb-8 text-xs text-secondary max-[900px]:hidden"
      >
        <span>名称</span>
        <span>类型</span>
        <span>大小</span>
        <span>更新人</span>
        <span>更新时间</span>
        <span></span>
      </div>
      <div class="min-h-0 flex-1 overflow-auto py-6">
        <a-tree
          v-model:expanded-keys="expandedKeys"
          v-model:selected-keys="selectedKeys"
          block-node
          multiple
          show-line
          :tree-data="treeData"
          :virtual="false"
        >
          <template #titleRender="{ file }">
            <a-dropdown :trigger="['contextmenu']" :menu="getActionMenu(file)">
              <Motion
                as="div"
                class="file-tree__row group border-1 border-transparent border-solid text-secondary hover:(border-color-2 bg-hover)"
                :data-file-manager-item-id="file.id"
                :while-hover="rowHover"
                :while-press="rowPress"
                :transition="rowTransition"
                @dblclick.stop="handleDoubleClick(file)"
                @contextmenu.stop
              >
                <div class="file-tree__name">
                  <img
                    :src="getIcon(file)"
                    :alt="file.fileName"
                    :class="[
                      'file-tree__icon size-28 shrink-0 object-cover',
                      isDirectory(file) ? '' : 'rounded-4',
                    ]"
                  />
                  <span class="min-w-0 truncate text-sm text-main">
                    {{ file.fileName }}
                  </span>
                  <Icon
                    v-if="file.favorite"
                    name="i-lucide:star"
                    class="shrink-0 text-warning"
                  />
                  <Icon
                    v-if="file.encrypted"
                    name="i-lucide:lock-keyhole"
                    class="shrink-0 text-warning"
                  />
                </div>
                <span class="file-tree__meta">
                  {{
                    isDirectory(file)
                      ? '文件夹'
                      : getFileCategoryLabel(file.fileType)
                  }}
                </span>
                <span class="file-tree__meta">
                  {{ isDirectory(file) ? '-' : formatFileSize(file.fileSize) }}
                </span>
                <span class="file-tree__meta">{{ file.updater || '-' }}</span>
                <span class="file-tree__meta">{{
                  file.updateTime || '-'
                }}</span>
                <a-dropdown :trigger="['click']" :menu="getActionMenu(file)">
                  <button
                    type="button"
                    data-file-manager-action
                    class="button size-30 translate-x-1 rounded-4 text-secondary opacity-0 transition-[background-color,color,opacity,transform] group-hover:translate-x-0 group-hover:opacity-100 hover:(bg-hover text-primary) focus:translate-x-0 focus:opacity-100"
                    @click.stop
                    @dblclick.stop
                    @contextmenu.stop
                  >
                    <Icon name="i-lucide:more-horizontal" :size="16" />
                  </button>
                </a-dropdown>
              </Motion>
            </a-dropdown>
          </template>
        </a-tree>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-tree :deep(.ant-tree-treenode) {
  width: 100%;
  padding: 2px 0;
}

.file-tree :deep(.ant-tree-node-content-wrapper) {
  flex: 1;
  min-width: 0;
  padding: 0;
  border-radius: 6px;
}

.file-tree :deep(.ant-tree-title) {
  display: block;
  min-width: 0;
}

.file-tree__row {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 104px 104px 116px 168px 44px;
  gap: 12px;
  align-items: center;
  min-width: 0;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 6px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.file-tree__name {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.file-tree__meta {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  white-space: nowrap;
}

.file-tree__icon {
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

.file-tree__row:hover .file-tree__icon {
  transform: scale(1.06);
}

.file-tree :deep(.ant-tree-switcher) {
  transition:
    color 160ms ease,
    background-color 160ms ease;
}

.file-tree :deep(.ant-tree-switcher:hover) {
  color: rgb(var(--w-color-primary));
  background-color: rgb(var(--w-bg-hover));
}

@media (prefers-reduced-motion: reduce) {
  .file-tree__row,
  .file-tree__icon,
  .file-tree :deep(.ant-tree-switcher) {
    transition: none;
  }
}

@media (width <= 900px) {
  .file-tree__row {
    grid-template-columns: minmax(0, 1fr) 32px;
    gap: 8px;
  }

  .file-tree__meta {
    display: none;
  }
}
</style>
