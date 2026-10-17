import type { BinarySettingKey } from '../data'
import type { ChatSettings } from '../../types'
import type { MaybeRefOrGetter } from 'vue'

interface UseChatSettingsOptions {
  /**
   * @desc 当前设置(受控值)
   */
  settings: MaybeRefOrGetter<ChatSettings>
  /**
   * @desc 设置变化时回传完整对象
   */
  onChange: (value: ChatSettings) => void
}

/**
 * 设置面板的更新逻辑
 *
 * 面板本身是受控组件:这里只负责把单字段变更合并成完整设置对象,
 * 并统一处理 antd slider 可能返回的单值/区间值
 */
export function useChatSettings(options: UseChatSettingsOptions) {
  const settings = computed(() => toValue(options.settings))

  function patchSettings(patch: Partial<ChatSettings>) {
    options.onChange({
      ...settings.value,
      ...patch,
    })
  }

  function updateSetting(key: BinarySettingKey, checked: unknown) {
    patchSettings({ [key]: Boolean(checked) })
  }

  /**
   * @param value slider 回调值
   * @param fallback 非法值时沿用的当前值
   * @returns 归一化后的数字
   */
  function toSliderValue(value: unknown, fallback: number) {
    if (typeof value === 'number') return value
    if (Array.isArray(value) && typeof value[0] === 'number') return value[0]
    return fallback
  }

  function updateSoundVolume(value: unknown) {
    patchSettings({
      soundVolume: toSliderValue(value, settings.value.soundVolume),
    })
  }

  function updateArchiveDays(value: unknown) {
    patchSettings({
      autoArchiveDays: toSliderValue(value, settings.value.autoArchiveDays),
    })
  }

  return {
    settings,
    updateSetting,
    updateSoundVolume,
    updateArchiveDays,
  }
}
