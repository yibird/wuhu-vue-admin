import { computed, shallowRef, useTemplateRef, watch, type Ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import type { DesignerPreviewSize } from '../types'

interface UsePreviewStageScaleOptions {
  size: Readonly<Ref<DesignerPreviewSize>>
}

export function usePreviewStageScale(options: UsePreviewStageScaleOptions) {
  const stageRef = useTemplateRef<HTMLElement>('previewStage')
  const stagePadding = shallowRef(0)
  const { width: stageWidth, height: stageHeight } = useElementSize(stageRef)

  const scale = computed(() => {
    const availableWidth = Math.max(
      stageWidth.value - stagePadding.value * 2,
      0
    )
    const availableHeight = Math.max(
      stageHeight.value - stagePadding.value * 2,
      0
    )

    if (!availableWidth || !availableHeight) return 1

    return Math.min(
      availableWidth / options.size.value.width,
      availableHeight / options.size.value.height,
      1
    )
  })

  const scaledSize = computed(() => ({
    height: Math.round(options.size.value.height * scale.value),
    width: Math.round(options.size.value.width * scale.value),
  }))

  const viewportStyle = computed(() => ({
    height: `${scaledSize.value.height}px`,
    width: `${scaledSize.value.width}px`,
  }))

  const surfaceScaleStyle = computed(() => ({
    transform: `scale(${scale.value})`,
  }))

  watch(
    stageRef,
    (element) => {
      if (!element) {
        stagePadding.value = 0
        return
      }

      const style = window.getComputedStyle(element)
      stagePadding.value = Math.max(
        Number.parseFloat(style.paddingTop) || 0,
        Number.parseFloat(style.paddingRight) || 0,
        Number.parseFloat(style.paddingBottom) || 0,
        Number.parseFloat(style.paddingLeft) || 0
      )
    },
    { immediate: true }
  )

  return {
    scale,
    surfaceScaleStyle,
    viewportStyle,
  }
}
