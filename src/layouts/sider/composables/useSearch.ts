import { computed, nextTick, type Ref } from 'vue'
import { debounce } from 'es-toolkit'
import { useAppStore } from '@/store'

interface UseSearchOptions {
  value: Ref<string>
  collapsed?: Ref<boolean | undefined> | boolean
  onChange?: (value: string) => void
  onClear?: () => void
}

export function useSearch(options: UseSearchOptions) {
  const { sider, setCollapsed } = useAppStore()
  const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
  const isCollapsed = computed(
    () => toRaw(options.collapsed) ?? sider.value.collapsed
  )
  const onChange = debounce((e: Event) => {
    const target = e.target as HTMLInputElement
    options.value.value = target.value
    options.onChange?.(target.value)
  }, 50)

  const onClear = () => {
    options.value.value = ''
    inputRef.value?.focus()
    options.onClear?.()
  }

  const onClick = async () => {
    if (!sider.value.collapsed) return
    setCollapsed(false)
    await nextTick()
    inputRef.value?.focus()
  }

  return {
    isCollapsed,
    onChange,
    onClear,
    onClick,
  }
}
