import { computed, shallowRef, type ComputedRef, type ShallowRef } from 'vue'
import { defaultIconOptions, formatIconLabel } from './data'
import type {
  IconOptionEmits,
  IconSelectorOption,
  IconSelectorOptionInput,
  IconSelectorProps,
} from './types'

export interface UseIconOptionsReturn {
  filteredOptions: ComputedRef<IconSelectorOption[]>
  normalizedOptions: ComputedRef<IconSelectorOption[]>
  searchValue: ShallowRef<string>
  selectedOption: ComputedRef<IconSelectorOption | undefined>
  clearIcon: () => void
  emitSearch: (keyword: string) => void
  resetSearch: () => void
  selectIcon: (option: IconSelectorOption) => void
}

function normalizeIconOption(
  option: IconSelectorOptionInput
): IconSelectorOption {
  if (typeof option === 'string') {
    return {
      label: formatIconLabel(option),
      value: option,
    }
  }

  return option
}

function matchesKeyword(option: IconSelectorOption, keyword: string) {
  const text = [
    option.value,
    option.label,
    option.category,
    ...(option.keywords ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return text.includes(keyword)
}

export function useIconOptions(
  props: Readonly<IconSelectorProps>,
  emit: IconOptionEmits
): UseIconOptionsReturn {
  const searchValue = shallowRef('')

  const normalizedOptions = computed(() =>
    (props.icons?.length ? props.icons : defaultIconOptions).map(
      normalizeIconOption
    )
  )

  const selectedOption = computed(() => {
    const option = normalizedOptions.value.find(
      (item) => item.value === props.value
    )
    if (option || !props.value) return option
    return normalizeIconOption(props.value)
  })

  const filteredOptions = computed(() => {
    const keyword = searchValue.value.trim().toLowerCase()
    const limit = props.maxVisible ?? 160
    const options = keyword
      ? normalizedOptions.value.filter((option) =>
          matchesKeyword(option, keyword)
        )
      : normalizedOptions.value

    return limit > 0 ? options.slice(0, limit) : options
  })

  const emitSearch = (keyword: string) => {
    searchValue.value = keyword
    emit('search', keyword)
  }

  const resetSearch = () => {
    if (!searchValue.value) return
    searchValue.value = ''
    emit('search', '')
  }

  const selectIcon = (option: IconSelectorOption) => {
    if (option.disabled) return
    emit('update:value', option.value)
    emit('change', option.value, option)
    emit('select', option.value, option)
  }

  const clearIcon = () => {
    emit('update:value', undefined)
    emit('change', undefined)
    emit('clear')
  }

  return {
    filteredOptions,
    normalizedOptions,
    searchValue,
    selectedOption,
    clearIcon,
    emitSearch,
    resetSearch,
    selectIcon,
  }
}
