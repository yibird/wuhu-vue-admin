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
const iconCache = new Map<string, InlineIcon | undefined>()

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
  const match = /^i-lucide:(.+)$/.exec(iconName)
  if (!match) return undefined

  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)
  }

  const iconSet = await loadIconSet()
  const icon = resolveIcon(iconSet, match[1])

  if (!icon) {
    iconCache.set(iconName, undefined)
    return undefined
  }

  const width = icon.width ?? iconSet.width ?? 24
  const height = icon.height ?? iconSet.height ?? 24

  const result: InlineIcon = {
    body: icon.body,
    viewBox: `0 0 ${width} ${height}`,
  }
  iconCache.set(iconName, result)
  return result
}
