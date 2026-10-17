import {
  defaultIgnoreAttributes,
  presetAttributify,
} from 'unocss/preset-attributify'
import { wind4Preset } from './wind4'
import { iconsPreset } from './icons'
import { extraPreset } from './extra'
import { fontsPreset } from './fonts'

export const presets = [
  wind4Preset,
  /**
   * 属性化模式需要忽略非工具类属性
   *
   * `color` 与项目自定义的 color 规则同名;
   * `name`/`icon` 等承载图标名的属性会被属性化提取器当成工具类,
   * 并和相邻属性拼接出 `i-lucide:box-13` 这类不存在的图标名。
   */
  presetAttributify({
    ignoreAttributes: [
      ...defaultIgnoreAttributes,
      'color',
      ':color',
      'v-bind:color',
      'name',
      ':name',
      'v-bind:name',
      'icon',
      ':icon',
      'v-bind:icon',
    ],
  }),
  iconsPreset,
  extraPreset,
  fontsPreset,
]
