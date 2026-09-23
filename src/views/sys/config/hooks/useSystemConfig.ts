import { message, Modal } from 'antdv-next'
import { cloneDeep } from 'es-toolkit'

const savedConfigs = new Map<string, object>()

interface UseSystemConfigOptions<T extends object> {
  key: string
  label: string
  defaults: T
}

export function useSystemConfig<T extends object>({
  key,
  label,
  defaults,
}: UseSystemConfigOptions<T>) {
  const savedConfig = savedConfigs.get(key) as T | undefined
  const form = reactive<T>(cloneDeep(savedConfig ?? defaults))

  function save() {
    savedConfigs.set(key, cloneDeep(toRaw(form)))
    message.success(`${label}已保存`)
  }

  function reset() {
    Modal.confirm({
      title: `恢复${label}默认配置？`,
      content: '当前未保存的修改会丢失，恢复后将立即保存默认配置。',
      okText: '恢复默认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        const nextValue = cloneDeep(defaults)
        Object.assign(form, nextValue)
        savedConfigs.set(key, nextValue)
        message.success(`${label}已恢复默认配置`)
      },
    })
  }

  return { form, save, reset }
}
