export interface WorkbenchMember {
  name: string
  src?: string
}

export type ProjectLogoTone =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

export interface ProjectLogo {
  icon: string
  tone: ProjectLogoTone
}

export interface Project {
  id: number | string
  logo: ProjectLogo
  name: string
  describe: string
  master: string
  createdAt: string
  dueAt: string
  progress: number
  status: string
  statusClass: string
  members: WorkbenchMember[]
}

export type ProjectSettingsMode = 'create' | 'edit'

export interface ProjectSettingsPayload {
  logo: ProjectLogo
  name: string
  describe: string
  master: string
  dueAt: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  notify: boolean
  autoReport: boolean
  riskWatch: boolean
}
