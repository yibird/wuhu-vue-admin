/// <reference types="vite/client" />
/// <reference types="@starweave-lab/vite-plugin-loading/client" />
interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_APP_PORT: number
  readonly VITE_APP_NAME: string
  readonly VITE_APP_TITLE: string
  readonly VITE_API_PROXY_URL: string

  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: number
  readonly VITE_API_RETRY_LIMIT: number
  readonly VITE_API_MAX_RETRY_AFTER: number

  readonly VITE_ANALYZE: string

  readonly VITE_IFRAME_ALLOWED_ORIGINS?: string
  readonly VITE_LLM_API_URL?: string
  readonly VITE_LLM_MODEL?: string
  readonly VITE_LLM_API_KEY?: string
  readonly VITE_AI_MOCK_FALLBACK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
