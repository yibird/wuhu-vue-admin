export interface OverviewMetric {
  title: string
  value: number
  desc: string
  icon: string
  tone: string
}

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

export interface WorkbenchMember {
  name: string
  src?: string
}

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
  createAt: string
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

export interface Dynamic {
  id: number | string
  avatar?: string
  name: string
  action: string
  target: string
  describe: string
  createAt: string
  icon: string
}

export interface TeamItem {
  id: number | string
  icon: string
  name: string
  desc: string
  members: number
  online: number
  progress: number
  status: string
}

export interface AnalysisMetric {
  label: string
  value: number
  suffix?: string
  descValue: number
  descPrefix?: string
  descSuffix?: string
  percent: number
  tone: string
}

export interface AnalysisRankItem {
  label: string
  value: number
  suffix?: string
  percent: number
}
