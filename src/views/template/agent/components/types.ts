export interface ChatItem {
  id: string
  title: string
  createTime: string
}

export interface ListProps {
  items?: ChatItem[]
}

export interface ListEmits {
  /**
   * @desc 选择会话
   * @returns void
   */
  (e: 'change', id: string): void
}

export interface SiderProps {
  items?: ChatItem[]
}
export interface SiderEmits extends ListEmits {}
