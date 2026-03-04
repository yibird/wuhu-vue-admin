import { toMerged } from 'es-toolkit'
import type { VDataTableProps } from '../types'

export function useRowProps<T>(
  rowProps?: VDataTableProps['rowProps'] | Ref<VDataTableProps['rowProps'] | undefined>,
  defaultRowProps?: VDataTableProps['rowProps']
) {
  return (row: T, rowIndex: number) => {
    const rawRowProps = unref(rowProps)
    const rowPropsValue = typeof rawRowProps === 'function' ? rawRowProps(row, rowIndex) : {}
    const defaultRowPropsValue =
      typeof defaultRowProps === 'function' ? defaultRowProps(row, rowIndex) : {}
    return toMerged(rowPropsValue, defaultRowPropsValue)
  }
}
