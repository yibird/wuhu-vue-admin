<script setup lang="ts">
import lucideIconSet from '@iconify-json/lucide/icons.json'

defineOptions({ name: 'Preview' })

interface IconifyIconData {
  body: string
}

interface IconifyAliasData {
  parent: string
}

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
  }>(),
  {
    size: 18,
  }
)

const icons = lucideIconSet.icons as Record<string, IconifyIconData>
const aliases = (lucideIconSet.aliases ?? {}) as Record<
  string,
  IconifyAliasData
>

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const SPRITE_ID = 'w-lucide-sprite'
const SYMBOL_ID_PREFIX = 'w-lucide-'

const symbolIds = new Map<string, string>()
let sprite: SVGSVGElement | undefined

/**
 * 图标 body 只解析一次
 *
 * 虚拟列表滚动时会不断挂载新行,若每次挂载都写入 body,每帧要做几十次 HTML 解析;
 * 这里把 body 写进共享的 <symbol> 精灵,之后每处只渲染一个 <use>,
 * 挂载成本降到创建两个元素,同名 symbol 也只解析一次。
 *
 * @param name 去掉 i-lucide: 前缀的图标名
 * @returns symbol 的 id,图标不存在时返回 undefined
 */
function ensureSymbol(name: string) {
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

const iconName = computed(() => props.name.replace(/^i-lucide:/, ''))
const symbolId = shallowRef<string>()
const iconStyle = computed(() => ({
  height: `${props.size}px`,
  width: `${props.size}px`,
}))

watch(
  iconName,
  (name) => {
    symbolId.value = ensureSymbol(name)
  },
  { immediate: true }
)
</script>

<template>
  <svg
    v-if="symbolId"
    class="inline-block shrink-0 overflow-visible align-[-0.125em]"
    :style="iconStyle"
    aria-hidden="true"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <use :href="`#${symbolId}`" />
  </svg>
  <Icon v-else :name="name" :size="size" />
</template>
