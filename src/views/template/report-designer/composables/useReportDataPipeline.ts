import { onScopeDispose, shallowRef, watch } from 'vue'
import { processReportData } from '../model/reportDataPipeline'
import type {
  ReportDataPipelineInput,
  ReportSummaryAggregate,
} from '../model/reportDataPipeline'
import type { ReportField, ReportFilter, ReportRow, ReportSort } from '../types'
import type {
  ReportDataWorkerRequest,
  ReportDataWorkerResponse,
} from '../workers/reportData.worker'
import type { ShallowRef } from 'vue'

interface UseReportDataPipelineOptions {
  fields: Readonly<ShallowRef<ReportField[]>>
  filters: Readonly<ShallowRef<ReportFilter[]>>
  rawRows: Readonly<ShallowRef<ReportRow[]>>
  sorts: Readonly<ShallowRef<ReportSort[]>>
}

const workerThreshold = 2_000
const workerDebounce = 120

export function useReportDataPipeline({
  fields,
  filters,
  rawRows,
  sorts,
}: UseReportDataPipelineOptions) {
  const rows = shallowRef<ReportRow[]>([])
  const summaries = shallowRef<Record<string, ReportSummaryAggregate>>({})
  const isProcessing = shallowRef(false)
  const processingError = shallowRef('')
  let worker: Worker | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let requestId = 0

  function createInput(): ReportDataPipelineInput {
    return {
      fields: fields.value,
      filters: filters.value,
      rows: rawRows.value,
      sorts: sorts.value,
    }
  }

  function commit(result: ReturnType<typeof processReportData>) {
    rows.value = result.rows
    summaries.value = result.summaries
    isProcessing.value = false
    processingError.value = ''
  }

  function runSynchronously(input: ReportDataPipelineInput) {
    commit(processReportData(input))
  }

  function getWorker() {
    if (worker) return worker
    if (typeof Worker === 'undefined') return undefined

    try {
      worker = new Worker(
        new URL('../workers/reportData.worker.ts', import.meta.url),
        { type: 'module' }
      )
      worker.onmessage = (event: MessageEvent<ReportDataWorkerResponse>) => {
        if (event.data.id !== requestId) return
        commit(event.data.result)
      }
      worker.onerror = () => {
        worker?.terminate()
        worker = undefined
        processingError.value = '后台数据计算失败，已切换主线程处理'
        runSynchronously(createInput())
      }
    } catch {
      worker = undefined
    }

    return worker
  }

  function process() {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }

    const input = createInput()
    if (input.rows.length < workerThreshold) {
      requestId += 1
      runSynchronously(input)
      return
    }

    isProcessing.value = true
    const currentRequestId = ++requestId
    timer = setTimeout(() => {
      timer = undefined
      const activeWorker = getWorker()
      if (!activeWorker) {
        runSynchronously(createInput())
        return
      }

      const payload: ReportDataWorkerRequest = {
        id: currentRequestId,
        input: createInput(),
      }
      activeWorker.postMessage(payload)
    }, workerDebounce)
  }

  watch([rawRows, fields, filters, sorts], process, { immediate: true })

  onScopeDispose(() => {
    if (timer) clearTimeout(timer)
    worker?.terminate()
  })

  return {
    isProcessing,
    processingError,
    rows,
    summaries,
  }
}
