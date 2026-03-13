import { ref, isRef, onMounted, type Ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { throttle } from 'es-toolkit'
import { getElementSize, getElSpacing } from '@/utils'

const TABLE_PLUS_CLASS_NAME = '.table-plus'
const HEADER_CLASS_NAME = '.table-plus-header'
const N_HEADER_CLASS_NAME = '.n-data-table-base-table-header'
const N_PAGINATION_CLASS_NAME = '.n-data-table__pagination'
const N_BORDER_CLASS_NAME = '.n-data-table--bordered'

interface UseSizeOptions {
  autoSize?: boolean | Ref<boolean | undefined>
  resize?: boolean
}

export function useSize(
  target: Ref<HTMLElement | undefined> | HTMLElement | (() => HTMLElement),
  options: UseSizeOptions = { autoSize: true, resize: true }
) {
  const height = ref(200)
  const width = ref<number>()

  const getTargetEl = () =>
    isRef(target) ? target.value : typeof target === 'function' ? target() : target

  const calculateSize = throttle(() => {
    const el = getTargetEl()
    if (!el) return

    const tablePlusEl = el.closest<HTMLElement>(TABLE_PLUS_CLASS_NAME)
    if (!tablePlusEl) return

    const tablePlusHeaderEl = tablePlusEl.querySelector<HTMLElement>(HEADER_CLASS_NAME)
    const nTableHeaderEl = el.querySelector<HTMLElement>(N_HEADER_CLASS_NAME)
    const nPaginationEl = el.querySelector<HTMLElement>(N_PAGINATION_CLASS_NAME)
    const hasBordered = !!el.querySelector(N_BORDER_CLASS_NAME)

    const tablePlusElHeight = tablePlusEl.clientHeight ?? 0
    const tablePlusElWidth = tablePlusEl.clientWidth ?? 0
    const tablePlusHeaderHeight = tablePlusHeaderEl?.clientHeight ?? 0

    const { x: spacingX, y: spacingY } = getElSpacing(el)
    const { height: nHeaderH } = getElementSize(nTableHeaderEl)
    const { height: nPaginationH } = getElementSize(nPaginationEl)

    const newHeight = tablePlusElHeight - spacingY - tablePlusHeaderHeight - nHeaderH - nPaginationH
    const newWidth = tablePlusElWidth - spacingX - (hasBordered ? 2 : 0)

    if (height.value !== newHeight) height.value = newHeight
    if (width.value !== newWidth) width.value = newWidth
  }, 1000)  

  onMounted(() => {
    if (unref(options.autoSize)) {
      calculateSize()
    }
  })

  if (options.resize) {
    useResizeObserver(target, () => {
      calculateSize()
    })
  }

  return { height, width, calculateSize }
}