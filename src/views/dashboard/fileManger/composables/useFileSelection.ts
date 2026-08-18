import { computed, nextTick, shallowRef, type Ref } from 'vue'
import { useRangeSelection } from '@/composables/useRangeSelection'
import type { FileSelectionKey, FileViewMode, IFile } from '../components/types'
import type { ScrollbarInstance } from '@/components/scrollbar'

interface UseFileSelectionOptions {
  items: Ref<IFile[]>
  selectedKeys: Ref<FileSelectionKey[]>
  viewMode: Ref<FileViewMode>
  containerRef: Ref<ScrollbarInstance | null | undefined>
}

const fileItemSelector = '[data-file-manager-item-id]'

function getFileIdSelector(id: FileSelectionKey) {
  return `[data-file-manager-item-id="${CSS.escape(id)}"]`
}

export function useFileSelection({
  items,
  selectedKeys,
  viewMode,
  containerRef,
}: UseFileSelectionOptions) {
  const focusedKey = shallowRef<FileSelectionKey>()
  const selectionAnchorKey = shallowRef<FileSelectionKey>()

  const selectableItems = computed(() => items.value)
  const selectedKeySet = computed(() => new Set(selectedKeys.value))

  function focusContainer() {
    const element =
      containerRef.value?.getElement() ?? containerRef.value?.getScrollElement()
    if (!element) return
    if (element.tabIndex < 0) element.tabIndex = 0
    element.focus({ preventScroll: true })
  }

  function getContentElement() {
    return containerRef.value?.getContentElement() ?? null
  }

  const rangeContainer = computed(
    () => containerRef.value?.getScrollElement() ?? null
  )
  const itemVersion = computed(() =>
    items.value.map((item) => item.id).join('|')
  )
  const rangeTargets = computed(() => {
    itemVersion.value
    const content = getContentElement()
    return content
      ? Array.from(content.querySelectorAll<HTMLElement>(fileItemSelector))
      : []
  })
  const selectedRangeTargets = computed(() => {
    const selected = selectedKeySet.value
    return rangeTargets.value.filter((element) =>
      selected.has(element.dataset.fileManagerItemId ?? '')
    )
  })

  const rangeSelection = useRangeSelection<HTMLElement>({
    container: rangeContainer,
    getKey: (element) => element.dataset.fileManagerItemId ?? '',
    multiple: true,
    observeScroll: true,
    selected: selectedRangeTargets,
    targets: rangeTargets,
    threshold: 4,
    onSelecting: (_rect, elements) => {
      const keys = elements
        .map((element) => element.dataset.fileManagerItemId ?? '')
        .filter(Boolean) as FileSelectionKey[]
      setSelectedKeys(keys)
      focusedKey.value = keys.at(-1) ?? keys.at(0)
    },
    onStart: () => {
      focusContainer()
    },
    onChange: (elements) => {
      setSelectedKeys(
        elements
          .map((element) => element.dataset.fileManagerItemId ?? '')
          .filter(Boolean) as FileSelectionKey[]
      )
    },
  })
  const dragSelection = computed(() =>
    rangeSelection.isSelecting.value ? true : undefined
  )
  const dragSelectionStyle = rangeSelection.selectionStyle

  function getItemIndex(key: FileSelectionKey | undefined) {
    if (!key) return -1
    return selectableItems.value.findIndex((item) => item.id === key)
  }

  function getItemElement(key: FileSelectionKey) {
    return getContentElement()?.querySelector<HTMLElement>(
      getFileIdSelector(key)
    )
  }

  function setSelectedKeys(keys: FileSelectionKey[]) {
    const visibleKeys = new Set(selectableItems.value.map((item) => item.id))
    selectedKeys.value = [...new Set(keys)].filter((key) =>
      visibleKeys.has(key)
    )
  }

  function selectOnly(key: FileSelectionKey) {
    focusedKey.value = key
    selectionAnchorKey.value = key
    setSelectedKeys([key])
  }

  function toggleKey(key: FileSelectionKey) {
    focusedKey.value = key
    selectionAnchorKey.value = key
    const nextKeys = new Set(selectedKeys.value)
    if (nextKeys.has(key)) {
      nextKeys.delete(key)
    } else {
      nextKeys.add(key)
    }
    setSelectedKeys([...nextKeys])
  }

  function selectRange(toKey: FileSelectionKey) {
    const anchorKey = selectionAnchorKey.value ?? focusedKey.value ?? toKey
    const anchorIndex = getItemIndex(anchorKey)
    const targetIndex = getItemIndex(toKey)
    if (anchorIndex < 0 || targetIndex < 0) {
      selectOnly(toKey)
      return
    }

    const start = Math.min(anchorIndex, targetIndex)
    const end = Math.max(anchorIndex, targetIndex)
    focusedKey.value = toKey
    setSelectedKeys(
      selectableItems.value.slice(start, end + 1).map((item) => item.id)
    )
  }

  function handleItemClick(file: IFile, event: MouseEvent | KeyboardEvent) {
    focusContainer()

    if (event.shiftKey) {
      selectRange(file.id)
      return
    }

    if (event.ctrlKey || event.metaKey) {
      toggleKey(file.id)
      return
    }

    selectOnly(file.id)
  }

  function handleCheckboxChange(file: IFile, checked: boolean) {
    focusContainer()
    focusedKey.value = file.id
    selectionAnchorKey.value = file.id
    const nextKeys = new Set(selectedKeys.value)
    if (checked) {
      nextKeys.add(file.id)
    } else {
      nextKeys.delete(file.id)
    }
    setSelectedKeys([...nextKeys])
  }

  function clearSelection() {
    rangeSelection.cancelSelection()
    selectedKeys.value = []
    focusedKey.value = undefined
    selectionAnchorKey.value = undefined
  }

  function getGridColumnCount() {
    if (viewMode.value === 'list') return 1

    const content = getContentElement()
    if (!content) return 1

    const first = content.querySelector<HTMLElement>(fileItemSelector)
    if (!first) return 1

    const firstTop = Math.round(first.getBoundingClientRect().top)
    const count = Array.from(
      content.querySelectorAll<HTMLElement>(fileItemSelector)
    ).filter(
      (element) => Math.round(element.getBoundingClientRect().top) === firstTop
    ).length
    return Math.max(1, count)
  }

  function getNextIndex(event: KeyboardEvent) {
    const currentIndex =
      getItemIndex(focusedKey.value) >= 0
        ? getItemIndex(focusedKey.value)
        : Math.max(0, getItemIndex(selectedKeys.value.at(-1)))
    const fallbackIndex = currentIndex >= 0 ? currentIndex : 0
    const columns = getGridColumnCount()
    const maxIndex = selectableItems.value.length - 1

    switch (event.key) {
      case 'ArrowLeft':
        return Math.max(0, fallbackIndex - 1)
      case 'ArrowRight':
        return Math.min(maxIndex, fallbackIndex + 1)
      case 'ArrowUp':
        return Math.max(0, fallbackIndex - columns)
      case 'ArrowDown':
        return Math.min(maxIndex, fallbackIndex + columns)
      case 'Home':
        return 0
      case 'End':
        return maxIndex
      default:
        return -1
    }
  }

  async function scrollItemIntoView(key: FileSelectionKey) {
    await nextTick()
    getItemElement(key)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (
      ![
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'a',
        'A',
      ].includes(event.key)
    ) {
      return
    }

    if (
      (event.key === 'a' || event.key === 'A') &&
      (event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault()
      setSelectedKeys(selectableItems.value.map((item) => item.id))
      focusedKey.value = selectableItems.value.at(-1)?.id
      selectionAnchorKey.value = selectableItems.value.at(0)?.id
      return
    }

    const nextIndex = getNextIndex(event)
    if (nextIndex < 0) return

    const nextItem = selectableItems.value[nextIndex]
    if (!nextItem) return

    event.preventDefault()
    if (event.shiftKey) {
      selectRange(nextItem.id)
    } else {
      selectOnly(nextItem.id)
    }
    void scrollItemIntoView(nextItem.id)
  }

  function syncAfterItemsChange() {
    const visibleKeys = new Set(selectableItems.value.map((item) => item.id))
    selectedKeys.value = selectedKeys.value.filter((key) =>
      visibleKeys.has(key)
    )

    if (focusedKey.value && !visibleKeys.has(focusedKey.value)) {
      focusedKey.value = selectedKeys.value.at(-1)
    }
    if (
      selectionAnchorKey.value &&
      !visibleKeys.has(selectionAnchorKey.value)
    ) {
      selectionAnchorKey.value = focusedKey.value
    }
  }

  return {
    dragSelection,
    dragSelectionStyle,
    focusedKey,
    selectedKeySet,
    clearSelection,
    handleCheckboxChange,
    handleItemClick,
    handleKeyDown,
    syncAfterItemsChange,
  }
}
