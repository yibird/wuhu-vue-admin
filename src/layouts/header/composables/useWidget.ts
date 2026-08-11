import { computed } from 'vue'
import { useAppStore } from '@/store'
import { HeaderWidget, type HeaderWidgetType } from '@/constants'

export function useWidget() {
  const { header } = useAppStore()

  const widgetSet = computed(() => new Set(header.value.widgets))

  const enableSearch = computed(() => widgetSet.value.has(HeaderWidget.Search))
  const enableTaskCenter = computed(() =>
    widgetSet.value.has(HeaderWidget.TaskCenter)
  )
  const enableDownloadCenter = computed(() =>
    widgetSet.value.has(HeaderWidget.DownloadCenter)
  )
  const enableNoteBook = computed(() =>
    widgetSet.value.has(HeaderWidget.NoteBook)
  )
  const enableTheme = computed(() => widgetSet.value.has(HeaderWidget.Theme))
  const enableTranslate = computed(() =>
    widgetSet.value.has(HeaderWidget.Translate)
  )
  const enableFullScreen = computed(() =>
    widgetSet.value.has(HeaderWidget.FullScreen)
  )
  const enableNotice = computed(() => widgetSet.value.has(HeaderWidget.Notice))
  const enableLockScreen = computed(() =>
    widgetSet.value.has(HeaderWidget.LockScreen)
  )
  const enableAI = computed(() => widgetSet.value.has(HeaderWidget.AI))

  const onChange = (checked: boolean, value: HeaderWidgetType) => {
    if (checked) {
      header.value.widgets.push(value)
    } else {
      header.value.widgets = header.value.widgets.filter(
        (item) => item !== value
      )
    }
  }

  return {
    enableSearch,
    enableTaskCenter,
    enableDownloadCenter,
    enableNoteBook,
    enableTheme,
    enableTranslate,
    enableFullScreen,
    enableNotice,
    enableLockScreen,
    enableAI,
    onChange,
  }
}
