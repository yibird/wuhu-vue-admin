import { computed } from 'vue'
import { useAppStore } from '@/store'
import { HeaderWidget } from '@/constants'

import type { HeaderWidget as HeaderWidgetValue } from '@/config'

export function useWidget() {
  const { header } = useAppStore()

  const widgetSet = computed(() => new Set(header.value.widgets))
  const showSearch = computed(() => widgetSet.value.has(HeaderWidget.Search))
  const showTaskCenter = computed(() =>
    widgetSet.value.has(HeaderWidget.TaskCenter)
  )
  const showDownloadCenter = computed(() =>
    widgetSet.value.has(HeaderWidget.DownloadCenter)
  )
  const showNoteBook = computed(() =>
    widgetSet.value.has(HeaderWidget.NoteBook)
  )
  const showTheme = computed(() => widgetSet.value.has(HeaderWidget.Theme))
  const showTranslate = computed(() =>
    widgetSet.value.has(HeaderWidget.Translate)
  )
  const showFullScreen = computed(() =>
    widgetSet.value.has(HeaderWidget.FullScreen)
  )
  const showNotice = computed(() => widgetSet.value.has(HeaderWidget.Notice))
  const showLockScreen = computed(() =>
    widgetSet.value.has(HeaderWidget.LockScreen)
  )
  const showAI = computed(() => widgetSet.value.has(HeaderWidget.AI))
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
