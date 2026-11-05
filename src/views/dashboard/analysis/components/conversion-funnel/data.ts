import type { FunnelInsight, FunnelStage, FunnelSummary } from './types'

export const stages: FunnelStage[] = [
  {
    id: 'visit',
    title: '访问触达',
    value: '48,920',
    rate: 100,
    trend: '+12.8%',
    toneClass: 'text-success',
    fillClass: 'from-primary to-info',
  },
  {
    id: 'signup',
    title: '线索留资',
    value: '16,840',
    rate: 72,
    trend: '+8.4%',
    toneClass: 'text-success',
    fillClass: 'from-info to-success',
  },
  {
    id: 'trial',
    title: '试用激活',
    value: '8,426',
    rate: 48,
    trend: '+3.2%',
    toneClass: 'text-success',
    fillClass: 'from-success to-warning',
  },
  {
    id: 'deal',
    title: '成交转化',
    value: '2,356',
    rate: 28,
    trend: '-1.6%',
    toneClass: 'text-warning',
    fillClass: 'from-warning to-error',
  },
]

export const summary: FunnelSummary = {
  title: '最终成交',
  value: '2,356',
  unit: '人',
  description: '由 48,920 次访问逐步转化',
  rateLabel: '总体转化率',
  rate: '4.8%',
  progress: 28,
}

export const insights: FunnelInsight[] = [
  {
    id: 'retention',
    label: '复访率',
    value: '64.2%',
    description: '较上周提升 4.8%',
    icon: 'i-lucide:repeat-2',
    iconClass: 'bg-success/10 text-success',
  },
  {
    id: 'response',
    label: '平均响应',
    value: '1.8h',
    description: '客服承接更快',
    icon: 'i-lucide:timer',
    iconClass: 'bg-info/10 text-info',
  },
  {
    id: 'risk',
    label: '异常波动',
    value: '3',
    description: '需关注渠道',
    icon: 'i-lucide:radar',
    iconClass: 'bg-warning/10 text-warning',
  },
]
