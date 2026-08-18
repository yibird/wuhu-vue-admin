interface LucideIcon {
  body: string
  width?: number
  height?: number
}

interface LucideAlias {
  parent: string
  body?: string
  width?: number
  height?: number
}

interface LucideIconSet {
  icons: Record<string, LucideIcon>
  aliases?: Record<string, LucideAlias>
  width?: number
  height?: number
}

export interface InlineIcon {
  body: string
  viewBox: string
}

let iconSetPromise: Promise<LucideIconSet> | undefined
const inlineIconCache = new Map<string, InlineIcon | undefined>()

function normalizeSvgBody(body: string) {
  if (typeof DOMParser === 'undefined' || !body.includes('<path')) {
    return body
  }

  const document = new DOMParser().parseFromString(
    `<svg>${body}</svg>`,
    'image/svg+xml'
  )

  for (const path of document.querySelectorAll('path[d]')) {
    if (path.getAttribute('fill') !== 'none' || !path.hasAttribute('stroke')) {
      continue
    }

    const pathData = path.getAttribute('d')
    if (!pathData) continue

    const subpaths = pathData.split(/(?=[Mm])/).filter(Boolean)
    if (subpaths.length < 2) continue

    const fragment = document.createDocumentFragment()
    for (const subpath of subpaths) {
      const clone = path.cloneNode(true) as SVGPathElement
      clone.setAttribute('d', subpath.trim())
      fragment.append(clone)
    }

    path.replaceWith(fragment)
  }

  return document.documentElement.innerHTML
}

function loadIconSet() {
  iconSetPromise ??= import('@iconify-json/lucide/icons.json').then(
    ({ default: iconSet }) => iconSet as LucideIconSet
  )
  return iconSetPromise
}

function resolveIcon(
  iconSet: LucideIconSet,
  name: string,
  visited = new Set<string>()
): LucideIcon | undefined {
  if (visited.has(name)) return undefined
  visited.add(name)

  const icon = iconSet.icons[name]
  if (icon) return icon

  const alias = iconSet.aliases?.[name]
  if (!alias) return undefined

  const parent = resolveIcon(iconSet, alias.parent, visited)
  if (!parent) return undefined

  return {
    body: `${parent.body}${alias.body ?? ''}`,
    width: alias.width ?? parent.width,
    height: alias.height ?? parent.height,
  }
}

export async function loadLucideIcon(
  iconName: string
): Promise<InlineIcon | undefined> {
  const match = iconName.match(/^i-lucide:(.+)$/)
  if (!match) return undefined
  if (inlineIconCache.has(iconName)) return inlineIconCache.get(iconName)

  const iconSet = await loadIconSet()
  const icon = resolveIcon(iconSet, match[1])
  if (!icon) {
    inlineIconCache.set(iconName, undefined)
    return undefined
  }

  const width = icon.width ?? iconSet.width ?? 24
  const height = icon.height ?? iconSet.height ?? 24

  const inlineIcon = {
    body: normalizeSvgBody(icon.body),
    viewBox: `0 0 ${width} ${height}`,
  }

  inlineIconCache.set(iconName, inlineIcon)
  return inlineIcon
}
