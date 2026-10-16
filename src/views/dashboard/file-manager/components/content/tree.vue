<script lang="ts" setup>
import { Icon } from '@/components/icon'
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
import type { MenuProps } from 'antdv-next'

interface FileTreeNode {
  children: FileTreeNode[]
  file: IFile
  key: string
}

interface FileTreeRow {
  depth: number
  file: IFile
  hasChildren: boolean
  key: string
  parentKey?: string
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

const expandedKeys = shallowRef<FileSelectionKey[]>([])
const selectionAnchorKey = shallowRef<FileSelectionKey>()
const failedImageKeys = shallowRef(new Set<string>())
const treeRef = useTemplateRef<HTMLElement>('tree')
const expandedKeySet = computed(() => new Set(expandedKeys.value))
const selectedKeySet = computed(() => new Set(selectedKeys.value))

const treeData = computed<FileTreeNode[]>(() => {
  const nodeMap = new Map<string, FileTreeNode>()

  for (const file of props.items) {
    nodeMap.set(file.id, {
      key: file.id,
      file,
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
  return roots
})

const visibleRows = computed<FileTreeRow[]>(() => {
  const rows: FileTreeRow[] = []

  function appendRows(nodes: FileTreeNode[], depth: number) {
    for (const node of nodes) {
      const hasChildren = node.children.length > 0
      rows.push({
        depth,
        file: node.file,
        hasChildren,
        key: node.key,
        parentKey: depth > 0 ? node.file.parentId : undefined,
      })
      if (hasChildren && expandedKeySet.value.has(node.key)) {
        appendRows(node.children, depth + 1)
      }
    }
  }

  appendRows(treeData.value, 0)
  return rows
})

watch(
  () => props.items.map((item) => item.id).join('|'),
  () => {
    const visibleKeys = new Set(props.items.map((item) => item.id))
    expandedKeys.value = expandedKeys.value.filter((key) =>
      visibleKeys.has(key)
    )
    failedImageKeys.value = new Set(
      [...failedImageKeys.value].filter((key) => visibleKeys.has(key))
    )
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
  if (
    getFileCategoryByType(file.fileType) === 'image' &&
    file.fileUrl &&
    !failedImageKeys.value.has(file.id)
  ) {
    return file.fileUrl
  }
  return icons[getFileExtension(file.fileName)] ?? unknownIcon
}

function handleIconError(file: IFile) {
  if (failedImageKeys.value.has(file.id)) return
  failedImageKeys.value = new Set(failedImageKeys.value).add(file.id)
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

function toggleExpanded(key: FileSelectionKey) {
  const nextKeys = new Set(expandedKeys.value)
  if (nextKeys.has(key)) {
    nextKeys.delete(key)
  } else {
    nextKeys.add(key)
  }
  expandedKeys.value = [...nextKeys]
}

function getRowElement(key: FileSelectionKey) {
  return [
    ...(treeRef.value?.querySelectorAll<HTMLElement>(
      '[data-file-manager-item-id]'
    ) ?? []),
  ].find((element) => element.dataset.fileManagerItemId === key)
}

function focusRow(key?: FileSelectionKey) {
  if (!key) return
  nextTick(() => getRowElement(key)?.focus())
}

function moveFocus(row: FileTreeRow, offset: number) {
  const index = visibleRows.value.findIndex((item) => item.key === row.key)
  const target = visibleRows.value[index + offset]
  focusRow(target?.key)
}

function handleContextMenu(file: IFile) {
  if (selectedKeySet.value.has(file.id)) return
  selectionAnchorKey.value = file.id
  selectedKeys.value = [file.id]
}

function handleRowClick(file: IFile, event: MouseEvent | KeyboardEvent) {
  if (event.shiftKey) {
    const anchorKey = selectionAnchorKey.value ?? file.id
    const anchorIndex = visibleRows.value.findIndex(
      (row) => row.key === anchorKey
    )
    const targetIndex = visibleRows.value.findIndex(
      (row) => row.key === file.id
    )
    if (anchorIndex >= 0 && targetIndex >= 0) {
      const start = Math.min(anchorIndex, targetIndex)
      const end = Math.max(anchorIndex, targetIndex)
      selectedKeys.value = visibleRows.value
        .slice(start, end + 1)
        .map((row) => row.key)
      return
    }
  }

  selectionAnchorKey.value = file.id
  if (event.ctrlKey || event.metaKey) {
    const nextKeys = new Set(selectedKeys.value)
    if (nextKeys.has(file.id)) {
      nextKeys.delete(file.id)
    } else {
      nextKeys.add(file.id)
    }
    selectedKeys.value = [...nextKeys]
    return
  }

  selectedKeys.value = [file.id]
}

function handleRowKeydown(row: FileTreeRow, event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveFocus(row, 1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveFocus(row, -1)
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    focusRow(visibleRows.value[0]?.key)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    focusRow(visibleRows.value.at(-1)?.key)
    return
  }

  if (event.key === 'ArrowRight' && row.hasChildren) {
    event.preventDefault()
    if (!expandedKeySet.value.has(row.key)) {
      toggleExpanded(row.key)
    } else {
      focusRow(
        visibleRows.value.find((item) => item.parentKey === row.key)?.key
      )
    }
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (row.hasChildren && expandedKeySet.value.has(row.key)) {
      toggleExpanded(row.key)
    } else {
      focusRow(row.parentKey)
    }
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    handleDoubleClick(row.file)
    return
  }

  if (event.key === ' ') {
    event.preventDefault()
    handleRowClick(row.file, event)
  }
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
  return actionMenuMap.value.get(file.id)
}

const actionMenuMap = computed(() => {
  return new Map(
    props.items.map((file) => [
      file.id,
      {
        items: getActionItems(file),
        onClick: (event: { key: string }) => handleAction(file, event),
      },
    ])
  )
})

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
  <div ref="tree" class="h-full min-h-0 w-full overflow-hidden">
    <a-empty
      v-if="treeData.length === 0"
      class="py-72"
      description="暂无文件"
    />
    <div v-else class="h-full min-h-0 flex flex-col overflow-hidden">
      <div
        class="list-group min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4"
        role="tree"
        aria-label="文件列表"
        aria-multiselectable="true"
      >
        <div
          class="sticky top-0 z-2 h-36 min-w-0 flex items-center gap-12 border-b-1 border-color-1 border-b-solid bg-container px-8 text-xs text-secondary font-500 select-none"
          role="presentation"
        >
          <span class="min-w-0 flex-1 truncate">名称</span>
          <span class="hidden w-96 shrink-0 md:block">类型</span>
          <span class="hidden w-96 shrink-0 sm:block">大小</span>
          <span class="hidden w-104 shrink-0 lg:block">更新人</span>
          <span class="hidden w-156 shrink-0 sm:block">更新时间</span>
          <span class="w-36 shrink-0"></span>
        </div>
        <TransitionGroup
          name="list"
          tag="div"
          class="flex flex-col gap-4 py-6"
          role="group"
        >
          <div v-for="row in visibleRows" :key="row.key" class="w-full">
            <a-dropdown
              :trigger="['contextmenu']"
              :menu="getActionMenu(row.file)"
            >
              <div
                :class="[
                  'group h-52 min-w-0 flex cursor-pointer items-center gap-12 rounded-4 px-8 text-secondary outline-none transition-[background-color,transform] duration-motion-moderate ease-motion-spring hover:bg-hover-2 focus-visible:bg-primary-tint active:scale-99 motion-reduce:(transform-none transition-none)',
                  selectedKeySet.has(row.key)
                    ? 'bg-primary-tint hover:bg-primary-tint-hover'
                    : '',
                ]"
                :data-file-manager-item-id="row.key"
                :aria-expanded="
                  row.hasChildren ? expandedKeySet.has(row.key) : undefined
                "
                :aria-selected="selectedKeySet.has(row.key)"
                role="treeitem"
                tabindex="0"
                @click="handleRowClick(row.file, $event)"
                @dblclick.stop="handleDoubleClick(row.file)"
                @keydown.self="handleRowKeydown(row, $event)"
                @contextmenu.prevent="handleContextMenu(row.file)"
              >
                <div class="min-w-0 flex flex-1 items-center gap-8">
                  <span
                    v-for="level in row.depth"
                    :key="level"
                    class="w-16 shrink-0"
                    aria-hidden="true"
                  ></span>
                  <button
                    v-if="row.hasChildren"
                    type="button"
                    class="button size-26 shrink-0 rounded-4 text-muted transition-[background-color,color,transform] duration-motion-base ease-motion-standard hover:(bg-hover text-primary) focus-visible:(bg-primary-tint text-primary shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_16%)]) motion-reduce:transition-none"
                    :class="{
                      'rotate-90 text-primary': expandedKeySet.has(row.key),
                    }"
                    :aria-label="
                      expandedKeySet.has(row.key)
                        ? `收起${row.file.fileName}`
                        : `展开${row.file.fileName}`
                    "
                    :aria-expanded="expandedKeySet.has(row.key)"
                    @click.stop="toggleExpanded(row.key)"
                    @dblclick.stop
                    @contextmenu.stop
                  >
                    <Icon name="i-lucide:chevron-right" :size="15" />
                  </button>
                  <span
                    v-else
                    class="size-26 shrink-0"
                    aria-hidden="true"
                  ></span>
                  <img
                    :src="getIcon(row.file)"
                    :alt="row.file.fileName"
                    class="size-32 shrink-0 rounded-4 object-cover transition-[filter,transform] duration-motion-base ease-motion-enter group-hover:(scale-104 saturate-110) motion-reduce:transition-none"
                    @error="handleIconError(row.file)"
                  />
                  <span
                    class="min-w-0 truncate text-sm text-main font-500 transition-colors duration-motion-base group-hover:text-main"
                  >
                    {{ row.file.fileName }}
                  </span>
                  <Icon
                    v-if="row.file.favorite"
                    name="i-lucide:star"
                    class="shrink-0 text-warning"
                  />
                  <Icon
                    v-if="row.file.encrypted"
                    name="i-lucide:lock-keyhole"
                    class="shrink-0 text-warning"
                  />
                </div>
                <span
                  class="hidden w-96 shrink-0 truncate whitespace-nowrap text-xs tabular-nums md:block"
                >
                  {{
                    isDirectory(row.file)
                      ? '文件夹'
                      : getFileCategoryLabel(row.file.fileType)
                  }}
                </span>
                <span
                  class="hidden w-96 shrink-0 truncate whitespace-nowrap text-xs tabular-nums sm:block"
                >
                  {{
                    isDirectory(row.file)
                      ? '-'
                      : formatFileSize(row.file.fileSize)
                  }}
                </span>
                <span
                  class="hidden w-104 shrink-0 truncate whitespace-nowrap text-xs lg:block"
                >
                  {{ row.file.updater || '-' }}
                </span>
                <span
                  class="hidden w-156 shrink-0 truncate whitespace-nowrap text-xs tabular-nums sm:block"
                >
                  {{ row.file.updateTime || '-' }}
                </span>
                <div class="w-36 shrink-0 flex justify-center">
                  <a-dropdown
                    :trigger="['click']"
                    :menu="getActionMenu(row.file)"
                  >
                    <button
                      type="button"
                      data-file-manager-action
                      class="button size-30 translate-x-4 rounded-4 text-secondary opacity-0 transition-[background-color,color,opacity,transform] duration-motion-base ease-motion-standard group-focus-within:(translate-x-0 opacity-100) group-hover:(translate-x-0 opacity-100) hover:(bg-fill-tertiary text-primary) focus-visible:(translate-x-0 bg-fill-tertiary text-primary opacity-100) motion-reduce:transition-none"
                      aria-label="更多操作"
                      @click.stop
                      @dblclick.stop
                      @contextmenu.stop
                    >
                      <Icon name="i-lucide:more-horizontal" :size="16" />
                    </button>
                  </a-dropdown>
                </div>
              </div>
            </a-dropdown>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>
