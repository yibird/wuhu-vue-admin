import { message, Modal } from 'antdv-next'
import { appStore } from '@/store'
import { createAppConfigFile, parseAppConfig } from './configSchema'

export function useConfig() {
  const store = appStore()

  const copyConfig = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(createAppConfigFile(store.$state), null, 2)
      )
      message.success('配置已复制到剪贴板')
    } catch {
      message.error('复制配置失败，请检查浏览器剪贴板权限')
    }
  }

  const parseConfig = async (file: File) => {
    try {
      const rawConfig: unknown = JSON.parse(await file.text())
      const config = parseAppConfig(rawConfig, store.$state)
      store.$patch(config)
      message.success('配置导入成功')
    } catch (error) {
      const reason = error instanceof Error ? error.message : '未知错误'
      message.error(`配置导入失败：${reason}`)
    }
  }

  const resetConfig = () => {
    Modal.confirm({
      title: '恢复默认设置？',
      content: '当前个性化设置将被恢复为默认值，此操作会立即生效。',
      okText: '恢复默认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        store.$reset()
        message.success('已恢复默认设置')
      },
    })
  }

  return { copyConfig, parseConfig, resetConfig }
}
