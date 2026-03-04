export interface DictItem {
  label: string
  value: string | number
  [key: string]: any
}

export interface UseDictOptions {
  labelKey?: string
  valueKey?: string
  transform?: (raw: any) => DictItem
}

const dict: Record<string, Array<Record<string, any>>> = {}

export function useDict(code: string, options: UseDictOptions = {}) {
  const { labelKey = 'label', valueKey = 'value', transform } = options

  const dictItems = computed(() => dict[code] ?? [])

  const dictOptions = computed<DictItem[]>(() => {
    return dictItems.value.map((item) => {
      return typeof transform === 'function'
        ? transform(item)
        : { label: item[labelKey], value: item[valueKey], ...item }
    })
  })

  function refresh() {}

  return {
    options: dictOptions,
    refresh,
  }
}
