export interface WorkbenchAction {
  id: number | string
  icon: string
  name: string
  desc: string
  tone: string
  text: string
  action?: 'create-project'
  path?: string
}
