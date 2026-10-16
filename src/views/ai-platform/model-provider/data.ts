import dayjs from 'dayjs'
import { ApiCode } from '@/constants'
import type { PageResult, Result } from '#/http'
import type {
  ProviderCreateInput,
  ProviderItem,
  ProviderProtocol,
  ProviderQuery,
} from './types'

export const protocolOptions: Array<{
  label: string
  value: ProviderProtocol
}> = [
  { label: 'OpenAI Compatible', value: 'openai-compatible' },
  { label: 'Anthropic Messages', value: 'anthropic' },
  { label: 'Google Generative AI', value: 'google-generative-ai' },
]

export const protocolLabels: Record<ProviderProtocol, string> = {
  'openai-compatible': 'OpenAI Compatible',
  anthropic: 'Anthropic Messages',
  'google-generative-ai': 'Google Generative AI',
}

/**
 * 取协议展示名,未匹配到时回退为原始值
 *
 * @param protocol 协议标识
 * @returns 协议展示名
 */
export function getProtocolLabel(protocol: string) {
  return protocolLabels[protocol as ProviderProtocol] ?? protocol
}

/**
 * 掩码展示 API Key,只保留末 4 位
 *
 * @param apiKey 原始密钥
 * @returns 掩码后的展示文本
 */
function maskApiKey(apiKey: string) {
  const tail = apiKey.slice(-4)
  return tail ? `••••••••${tail}` : '未配置'
}

const seedProviders: ProviderItem[] = [
  {
    id: 'provider-openai',
    name: 'OpenAI',
    protocol: 'openai-compatible',
    endpoint: 'https://api.openai.com/v1',
    apiKeyMasked: '••••••••7Kd2',
    description: '官方接口,用于 GPT 系列模型',
    createdAt: '2026-03-02 10:12',
  },
  {
    id: 'provider-anthropic',
    name: 'Anthropic',
    protocol: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1',
    apiKeyMasked: '••••••••9Fa1',
    description: 'Claude 系列模型',
    createdAt: '2026-03-05 14:38',
  },
  {
    id: 'provider-zhipu',
    name: '智谱 AI',
    protocol: 'openai-compatible',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    apiKeyMasked: '••••••••3Bc8',
    description: 'GLM 系列模型',
    createdAt: '2026-04-11 09:20',
  },
  {
    id: 'provider-deepseek',
    name: 'DeepSeek',
    protocol: 'openai-compatible',
    endpoint: 'https://api.deepseek.com/v1',
    apiKeyMasked: '••••••••5Xy6',
    description: '推理与代码场景',
    createdAt: '2026-05-08 16:02',
  },
  {
    id: 'provider-google',
    name: 'Google',
    protocol: 'google-generative-ai',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyMasked: '••••••••1Qw9',
    description: 'Gemini 系列模型',
    createdAt: '2026-06-19 11:45',
  },
]

/**
 * 前端内存数据源,mock 接口基于它做筛选与分页;
 * 接入真实后端时只需替换下方两个 api 函数。
 */
let providers: ProviderItem[] = seedProviders.map((item) => ({ ...item }))

/**
 * 模拟网络往返,便于观察表格 loading 状态
 *
 * @param ms 延迟毫秒数
 */
function delay(ms = 220) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function getProviderPageListApi(
  query: ProviderQuery
): Promise<Result<PageResult<ProviderItem>>> {
  await delay()

  const keyword = query.keyword?.trim().toLowerCase()
  const filtered = providers.filter((item) => {
    const matchesKeyword =
      !keyword ||
      [item.name, item.endpoint, item.description].some((value) =>
        value.toLowerCase().includes(keyword)
      )
    const matchesProtocol = !query.protocol || item.protocol === query.protocol
    return matchesKeyword && matchesProtocol
  })

  const start = (query.current - 1) * query.pageSize
  return {
    code: ApiCode.Ok,
    message: '请求成功',
    data: {
      list: filtered.slice(start, start + query.pageSize),
      current: query.current,
      pageSize: query.pageSize,
      total: filtered.length,
      totalPage: Math.max(1, Math.ceil(filtered.length / query.pageSize)),
    },
  }
}

export async function createProviderApi(
  input: ProviderCreateInput
): Promise<Result<ProviderItem>> {
  await delay()

  const item: ProviderItem = {
    id: `provider-${Date.now().toString(36)}`,
    name: input.name,
    protocol: input.protocol,
    endpoint: input.endpoint,
    apiKeyMasked: maskApiKey(input.apiKey),
    description: input.description,
    createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
  }
  providers = [item, ...providers]

  return { code: ApiCode.Ok, message: '请求成功', data: item }
}
