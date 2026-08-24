import { ref, isRef, onMounted, type Ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { throttle } from 'es-toolkit'

const TABLE_PLUS_CLASS_NAME = '.table-plus'
const HEADER_CLASS_NAME = '.table-plus-header'
const TABLE_HEADER_CLASS_NAME = '.ant-table-header'
const TABLE_PAGINATION_CLASS_NAME = '.ant-pagination'
const TABLE_BORDER_CLASS_NAME = '.ant-table-bordered'

function parsePixelValue(value: string) {
  return Number.parseFloat(value) || 0
}

function getElementSpacing(element: Element) {
  const style = getComputedStyle(element)
  const horizontal =
    parsePixelValue(style.marginLeft) +
    parsePixelValue(style.marginRight) +
    parsePixelValue(style.paddingLeft) +
    parsePixelValue(style.paddingRight) +
    parsePixelValue(style.borderLeftWidth) +
    parsePixelValue(style.borderRightWidth)
  const vertical =
    parsePixelValue(style.marginTop) +
    parsePixelValue(style.marginBottom) +
    parsePixelValue(style.paddingTop) +
    parsePixelValue(style.paddingBottom) +
    parsePixelValue(style.borderTopWidth) +
    parsePixelValue(style.borderBottomWidth)

  return { x: horizontal, y: vertical }
}

function getElementSize(element?: Element | null) {
  if (!element) return { width: 0, height: 0 }

  const rect = element.getBoundingClientRect()
  const style = getComputedStyle(element)

  return {
    width:
      rect.width +
      parsePixelValue(style.marginLeft) +
      parsePixelValue(style.marginRight),
    height:
      rect.height +
      parsePixelValue(style.marginTop) +
      parsePixelValue(style.marginBottom),
  }
}

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
    isRef(target)
      ? target.value
      : typeof target === 'function'
        ? target()
        : target

  const calculateSize = throttle(() => {
    const el = getTargetEl()
    if (!el) return

    const tablePlusEl = el.closest<HTMLElement>(TABLE_PLUS_CLASS_NAME)
    if (!tablePlusEl) return

    const tablePlusHeaderEl =
      tablePlusEl.querySelector<HTMLElement>(HEADER_CLASS_NAME)
    const tableHeaderEl = el.querySelector<HTMLElement>(TABLE_HEADER_CLASS_NAME)
    const paginationEl = el.querySelector<HTMLElement>(
      TABLE_PAGINATION_CLASS_NAME
    )
    const hasBordered = !!el.querySelector(TABLE_BORDER_CLASS_NAME)

    const tablePlusElHeight = tablePlusEl.clientHeight ?? 0
    const tablePlusElWidth = tablePlusEl.clientWidth ?? 0
    const tablePlusHeaderHeight = tablePlusHeaderEl?.clientHeight ?? 0

    const { x: spacingX, y: spacingY } = getElementSpacing(el)
    const { height: tableHeaderHeight } = getElementSize(tableHeaderEl)
    const { height: paginationHeight } = getElementSize(paginationEl)

    const newHeight =
      tablePlusElHeight -
      spacingY -
      tablePlusHeaderHeight -
      tableHeaderHeight -
      paginationHeight
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
