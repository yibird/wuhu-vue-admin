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

function collectMenuRoutes(sourceFile) {
  const routes = []
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const type = Number(getLiteralValue(getProperty(node, 'type')))
      const path = getLiteralValue(getProperty(node, 'path'))
      if ([1, 2].includes(type) && typeof path === 'string') {
        routes.push({
          path,
          componentPath: getLiteralValue(getProperty(node, 'componentPath')),
          disabled: getLiteralValue(getProperty(node, 'disabled')) === true,
          line:
            sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return routes
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
const menuRoutes = collectMenuRoutes(sourceFile)
const failures = []
const activePaths = new Map()

for (const menu of menuRoutes) {
  if (menu.disabled || /^https?:\/\//i.test(menu.path)) continue
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

if (failures.length) {
  console.error('Route contract check failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    `Route contract check passed (${activePaths.size} active menu routes).`
  )
}
