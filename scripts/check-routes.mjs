import { readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import ts from 'typescript'

const root = resolve(import.meta.dirname, '..')
const menuFile = join(root, 'src/config/menu.ts')
const viewsRoot = join(root, 'src/views')

function normalizeRoutePath(value) {
  const normalized = `/${value}`.replaceAll('\\', '/').replace(/\/{2,}/g, '/')
  return normalized.length > 1 ? normalized.replace(/\/$/, '') : normalized
}

function collectViewRoutes(directory = viewsRoot) {
  const routes = new Set()
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = join(directory, entry.name)
    if (entry.isDirectory()) {
      const directoryPath = relative(viewsRoot, absolutePath).replaceAll(
        '\\',
        '/'
      )
      const isNestedComponentsDirectory =
        entry.name === 'components' && directoryPath !== 'components'
      if (!isNestedComponentsDirectory)
        collectViewRoutes(absolutePath).forEach((route) => routes.add(route))
      continue
    }
    if (!['.vue', '.tsx'].includes(extname(entry.name))) continue

    const filePath = relative(viewsRoot, absolutePath).replaceAll('\\', '/')
    const suffix = filePath.endsWith('/entry/index.vue')
      ? '/entry/index.vue'
      : filePath.endsWith('/entry/index.tsx')
        ? '/entry/index.tsx'
        : filePath.endsWith('/index.vue')
          ? '/index.vue'
          : filePath.endsWith('/index.tsx')
            ? '/index.tsx'
            : null
    if (suffix)
      routes.add(normalizeRoutePath(filePath.slice(0, -suffix.length)))
  }
  return routes
}

function getProperty(object, name) {
  return object.properties.find((property) => {
    if (!ts.isPropertyAssignment(property)) return false
    return property.name.getText().replace(/^['"]|['"]$/g, '') === name
  })
}

function getLiteralValue(property) {
  if (!property || !ts.isPropertyAssignment(property)) return undefined
  const { initializer } = property
  if (ts.isStringLiteralLike(initializer) || ts.isNumericLiteral(initializer)) {
    return initializer.text
  }
  if (initializer.kind === ts.SyntaxKind.TrueKeyword) return true
  if (initializer.kind === ts.SyntaxKind.FalseKeyword) return false
  return undefined
}

function collectMenuEntries(sourceFile) {
  const entries = []

  function getAncestors(node) {
    const ancestors = []
    let current = node.parent
    while (current) {
      if (ts.isObjectLiteralExpression(current)) {
        const id = Number(getLiteralValue(getProperty(current, 'id')))
        const type = Number(getLiteralValue(getProperty(current, 'type')))
        if (Number.isFinite(id) && [0, 1, 2, 3].includes(type)) {
          ancestors.unshift({ id })
        }
      }
      current = current.parent
    }
    return ancestors
  }

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const id = Number(getLiteralValue(getProperty(node, 'id')))
      const type = Number(getLiteralValue(getProperty(node, 'type')))
      const path = getLiteralValue(getProperty(node, 'path'))
      if (Number.isFinite(id) && [0, 1, 2, 3].includes(type)) {
        entries.push({
          id,
          type,
          path,
          componentPath: getLiteralValue(getProperty(node, 'componentPath')),
          disabled: getLiteralValue(getProperty(node, 'disabled')) === true,
          external: getLiteralValue(getProperty(node, 'isExternal')) === true,
          home: getLiteralValue(getProperty(node, 'home')) === true,
          rootId: Number(getLiteralValue(getProperty(node, 'rootId'))),
          parentId: Number(getLiteralValue(getProperty(node, 'parentId'))),
          level: getLiteralValue(getProperty(node, 'level')),
          ancestors: getAncestors(node),
          line:
            sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return entries
}

const sourceText = readFileSync(menuFile, 'utf8')
const sourceFile = ts.createSourceFile(
  menuFile,
  sourceText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
)
const viewRoutes = collectViewRoutes()
const menuEntries = collectMenuEntries(sourceFile)
const failures = []
const activePaths = new Map()
const menuIds = new Map()
let homeCount = 0

for (const menu of menuEntries) {
  const previousIdLine = menuIds.get(menu.id)
  if (previousIdLine) {
    failures.push(
      `menu.ts:${menu.line} duplicate menu id ${menu.id} (first at line ${previousIdLine})`
    )
  } else {
    menuIds.set(menu.id, menu.line)
  }

  const parent = menu.ancestors.at(-1)
  const root = menu.ancestors[0]
  const expectedParentId = parent?.id ?? 0
  const expectedRootId = root?.id ?? 0
  const expectedLevel = [...menu.ancestors.map(({ id }) => id), menu.id].join(
    '-'
  )
  if (menu.parentId !== expectedParentId) {
    failures.push(
      `menu.ts:${menu.line} menu ${menu.id} parentId ${menu.parentId} should be ${expectedParentId}`
    )
  }
  if (menu.rootId !== expectedRootId) {
    failures.push(
      `menu.ts:${menu.line} menu ${menu.id} rootId ${menu.rootId} should be ${expectedRootId}`
    )
  }
  if (menu.level !== expectedLevel) {
    failures.push(
      `menu.ts:${menu.line} menu ${menu.id} level ${menu.level} should be ${expectedLevel}`
    )
  }

  if (menu.home) {
    homeCount += 1
    if (menu.type !== 1) {
      failures.push(`menu.ts:${menu.line} home menu ${menu.id} must be type 1`)
    }
  }

  const externalPath =
    typeof menu.path === 'string' && /^https?:\/\//i.test(menu.path)
  if (externalPath && !menu.external) {
    failures.push(
      `menu.ts:${menu.line} external URL ${menu.path} must set isExternal: true`
    )
  }
  if (menu.external && !/^https:\/\//i.test(menu.path ?? '')) {
    failures.push(
      `menu.ts:${menu.line} external menu ${menu.id} must use an HTTPS URL`
    )
  }

  if (![1, 2].includes(menu.type)) continue
  if (typeof menu.path !== 'string' || !menu.path) {
    failures.push(`menu.ts:${menu.line} route menu ${menu.id} is missing path`)
    continue
  }
  if (menu.disabled || externalPath) continue
  const routePath = normalizeRoutePath(menu.path)
  const target = normalizeRoutePath(menu.componentPath ?? routePath)
  if (!viewRoutes.has(target)) {
    failures.push(`menu.ts:${menu.line} ${routePath} -> missing view ${target}`)
  }
  const previousLine = activePaths.get(routePath)
  if (previousLine) {
    failures.push(
      `menu.ts:${menu.line} duplicate route path ${routePath} (first at line ${previousLine})`
    )
  } else {
    activePaths.set(routePath, menu.line)
  }
}

if (homeCount !== 1) {
  failures.push(
    `menu catalog must contain exactly one home route (found ${homeCount})`
  )
}

if (failures.length) {
  console.error('Route contract check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    `Route contract check passed (${menuIds.size} menus, ${activePaths.size} active routes).`
  )
}
