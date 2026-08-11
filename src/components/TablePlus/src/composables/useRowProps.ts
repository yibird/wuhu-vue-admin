import { mergeProps } from 'vue'

export function useRowProps(outerProps?: any, innerProps?: any) {
  return (row: any, rowIndex: number) => {
    let rowProps = {} as Record<string, any>
    if (typeof outerProps === 'function') {
      rowProps = mergeProps(rowProps, outerProps(row, rowIndex))
    } else if (typeof outerProps === 'object') {
      rowProps = mergeProps(rowProps, outerProps)
    }

    if (typeof innerProps === 'function') {
      rowProps = mergeProps(rowProps, innerProps(row, rowIndex))
    } else if (typeof innerProps === 'object') {
      rowProps = mergeProps(rowProps, innerProps)
    }
    return rowProps
  }
}
