export type ArticleStatus = 'archived' | 'draft' | 'published'

export type ArticleSort =
  | 'created-desc'
  | 'title-asc'
  | 'updated-desc'
  | 'views-desc'

export type ArticleAction =
  | 'archive'
  | 'delete'
  | 'duplicate'
  | 'edit'
  | 'open'
  | 'publish'

export interface ArticleAuthor {
  name: string
  department: string
}

export interface ArticleItem {
  id: string
  title: string
  summary: string
  category: string
  tags: string[]
  author: ArticleAuthor
  createdAt: string
  updatedAt: string
  status: ArticleStatus
  views: number
  wordCount: number
  icon: string
  iconBackground: string
}
