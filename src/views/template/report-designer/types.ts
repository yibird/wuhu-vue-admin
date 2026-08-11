export type DataSourceKind = 'sample' | 'rest' | 'json' | 'sql'
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH'
export type SqlDriver =
  | 'mysql'
  | 'postgresql'
  | 'sqlserver'
  | 'oracle'
  | 'custom'
export type FieldType = 'string' | 'number' | 'currency' | 'percent' | 'date'
export type FieldAlign = 'left' | 'center' | 'right'
export type FieldSummary = 'none' | 'sum' | 'avg' | 'count'
export type ReportTheme = 'default' | 'ink' | 'teal' | 'amber' | 'steel'
export type ReportDensity = 'compact' | 'standard' | 'comfortable'
export type ExportFormat = 'csv' | 'xls' | 'json' | 'pdf' | 'print'
export type FieldMappingMode = 'manual' | 'source'
export type FieldFormatMode = 'auto' | 'preset' | 'custom'
export type ReportTemplateType =
  | 'detail'
  | 'summary'
  | 'group'
  | 'masterDetail'
  | 'label'
  | 'delivery'
  | 'inbound'
  | 'invoice'
  | 'statement'
  | 'bi'
  | 'finance'
export type ReportPaperSize = 'A4' | 'A5' | 'Letter' | 'label100x150'
export type ReportOrientation = 'portrait' | 'landscape'
export type PermissionMode = 'inherit' | 'template' | 'private'
export type CapabilityStatus = 'ready' | 'partial' | 'planned'
export type FieldFormatPreset =
  | 'text-trim'
  | 'text-uppercase'
  | 'text-lowercase'
  | 'number-integer'
  | 'number-decimal-1'
  | 'number-decimal-2'
  | 'number-decimal-4'
  | 'number-compact'
  | 'currency-cny-0'
  | 'currency-cny-2'
  | 'currency-usd-2'
  | 'currency-plain-2'
  | 'percent-0'
  | 'percent-1'
  | 'percent-2'
  | 'date-yyyy-mm-dd'
  | 'date-yyyy-slash-mm-dd'
  | 'date-cn'
  | 'date-yyyy-mm-dd-hh-mm'
  | 'date-mm-dd'
  | 'date-timestamp'
export type FilterOperator =
  | 'contains'
  | 'equals'
  | 'notEquals'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'greaterOrEqual'
  | 'lessThan'
  | 'lessOrEqual'
  | 'between'
  | 'empty'
  | 'notEmpty'
export type SortDirection = 'asc' | 'desc'

export interface ReportRow {
  [key: string]: string | number | boolean | null | undefined
}

export interface DataSourceConfig {
  kind: DataSourceKind
  name: string
  /** Backend-managed credential reference; secrets must not be persisted client-side. */
  credentialId?: string
  method: RequestMethod
  endpoint: string
  dataPath: string
  queryParams: string
  headers: string
  body: string
  rawJson: string
  sqlDatabase: string
  sqlDriver: SqlDriver
  sqlHost: string
  sqlPassword: string
  sqlPort: string
  sqlText: string
  sqlUsername: string
}

export interface ReportDataSourceItem {
  id: string
  name: string
  kind: DataSourceKind
  savedAt: string
  config: DataSourceConfig
}

export interface ReportField {
  key: string
  label: string
  type: FieldType
  enabled: boolean
  width: number
  align: FieldAlign
  summary: FieldSummary
  computed?: boolean
  expression?: string
  mappingEnabled?: boolean
  mappingItems?: ReportFieldMappingItem[]
  mappingKeyField?: string
  mappingLabelField?: string
  mappingMode?: FieldMappingMode
  mappingSource?: string
  format?: ReportFieldFormatConfig
}

export interface ReportFieldMappingItem {
  key: string
  label: string
}

export interface ReportFieldFormatConfig {
  mode: FieldFormatMode
  preset?: FieldFormatPreset
  customCode?: string
  testValue?: string
}

export interface FieldFormatterTestResult {
  error: string
  value: string
}

export interface ReportSettings {
  title: string
  subtitle: string
  fileName: string
  sheetName: string
  templateType: ReportTemplateType
  theme: ReportTheme
  density: ReportDensity
  showIndex: boolean
  showSummary: boolean
  showFooter: boolean
  watermark: string
  previewLimit: number
  paperSize: ReportPaperSize
  orientation: ReportOrientation
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  pageHeader: string
  pageFooter: string
  repeatTableHeader: boolean
  permissionMode: PermissionMode
  asyncExportThreshold: number
  streamExportThreshold: number
}

export interface ReportSummary {
  key: string
  label: string
  value: string
}

export interface ExportOption {
  format: ExportFormat
  label: string
  icon: string
  description: string
}

export interface RequirementPhase {
  phase: string
  title: string
  items: string[]
}

export interface ReportFilter {
  id: string
  fieldKey: string
  operator: FilterOperator
  value: string
  secondValue: string
  enabled: boolean
}

export interface ReportSort {
  id: string
  fieldKey: string
  direction: SortDirection
  enabled: boolean
}

export interface ReportTemplateSnapshot {
  id: string
  name: string
  savedAt: string
  sourceConfig: DataSourceConfig
  settings: ReportSettings
  fields: ReportField[]
  filters: ReportFilter[]
  sorts: ReportSort[]
}

export interface ReportDatasetSchema {
  id: string
  name: string
  primaryKey: string
  sourceId: string
  rowPath: string
  fields: ReportField[]
}

export interface ReportParameterSchema {
  id: string
  key: string
  label: string
  type: FieldType | 'boolean'
  defaultValue: string | number | boolean
  required: boolean
}

export interface ReportCapabilityItem {
  label: string
  description: string
  icon: string
  status: CapabilityStatus
}

export interface ReportCapabilityGroup {
  title: string
  description: string
  icon: string
  items: ReportCapabilityItem[]
}

export interface ReportDesignerSchema {
  $schema: string
  schemaVersion: number
  version: string
  title: string
  description: string
  activeSourceId: string
  templateType: ReportTemplateType
  settings: ReportSettings
  dataSources: ReportDataSourceItem[]
  datasets: ReportDatasetSchema[]
  parameters: ReportParameterSchema[]
  fields: ReportField[]
  filters: ReportFilter[]
  sorts: ReportSort[]
  export: {
    csv: {
      encoding: string
      separator: string
      streaming: boolean
    }
    excel: {
      engine: 'clientHtmlXls' | 'serverXlsx'
      multiSheet: boolean
      stylePreserved: boolean
    }
    pdf: {
      engine: 'browserPrint' | 'serverPdf'
      fontEmbedding: boolean
      pageBreaks: boolean
    }
  }
  print: {
    paperSize: ReportPaperSize
    orientation: ReportOrientation
    margins: {
      top: number
      right: number
      bottom: number
      left: number
    }
    pageHeader: string
    pageFooter: string
    repeatTableHeader: boolean
  }
  security: {
    mode: PermissionMode
    auditEnabled: boolean
    watermarkEnabled: boolean
    permissions: string[]
  }
  performance: {
    previewLimit: number
    asyncExportThreshold: number
    streamExportThreshold: number
    virtualPreview: boolean
  }
}
