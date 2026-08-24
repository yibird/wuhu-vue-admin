/// <reference types="vite/client" />
/// <reference types="unplugin-fonts/client" />
interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_PORT: number
  readonly VITE_API_PROXY_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_IFRAME_ALLOWED_ORIGINS?: string

  readonly VITE_APP_TITLE: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
