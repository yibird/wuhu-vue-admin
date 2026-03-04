import elementResizeDetectorMaker from 'element-resize-detector'
import { throttle } from 'es-toolkit'
import { getElementSize, getElSpacing } from '@/utils'

const TABLE_PLUS_CLASS_NAME = '.table-plus'
const HEADER_CLASS_NAME = '.table-plus-header'
const N_HEADER_CLASS_NAME = '.n-data-table-base-table-header'
const N_PAGINATION_CLASS_NAME = '.n-data-table__pagination'
const N_BORDER_CLASS_NAME = '.n-data-table--bordered'

interface UseSizeOptions {
  /**
   * 是否开启自动计算 size
   * @default true
   */
  autoSize?: boolean | Ref<boolean | undefined>
  /**
   * 是否监听目标元素 resize 时重新计算 size
   * @default true
   */
  resize?: boolean
}

export function useSize(
  target?: Ref<HTMLElement | undefined> | HTMLElement | (() => HTMLElement),
  options: UseSizeOptions = {
    autoSize: true,
    resize: true
  }
) {
  const height = ref(200)
  const width = ref<number>()
  const erdInstance = ref<elementResizeDetectorMaker.Erd | null>()

  const getTargetEl = () =>
    isRef(target) ? target.value : typeof target === 'function' ? target() : target

  const calculateSize = throttle(function () {
    nextTick(() => {
      const el = getTargetEl()
      if (!el) return

      const tablePlusEl = el.closest<HTMLElement>(TABLE_PLUS_CLASS_NAME)
      if (!tablePlusEl) return

      const tablePlusHeaderEl = tablePlusEl.querySelector<HTMLElement>(HEADER_CLASS_NAME)
      const nTableHeaderEl = el.querySelector<HTMLElement>(N_HEADER_CLASS_NAME)
      const nPaginationEl = el.querySelector<HTMLElement>(N_PAGINATION_CLASS_NAME)

      const tablePlusElHeight = tablePlusEl.clientHeight ?? 0
      const tablePlusElWidth = tablePlusEl.clientWidth ?? 0
      const tablePlusHeaderHeight = tablePlusHeaderEl?.clientHeight ?? 0

      const { x: tablePlusSpacingX, y: tablePlusSpacingY } = getElSpacing(el)
      const { height: nTableHeaderHeight } = getElementSize(nTableHeaderEl)
      const { height: nPaginationHeight } = getElementSize(nPaginationEl)

      const hasBordered = !!el.querySelector(N_BORDER_CLASS_NAME)

      height.value =
        tablePlusElHeight -
        tablePlusSpacingY -
        tablePlusHeaderHeight -
        nTableHeaderHeight -
        nPaginationHeight
      width.value = tablePlusElWidth - tablePlusSpacingX - (hasBordered ? 2 : 0)
    })
  }, 20)

  onMounted(() => {
    if (options.autoSize) {
      calculateSize()
    }
    erdInstance.value = elementResizeDetectorMaker()
    if (options.resize) {
      const el = getTargetEl()
      if (!el) return
      erdInstance.value.listenTo(el, calculateSize)
    }
  })

  onUnmounted(() => {
    if (erdInstance.value) {
      const el = getTargetEl()
      if (!el) return
      erdInstance.value.uninstall(el)
      erdInstance.value = null
    }
  })

  return { height, width, calculateSize }
}
