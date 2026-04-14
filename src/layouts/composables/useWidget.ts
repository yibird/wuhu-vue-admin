import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'
import { HeaderWidget, type HeaderWidgetType } from '@/constant'

export function useWidget() {
  const { header } = storeToRefs(appStore())
  const enableSearch = computed(() => {
    return header.value.widgets.includes(HeaderWidget.Search)
  })
  const enableDownloadCenter = computed(() => {
    return header.value.widgets.includes(HeaderWidget.DownloadCenter)
  })
  const enableNoteBook = computed(() => {
    return header.value.widgets.includes(HeaderWidget.DownloadCenter)
  })
  const enableTheme = computed(() => {
    return header.value.widgets.includes(HeaderWidget.Theme)
  })
  const enableTranslate = computed(() => {
    return header.value.widgets.includes(HeaderWidget.Translate)
  })
  const enableFullScreen = computed(() => {
    return header.value.widgets.includes(HeaderWidget.FullScreen)
  })
  const enableNotice = computed(() => {
    return header.value.widgets.includes(HeaderWidget.Notice)
  })
  const enableLockScreen = computed(() => {
    return header.value.widgets.includes(HeaderWidget.LockScreen)
  })
  const enableAI = computed(() => {
    return header.value.widgets.includes(HeaderWidget.AI)
  })

  const onChange = (checked: boolean, value: HeaderWidgetType) => {
    if (checked) {
      header.value.widgets.push(value)
    } else {
      header.value.widgets = header.value.widgets.filter((item) => item !== value)
    }
  }

  return {
    enableSearch,
    enableDownloadCenter,
    enableNoteBook,
    enableTheme,
    enableTranslate,
    enableFullScreen,
    enableNotice,
    enableLockScreen,
    enableAI,
    onChange
  }
}
