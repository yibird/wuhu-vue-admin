import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import type { ChartDesignerSchema } from '../types'

export interface ChartSchemaHistoryEntry {
  id: string
  title: string
  createdAt: string
  schemaText: string
}

interface UseChartSchemaWorkspaceOptions {
  applySchema: (schema: ChartDesignerSchema) => void
  getSchemaText: () => string
}

export function useChartSchemaWorkspace(
  options: UseChartSchemaWorkspaceOptions
) {
  const schemaOpen = shallowRef(false)
  const historyOpen = shallowRef(false)
  const previewOpen = shallowRef(false)
  const shareOpen = shallowRef(false)
  const schemaDraft = shallowRef('')
  const schemaError = shallowRef('')
  const history = shallowRef<ChartSchemaHistoryEntry[]>([])
  const lastAppliedText = shallowRef('')
  let applyTimer: number | undefined

  const shareUrl = computed(() => {
    if (typeof window === 'undefined') return ''
    const encoded = encodeURIComponent(toBase64(options.getSchemaText()))
    return `${window.location.origin}${window.location.pathname}?chartSchema=${encoded}`
  })

  function openSchema() {
    schemaDraft.value = options.getSchemaText()
    lastAppliedText.value = schemaDraft.value
    schemaError.value = ''
    schemaOpen.value = true
  }

  function openHistory() {
    captureHistory('手动快照')
    historyOpen.value = true
  }

  function openPreview() {
    previewOpen.value = true
  }

  function openShare() {
    shareOpen.value = true
  }

  function restoreHistory(entry: ChartSchemaHistoryEntry) {
    schemaDraft.value = entry.schemaText
    applySchemaText(entry.schemaText, '恢复历史版本')
    historyOpen.value = false
  }

  function formatSchemaDraft() {
    const schema = parseSchemaText(schemaDraft.value)
    schemaDraft.value = JSON.stringify(schema, null, 2)
  }

  async function copyShareUrl() {
    await navigator.clipboard?.writeText(shareUrl.value)
  }

  watch(schemaDraft, (value) => {
    if (!schemaOpen.value || value === lastAppliedText.value) return
    window.clearTimeout(applyTimer)
    applyTimer = window.setTimeout(() => {
      applySchemaText(value, '源码实时导入')
    }, 360)
  })

  onBeforeUnmount(() => {
    window.clearTimeout(applyTimer)
  })

  function applySchemaText(value: string, title: string) {
    try {
      const schema = parseSchemaText(value)
      captureHistory(title)
      options.applySchema(schema)
      lastAppliedText.value = value
      schemaError.value = ''
    } catch (error) {
      schemaError.value =
        error instanceof Error ? error.message : 'Schema 解析失败'
    }
  }

  function captureHistory(title: string) {
    const schemaText = options.getSchemaText()
    if (history.value[0]?.schemaText === schemaText) return

    history.value = [
      {
        id: `history-${Date.now()}`,
        title,
        createdAt: new Date().toLocaleString(),
        schemaText,
      },
      ...history.value,
    ].slice(0, 12)
  }

  return {
    history,
    historyOpen,
    previewOpen,
    schemaDraft,
    schemaError,
    schemaOpen,
    shareOpen,
    shareUrl,
    copyShareUrl,
    formatSchemaDraft,
    openHistory,
    openPreview,
    openSchema,
    openShare,
    restoreHistory,
  }
}

function parseSchemaText(value: string): ChartDesignerSchema {
  const schema = JSON.parse(value) as Partial<ChartDesignerSchema>
  if (!schema.screen || !Array.isArray(schema.dataSources)) {
    throw new Error('Schema 需要包含 screen 和 dataSources。')
  }
  if (!Array.isArray(schema.widgets)) {
    throw new Error('Schema 需要包含 widgets 数组。')
  }
  return schema as ChartDesignerSchema
}

function toBase64(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return window.btoa(binary)
}
