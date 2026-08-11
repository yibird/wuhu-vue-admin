export type DownloadStatus =
  | 'downloading'
  | 'waiting'
  | 'paused'
  | 'success'
  | 'failed'
export type DownloadStatusFilter = DownloadStatus | 'all'
export type DownloadCategory =
  | 'report'
  | 'asset'
  | 'backup'
  | 'invoice'
  | 'other'
export type DownloadCategoryFilter = DownloadCategory | 'all'

export interface DownloadItem {
  id: string
  name: string
  description: string
  category: DownloadCategory
  status: DownloadStatus
  progress: number
  size: string
  speed: string
  source: string
  savePath: string
  checksum: string
  createdAt: string
  updatedAt: string
}

export interface DownloadOption<T extends string = string> {
  label: string
  value: T
}

export interface DownloadMeta {
  label: string
  icon: string
  color: string
  class: string
}
