export interface Status {
  id: string
  title: string
  value: number
  description?: string
}

export interface StatusProps {
  items: Status[]
}
export interface StatusItemProps {
  item: Status
}

export interface SysInfoType {
  title: string
  value: string
}

export interface SysInfoProps {
  items: SysInfoType[]
}

export interface SysMonitorData {
  time: string
  value: number
}
export interface SysMonitorProps {
  data?: SysMonitorData[]
}

export interface AppType {
  id: number
  title: string
  description: string
  icon?: string
}

export interface RecommendAppProps {
  items: AppType[]
}
