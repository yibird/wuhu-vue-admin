import type { Ref } from 'vue'
import type { ChartDataSource } from '../types'

interface UseChartDataSourceActionsOptions {
  activeSourceId: Ref<string>
  dataSources: Ref<ChartDataSource[]>
}

export function useChartDataSourceActions(
  options: UseChartDataSourceActionsOptions
) {
  function selectDataSource(id: string) {
    options.activeSourceId.value = id
  }

  function updateDataSource(id: string, patch: Partial<ChartDataSource>) {
    options.dataSources.value = options.dataSources.value.map((source) =>
      source.id === id ? { ...source, ...patch } : source
    )
  }

  return { selectDataSource, updateDataSource }
}
