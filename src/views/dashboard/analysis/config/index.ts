import visitCountIcon from '@/assets/svg/visit-count.svg'
import transactionIcon from '@/assets/svg/transaction.svg'
import downloadCountIcon from '@/assets/svg/download-count.svg'
import totalSalesIcon from '@/assets/svg/total-sales.svg'
import type { OverviewCard } from '../components/overview/types'

export const cards: OverviewCard[] = [
  {
    id: 1,
    title: '访问数',
    values: { year: 986, month: 312, day: 100 },
    description: '总访问数',
    totalValue: '1000',
    icon: visitCountIcon,
  },
  {
    id: 2,
    title: '成交额',
    values: { year: 920, month: 286, day: 64 },
    description: '总成交额',
    totalValue: '1000',
    icon: transactionIcon,
  },
  {
    id: 3,
    title: '下载数',
    values: { year: 874, month: 253, day: 86 },
    description: '总下载数',
    totalValue: '1000',
    icon: downloadCountIcon,
  },
  {
    id: 4,
    title: '成交数',
    values: { year: 234, month: 118, day: 42 },
    description: '总成交数',
    totalValue: '1000',
    icon: totalSalesIcon,
  },
]
