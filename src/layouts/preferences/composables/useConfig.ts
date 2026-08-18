import message from 'antdv-next/dist/message/index'
import Modal from 'antdv-next/dist/modal/index'
import { appStore, type AppState } from '@/store'

export function useConfig() {
  const store = appStore()

  const copyConfig = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(store.$state, null, 2))
      message.success('配置已复制到剪贴板')
    } catch {
      message.error('复制配置失败，请检查浏览器剪贴板权限')
    }
  }

  const parseConfig = async (file: File) => {
    try {
      const config = JSON.parse(await file.text()) as AppState
      store.$patch(config)
      message.success('配置导入成功')
    } catch {
      message.error('配置文件格式不正确，导入失败')
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
