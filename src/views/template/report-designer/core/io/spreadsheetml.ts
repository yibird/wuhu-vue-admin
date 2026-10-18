import type { CellStyle, NumberFormat } from '../../types'
import type { ExportCell, ExportSheet } from '../adapters/export-model'
import { parseFormula } from '../formula/parser'
import type { FormulaNode } from '../formula/ast'
import { escapeXml } from './download'

const NUM_FORMATS: Record<NumberFormat, string> = {
  general: '',
  number: '#,##0.00',
  currency: '¥#,##0.00',
  percent: '0.00%',
  date: 'yyyy-mm-dd',
  datetime: 'yyyy-mm-dd hh:mm:ss',
}

/**
 * 生成 Excel 兼容 SpreadsheetML
 * @param sheet 导出工作表
 * @returns XML 文本
 */
export function createSpreadsheetMl(sheet: ExportSheet) {
  const styleMap = new Map<string, { id: string; cell: ExportCell }>()
  let styleIndex = 0

  sheet.cells.forEach((cell) => {
    if (cell.covered) return
    const key = `${JSON.stringify(cell.style)}|${cell.numberPattern ?? ''}`
    if (styleMap.has(key)) return
    styleIndex += 1
    styleMap.set(key, { id: `s${styleIndex}`, cell })
  })

  const stylesXml = [...styleMap.values()]
    .map(
      ({ id, cell }) => `<Style ss:ID="${id}">
${styleFont(cell.style)}${styleInterior(cell.style)}${styleBorders(cell.style)}${styleAlignment(cell.style)}${styleNumberFormat(cell)}
</Style>`
    )
    .join('')

  const columns: string[] = []
  for (let col = 0; col < sheet.colCount; col += 1) {
    const width = sheet.colWidths[col]
    if (!width) continue
    columns.push(
      `<Column ss:Index="${col + 1}" ss:AutoFitWidth="0" ss:Width="${Math.max(
        1,
        Math.round(width * 0.75)
      )}"/>`
    )
  }

  const rows: string[] = []
  for (let row = 0; row < sheet.rowCount; row += 1) {
    const cells: string[] = []
    let nextCol = 0

    for (let col = 0; col < sheet.colCount; col += 1) {
      const cell = sheet.cells.get(`${row}:${col}`)
      if (!cell || cell.covered) continue
      const merge = sheet.merges.find(
        (item) => item.startRow === row && item.startColumn === col
      )
      if (
        cell.value === null &&
        !cell.formula &&
        !hasStyle(cell.style) &&
        !merge
      ) {
        continue
      }

      const gap = col - nextCol
      const attrs: string[] = []
      if (gap > 0) attrs.push(`ss:Index="${col + 1}"`)
      const style = styleMap.get(
        `${JSON.stringify(cell.style)}|${cell.numberPattern ?? ''}`
      )
      if (style) attrs.push(`ss:StyleID="${style.id}"`)
      if (merge && merge.endColumn > merge.startColumn) {
        attrs.push(`ss:MergeAcross="${merge.endColumn - merge.startColumn}"`)
      }
      if (merge && merge.endRow > merge.startRow) {
        attrs.push(`ss:MergeDown="${merge.endRow - merge.startRow}"`)
      }
      if (cell.formula) {
        attrs.push(`ss:Formula="${escapeXml(toR1C1(cell.formula))}"`)
      }

      const value = cell.value
      const isNumber = typeof value === 'number'
      const isBoolean = typeof value === 'boolean'
      const dataType = isNumber ? 'Number' : isBoolean ? 'Boolean' : 'String'
      const dataText = isNumber
        ? String(value)
        : isBoolean
          ? value
            ? '1'
            : '0'
          : escapeXml(String(value ?? cell.display ?? ''))

      cells.push(
        `<Cell ${attrs.join(' ')}><Data ss:Type="${dataType}">${dataText}</Data></Cell>`
      )
      nextCol = col + 1 + (merge ? merge.endColumn - merge.startColumn : 0)
    }

    if (!cells.length) continue
    const height = sheet.rowHeights[row]
    const rowAttr = height
      ? ` ss:Height="${Math.max(1, Math.round(height * 0.75))}"`
      : ''
    rows.push(`<Row${rowAttr}>${cells.join('')}</Row>`)
  }

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
<Styles>${stylesXml}</Styles>
<Worksheet ss:Name="${escapeXml(sheet.name)}">
<Table>
${columns.join('')}
${rows.join('')}
</Table>
${freezeOptions(sheet)}
</Worksheet>
</Workbook>`
}

function hasStyle(style: CellStyle) {
  return Object.keys(style).length > 0
}

function styleFont(style: CellStyle) {
  const attrs = [
    `ss:FontName="${escapeXml(style.fontFamily || 'Calibri')}"`,
    `ss:Size="${style.fontSize ? Math.max(1, Math.round(style.fontSize * 0.75)) : 11}"`,
    style.bold ? 'ss:Bold="1"' : '',
    style.italic ? 'ss:Italic="1"' : '',
    style.underline ? 'ss:Underline="Single"' : '',
    style.color ? `ss:Color="${escapeXml(style.color)}"` : '',
  ].filter(Boolean)
  return `<Font ${attrs.join(' ')}/>`
}

function styleInterior(style: CellStyle) {
  return style.fill
    ? `<Interior ss:Color="${escapeXml(style.fill)}" ss:Pattern="Solid"/>`
    : ''
}

function styleBorders(style: CellStyle) {
  const border = style.border
  if (!border) return ''
  const sides: Array<[string, string | undefined]> = [
    ['Top', border.top],
    ['Right', border.right],
    ['Bottom', border.bottom],
    ['Left', border.left],
  ]
  const entries = sides
    .filter(([, value]) => Boolean(value))
    .map(([position, value]) => {
      const color = extractColor(value)
      return `<Border ss:Position="${position}" ss:LineStyle="Continuous"${
        color ? ` ss:Color="${color}"` : ''
      }/>`
    })
  return entries.length ? `<Borders>${entries.join('')}</Borders>` : ''
}

function styleAlignment(style: CellStyle) {
  if (!style.align && !style.valign) return ''
  const horizontal =
    style.align === 'center'
      ? 'Center'
      : style.align === 'right'
        ? 'Right'
        : style.align === 'left'
          ? 'Left'
          : undefined
  const vertical =
    style.valign === 'middle'
      ? 'Center'
      : style.valign === 'bottom'
        ? 'Bottom'
        : style.valign === 'top'
          ? 'Top'
          : undefined
  const attrs = [
    horizontal ? `ss:Horizontal="${horizontal}"` : '',
    vertical ? `ss:Vertical="${vertical}"` : '',
    'ss:WrapText="1"',
  ].filter(Boolean)
  return `<Alignment ${attrs.join(' ')}/>`
}

function styleNumberFormat(cell: ExportCell) {
  const format =
    cell.numberPattern ??
    (cell.style.numFmt ? NUM_FORMATS[cell.style.numFmt] : undefined)
  return format ? `<NumberFormat ss:Format="${escapeXml(format)}"/>` : ''
}

function freezeOptions(sheet: ExportSheet) {
  if (!sheet.freezeRows && !sheet.freezeCols) return ''
  const panes: string[] = ['<FrozenNoSplit/>']
  if (sheet.freezeRows) {
    panes.push(`<SplitHorizontal>${sheet.freezeRows}</SplitHorizontal>`)
    panes.push(`<TopRowBottomPane>${sheet.freezeRows}</TopRowBottomPane>`)
  }
  if (sheet.freezeCols) {
    panes.push(`<SplitVertical>${sheet.freezeCols}</SplitVertical>`)
    panes.push(`<LeftColumnRightPane>${sheet.freezeCols}</LeftColumnRightPane>`)
  }
  panes.push('<ActivePane>0</ActivePane>')
  return `<WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes>${panes.join(
    ''
  )}</FreezePanes></WorksheetOptions>`
}

function extractColor(value?: string) {
  if (!value) return undefined
  const hex = /#([0-9a-f]{3}|[0-9a-f]{6})/i.exec(value)
  if (hex) return `#${hex[1]}`
  const rgb = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(value)
  if (rgb) {
    return `#${[rgb[1], rgb[2], rgb[3]]
      .map((part) => Number(part).toString(16).padStart(2, '0'))
      .join('')}`
  }
  return undefined
}

function toR1C1(formula: string) {
  try {
    const ast = parseFormula(formula)
    return `=${serializeR1C1(ast, 0)}`
  } catch {
    return '=#VALUE!'
  }
}

function serializeR1C1(node: FormulaNode, parentPrecedence: number): string {
  const precedence: Record<string, number> = {
    '=': 1,
    '<>': 1,
    '<': 1,
    '<=': 1,
    '>': 1,
    '>=': 1,
    '&': 2,
    '+': 3,
    '-': 3,
    '*': 4,
    '/': 4,
    '^': 5,
  }

  switch (node.kind) {
    case 'number':
      return String(node.value)
    case 'string':
      return `"${node.value.replaceAll('"', '""')}"`
    case 'boolean':
      return node.value ? 'TRUE' : 'FALSE'
    case 'error':
      return node.code
    case 'name':
      return node.name
    case 'ref': {
      const sheet = node.sheet ? `${quoteSheet(node.sheet)}!` : ''
      return `${sheet}R${node.row + 1}C${node.col + 1}`
    }
    case 'range': {
      const sheet = node.sheet ? `${quoteSheet(node.sheet)}!` : ''
      return `${sheet}R${node.startRow + 1}C${node.startCol + 1}:R${
        node.endRow + 1
      }C${node.endCol + 1}`
    }
    case 'call':
      return `${node.name}(${node.args
        .map((arg) => serializeR1C1(arg, 0))
        .join(',')})`
    case 'unary':
      return `${node.op}${serializeR1C1(node.arg, 6)}`
    case 'binary': {
      const value = precedence[node.op] ?? 0
      const content = `${serializeR1C1(node.left, value)} ${node.op} ${serializeR1C1(
        node.right,
        value + 1
      )}`
      return value < parentPrecedence ? `(${content})` : content
    }
  }
}

function quoteSheet(name: string) {
  return /[\s!]/.test(name) ? `'${name.replaceAll("'", "''")}'` : name
}
