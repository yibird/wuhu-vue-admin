import type {
  SysFileCreateReq,
  FileKind,
  SysFile,
  SysFileUpdateReq,
} from '@/apis'

const uploaders = ['管理员', '张伟', '李娜', '王强', '赵敏']

function svgDataUrl(label: string, color: string) {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">',
    `<rect width="100%" height="100%" fill="${color}"/>`,
    `<text x="160" y="108" font-size="20" text-anchor="middle" fill="#fff">${label}</text>`,
    '</svg>',
  ].join('')
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function textDataUrl(content: string, mimeType = 'text/plain') {
  return `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`
}

const imageColors = ['#5b8ff9', '#5ad8a6', '#f6bd16', '#ff9845', '#945fb9']

interface SeedFile {
  name: string
  mimeType: string
  size: number
  kind: FileKind
  /** 距今多少天前上传,用于构造可用于筛选的时间分布 */
  daysAgo: number
}

const seedFiles: SeedFile[] = [
  {
    name: '产品需求文档-v2.4.pdf',
    mimeType: 'application/pdf',
    size: 2_418_688,
    kind: 'document',
    daysAgo: 0,
  },
  {
    name: '首页设计稿.png',
    mimeType: 'image/png',
    size: 1_236_992,
    kind: 'image',
    daysAgo: 0,
  },
  {
    name: 'logo-深色.svg',
    mimeType: 'image/svg+xml',
    size: 18_432,
    kind: 'image',
    daysAgo: 1,
  },
  {
    name: '2026-09 运营数据.csv',
    mimeType: 'text/csv',
    size: 486_912,
    kind: 'document',
    daysAgo: 1,
  },
  {
    name: '用户导入模板.xlsx',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 32_768,
    kind: 'document',
    daysAgo: 2,
  },
  {
    name: '部署脚本.tar.gz',
    mimeType: 'application/gzip',
    size: 5_242_880,
    kind: 'archive',
    daysAgo: 2,
  },
  {
    name: '演示录屏.mp4',
    mimeType: 'video/mp4',
    size: 48_234_496,
    kind: 'video',
    daysAgo: 3,
  },
  {
    name: '提示音.mp3',
    mimeType: 'audio/mpeg',
    size: 1_048_576,
    kind: 'audio',
    daysAgo: 3,
  },
  {
    name: 'README.md',
    mimeType: 'text/markdown',
    size: 8_192,
    kind: 'document',
    daysAgo: 4,
  },
  {
    name: '数据结构.json',
    mimeType: 'application/json',
    size: 64_512,
    kind: 'document',
    daysAgo: 4,
  },
  {
    name: '移动端原型.png',
    mimeType: 'image/png',
    size: 892_928,
    kind: 'image',
    daysAgo: 5,
  },
  {
    name: '季度汇报.pptx',
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    size: 8_912_896,
    kind: 'document',
    daysAgo: 6,
  },
  {
    name: '字体子集.woff2',
    mimeType: 'font/woff2',
    size: 142_336,
    kind: 'other',
    daysAgo: 7,
  },
  {
    name: '接口文档.pdf',
    mimeType: 'application/pdf',
    size: 1_782_579,
    kind: 'document',
    daysAgo: 8,
  },
  {
    name: '背景图-登录页.jpg',
    mimeType: 'image/jpeg',
    size: 3_145_728,
    kind: 'image',
    daysAgo: 9,
  },
  {
    name: '日志归档-0901.zip',
    mimeType: 'application/zip',
    size: 12_582_912,
    kind: 'archive',
    daysAgo: 10,
  },
  {
    name: '客服话术.txt',
    mimeType: 'text/plain',
    size: 24_576,
    kind: 'document',
    daysAgo: 12,
  },
  {
    name: '系统架构图.png',
    mimeType: 'image/png',
    size: 2_048_000,
    kind: 'image',
    daysAgo: 14,
  },
  {
    name: '培训视频-第 1 讲.mp4',
    mimeType: 'video/mp4',
    size: 126_877_696,
    kind: 'video',
    daysAgo: 16,
  },
  {
    name: '合同扫描件.pdf',
    mimeType: 'application/pdf',
    size: 4_194_304,
    kind: 'document',
    daysAgo: 18,
  },
  {
    name: '配置备份.yaml',
    mimeType: 'text/yaml',
    size: 12_288,
    kind: 'document',
    daysAgo: 20,
  },
  {
    name: '应用图标切图.zip',
    mimeType: 'application/zip',
    size: 3_355_443,
    kind: 'archive',
    daysAgo: 22,
  },
  {
    name: '反馈录音.m4a',
    mimeType: 'audio/mp4',
    size: 6_291_456,
    kind: 'audio',
    daysAgo: 25,
  },
  {
    name: '财务对账单.xlsx',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 786_432,
    kind: 'document',
    daysAgo: 28,
  },
  {
    name: '海报-A3.png',
    mimeType: 'image/png',
    size: 5_242_880,
    kind: 'image',
    daysAgo: 30,
  },
  {
    name: '发布清单.md',
    mimeType: 'text/markdown',
    size: 6_144,
    kind: 'document',
    daysAgo: 32,
  },
  {
    name: '驱动安装包.exe',
    mimeType: 'application/x-msdownload',
    size: 88_080_384,
    kind: 'other',
    daysAgo: 35,
  },
  {
    name: '年度总结.pptx',
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    size: 15_728_640,
    kind: 'document',
    daysAgo: 40,
  },
  {
    name: '空状态插画.svg',
    mimeType: 'image/svg+xml',
    size: 26_624,
    kind: 'image',
    daysAgo: 44,
  },
  {
    name: '测试数据.sql',
    mimeType: 'application/sql',
    size: 1_048_576,
    kind: 'document',
    daysAgo: 48,
  },
]

function createUrl(seed: SeedFile, index: number) {
  if (seed.kind === 'image') {
    return svgDataUrl(seed.name, imageColors[index % imageColors.length])
  }
  return textDataUrl(
    `【示例文件】${seed.name}\n该文件由 mock 生成,仅用于演示文件管理功能。`
  )
}

function createBase(id: string, daysAgo: number, createdBy: string) {
  const createdAt = new Date(Date.now() - daysAgo * 86_400_000)
  return {
    id,
    dataStatus: true,
    deleted: false,
    version: 1,
    createdBy,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  }
}

export const fileDataSource: SysFile[] = seedFiles.map((seed, index) => ({
  ...createBase(
    `${index + 1}`,
    seed.daysAgo,
    uploaders[index % uploaders.length]
  ),
  name: seed.name,
  url: createUrl(seed, index),
  mimeType: seed.mimeType,
  size: seed.size,
  kind: seed.kind,
}))

export function appendFile(input: SysFileCreateReq) {
  const file: SysFile = {
    ...input,
    id: `${fileDataSource.length + 1}`,
    dataStatus: true,
    deleted: false,
    version: 1,
    createdBy: input.createdBy ?? '当前用户',
    createdAt: new Date().toISOString(),
  }
  fileDataSource.unshift(file)
  return file
}

export function findFile(id: string) {
  return fileDataSource.find((item) => item.id === id)
}

export function updateFile(input: SysFileUpdateReq) {
  const file = findFile(input.id)
  if (!file) return false

  Object.assign(file, input, { updatedAt: new Date().toISOString() })
  return true
}

export function deleteFiles(ids: Array<string | number>) {
  const keys = new Set(ids.map((id) => String(id)))
  const rest = fileDataSource.filter((item) => !keys.has(item.id))
  if (rest.length === fileDataSource.length) return false

  fileDataSource.splice(0, fileDataSource.length, ...rest)
  return true
}
