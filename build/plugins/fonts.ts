import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { fontless } from 'fontless'
import type { FontlessOptions } from 'fontless'
import type { Plugin } from 'vite'

/**
 * 自托管字体资源的输出目录
 *
 * 注意:fontless 的产物文件名由字体源路径/格式哈希得出,不含文件内容指纹,
 * 覆盖同名字体文件不会改变 URL,升级字体时需同步改名以刷新缓存。
 */
const FONT_ASSETS_PREFIX = '/assets/_fonts'

/**
 * 仓库内自托管字体所在目录
 *
 * 字体文件随仓库提交,构建期不再请求 fonts.google.com,
 * 断网 / CI 无外网时同样能产出完整的 @font-face。
 */
const FONT_DIR = resolve(process.cwd(), 'src/assets/fonts')

type FontFamilies = NonNullable<FontlessOptions['families']>

interface GeneratedFont {
  family: string
  weight: string
  preload: boolean
  core: {
    file: string
    unicodeRange: string
  }
}

interface FontManifest {
  fonts: GeneratedFont[]
}

/**
 * 子集字体清单
 *
 * 由 `pnpm fonts:optimize` 生成,文件名带内容指纹,只保留实际使用的字重区间。
 */
function readFontManifest(): FontManifest {
  try {
    return JSON.parse(
      readFileSync(resolve(FONT_DIR, 'generated/font-manifest.json'), 'utf8')
    ) as FontManifest
  } catch {
    throw new Error(
      '缺少字体子集产物,请先执行 `pnpm fonts:optimize` 并提交 src/assets/fonts/generated'
    )
  }
}

const fontManifest = readFontManifest()

/**
 * @param file src/assets/fonts/generated 下的子集字体文件名
 * @returns 本地字体源,由 fontless 复制进产物并生成 @font-face
 */
function localFont(file: string) {
  return [
    {
      url: pathToFileURL(resolve(FONT_DIR, 'generated', file)).href,
      format: 'woff2',
    },
  ]
}

/**
 * 需要自托管的字体族
 *
 * 全部走本地 src,由 fontless 复制字体文件进产物并生成 @font-face。
 * 字体文件均为 latin 子集的变量字体,字重区间见各族的 weight 声明。
 *
 * 系统字体显式声明 provider: none,避免无谓的 provider 解析与构建告警。
 */
const fontFamilies: FontFamilies = [
  // core 子集由 fontless 处理并生成 @font-face / preload;
  // extended 子集在 src/styles/fonts.extended.css 中通过 unicode-range 按需加载。
  ...fontManifest.fonts.map((font) => ({
    name: font.family,
    src: localFont(font.core.file),
    weight: font.weight,
    preload: font.preload,
    global: true,
    unicodeRange: font.core.unicodeRange,
  })),
  { name: 'Noto Sans SC', provider: 'none' },
  { name: 'Microsoft YaHei', provider: 'none' },
  { name: '-apple-system', provider: 'none' },
]

/**
 * 构建期字体插件
 *
 * 由 fontless 统一负责:把 src/assets/fonts 下的本地字体复制进产物、
 * 生成 @font-face、向 index.html 注入 preload 链接。
 *
 * 为什么所有字体族都声明 `global`:
 * 后台的字体切换发生在运行时(把 --w-font-family 写到 :root[data-font=...]),
 * 且这些变量声明由 UnoCSS 预检在 renderChunk 阶段注入,不经过模块 transform,
 * fontless 扫描不到使用点;`global` 让 @font-face 直接进 <head>,不依赖扫描。
 * 度量兜底族(size-adjust 等)因此也由 src/styles/fonts.css 静态维护。
 *
 * 为什么关闭所有远程 provider:
 * unifont 在初始化 provider 时就会拉取 fonts.google.com 的元数据(约 10s,
 * 常触发 undici 连接超时),而远程请求对本地字体毫无用处。
 * fontless 要求至少保留一个 provider,故留用 npm 兜底 ——
 * 它只在解析未声明 src 的字体族时才读取 node_modules,本项目不会走到。
 *
 * 字体子集:src/assets/fonts 下的原始文件仅作为手动脚本的输入,
 * 构建时只会引用 src/assets/fonts/generated 中的 core / extended 子集。
 * 内容、字重或 OpenType 特性变化后需执行 `pnpm fonts:optimize` 并提交产物;
 * 清单缺失时构建会直接报错提示。
 *
 * 字体版本升级:更新 src/assets/fonts 下的原始 woff2 与 OFL 许可,
 * 然后重新执行 `pnpm fonts:optimize`。
 *
 * @returns Vite 插件数组
 */
export function fontsPlugin(): Plugin[] {
  return [
    ...fontless({
      providers: {
        google: false,
        adobe: false,
        bunny: false,
        fontshare: false,
        fontsource: false,
        googleicons: false,
      },
      defaults: {
        // woff2 已覆盖全部目标浏览器,无需 woff/ttf 冗余格式
        formats: ['woff2'],
        // 后台系统只使用常规体,斜体交给浏览器合成
        styles: ['normal'],
        // 预加载按族显式开启,默认不注入
        preload: false,
      },
      families: fontFamilies,
      assets: {
        prefix: FONT_ASSETS_PREFIX,
      },
    }),
    fontHtmlGuardPlugin(),
  ]
}

function fontHtmlGuardPlugin(): Plugin {
  const required = fontFamilies
    .filter(
      (family) =>
        family.global === true &&
        !('provider' in family && family.provider === 'none')
    )
    .map((family) => family.name)
  let isBuild = false
  let checked = false

  return {
    name: 'w-fonts-guard',
    enforce: 'post',
    configResolved(config) {
      isBuild = config.command === 'build'
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!checked) {
          checked = true
          checkFontFaces(html, required, isBuild)
        }
        return moveCharsetToHeadStart(html)
      },
    },
  }
}

/**
 * @param html 当前 HTML
 * @param required 必须声明 @font-face 的字体族
 * @param isBuild 是否处于构建阶段
 */
function checkFontFaces(html: string, required: string[], isBuild: boolean) {
  const missing = required.filter((family) => !hasFontFace(html, family))
  if (missing.length === 0) return

  const message = [
    `字体未解析成功,产物缺少 @font-face:${missing.join('、')}`,
    '本地字体来自 src/assets/fonts,请确认对应文件存在且能被打包;',
    '缺失时浏览器会静默回退到系统字体,页面字体与设计稿不一致。',
  ].join('\n')

  if (isBuild) throw new Error(message)
  console.warn(`\n[w-fonts-guard] ${message}\n`)
}

/**
 * @param html 当前 HTML
 * @returns 编码声明已在最前时返回 undefined,否则返回调整后的 HTML
 */
function moveCharsetToHeadStart(html: string): string | undefined {
  const head = /<head[^>]*>/i.exec(html)
  const charset = /<meta\s+charset=["']?[^"'>\s]+["']?\s*\/?>/i.exec(html)
  if (!head || !charset || charset.index < head.index) return undefined
  if (html.slice(head.index + head[0].length, charset.index).trim() === '') {
    return undefined
  }

  return html
    .replace(charset[0], '')
    .replace(head[0], `${head[0]}\n    ${charset[0]}`)
}

/**
 * @param html 最终输出的 index.html
 * @param family 字体族名称
 * @returns index.html 中是否存在该字体族的 @font-face 声明
 */
function hasFontFace(html: string, family: string): boolean {
  const pattern = new RegExp(
    `font-family\\s*:\\s*['"]?${escapeRegExp(family)}['"]?\\s*[;}]`
  )
  return pattern.test(html)
}

/**
 * @param value 待转义的字符串
 * @returns 可直接拼进正则表达式的字符串
 */
function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
