import lucideIconSet from '@iconify-json/lucide/icons.json'

interface IconifyIconData {
  body: string
}

interface IconifyAliasData {
  parent: string
}

const icons = lucideIconSet.icons as Record<string, IconifyIconData>
const aliases = (lucideIconSet.aliases ?? {}) as Record<
  string,
  IconifyAliasData
>

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const SPRITE_ID = 'w-lucide-sprite'
const SYMBOL_ID_PREFIX = 'w-lucide-'

/**
 * 已写入精灵的图标,必须放在模块作用域共享:
 * 虚拟列表会挂载大量 Preview 实例,实例级缓存会让同名图标被反复写入 body
 */
const symbolIds = new Map<string, string>()
let sprite: SVGSVGElement | undefined

/**
 * 把图标 body 写入共享的 <symbol> 精灵
 *
 * 虚拟列表滚动时会不断挂载新行,若每次挂载都写入 body,每帧要做几十次 HTML 解析;
 * 这里把 body 写进共享的 <symbol>,之后每处只渲染一个 <use>,
 * 挂载成本降到创建两个元素,同名 symbol 也只解析一次。
 *
 * @param name 去掉 i-lucide: 前缀的图标名
 * @returns symbol 的 id,图标不存在时返回 undefined
 */
export function ensureSymbol(name: string) {
  const cached = symbolIds.get(name)
  if (cached) return cached
  if (typeof document === 'undefined') return undefined

  const data = icons[name] ?? icons[aliases[name]?.parent ?? '']
  if (!data) return undefined

  if (!sprite) {
    sprite =
      (document.getElementById(SPRITE_ID) as SVGSVGElement | null) ??
      document.createElementNS(SVG_NAMESPACE, 'svg')
    if (!sprite.id) {
      sprite.id = SPRITE_ID
      sprite.setAttribute('aria-hidden', 'true')
      sprite.style.display = 'none'
      document.body.appendChild(sprite)
    }
  }

  const id = `${SYMBOL_ID_PREFIX}${name}`
  // 同名 symbol 已存在时直接复用,避免热更新等场景重复写入
  if (document.getElementById(id)) {
    symbolIds.set(name, id)
    return id
  }

  const symbol = document.createElementNS(SVG_NAMESPACE, 'symbol')
  symbol.setAttribute('id', id)
  symbol.setAttribute('viewBox', '0 0 24 24')
  // symbol 默认 overflow: hidden,图标描边会略微超出 24 视口,这里放行
  symbol.setAttribute('overflow', 'visible')
  symbol.innerHTML = data.body
  sprite.appendChild(symbol)

  symbolIds.set(name, id)
  return id
}
