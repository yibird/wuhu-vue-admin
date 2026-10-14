/**
 * OpenAI 兼容的对话补全请求体。
 */
export interface ChatCompletionRequest {
  /**
   * @desc 模型标识
   */
  model: string
  /**
   * @desc 对话消息列表
   */
  messages: ChatCompletionMessage[]
  /**
   * @desc 是否开启流式输出
   * @default true
   */
  stream?: boolean
  /**
   * @desc 采样温度
   */
  temperature?: number
  /**
   * @desc 核采样范围
   */
  top_p?: number
  /**
   * @desc 最大输出 token 数
   */
  max_tokens?: number
}

/**
 * 对话消息。
 */
export interface ChatCompletionMessage {
  /**
   * @desc 消息角色
   */
  role: 'assistant' | 'system' | 'user'
  /**
   * @desc 消息内容
   */
  content: string
}

/**
 * 流式响应的单个分片。
 */
export interface ChatCompletionChunk {
  /**
   * @desc 候选回复列表
   */
  choices?: Array<{
    /**
     * @desc 增量内容
     */
    delta?: {
      /**
       * @desc 增量文本
       */
      content?: string
    }
  }>
}

/**
 * LLM 连接配置。
 */
export interface LlmConfig {
  /**
   * @desc 对话补全接口路径,相对于 API 基础前缀
   */
  url: string
  /**
   * @desc 默认模型标识
   */
  model: string
  /**
   * @desc 网关独立密钥,留空则只携带应用 token
   */
  apiKey?: string
}
