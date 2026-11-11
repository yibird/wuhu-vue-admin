/**
 * 手动字体子集化脚本
 *
 * 用法:
 *   pnpm fonts:optimize
 *
 * 产物会写入 src/assets/fonts/generated/ 和 src/styles/fonts.extended.css,
 * 这两个位置的输出需要一起提交。内容/字重/特性发生变化后重新运行即可。
 *
 * 策略:
 * - core: ASCII + 站点常用标点 + 当前内容实际用到的非 ASCII 字符, 由 fontless 预加载
 * - extended: Latin-1 + Latin Extended-A, 通过 unicode-range 按需加载
 * - 仅保留默认排版特性以及 tabular-nums 需要的 tnum
 * - 保留完整变量轴与 hinting: 收窄轴/去 hinting 会改变字宽或栅格化结果,
 *   与"渲染保持不变"冲突; 详见最终报告中的取舍说明
 * - Lato 受 OFL Reserved Font Name 约束, 子集后重命名字体内部名称
 *
 * 不参与构建流程, 仅在手动执行时处理字体。
 */
import * as fontkit from 'fontkit'
import subsetFont from 'subset-font'
import wawoff2 from 'wawoff2'
import { createHash } from 'node:crypto'
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(process.cwd())
const FONT_DIR = join(ROOT, 'src/assets/fonts')
const OUT_DIR = join(FONT_DIR, 'generated')
const EXTENDED_CSS = join(ROOT, 'src/styles/fonts.extended.css')

const KEEP_FEATURES = [
  'ccmp',
  'locl',
  'liga',
  'calt',
  'rvrn',
  'kern',
  'mark',
  'mkmk',
  // tabular-nums / font-variant-numeric: tabular-nums
  'tnum',
]

const CORE_PUNCTUATION = [
  0x00a0, // nbsp: antdv 输入框/选择器会通过伪元素渲染, 避免触发 extended
  0x2013, // en dash
  0x2014, // em dash
  0x2018, // left single quote
  0x2019, // right single quote
  0x201c, // left double quote
  0x201d, // right double quote
  0x2026, // ellipsis
]

const PRESERVE_NAME_IDS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
]

const FONTS = [
  {
    source: 'OutfitVariable.woff2',
    family: 'Outfit',
    file: 'Outfit',
    weight: '400 900',
    // 保留完整轴: 收窄轴会重新基准化 gvar 增量,
    // 实测反而更大且产生 0.1-0.4px 的字宽变化
    features: KEEP_FEATURES,
    preload: true,
  },
  {
    source: 'DMSansVariable.woff2',
    family: 'DM Sans',
    file: 'DMSans',
    weight: '400 900',
    // 收窄轴可省约 9KB, 但会改变字宽; 默认保持渲染一致
    features: KEEP_FEATURES,
  },
  {
    source: 'InterVariable.woff2',
    family: 'Inter Variable',
    file: 'Inter',
    weight: '400 900',
    // 收窄轴可省约 6KB, 但会改变字宽; 默认保持渲染一致
    features: KEEP_FEATURES,
  },
  {
    source: 'SpaceGroteskVariable.woff2',
    family: 'Space Grotesk',
    file: 'SpaceGrotesk',
    weight: '400 700',
    features: KEEP_FEATURES,
  },
  {
    source: 'RobotoMonoVariable.woff2',
    family: 'Roboto Mono',
    file: 'RobotoMono',
    weight: '400 700',
    // 收窄轴可省约 6KB, 但实测会改变栅格化结果; 默认保持渲染一致
    features: KEEP_FEATURES,
  },
  {
    source: 'LatoRegular.woff2',
    family: 'Lato',
    file: 'Lato',
    weight: '400',
    features: ['liga', 'kern'],
    // OFL-RFN: 修改后的字体不得继续使用 "Lato" 作为内部名称
    rename: {
      1: 'Lato Subset',
      2: 'Regular',
      3: 'Lato Subset Regular',
      4: 'Lato Subset Regular',
      6: 'LatoSubset-Regular',
      16: 'Lato Subset',
      17: 'Regular',
    },
  },
]

const SOURCE_ROOTS = ['src', 'mock', 'index.html']
const SOURCE_EXT = /\.(vue|ts|tsx|js|mjs|json|css|less|html|md)$/
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  'bones',
  'assets',
  'generated',
])

function* walk(path) {
  const entry = statSync(path)
  if (entry.isFile()) {
    if (SOURCE_EXT.test(path)) yield path
    return
  }
  for (const item of readdirSync(path, { withFileTypes: true })) {
    if (SKIP_DIRS.has(item.name)) continue
    yield* walk(join(path, item.name))
  }
}

function collectUsedChars() {
  const chars = new Set()
  for (const root of SOURCE_ROOTS) {
    for (const file of walk(join(ROOT, root))) {
      for (const ch of readFileSync(file, 'utf8')) {
        const cp = ch.codePointAt(0)
        if (cp >= 0x20 && cp !== 0x7f) chars.add(cp)
      }
    }
  }
  return chars
}

function formatUnicodeRange(codepoints) {
  const sorted = [...codepoints].sort((a, b) => a - b)
  const parts = []
  let start = null
  let previous = null
  const flush = () => {
    if (start === null) return
    const from = start.toString(16).toUpperCase().padStart(4, '0')
    const to = previous.toString(16).toUpperCase().padStart(4, '0')
    parts.push(start === previous ? `U+${from}` : `U+${from}-${to}`)
  }
  for (const cp of sorted) {
    if (start === null) {
      start = previous = cp
      continue
    }
    if (cp === previous + 1) {
      previous = cp
      continue
    }
    flush()
    start = previous = cp
  }
  flush()
  return parts.join(', ')
}

function toText(codepoints) {
  return [...codepoints]
    .sort((a, b) => a - b)
    .map((cp) => String.fromCodePoint(cp))
    .join('')
}

// ── SFNT name table patching (only used for OFL RFN fonts) ──────────────────

function checksum(buffer) {
  const length = (buffer.length + 3) & ~3
  let sum = 0
  for (let i = 0; i < length; i += 4) {
    let word = 0
    for (let j = 0; j < 4; j++) word = word * 256 + (buffer[i + j] ?? 0)
    sum = (sum + word) >>> 0
  }
  return sum >>> 0
}

function decodeName(platformID, data) {
  if (platformID === 1) return Buffer.from(data).toString('latin1')
  const copy = Buffer.from(data)
  if (copy.length % 2 === 0) copy.swap16()
  return copy.toString('utf16le')
}

function encodeName(platformID, value) {
  if (platformID === 1) return Buffer.from(value, 'latin1')
  const out = Buffer.from(value, 'utf16le')
  out.swap16()
  return out
}

function patchNameTable(name, replacements) {
  const count = name.readUInt16BE(2)
  const stringOffset = name.readUInt16BE(4)
  const records = []
  for (let i = 0; i < count; i++) {
    const offset = 6 + 12 * i
    const platformID = name.readUInt16BE(offset)
    const length = name.readUInt16BE(offset + 8)
    const stringStart = name.readUInt16BE(offset + 10)
    records.push({
      platformID,
      encodingID: name.readUInt16BE(offset + 2),
      languageID: name.readUInt16BE(offset + 4),
      nameID: name.readUInt16BE(offset + 6),
      value: decodeName(
        platformID,
        name.subarray(
          stringOffset + stringStart,
          stringOffset + stringStart + length
        )
      ),
    })
  }
  for (const record of records) {
    if (replacements[record.nameID] !== undefined) {
      record.value = replacements[record.nameID]
    }
  }
  for (const id of [16, 17]) {
    if (replacements[id] === undefined) continue
    if (
      !records.some((record) => record.nameID === id && record.platformID === 3)
    ) {
      records.push({
        platformID: 3,
        encodingID: 1,
        languageID: 0x409,
        nameID: id,
        value: replacements[id],
      })
    }
  }
  records.sort(
    (a, b) =>
      a.platformID - b.platformID ||
      a.encodingID - b.encodingID ||
      a.languageID - b.languageID ||
      a.nameID - b.nameID
  )
  const encoded = records.map((record) => ({
    ...record,
    data: encodeName(record.platformID, record.value),
  }))
  const headerSize = 6 + encoded.length * 12
  const out = Buffer.alloc(
    headerSize + encoded.reduce((sum, record) => sum + record.data.length, 0)
  )
  out.writeUInt16BE(0, 0)
  out.writeUInt16BE(encoded.length, 2)
  out.writeUInt16BE(headerSize, 4)
  let cursor = 0
  encoded.forEach((record, index) => {
    const offset = 6 + index * 12
    out.writeUInt16BE(record.platformID, offset)
    out.writeUInt16BE(record.encodingID, offset + 2)
    out.writeUInt16BE(record.languageID, offset + 4)
    out.writeUInt16BE(record.nameID, offset + 6)
    out.writeUInt16BE(record.data.length, offset + 8)
    out.writeUInt16BE(cursor, offset + 10)
    record.data.copy(out, headerSize + cursor)
    cursor += record.data.length
  })
  return out
}

function parseSfnt(buffer) {
  const numTables = buffer.readUInt16BE(4)
  const tables = []
  for (let i = 0; i < numTables; i++) {
    const offset = 12 + 16 * i
    const tableOffset = buffer.readUInt32BE(offset + 8)
    const length = buffer.readUInt32BE(offset + 12)
    tables.push({
      tag: buffer.toString('latin1', offset, offset + 4),
      data: Buffer.from(buffer.subarray(tableOffset, tableOffset + length)),
    })
  }
  return { version: buffer.readUInt32BE(0), tables }
}

function buildSfnt({ version, tables }) {
  const numTables = tables.length
  const entrySelector = Math.floor(Math.log2(numTables))
  const searchRange = 16 * 2 ** entrySelector
  let cursor = 12 + 16 * numTables
  const entries = []
  for (const table of tables) {
    if (table.tag === 'head' && table.data.length >= 12) {
      table.data.writeUInt32BE(0, 8)
    }
    while (cursor % 4 !== 0) cursor++
    entries.push({
      ...table,
      offset: cursor,
      checksum: checksum(table.data),
    })
    cursor += table.data.length
  }
  const out = Buffer.alloc(cursor)
  out.writeUInt32BE(version, 0)
  out.writeUInt16BE(numTables, 4)
  out.writeUInt16BE(searchRange, 6)
  out.writeUInt16BE(entrySelector, 8)
  out.writeUInt16BE(16 * numTables - searchRange, 10)
  entries.forEach((entry, index) => {
    const offset = 12 + 16 * index
    out.write(entry.tag, offset, 4, 'latin1')
    out.writeUInt32BE(entry.checksum, offset + 4)
    out.writeUInt32BE(entry.offset, offset + 8)
    out.writeUInt32BE(entry.data.length, offset + 12)
    entry.data.copy(out, entry.offset)
  })
  const head = entries.find((entry) => entry.tag === 'head')
  if (head) {
    const adjustment = (0xb1b0afba - checksum(out)) >>> 0
    out.writeUInt32BE(adjustment, head.offset + 8)
    head.data.writeUInt32BE(adjustment, 8)
    out.writeUInt32BE(checksum(head.data), 12 + entries.indexOf(head) * 16 + 4)
  }
  return out
}

async function renameFont(buffer, replacements) {
  const decompressed = await wawoff2.decompress(buffer)
  const sfnt = parseSfnt(Buffer.from(decompressed))
  const nameTable = sfnt.tables.find((table) => table.tag === 'name')
  if (!nameTable) throw new Error('name table not found')
  nameTable.data = patchNameTable(nameTable.data, replacements)
  return Buffer.from(await wawoff2.compress(buildSfnt(sfnt)))
}

// ── Main ────────────────────────────────────────────────────────────────────

rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })

const usedChars = collectUsedChars()
console.log(`scanned ${usedChars.size} distinct characters\n`)

const manifestFonts = []
const cssBlocks = [
  '/* Auto-generated by scripts/optimize-fonts.mjs — do not edit. */',
  '/* Run `pnpm fonts:optimize` after content, weight or feature changes. */',
  '',
]

for (const config of FONTS) {
  const sourcePath = join(FONT_DIR, config.source)
  let sourceBuffer = readFileSync(sourcePath)
  const sourceSize = sourceBuffer.length
  const sourceFont = fontkit.create(sourceBuffer)
  if (config.rename)
    sourceBuffer = await renameFont(sourceBuffer, config.rename)

  const coreSet = new Set()
  for (let cp = 0x20; cp <= 0x7e; cp++) coreSet.add(cp)
  for (const cp of CORE_PUNCTUATION) coreSet.add(cp)
  for (const cp of usedChars) {
    if (sourceFont.hasGlyphForCodePoint(cp)) coreSet.add(cp)
  }
  const extendedSet = new Set()
  for (let cp = 0xa0; cp <= 0xff; cp++) {
    if (sourceFont.hasGlyphForCodePoint(cp) && !coreSet.has(cp)) {
      extendedSet.add(cp)
    }
  }
  for (let cp = 0x100; cp <= 0x17f; cp++) {
    if (sourceFont.hasGlyphForCodePoint(cp) && !coreSet.has(cp)) {
      extendedSet.add(cp)
    }
  }
  for (const cp of usedChars) {
    if (sourceFont.hasGlyphForCodePoint(cp) && !coreSet.has(cp)) {
      extendedSet.add(cp)
    }
  }

  const coreText = toText(
    [...coreSet].filter((cp) => sourceFont.hasGlyphForCodePoint(cp))
  )
  const extendedText = toText(
    [...extendedSet].filter((cp) => sourceFont.hasGlyphForCodePoint(cp))
  )

  const subsetOptions = {
    targetFormat: 'woff2',
    keepFeatures: config.features,
    // 保留 hinting: 实测只占 0-12B, 但在 Windows 上会改变栅格化结果
    preserveNameIds: PRESERVE_NAME_IDS,
  }
  if (config.axes) subsetOptions.variationAxes = config.axes

  const coreData = Buffer.from(
    await subsetFont(sourceBuffer, coreText, subsetOptions)
  )
  const extendedData = Buffer.from(
    await subsetFont(sourceBuffer, extendedText, subsetOptions)
  )

  // 文件名带内容指纹: fontless 的产物 URL 只由源文件路径决定,
  // 同名覆盖不会刷新浏览器缓存
  const hash = (buffer) =>
    createHash('sha256').update(buffer).digest('hex').slice(0, 8)
  const coreFile = `${config.file}Core.${hash(coreData)}.woff2`
  const extendedFile = `${config.file}Extended.${hash(extendedData)}.woff2`
  writeFileSync(join(OUT_DIR, coreFile), coreData)
  writeFileSync(join(OUT_DIR, extendedFile), extendedData)

  const coreFont = fontkit.create(readFileSync(join(OUT_DIR, coreFile)))
  const extendedFont = fontkit.create(readFileSync(join(OUT_DIR, extendedFile)))
  const missingCore = [...coreSet].filter(
    (cp) =>
      sourceFont.hasGlyphForCodePoint(cp) && !coreFont.hasGlyphForCodePoint(cp)
  )
  const missingExtended = [...extendedSet].filter(
    (cp) =>
      sourceFont.hasGlyphForCodePoint(cp) &&
      !extendedFont.hasGlyphForCodePoint(cp)
  )
  if (missingCore.length || missingExtended.length) {
    throw new Error(
      `${config.family}: subset is missing codepoints core=${missingCore.length} extended=${missingExtended.length}`
    )
  }
  if (config.rename && coreFont.familyName !== config.rename[1]) {
    throw new Error(`${config.family}: reserved name was not replaced`)
  }

  const coreRange = formatUnicodeRange(
    [...coreSet].filter((cp) => coreFont.hasGlyphForCodePoint(cp))
  )
  const extendedRange = formatUnicodeRange(
    [...extendedSet].filter((cp) => extendedFont.hasGlyphForCodePoint(cp))
  )

  manifestFonts.push({
    family: config.family,
    weight: config.weight,
    source: config.source,
    sourceBytes: sourceSize,
    sourceGlyphs: sourceFont.numGlyphs,
    axes: config.axes ?? {},
    preload: config.preload === true,
    core: {
      file: coreFile,
      bytes: coreData.length,
      glyphs: coreFont.numGlyphs,
      unicodeRange: coreRange,
    },
    extended: {
      file: extendedFile,
      bytes: extendedData.length,
      glyphs: extendedFont.numGlyphs,
      unicodeRange: extendedRange,
    },
  })

  cssBlocks.push(
    `@font-face {
  font-family: '${config.family}';
  src: url('../assets/fonts/generated/${extendedFile}') format('woff2');
  font-style: normal;
  font-weight: ${config.weight};
  font-display: swap;
  unicode-range: ${extendedRange};
}`,
    ''
  )

  console.log(
    `${config.family.padEnd(14)} ${String(sourceSize).padStart(6)}B -> core ${String(coreData.length).padStart(6)}B + extended ${String(extendedData.length).padStart(6)}B`
  )
}

writeFileSync(
  join(OUT_DIR, 'font-manifest.json'),
  `${JSON.stringify({ fonts: manifestFonts }, null, 2)}\n`
)
writeFileSync(EXTENDED_CSS, `${cssBlocks.join('\n').trim()}\n`)

console.log(`\nwrote ${OUT_DIR}`)
console.log(`wrote ${EXTENDED_CSS}`)
