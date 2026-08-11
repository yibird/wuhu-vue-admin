export const ROOT_PARENT_ID = '-1'

export const FILE_NODE_TYPE = {
  DIRECTORY: 1,
  FILE: 2,
} as const

export type FileNodeType = (typeof FILE_NODE_TYPE)[keyof typeof FILE_NODE_TYPE]

export const FILE_TYPE = {
  OTHER: 0,
  IMAGE: 1,
  DOCUMENT: 2,
  VIDEO: 3,
  AUDIO: 4,
  ARCHIVE: 5,
  CODE: 6,
} as const

export type FileTypeValue = (typeof FILE_TYPE)[keyof typeof FILE_TYPE]

export type FileCategory =
  | 'all'
  | 'image'
  | 'document'
  | 'video'
  | 'audio'
  | 'archive'
  | 'code'
  | 'trash'
  | 'other'

export type FileType = Exclude<FileCategory, 'all' | 'trash'>

export type FileSelectionKey = string

export type FileSortBy = 'updateTime' | 'name' | 'size' | 'type'

export type FileViewMode = 'grid' | 'list'

export type FileSource = 'local' | 'remote'

export interface IFile {
  id: string
  type: FileNodeType
  rootId: string
  parentId: string
  rootLevel: string
  parentLevel: string
  fileName: string
  fileType: FileTypeValue
  fileRawType: string
  fileSize?: number
  fileUrl?: string
  fileExtension?: string
  mimeType?: string
  favorite?: boolean
  source?: FileSource
  encrypted?: boolean
  encryptPassword?: string
  deleted?: boolean
  deletedTime?: string
  deleteUser?: string
  createTime: string
  creator: string
  updateTime: string
  updater: string
  remark?: string
  tags?: string[]
}

export interface FileBreadcrumbItem {
  id: string
  fileName: string
}

export interface FileCategoryMetric {
  count: number
  size: number
}

export type FileCategoryStats = Record<FileCategory, FileCategoryMetric>
