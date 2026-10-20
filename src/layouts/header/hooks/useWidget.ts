import { computed } from 'vue'
import { useAppStore } from '@/store'
import { HEADER_WIDGET } from '@/constants'

import type { HeaderWidget as HeaderWidgetValue } from '@/constants'

export function useWidget() {
  const { header } = useAppStore()

  const widgetSet = computed(() => new Set(header.value.widgets))
  const showSearch = computed(() => widgetSet.value.has(HEADER_WIDGET.Search))
  const showTaskCenter = computed(() =>
    widgetSet.value.has(HEADER_WIDGET.TaskCenter)
  )
  const showDownloadCenter = computed(() =>
    widgetSet.value.has(HEADER_WIDGET.DownloadCenter)
  )
  const showNoteBook = computed(() =>
    widgetSet.value.has(HEADER_WIDGET.NoteBook)
  )
  const showTheme = computed(() => widgetSet.value.has(HEADER_WIDGET.Theme))
  const showTranslate = computed(() =>
    widgetSet.value.has(HEADER_WIDGET.Translate)
  )
  const showFullScreen = computed(() =>
    widgetSet.value.has(HEADER_WIDGET.FullScreen)
  )
  const showNotice = computed(() => widgetSet.value.has(HEADER_WIDGET.Notice))
  const showLockScreen = computed(() =>
    widgetSet.value.has(HEADER_WIDGET.LockScreen)
  )
  const showAI = computed(() => widgetSet.value.has(HEADER_WIDGET.AI))
  const onChange = (checked: boolean, value: HeaderWidgetValue) => {
    if (checked) {
      header.value.widgets.push(value)
    } else {
      header.value.widgets = header.value.widgets.filter(
        (item) => item !== value
      )
    }
  }

  return {
    showSearch,
    showTaskCenter,
    showDownloadCenter,
    showNoteBook,
    showTheme,
    showTranslate,
    showFullScreen,
    showNotice,
    showLockScreen,
    showAI,
    onChange,
  }
}
