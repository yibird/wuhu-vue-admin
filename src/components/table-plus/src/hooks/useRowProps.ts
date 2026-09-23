import { mergeProps } from 'vue'

export type RowProps = Record<string, unknown>

type RowPropsInput<T> =
  | ((row: T, rowIndex: number) => RowProps)
  | RowProps
  | undefined

export function useRowProps<T = Record<string, unknown>>(
  outerProps?: RowPropsInput<T>,
  innerProps?: RowPropsInput<T>
) {
  return (row: T, rowIndex: number): RowProps => {
    const resolve = (props: RowPropsInput<T>): RowProps => {
      if (typeof props === 'function') return props(row, rowIndex)
      if (typeof props === 'object' && props !== null) return props
      return {}
    }

    return mergeProps(resolve(outerProps), resolve(innerProps)) as RowProps
  }
}
