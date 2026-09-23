import dayjs from 'dayjs'
import { computed, shallowRef } from 'vue'
import { initialFiles } from '../dataSource'
import {
  FILE_NODE_TYPE,
  ROOT_PARENT_ID,
  type FileCategory,
  type FileCategoryStats,
  type FileSelectionKey,
  type FileSortBy,
  type FileViewMode,
  type IFile,
} from '../components/types'
import { getFileCategoryByType, getFileExtension } from '../components/utils'

const STORAGE_TOTAL_SIZE = 256 * 1024 * 1024

export function useFileExplorer() {
  const files = shallowRef<IFile[]>(initialFiles.map((item) => ({ ...item })))
  const activeCategory = shallowRef<FileCategory>('all')
  const currentDirectoryId = shallowRef(ROOT_PARENT_ID)
  const keyword = shallowRef('')
  const sortBy = shallowRef<FileSortBy>('updateTime')
  const viewMode = shallowRef<FileViewMode>('grid')
  const selectedKeys = shallowRef<FileSelectionKey[]>([])
  const previewFile = shallowRef<IFile | null>(null)
  const renameFile = shallowRef<IFile | null>(null)
  const renameValue = shallowRef('')

  const directoryMap = computed(() => {
    return new Map(
      files.value
        .filter((item) => isDirectory(item))
        .map((item) => [item.id, item])
    )
  })

  const currentBreadcrumb = computed(() => {
    const current = directoryMap.value.get(currentDirectoryId.value)
    if (!current) return []

    return current.rootLevel
      .split('-')
      .map((id) => directoryMap.value.get(id))
      .filter((item): item is IFile => Boolean(item))
      .map((item) => ({ id: item.id, fileName: item.fileName }))
  })

  const filteredFiles = computed(() => {
    const query = keyword.value.trim().toLowerCase()
    const isTrash = activeCategory.value === 'trash'
    const visibleFiles = files.value.filter((item) => {
      if (isTrash) {
        if (!isDeleted(item)) return false
      } else {
        if (isDeleted(item) || item.parentId !== currentDirectoryId.value) {
          return false
        }
      }

      const category = getFileCategoryByType(item.fileType)
      const matchCategory =
        activeCategory.value === 'all' ||
        activeCategory.value === 'trash' ||
        (isFile(item) && category === activeCategory.value)
      const matchKeyword = matchFileKeyword(item, query)

      return matchCategory && matchKeyword
    })

    return sortFileItems(visibleFiles, !isTrash)
  })

  const treeFiles = computed(() => {
    const query = keyword.value.trim().toLowerCase()
    const isTrash = activeCategory.value === 'trash'

    if (isTrash) {
      return sortFileItems(
        files.value.filter((item) => isDeleted(item)),
        false
      )
    }

    if (activeCategory.value === 'all' && !query) {
      return sortFileItems(
        files.value.filter((item) => !isDeleted(item)),
        true
      )
    }

    const visibleIds = new Set<string>()
    for (const item of files.value) {
      if (isDeleted(item)) continue

      if (matchFileCategory(item) && matchFileKeyword(item, query)) {
        visibleIds.add(item.id)
        addAncestorIds(item, visibleIds)
        if (isDirectory(item) && activeCategory.value === 'all') {
          addDescendantIds(item, visibleIds)
        }
      }
    }

    return sortFileItems(
      files.value.filter((item) => visibleIds.has(item.id)),
      true
    )
  })

  const selectedFiles = computed(() => {
    const selectedKeySet = new Set(selectedKeys.value)
    return files.value.filter(
      (item) => selectedKeySet.has(item.id) && isFile(item)
    )
  })

  const categoryStats = computed<FileCategoryStats>(() => {
    const stats = createEmptyStats()
    for (const item of files.value) {
      if (!isFile(item)) continue

      const size = item.fileSize ?? 0
      if (isDeleted(item)) {
        stats.trash.count += 1
        stats.trash.size += size
        continue
      }

      const category = getFileCategoryByType(item.fileType)
      stats.all.count += 1
      stats.all.size += size
      stats[category].count += 1
      stats[category].size += size
    }
    return stats
  })

  const storageUsedSize = computed(() => categoryStats.value.all.size)
  const visibleTotalCount = computed(() =>
    activeCategory.value === 'trash'
      ? categoryStats.value.trash.count
      : categoryStats.value.all.count
  )

  function isDirectory(file: IFile) {
    return file.type === FILE_NODE_TYPE.DIRECTORY
  }

  function isFile(file: IFile) {
    return file.type === FILE_NODE_TYPE.FILE
  }

  function isDeleted(file: IFile) {
    return Boolean(file.deleted || file.deletedTime)
  }

  function matchFileCategory(file: IFile) {
    return (
      activeCategory.value === 'all' ||
      (isFile(file) &&
        getFileCategoryByType(file.fileType) === activeCategory.value)
    )
  }

  function matchFileKeyword(file: IFile, query: string) {
    return (
      !query ||
      file.fileName.toLowerCase().includes(query) ||
      file.creator.toLowerCase().includes(query) ||
      file.updater.toLowerCase().includes(query) ||
      getFileExtension(file.fileName).includes(query)
    )
  }

  function addAncestorIds(file: IFile, target: Set<string>) {
    if (file.parentLevel === ROOT_PARENT_ID) return
    for (const id of file.parentLevel.split('-')) {
      target.add(id)
    }
  }

  function addDescendantIds(file: IFile, target: Set<string>) {
    const prefix = `${file.rootLevel}-`
    for (const item of files.value) {
      if (!isDeleted(item) && item.rootLevel.startsWith(prefix)) {
        target.add(item.id)
      }
    }
  }

  function sortFileItems(items: IFile[], directoriesFirst: boolean) {
    return [...items].sort((a, b) => {
      if (directoriesFirst && a.type !== b.type) return a.type - b.type

      switch (sortBy.value) {
        case 'name':
          return a.fileName.localeCompare(b.fileName, 'zh-CN')
        case 'size':
          return (b.fileSize ?? 0) - (a.fileSize ?? 0)
        case 'type':
          return a.fileType - b.fileType
        case 'updateTime':
        default:
          return dayjs(b.updateTime).valueOf() - dayjs(a.updateTime).valueOf()
      }
    })
  }

  function buildFileLocation(parentId: string, id: string) {
    const parent = directoryMap.value.get(parentId)
    if (!parent) {
      return {
        rootId: ROOT_PARENT_ID,
        parentId: ROOT_PARENT_ID,
        rootLevel: id,
        parentLevel: ROOT_PARENT_ID,
      }
    }

    return {
      rootId: parent.rootId === ROOT_PARENT_ID ? parent.id : parent.rootId,
      parentId: parent.id,
      rootLevel: `${parent.rootLevel}-${id}`,
      parentLevel: parent.rootLevel,
    }
  }

  function getCascadeKeys(keys: FileSelectionKey[]) {
    const keySet = new Set(keys)
    const directories = files.value.filter(
      (item) => keySet.has(item.id) && isDirectory(item)
    )

    for (const directory of directories) {
      const prefix = `${directory.rootLevel}-`
      for (const item of files.value) {
        if (item.rootLevel.startsWith(prefix)) keySet.add(item.id)
      }
    }

    return [...keySet]
  }

  function syncSelectedKeys() {
    const fileKeys = new Set(files.value.map((item) => item.id))
    selectedKeys.value = selectedKeys.value.filter((key) => fileKeys.has(key))
  }

  function selectAllVisible() {
    const visibleFiles =
      viewMode.value === 'list' ? treeFiles.value : filteredFiles.value
    selectedKeys.value = visibleFiles
      .filter((item) => isFile(item))
      .map((item) => item.id)
  }

  function clearSelection() {
    selectedKeys.value = []
  }

  function changeCategory(category: FileCategory) {
    activeCategory.value = category
    if (category === 'trash') {
      currentDirectoryId.value = ROOT_PARENT_ID
    }
    selectedKeys.value = []
  }

  function changeDirectory(id: string) {
    currentDirectoryId.value = id
    selectedKeys.value = []
  }

  function resetFileView() {
    activeCategory.value = 'all'
    currentDirectoryId.value = ROOT_PARENT_ID
    keyword.value = ''
    selectedKeys.value = []
  }

  function getFilePathText(file: IFile) {
    if (file.parentId === ROOT_PARENT_ID) return '根目录'

    const directories = file.parentLevel
      .split('-')
      .map((id) => directoryMap.value.get(id)?.fileName)
      .filter((item): item is string => Boolean(item))

    return directories.length ? directories.join(' / ') : file.parentLevel
  }

  function getFileById(id: string) {
    return files.value.find((item) => item.id === id)
  }

  function getAccessLockedFile(file: IFile) {
    if (file.encrypted) return file
    if (file.parentLevel === ROOT_PARENT_ID) return undefined

    return file.parentLevel
      .split('-')
      .reverse()
      .map((id) => directoryMap.value.get(id))
      .find((item): item is IFile => Boolean(item?.encrypted))
  }

  return {
    activeCategory,
    categoryStats,
    currentBreadcrumb,
    currentDirectoryId,
    files,
    filteredFiles,
    keyword,
    previewFile,
    renameFile,
    renameValue,
    selectedFiles,
    selectedKeys,
    sortBy,
    storageTotalSize: STORAGE_TOTAL_SIZE,
    storageUsedSize,
    treeFiles,
    viewMode,
    visibleTotalCount,
    buildFileLocation,
    changeCategory,
    changeDirectory,
    clearSelection,
    getAccessLockedFile,
    getCascadeKeys,
    getFileById,
    getFilePathText,
    isDeleted,
    isDirectory,
    isFile,
    resetFileView,
    selectAllVisible,
    syncSelectedKeys,
  }
}

export type FileExplorer = ReturnType<typeof useFileExplorer>

function createEmptyStats(): FileCategoryStats {
  return {
    all: { count: 0, size: 0 },
    image: { count: 0, size: 0 },
    document: { count: 0, size: 0 },
    video: { count: 0, size: 0 },
    audio: { count: 0, size: 0 },
    archive: { count: 0, size: 0 },
    code: { count: 0, size: 0 },
    trash: { count: 0, size: 0 },
    other: { count: 0, size: 0 },
  }
}
