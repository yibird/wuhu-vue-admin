import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const KiB = 1024
const MiB = KiB * KiB
const distDir = resolve(process.argv[2] ?? 'dist')
const assetsDir = join(distDir, 'assets')
const indexPath = join(distDir, 'index.html')
const manifestPath = join(distDir, '.vite', 'manifest.json')

const budgets = {
  initialJs: readBudget('BUNDLE_INITIAL_JS_GZIP_MAX', 700 * KiB),
  initialCss: readBudget('BUNDLE_INITIAL_CSS_GZIP_MAX', 100 * KiB),
  singleJs: readBudget('BUNDLE_SINGLE_JS_GZIP_MAX', 3 * MiB),
  totalJs: readBudget('BUNDLE_TOTAL_JS_GZIP_MAX', 5 * MiB),
}

if (
  !existsSync(indexPath) ||
  !existsSync(assetsDir) ||
  !existsSync(manifestPath)
) {
  fail(`Build output not found at ${distDir}. Run pnpm build first.`)
}

const html = readFileSync(indexPath, 'utf8')
const directInitialJsFiles = collectHtmlAssets(html, [
  /<script\b[^>]*\bsrc=["']([^"']+\.js)["'][^>]*>/gi,
  /<link\b[^>]*\brel=["']modulepreload["'][^>]*\bhref=["']([^"']+\.js)["'][^>]*>/gi,
])
const directInitialCssFiles = collectHtmlAssets(html, [
  /<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+\.css)["'][^>]*>/gi,
])
const jsFiles = readdirSync(assetsDir)
  .filter((file) => extname(file) === '.js')
  .map((file) => join(assetsDir, file))

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const manifestInitialAssets = collectManifestAssets(manifest, 'index.html')
const initialJsFiles = mergeFiles(
  directInitialJsFiles,
  manifestInitialAssets.js
)
const initialCssFiles = mergeFiles(
  directInitialCssFiles,
  manifestInitialAssets.css
)
const directInitialJsSize = sumGzip(directInitialJsFiles)
const initialJsSize = sumGzip(initialJsFiles)
const initialCssSize = sumGzip(initialCssFiles)
const totalJsSize = sumGzip(jsFiles)
const largestJs = jsFiles
  .map((file) => ({ file, size: gzipSize(file) }))
  .sort((left, right) => right.size - left.size)[0]

const checks = [
  checkBudget('Recursive initial JS', initialJsSize, budgets.initialJs),
  checkBudget('Initial CSS', initialCssSize, budgets.initialCss),
  checkBudget('Largest JS chunk', largestJs?.size ?? 0, budgets.singleJs),
  checkBudget('Total JS', totalJsSize, budgets.totalJs),
]

console.table(
  checks.map((check) => ({
    metric: check.label,
    actual: formatSize(check.actual),
    budget: formatSize(check.budget),
    status: check.passed ? 'PASS' : 'FAIL',
  }))
)

console.log(`HTML direct JS: ${formatSize(directInitialJsSize)}`)
console.log(`Recursive initial chunks: ${initialJsFiles.length}`)

if (largestJs) {
  console.log(`Largest chunk: ${largestJs.file.replace(`${distDir}\\`, '')}`)
}

const failures = checks.filter((check) => !check.passed)
if (failures.length) {
  fail(
    `Bundle budget exceeded: ${failures.map((item) => item.label).join(', ')}`
  )
}

function readBudget(name, fallback) {
  const value = Number(process.env[name])
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function collectHtmlAssets(source, patterns) {
  const files = new Set()
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const pathname = match[1]?.split(/[?#]/, 1)[0]
      if (!pathname) continue
      const relativePath = pathname.replace(/^\/+/, '')
      const file = join(distDir, relativePath)
      if (existsSync(file) && statSync(file).isFile()) files.add(file)
    }
  }
  return [...files]
}

function collectManifestAssets(manifest, rootKey) {
  const js = new Set()
  const css = new Set()
  const visited = new Set()
  const pending = [rootKey]

  while (pending.length) {
    const key = pending.pop()
    if (!key || visited.has(key)) continue
    visited.add(key)

    const entry = manifest[key]
    if (!entry) continue
    if (entry.file?.endsWith('.js')) addManifestFile(js, entry.file)
    for (const file of entry.css ?? []) addManifestFile(css, file)
    for (const dependency of entry.imports ?? []) pending.push(dependency)
  }

  return { js: [...js], css: [...css] }
}

function addManifestFile(files, relativePath) {
  const file = join(distDir, relativePath)
  if (existsSync(file) && statSync(file).isFile()) files.add(file)
}

function mergeFiles(...groups) {
  return [...new Set(groups.flat())]
}

function gzipSize(file) {
  return gzipSync(readFileSync(file), { level: 9 }).byteLength
}

function sumGzip(files) {
  return files.reduce((total, file) => total + gzipSize(file), 0)
}

function checkBudget(label, actual, budget) {
  return { label, actual, budget, passed: actual <= budget }
}

function formatSize(bytes) {
  return `${(bytes / KiB).toFixed(1)} KiB`
}

function fail(message) {
  console.error(message)
  process.exit(1)
}
