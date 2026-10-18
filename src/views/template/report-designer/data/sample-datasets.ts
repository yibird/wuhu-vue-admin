import type { Dataset, DatasetField, Scalar } from '../types'

const salesRows: Record<string, Scalar>[] = [
  {
    orderNo: 'SO-2026-1001',
    date: '2026-10-01',
    region: '华东',
    customer: '上海云启科技',
    product: '企业版订阅',
    quantity: 24,
    amount: 158000,
    status: '已回款',
  },
  {
    orderNo: 'SO-2026-1002',
    date: '2026-10-02',
    region: '华东',
    customer: '杭州数联网络',
    product: '标准版订阅',
    quantity: 36,
    amount: 86400,
    status: '已回款',
  },
  {
    orderNo: 'SO-2026-1003',
    date: '2026-10-03',
    region: '华南',
    customer: '深圳智造实业',
    product: '私有化部署',
    quantity: 1,
    amount: 320000,
    status: '待回款',
  },
  {
    orderNo: 'SO-2026-1004',
    date: '2026-10-05',
    region: '华南',
    customer: '广州星辰传媒',
    product: '标准版订阅',
    quantity: 48,
    amount: 115200,
    status: '已回款',
  },
  {
    orderNo: 'SO-2026-1005',
    date: '2026-10-06',
    region: '华北',
    customer: '北京华信咨询',
    product: '企业版订阅',
    quantity: 30,
    amount: 198000,
    status: '已回款',
  },
  {
    orderNo: 'SO-2026-1006',
    date: '2026-10-08',
    region: '华北',
    customer: '天津恒远物流',
    product: '增值服务包',
    quantity: 12,
    amount: 36000,
    status: '待回款',
  },
  {
    orderNo: 'SO-2026-1007',
    date: '2026-10-09',
    region: '西南',
    customer: '成都天府软件',
    product: '标准版订阅',
    quantity: 20,
    amount: 48000,
    status: '已回款',
  },
  {
    orderNo: 'SO-2026-1008',
    date: '2026-10-11',
    region: '西南',
    customer: '重庆两江制造',
    product: '私有化部署',
    quantity: 1,
    amount: 268000,
    status: '待回款',
  },
  {
    orderNo: 'SO-2026-1009',
    date: '2026-10-12',
    region: '华东',
    customer: '南京睿见数据',
    product: '增值服务包',
    quantity: 16,
    amount: 52000,
    status: '待回款',
  },
  {
    orderNo: 'SO-2026-1010',
    date: '2026-10-15',
    region: '华南',
    customer: '厦门海丝文旅',
    product: '企业版订阅',
    quantity: 18,
    amount: 126000,
    status: '已回款',
  },
  {
    orderNo: 'SO-2026-1011',
    date: '2026-10-18',
    region: '华北',
    customer: '青岛海川能源',
    product: '标准版订阅',
    quantity: 60,
    amount: 144000,
    status: '已回款',
  },
  {
    orderNo: 'SO-2026-1012',
    date: '2026-10-20',
    region: '西南',
    customer: '昆明云岭农业',
    product: '增值服务包',
    quantity: 10,
    amount: 30000,
    status: '待回款',
  },
]

const expenseRows: Record<string, Scalar>[] = [
  {
    expenseNo: 'EX-001',
    date: '2026-10-03',
    department: '销售部',
    applicant: '张敏',
    category: '差旅',
    amount: 3860,
    status: '已通过',
  },
  {
    expenseNo: 'EX-002',
    date: '2026-10-06',
    department: '市场部',
    applicant: '李航',
    category: '活动',
    amount: 12600,
    status: '已通过',
  },
  {
    expenseNo: 'EX-003',
    date: '2026-10-09',
    department: '研发部',
    applicant: '王珂',
    category: '设备',
    amount: 8600,
    status: '审批中',
  },
  {
    expenseNo: 'EX-004',
    date: '2026-10-12',
    department: '销售部',
    applicant: '周明',
    category: '差旅',
    amount: 2980,
    status: '已通过',
  },
  {
    expenseNo: 'EX-005',
    date: '2026-10-16',
    department: '人事部',
    applicant: '赵宁',
    category: '培训',
    amount: 5400,
    status: '已驳回',
  },
]

export const sampleDatasets: Dataset[] = [
  {
    id: 'sales',
    name: '销售订单',
    source: { kind: 'sample', json: JSON.stringify(salesRows, null, 2) },
    fields: deriveFields(salesRows),
    rows: salesRows,
  },
  {
    id: 'expenses',
    name: '费用明细',
    source: { kind: 'sample', json: JSON.stringify(expenseRows, null, 2) },
    fields: deriveFields(expenseRows),
    rows: expenseRows,
  },
]

/**
 * 根据数据行推导字段
 * @param rows 数据行
 * @returns 字段列表
 */
export function deriveFields(rows: Record<string, Scalar>[]): DatasetField[] {
  const first = rows[0]
  if (!first) return []
  return Object.keys(first).map((key) => ({
    key,
    label: key,
    type: deriveType(first[key]),
  }))
}

function deriveType(value: Scalar): DatasetField['type'] {
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return 'date'
  }
  return 'string'
}
