import type {
  BillingOption,
  CompareFeature,
  PricingAddon,
  PricingFaq,
  PricingPlan,
} from './types'

export const billingOptions: BillingOption[] = [
  {
    label: '月付',
    value: 'monthly',
    caption: '适合短期试运行',
  },
  {
    label: '年付',
    value: 'yearly',
    caption: '月均节省 20%',
  },
]

export const pricingPlans: PricingPlan[] = [
  {
    key: 'launch',
    name: 'Launch',
    eyebrow: '原型与小团队',
    tagline: '先把内部流程跑起来',
    description: '适合演示环境、轻量后台、低代码页面和早期数据看板。',
    icon: 'i-lucide:box',
    accent: 'mint',
    monthlyPrice: 0,
    yearlyPrice: 0,
    unit: '永久免费',
    cta: '启用 Launch',
    audience: '个人 / Demo / PoC',
    metrics: [
      { label: '项目', value: '3' },
      { label: '成员', value: '2' },
      { label: '空间', value: '5GB' },
    ],
    features: ['低代码页面搭建', '基础数据看板', '标准组件库', '7 天日志留存'],
  },
  {
    key: 'scale',
    name: 'Scale',
    eyebrow: '增长型团队',
    tagline: '把运营、研发和交付放进同一个工作台',
    description: '适合需要权限、自动化、接口、审计和多角色协作的团队。',
    icon: 'i-lucide:activity',
    accent: 'electric',
    monthlyPrice: 299,
    yearlyPrice: 239,
    unit: '每席 / 月',
    badge: '推荐',
    cta: '升级 Scale',
    audience: '产品 / 运营 / 研发',
    metrics: [
      { label: '项目', value: '不限' },
      { label: '成员', value: '30' },
      { label: '空间', value: '200GB' },
    ],
    features: [
      '无限项目与页面',
      '高级数据分析',
      'API 与 Webhook',
      '自动化任务额度',
      '品牌与权限管理',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    eyebrow: '组织与合规',
    tagline: '为多组织、多环境和私有化交付准备',
    description: '适合集团权限、私有化部署、审计报告和高可用 SLA 场景。',
    icon: 'i-lucide:building-2',
    accent: 'carbon',
    monthlyPrice: null,
    yearlyPrice: null,
    unit: '按需报价',
    cta: '预约方案顾问',
    audience: '集团 / 大型组织 / ISV',
    metrics: [
      { label: '项目', value: '不限' },
      { label: 'SLA', value: '99.95%' },
      { label: '支持', value: '专属' },
    ],
    features: [
      'SSO 与组织架构同步',
      '私有化部署',
      '多环境隔离',
      '审计日志与合规报告',
      '专属客户成功经理',
    ],
  },
]

export const compareFeatures: CompareFeature[] = [
  {
    group: '基础能力',
    name: '项目数量',
    launch: '3 个',
    scale: '不限',
    enterprise: '不限',
  },
  {
    group: '基础能力',
    name: '团队成员',
    launch: '2 人',
    scale: '30 人',
    enterprise: '不限',
  },
  {
    group: '基础能力',
    name: '存储空间',
    launch: '5GB',
    scale: '200GB',
    enterprise: '不限',
  },
  {
    group: '构建能力',
    name: '低代码组件库',
    launch: true,
    scale: true,
    enterprise: true,
  },
  {
    group: '构建能力',
    name: '高级数据分析',
    launch: false,
    scale: true,
    enterprise: true,
  },
  {
    group: '构建能力',
    name: 'API 与 Webhook',
    launch: false,
    scale: true,
    enterprise: true,
  },
  {
    group: '治理能力',
    name: '角色权限',
    launch: '基础',
    scale: '高级',
    enterprise: '集团级',
  },
  {
    group: '治理能力',
    name: 'SSO 单点登录',
    launch: false,
    scale: false,
    enterprise: true,
  },
  {
    group: '治理能力',
    name: '私有化部署',
    launch: false,
    scale: false,
    enterprise: true,
  },
]

export const pricingAddons: PricingAddon[] = [
  {
    name: '自动化额度包',
    description: '工作流、定时任务与批处理执行次数。',
    icon: 'i-lucide:workflow',
    value: '+100k 次',
  },
  {
    name: '数据保留包',
    description: '延长指标、审计日志和操作记录周期。',
    icon: 'i-lucide:database-backup',
    value: '365 天',
  },
  {
    name: '专家陪跑包',
    description: '上线方案评审、性能诊断和团队培训。',
    icon: 'i-lucide:headphones',
    value: '4 小时',
  },
]

export const pricingFaqs: PricingFaq[] = [
  {
    question: '可以先试用再升级吗？',
    answer:
      '可以。Launch 不需要信用卡即可使用，团队正式协作时再升级到付费方案。',
  },
  {
    question: '年付价格如何计算？',
    answer:
      '页面展示的是年付月均价，实际结算按 12 个月计费，Scale 相比月付约节省 20%。',
  },
  {
    question: 'Scale 是否支持权限和接口？',
    answer:
      '支持。Scale 包含成员权限、API、Webhook、自动化任务额度和基础审计能力。',
  },
  {
    question: '企业版能否私有化部署？',
    answer:
      '可以。Enterprise 支持私有化部署、SSO、专属 SLA、多环境隔离和合规审计。',
  },
]
