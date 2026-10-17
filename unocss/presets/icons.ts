import { presetIcons } from 'unocss'

/**
 * 图标预设
 *
 * 只声明 lucide 一个集合(本地 @iconify-json,构建期不联网)。
 *
 * 不开启 warn:UnoCSS 的候选名来自源码文本切分,属性化提取器会拼出
 * `name`/`size` 相邻属性这类并不存在的图标名,告警会被噪声淹没;
 * 图标名是否有效由 tests/icons.test.ts 精确校验。
 */
export const iconsPreset = presetIcons({
  collections: {
    lucide: () =>
      import('@iconify-json/lucide/icons.json').then((i) => i.default),
  },
})
