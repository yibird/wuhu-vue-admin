export interface QueryButtonProps {
  showSearch?: boolean
  showReset?: boolean
  searchText?: string
  resetText?: string
  onSearch?: () => void
  onReset?: () => void
}
