import {
  BooleanNumber,
  LocaleType,
  getSheetsEmptySnapshot,
  type ICellData,
  type IWorkbookData,
  type IWorksheetData,
} from '@univerjs/core'
import {
  DEFAULT_COL_WIDTH,
  DEFAULT_ROW_HEIGHT,
  SCHEMA_VERSION,
  type CellStyle,
  type DataRegion,
  type PrintSettings,
  type ReportDocument,
  type ReportMeta,
} from '../types'
import { legacyStyleToUniver } from '../core/adapters/snapshot'
import { createId } from '../core/util/id'
import { sampleDatasets } from './sample-datasets'

const PRINT_LANDSCAPE: PrintSettings = {
  paper: 'A4',
  orientation: 'landscape',
  margins: [12, 12, 12, 12],
}

const PRINT_PORTRAIT: PrintSettings = {
  paper: 'A4',
  orientation: 'portrait',
  margins: [12, 12, 12, 12],
}

interface StyleSet {
  workbook: IWorkbookData
  add: (style: CellStyle) => string
}

function createStyleSet(workbook: IWorkbookData): StyleSet {
  return {
    workbook,
    add(style) {
      const id = createId('style')
      workbook.styles[id] = legacyStyleToUniver(style)
      return id
    },
  }
}

function createSheet(
  id: string,
  name: string,
  rowCount: number,
  columnCount: number
): IWorksheetData {
  return {
    id,
    name,
    tabColor: '',
    hidden: BooleanNumber.FALSE,
    freeze: { startRow: 0, startColumn: 0, xSplit: 0, ySplit: 0 },
    rowCount,
    columnCount,
    zoomRatio: 1,
    scrollTop: 0,
    scrollLeft: 0,
    defaultColumnWidth: DEFAULT_COL_WIDTH,
    defaultRowHeight: DEFAULT_ROW_HEIGHT,
    mergeData: [],
    cellData: {},
    rowData: {},
    columnData: {},
    rowHeader: { width: 46, hidden: BooleanNumber.FALSE },
    columnHeader: { height: 24, hidden: BooleanNumber.FALSE },
    showGridlines: BooleanNumber.TRUE,
    rightToLeft: BooleanNumber.FALSE,
  }
}

function border() {
  return {
    top: '1px solid #e2e8f0',
    right: '1px solid #e2e8f0',
    bottom: '1px solid #e2e8f0',
    left: '1px solid #e2e8f0',
  }
}

/**
 * 创建默认报表文档
 * @returns 可直接编辑并预览的示例报表
 */
export function createDefaultDocument(): ReportDocument {
  const sheetId = createId('sheet')
  const helpSheetId = createId('sheet')
  const workbook = getSheetsEmptySnapshot(
    createId('workbook'),
    LocaleType.ZH_CN,
    '销售明细报表'
  )
  const sheet = createSheet(sheetId, '销售报表', 200, 12)
  const helpSheet = createSheet(helpSheetId, '参数与说明', 80, 8)
  const styles = createStyleSet(workbook)

  const titleStyle = styles.add({
    fontSize: 18,
    bold: true,
    align: 'center',
    valign: 'middle',
    color: '#1f2937',
  })
  const headerStyle = styles.add({
    bold: true,
    align: 'center',
    valign: 'middle',
    fill: '#e8f1ff',
    color: '#1f2937',
    border: {
      top: '1px solid #cbd5e1',
      right: '1px solid #cbd5e1',
      bottom: '1px solid #cbd5e1',
      left: '1px solid #cbd5e1',
    },
  })
  const groupHeaderStyle = styles.add({
    bold: true,
    fill: '#f1f5f9',
    color: '#334155',
    border: {
      top: '1px solid #e2e8f0',
      right: '1px solid #e2e8f0',
      bottom: '1px solid #e2e8f0',
      left: '1px solid #e2e8f0',
    },
  })
  const detailStyle = styles.add({
    align: 'left',
    valign: 'middle',
    border: {
      top: '1px solid #eef2f7',
      right: '1px solid #eef2f7',
      bottom: '1px solid #eef2f7',
      left: '1px solid #eef2f7',
    },
  })
  const amountStyle = styles.add({
    align: 'right',
    valign: 'middle',
    numFmt: 'currency',
    border: {
      top: '1px solid #eef2f7',
      right: '1px solid #eef2f7',
      bottom: '1px solid #eef2f7',
      left: '1px solid #eef2f7',
    },
  })
  const footerStyle = styles.add({
    bold: true,
    fill: '#fafafa',
    align: 'right',
    border: {
      top: '1px solid #e2e8f0',
      right: '1px solid #e2e8f0',
      bottom: '1px solid #e2e8f0',
      left: '1px solid #e2e8f0',
    },
  })
  const totalStyle = styles.add({
    bold: true,
    fill: '#fff7e6',
    color: '#b45309',
    align: 'right',
    numFmt: 'currency',
    border: {
      top: '1px solid #fed7aa',
      right: '1px solid #fed7aa',
      bottom: '1px solid #fed7aa',
      left: '1px solid #fed7aa',
    },
  })
  const hintStyle = styles.add({ color: '#64748b', italic: true })

  sheet.columnData = {
    0: { w: 150 },
    1: { w: 110 },
    2: { w: 90 },
    3: { w: 190 },
    4: { w: 150 },
    5: { w: 80 },
    6: { w: 130 },
  }
  sheet.rowData = {
    0: { h: 44 },
    2: { h: 32 },
    3: { h: 30 },
    4: { h: 30 },
    5: { h: 34 },
  }
  sheet.freeze = { startRow: 2, startColumn: 0, xSplit: 0, ySplit: 2 }
  sheet.mergeData = [
    { startRow: 0, startColumn: 0, endRow: 0, endColumn: 6 },
    { startRow: 2, startColumn: 0, endRow: 2, endColumn: 6 },
    { startRow: 4, startColumn: 0, endRow: 4, endColumn: 5 },
    { startRow: 5, startColumn: 0, endRow: 5, endColumn: 5 },
  ]
  sheet.cellData = {
    0: {
      0: { v: '{{params.reportMonth}} 销售明细报表', s: titleStyle },
    },
    1: {
      0: { v: '订单编号', s: headerStyle },
      1: { v: '日期', s: headerStyle },
      2: { v: '区域', s: headerStyle },
      3: { v: '客户', s: headerStyle },
      4: { v: '产品', s: headerStyle },
      5: { v: '数量', s: headerStyle },
      6: { v: '金额', s: headerStyle },
    },
    2: {
      0: { v: '区域：{{sales.region}}', s: groupHeaderStyle },
    },
    3: {
      0: { v: '{{sales.orderNo}}', s: detailStyle },
      1: { v: '{{sales.date}}', s: detailStyle },
      2: { v: '{{sales.region}}', s: detailStyle },
      3: { v: '{{sales.customer}}', s: detailStyle },
      4: { v: '{{sales.product}}', s: detailStyle },
      5: { v: '{{sales.quantity}}', s: detailStyle },
      6: { v: '{{sales.amount}}', s: amountStyle },
    },
    4: {
      0: { v: '区域小计', s: footerStyle },
      6: { v: '{{SUM(sales.amount)}}', s: footerStyle },
    },
    5: {
      0: { v: '全部区域总计', s: totalStyle },
      6: { v: '{{SUM(sales.amount)}}', s: totalStyle },
    },
    7: {
      0: {
        v: '提示：工具栏「行 / 列」菜单可插入、删除；左侧数据集面板可拖拽字段到单元格。',
        s: hintStyle,
      },
    },
  } satisfies Record<number, Record<number, ICellData>>

  const helpBorder = styles.add({ border: border() })
  const helpHeader = styles.add({
    bold: true,
    fill: '#e8f1ff',
    border: border(),
  })
  helpSheet.columnData = {
    0: { w: 180 },
    1: { w: 460 },
  }
  helpSheet.cellData = {
    0: {
      0: { v: '参数', s: helpHeader },
      1: { v: '值', s: helpHeader },
    },
    1: {
      0: { v: '报表月份', s: helpBorder },
      1: { v: '{{params.reportMonth}}', s: helpBorder },
    },
    3: { 0: { v: '使用说明', s: styles.add({ bold: true }) } },
    4: {
      0: {
        v: '1. 在「销售报表」工作表中编辑单元格或公式。',
        s: styles.add({ color: '#475569' }),
      },
    },
    5: {
      0: {
        v: '2. 左侧数据集面板可拖拽字段到单元格。',
        s: styles.add({ color: '#475569' }),
      },
    },
    6: {
      0: {
        v: '3. 选中行区间后可在右侧创建数据区域并配置分组。',
        s: styles.add({ color: '#475569' }),
      },
    },
    7: {
      0: {
        v: '4. 点击「预览」查看展开数据,支持导出 CSV/HTML/XLS 与打印。',
        s: styles.add({ color: '#475569' }),
      },
    },
  } satisfies Record<number, Record<number, ICellData>>

  workbook.sheetOrder = [sheetId, helpSheetId]
  workbook.sheets = {
    [sheetId]: sheet,
    [helpSheetId]: helpSheet,
  }

  const region: DataRegion = {
    id: createId('region'),
    datasetId: 'sales',
    detail: { startRow: 3, endRow: 3 },
    groups: [
      {
        field: 'region',
        header: { startRow: 2, endRow: 2 },
        footer: { startRow: 4, endRow: 4 },
      },
    ],
    filters: [],
    sort: [{ field: 'date', desc: false }],
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    workbook,
    report: {
      datasets: structuredClone(sampleDatasets),
      parameters: [
        {
          key: 'reportMonth',
          label: '报表月份',
          type: 'text',
          defaultValue: '2026-10',
        },
      ],
      print: PRINT_LANDSCAPE,
      activeSheetId: sheetId,
      sheets: {
        [sheetId]: { regions: [region] },
        [helpSheetId]: { regions: [] },
      },
    },
  }
}

/**
 * 创建空白报表文档
 * @returns 空白文档
 */
export function createBlankDocument(): ReportDocument {
  const sheetId = createId('sheet')
  const workbook = getSheetsEmptySnapshot(
    createId('workbook'),
    LocaleType.ZH_CN,
    '未命名报表'
  )
  const sheet = createSheet(sheetId, 'Sheet1', 1000, 26)
  workbook.sheetOrder = [sheetId]
  workbook.sheets = { [sheetId]: sheet }

  return {
    schemaVersion: SCHEMA_VERSION,
    workbook,
    report: {
      datasets: [],
      parameters: [],
      print: PRINT_PORTRAIT,
      activeSheetId: sheetId,
      sheets: { [sheetId]: { regions: [] } },
    },
  }
}

/**
 * 创建报表元数据(供迁移与新建使用)
 * @param value 元数据
 * @returns ReportMeta
 */
export function createReportMeta(value: Partial<ReportMeta>): ReportMeta {
  return {
    datasets: value.datasets ?? [],
    parameters: value.parameters ?? [],
    print: value.print ?? PRINT_PORTRAIT,
    activeSheetId: value.activeSheetId ?? '',
    sheets: value.sheets ?? {},
  }
}
