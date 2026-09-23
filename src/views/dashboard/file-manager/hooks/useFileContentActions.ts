import type { MenuProps, UploadFile } from 'antdv-next'
import { message } from 'antdv-next'
import { computed, h, shallowRef, type Ref } from 'vue'
import { Icon } from '@/components/icon'
import {
  FILE_NODE_TYPE,
  type FileCategory,
  type FileSelectionKey,
  type FileViewMode,
  type IFile,
} from '../components/types'
import { fileCategoryOptions } from '../components/utils'

interface FileContentActionHandlers {
  batchDelete: () => void
  batchDownload: () => void
  batchRestore: () => void
  changeCategory: (category: FileCategory) => void
  changeDirectory: (id: string) => void
  clearSelection: () => void
  copyLink: (file: IFile) => void
  copySelectedNames: () => void
  delete: (file: IFile) => void
  download: (file: IFile) => void
  rename: (file: IFile) => void
  restore: (file: IFile) => void
  selectAllVisible: () => void
  toggleFavorite: (file: IFile) => void
  updateEncryption: (file: IFile, password?: string) => void
  upload: (file: UploadFile | File) => void
}

interface UseFileContentActionsOptions {
  activeCategory: Ref<FileCategory>
  files: Readonly<Ref<IFile[]>>
  getAccessLockedFile: (file: IFile) => IFile | undefined
  getFileById: (id: string) => IFile | undefined
  getFilePathText: (file: IFile) => string
  handlers: FileContentActionHandlers
  previewFile: Ref<IFile | null>
  selectedKeys: Ref<FileSelectionKey[]>
  treeFiles: Readonly<Ref<IFile[]>>
  viewMode: Ref<FileViewMode>
}

export function useFileContentActions({
  activeCategory,
  files,
  getAccessLockedFile,
  getFileById,
  getFilePathText,
  handlers,
  previewFile,
  selectedKeys,
  treeFiles,
  viewMode,
}: UseFileContentActionsOptions) {
  const detailFile = shallowRef<IFile | null>(null)
  const encryptionFile = shallowRef<IFile | null>(null)
  const encryptionPassword = shallowRef('')
  const unlockFile = shallowRef<IFile | null>(null)
  const unlockPassword = shallowRef('')
  const unlockError = shallowRef('')
  const pendingAccessAction = shallowRef<(() => void) | null>(null)

  const hasSelection = computed(() => selectedKeys.value.length > 0)
  const isRecycleBin = computed(() => activeCategory.value === 'trash')
  const visibleFiles = computed(() =>
    viewMode.value === 'list' ? treeFiles.value : files.value
  )
  const currentVisibleCount = computed(() => visibleFiles.value.length)
  const selectedVisibleFiles = computed(() => {
    const selectedKeySet = new Set(selectedKeys.value)
    return visibleFiles.value.filter(
      (item) => item.type === FILE_NODE_TYPE.FILE && selectedKeySet.has(item.id)
    )
  })
  const hasFileSelection = computed(() => selectedVisibleFiles.value.length > 0)
  const selectedCountText = computed(() =>
    hasSelection.value ? `已选 ${selectedKeys.value.length} 项` : '未选择文件'
  )
  const detailPathText = computed(() =>
    detailFile.value ? getFilePathText(detailFile.value) : ''
  )
  const encryptionTitle = computed(() =>
    encryptionFile.value
      ? `设置「${encryptionFile.value.fileName}」加密`
      : '设置加密'
  )
  const unlockTitle = computed(() =>
    unlockFile.value ? `访问「${unlockFile.value.fileName}」` : '输入密码'
  )

  const batchMenuItems = computed<MenuProps['items']>(() => [
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
    { type: 'divider' },
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
    handlers.upload(file)
    return false
  }

  function handleCategorySelect(value: unknown) {
    if (
      typeof value === 'string' &&
      fileCategoryOptions.some((item) => item.value === value)
    ) {
      handlers.changeCategory(value as FileCategory)
    }
  }

  function handleBatchAction({ key }: { key: string }) {
    switch (key) {
      case 'download':
        requestSelectedAccess(handlers.batchDownload)
        break
      case 'copy':
        handlers.copySelectedNames()
        break
      case 'restore':
        handlers.batchRestore()
        break
      case 'select-all':
        handlers.selectAllVisible()
        break
      case 'clear':
        handlers.clearSelection()
        break
      case 'delete':
        requestSelectedAccess(handlers.batchDelete)
        break
    }
  }

  function requestSelectedAccess(action: () => void) {
    const lockedFile = selectedVisibleFiles.value
      .map((file) => getAccessLockedFile(file))
      .find((file): file is IFile => Boolean(file))

    if (lockedFile) {
      requestAccess(lockedFile, action)
      return
    }
    action()
  }

  function requestAccess(file: IFile, action: () => void) {
    const lockedFile = getAccessLockedFile(file)
    if (!lockedFile) {
      action()
      return
    }

    unlockFile.value = lockedFile
    unlockPassword.value = ''
    unlockError.value = ''
    pendingAccessAction.value = action
  }

  function submitUnlock() {
    const target = unlockFile.value
    if (!target) return

    if (unlockPassword.value !== target.encryptPassword) {
      unlockError.value = '密码错误，请重新输入'
      return
    }

    const action = pendingAccessAction.value
    cancelUnlock()
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
        handlers.updateEncryption(file, undefined)
        return
      }
      encryptionFile.value = file
      encryptionPassword.value = ''
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

    handlers.updateEncryption(target, password)
    cancelEncryption()
  }

  function cancelEncryption() {
    encryptionFile.value = null
    encryptionPassword.value = ''
  }

  function emitWithAccess(file: IFile, action: () => void) {
    requestAccess(file, action)
  }

  function previewFileWithAccess(file: IFile) {
    emitWithAccess(file, () => {
      previewFile.value = file
    })
  }

  function openDirectoryWithAccess(file: IFile) {
    emitWithAccess(file, () => handlers.changeDirectory(file.id))
  }

  function detailFileWithAccess(file: IFile) {
    emitWithAccess(file, () => {
      detailFile.value = file
    })
  }

  function renameFileWithAccess(file: IFile) {
    emitWithAccess(file, () => handlers.rename(file))
  }

  function deleteFileWithAccess(file: IFile) {
    emitWithAccess(file, () => handlers.delete(file))
  }

  function downloadFileWithAccess(file: IFile) {
    emitWithAccess(file, () => handlers.download(file))
  }

  function copyFileLinkWithAccess(file: IFile) {
    emitWithAccess(file, () => handlers.copyLink(file))
  }

  function toggleFavoriteWithAccess(file: IFile) {
    emitWithAccess(file, () => handlers.toggleFavorite(file))
  }

  function changeDirectoryWithAccess(id: string) {
    const directory = getFileById(id)
    if (!directory) {
      handlers.changeDirectory(id)
      return
    }
    openDirectoryWithAccess(directory)
  }

  return {
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
    restoreFile: handlers.restore,
    submitEncryption,
    submitUnlock,
    toggleFavoriteWithAccess,
  }
}
