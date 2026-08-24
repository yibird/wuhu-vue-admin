import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = resolve(import.meta.dirname, '..')
const testsRoot = join(root, 'tests')

function collectTests(directory) {
  const files = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...collectTests(path))
    else if (entry.name.endsWith('.test.ts')) files.push(path)
  }
  return files
}

let tests
try {
  tests = collectTests(testsRoot)
} catch {
  tests = []
}

if (tests.length === 0) {
  console.error('Unit test gate failed: no *.test.ts files were found.')
  process.exit(1)
}

const result = spawnSync(process.execPath, ['--test', ...tests], {
  cwd: root,
  stdio: 'inherit',
})

if (result.error) throw result.error
process.exit(result.status ?? 1)
