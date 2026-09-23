export interface WorkbenchAnnouncement {
  id: number | string
  title: string
  summary: string
  content: string
  category: string
  categoryClass: string
  icon: string
  publisher: string
  publishedAt: string
  read?: boolean
}
