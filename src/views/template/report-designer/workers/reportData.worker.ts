import { processReportData } from '../model/reportDataPipeline'
import type {
  ReportDataPipelineInput,
  ReportDataPipelineResult,
} from '../model/reportDataPipeline'

export interface ReportDataWorkerRequest {
  id: number
  input: ReportDataPipelineInput
}

export interface ReportDataWorkerResponse {
  id: number
  result: ReportDataPipelineResult
}

self.onmessage = (event: MessageEvent<ReportDataWorkerRequest>) => {
  const { id, input } = event.data
  const response: ReportDataWorkerResponse = {
    id,
    result: processReportData(input),
  }
  self.postMessage(response)
}
