import type {
  ChartDataRecord,
  ChartDataSource,
  ChartDesignerSchema,
  ChartField,
  ChartFieldType,
  ChartScreenConfig,
  ChartWidget,
} from '../types'

export function cloneDataSource(source: ChartDataSource): ChartDataSource {
  return {
    ...source,
    fields: source.fields.map((field) => ({ ...field })),
    records: source.records.map((record) => ({ ...record })),
  }
}

export function cloneWidget(widget: ChartWidget): ChartWidget {
  return { ...widget }
}

export function createSchema(
  screen: ChartScreenConfig,
  dataSources: readonly ChartDataSource[],
  widgets: readonly ChartWidget[]
): ChartDesignerSchema {
  return {
    $schema: 'https://wuhu.dev/schemas/chart-designer/v1.json',
    dataSources: dataSources.map(cloneDataSource),
    screen,
    version: '1.0.0',
    widgets: widgets.map(cloneWidget),
  }
}

export function inferFields(records: readonly ChartDataRecord[]) {
  const keys = Array.from(
    new Set(records.flatMap((record) => Object.keys(record)))
  )

  return keys.map<ChartField>((key) => {
    const sample = records.find(
      (record) => record[key] !== null && record[key] !== undefined
    )

    return {
      key,
      label: key,
      type: inferFieldType(sample?.[key]),
    }
  })
}

function inferFieldType(value: unknown): ChartFieldType {
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string' && /^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(value)) {
    return 'date'
  }
  return 'string'
}
