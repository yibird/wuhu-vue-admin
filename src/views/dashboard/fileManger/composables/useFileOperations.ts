import type { UploadFile } from 'antdv-next'
import { Modal, message } from 'antdv-next'
import dayjs from 'dayjs'
import { onBeforeUnmount } from 'vue'
import { useClipboard } from '@vueuse/core'
import {
  FILE_NODE_TYPE,
  FILE_TYPE,
  type FileSelectionKey,
  type IFile,
} from '../components/types'
import {
  getFileExtension,
  getFileTypeByName,
  getUniqueFilename,
} from '../components/utils'
import type { FileExplorer } from './useFileExplorer'

export function useFileOperations(explorer: FileExplorer) {
  const createdObjectUrls = new Set<string>()
  const { copy, isSupported: isClipboardSupported } = useClipboard({
    legacy: true,
  })

  function createFileId() {
    return `${Date.now()}${Math.random().toString(36).slice(2, 8)}`
  }

  function handleUpload(file: UploadFile | File) {
    const rawFile = file as File
    const id = createFileId()
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const fileName = getUniqueFilename(
      rawFile.name || '未命名文件',
      explorer.files.value
        .filter(
          (item) =>
            !explorer.isDeleted(item) &&
            item.parentId === explorer.currentDirectoryId.value &&
            explorer.isFile(item)
        )
        .map((item) => item.fileName)
    )
    const fileRawType = rawFile.type || getFileExtension(fileName) || 'unknown'
    const fileUrl = URL.createObjectURL(rawFile)
    createdObjectUrls.add(fileUrl)

    const fileItem: IFile = {
      id,
      ...explorer.buildFileLocation(explorer.currentDirectoryId.value, id),
      type: FILE_NODE_TYPE.FILE,
      fileName,
      fileType: getFileTypeByName(fileName, fileRawType),
      fileRawType,
      fileExtension: getFileExtension(fileName),
      mimeType: rawFile.type || undefined,
      fileSize: rawFile.size ?? 0,
      fileUrl,
      createTime: now,
      creator: '我',
      updateTime: now,
      updater: '我',
      source: 'local',
    }

    explorer.files.value = [fileItem, ...explorer.files.value]
    explorer.activeCategory.value = 'all'
    explorer.selectedKeys.value = [fileItem.id]
    message.success(`已添加 ${fileName}`)
    return false
  }

  function openRenameModal(file: IFile) {
    explorer.renameFile.value = file
    explorer.renameValue.value = file.fileName
  }

  function submitRename() {
    const target = explorer.renameFile.value
    const nextName = explorer.renameValue.value.trim()
    if (!target || !nextName) {
      message.warning('请输入文件名称')
      return
    }

    const nextFileName = getUniqueFilename(
      nextName,
      explorer.files.value
        .filter(
          (item) =>
            item.id !== target.id &&
            !explorer.isDeleted(item) &&
            item.parentId === target.parentId
        )
        .map((item) => item.fileName)
    )
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const nextRawType =
      target.mimeType || target.fileRawType || getFileExtension(nextFileName)

    explorer.files.value = explorer.files.value.map((item) =>
      item.id === target.id
        ? {
            ...item,
            fileName: nextFileName,
            fileType: explorer.isFile(item)
              ? getFileTypeByName(nextFileName, nextRawType)
              : FILE_TYPE.OTHER,
            fileExtension: explorer.isFile(item)
              ? getFileExtension(nextFileName)
              : item.fileExtension,
            fileRawType: nextRawType || 'unknown',
            updateTime: now,
            updater: '我',
          }
        : item
    )
    explorer.renameFile.value = null
    explorer.renameValue.value = ''
    message.success('文件已重命名')
  }

  function confirmDelete(file: IFile) {
    if (explorer.activeCategory.value === 'trash') {
      confirmPermanentDelete(file)
      return
    }

    Modal.confirm({
      title: '移入回收站',
      content: `确定将「${file.fileName}」移入回收站吗？`,
      okText: '移入回收站',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => deleteFiles([file.id]),
    })
  }

  function confirmBatchDelete() {
    const fileKeys = explorer.selectedFiles.value.map((item) => item.id)
    if (!fileKeys.length) return
    if (explorer.activeCategory.value === 'trash') {
      confirmBatchPermanentDelete()
      return
    }

    Modal.confirm({
      title: '批量移入回收站',
      content: `确定将选中的 ${fileKeys.length} 个文件移入回收站吗？`,
      okText: '移入回收站',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => deleteFiles(fileKeys),
    })
  }

  function deleteFiles(keys: FileSelectionKey[]) {
    const keySet = new Set(explorer.getCascadeKeys(keys))
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const deletedFiles = explorer.files.value.filter(
      (item) => keySet.has(item.id) && !explorer.isDeleted(item)
    )

    explorer.files.value = explorer.files.value.map((item) =>
      keySet.has(item.id)
        ? {
            ...item,
            deleted: true,
            deletedTime: now,
            deleteUser: '我',
            favorite: false,
            updateTime: now,
            updater: '我',
          }
        : item
    )
    explorer.syncSelectedKeys()
    explorer.selectedKeys.value = []
    message.success(
      deletedFiles.length > 1 ? '已移入回收站' : '文件已移入回收站'
    )
  }

  function confirmPermanentDelete(file: IFile) {
    Modal.confirm({
      title: '彻底删除',
      content: `确定彻底删除「${file.fileName}」吗？该操作不可恢复。`,
      okText: '彻底删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => permanentDeleteFiles([file.id]),
    })
  }

  function confirmBatchPermanentDelete() {
    const fileKeys = explorer.selectedFiles.value.map((item) => item.id)
    if (!fileKeys.length) return

    Modal.confirm({
      title: '批量彻底删除',
      content: `确定彻底删除选中的 ${fileKeys.length} 个文件吗？该操作不可恢复。`,
      okText: '彻底删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => permanentDeleteFiles(fileKeys),
    })
  }

  function permanentDeleteFiles(keys: FileSelectionKey[]) {
    const keySet = new Set(explorer.getCascadeKeys(keys))
    const deletedFiles = explorer.files.value.filter((item) =>
      keySet.has(item.id)
    )

    for (const item of deletedFiles) {
      if (item.fileUrl && createdObjectUrls.has(item.fileUrl)) {
        URL.revokeObjectURL(item.fileUrl)
        createdObjectUrls.delete(item.fileUrl)
      }
    }

    explorer.files.value = explorer.files.value.filter(
      (item) => !keySet.has(item.id)
    )
    explorer.syncSelectedKeys()
    message.success(
      deletedFiles.length > 1 ? '已彻底删除选中文件' : '文件已彻底删除'
    )
  }

  function restoreFiles(keys: FileSelectionKey[]) {
    const keySet = new Set(explorer.getCascadeKeys(keys))
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const restoredFiles = explorer.files.value.filter(
      (item) => keySet.has(item.id) && explorer.isDeleted(item)
    )

    explorer.files.value = explorer.files.value.map((item) =>
      keySet.has(item.id)
        ? {
            ...item,
            deleted: false,
            deletedTime: undefined,
            deleteUser: undefined,
            updateTime: now,
            updater: '我',
          }
        : item
    )
    explorer.syncSelectedKeys()
    explorer.selectedKeys.value = []
    message.success(restoredFiles.length > 1 ? '已恢复选中文件' : '文件已恢复')
  }

  function restoreFile(file: IFile) {
    restoreFiles([file.id])
  }

  function restoreSelectedFiles() {
    restoreFiles(explorer.selectedFiles.value.map((item) => item.id))
  }

  function toggleFavorite(file: IFile) {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    explorer.files.value = explorer.files.value.map((item) =>
      item.id === file.id
        ? {
            ...item,
            favorite: !item.favorite,
            updateTime: now,
            updater: '我',
          }
        : item
    )
  }

  function createDownloadLink(file: IFile) {
    return file.fileUrl || `demo://${encodeURIComponent(file.fileName)}`
  }

  function downloadFile(file: IFile) {
    if (!file.fileUrl) {
      const content = [
        `文件名：${file.fileName}`,
        `创建人：${file.creator || '-'}`,
        `更新人：${file.updater || '-'}`,
        `大小：${file.fileSize ?? 0} bytes`,
        `更新时间：${file.updateTime || '-'}`,
        '',
        '这是演示文件生成的下载内容。',
      ].join('\n')
      const url = URL.createObjectURL(
        new Blob([content], { type: 'text/plain;charset=utf-8' })
      )
      const link = document.createElement('a')
      link.href = url
      link.download = file.fileName
      link.click()
      URL.revokeObjectURL(url)
      message.success('已生成演示文件下载')
      return
    }

    const link = document.createElement('a')
    link.href = file.fileUrl
    link.download = file.fileName
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }

  function batchDownload() {
    if (!explorer.selectedFiles.value.length) return
    for (const file of explorer.selectedFiles.value) {
      downloadFile(file)
    }
    message.success('已处理选中文件下载')
  }

  async function copyFileLink(file: IFile) {
    if (!isClipboardSupported.value) {
      message.warning('当前环境不支持复制')
      return
    }

    await copy(createDownloadLink(file))
    message.success('文件链接已复制')
  }

  async function copySelectedNames() {
    if (!explorer.selectedFiles.value.length || !isClipboardSupported.value) {
      return
    }

    await copy(
      explorer.selectedFiles.value.map((item) => item.fileName).join('\n')
    )
    message.success('文件名称已复制')
  }

  function updateEncryption(file: IFile, password?: string) {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const encrypted = Boolean(password)

    explorer.files.value = explorer.files.value.map((item) =>
      item.id === file.id
        ? {
            ...item,
            encrypted,
            encryptPassword: password || undefined,
            updateTime: now,
            updater: '我',
          }
        : item
    )
    message.success(encrypted ? '已设置加密密码' : '已取消加密')
  }

  onBeforeUnmount(() => {
    for (const url of createdObjectUrls) {
      URL.revokeObjectURL(url)
    }
    createdObjectUrls.clear()
  })

  return {
    batchDownload,
    confirmBatchDelete,
    confirmDelete,
    copyFileLink,
    copySelectedNames,
    downloadFile,
    handleUpload,
    openRenameModal,
    restoreFile,
    restoreFiles,
    restoreSelectedFiles,
    submitRename,
    toggleFavorite,
    updateEncryption,
  }
}
