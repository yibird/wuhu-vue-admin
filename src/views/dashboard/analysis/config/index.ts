import visitCountIcon from '@/assets/svg/visit-count.svg'
import transactionIcon from '@/assets/svg/transaction.svg'
import downloadCountIcon from '@/assets/svg/download-count.svg'
import totalSalesIcon from '@/assets/svg/total-sales.svg'
import type { Card } from '../components'

export const cards: Card[] = [
  {
    id: 1,
    title: '访问数',
    value: 100,
    description: '总访问数',
    totalValue: '1000',
    icon: visitCountIcon
  },
  {
    id: 2,
    title: '成交额',
    value: 1000,
    description: '总成交额',
    totalValue: '1000',
    icon: transactionIcon
  },
  {
    id: 3,
    title: '下载数',
    value: 1000,
    description: '总下载数',
    totalValue: '1000',
    icon: downloadCountIcon
  },
  {
    id: 3,
    title: '成交数',
    value: 234,
    description: '总成交数',
    totalValue: '1000',
    icon: totalSalesIcon
  }
]
