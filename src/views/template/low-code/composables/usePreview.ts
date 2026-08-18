import { computed, reactive, shallowRef, watch, type Ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import message from 'antdv-next/dist/message/index'
import type {
  DesignerNode,
  DesignerPlatform,
  DesignerPlatformOption,
  DesignerPreviewMode,
  DesignerPreviewSize,
} from '../types'

interface UseDesignerPreviewOptions {
  nodes: Readonly<Ref<DesignerNode[]>>
  open: Readonly<Ref<boolean>>
  platform: Readonly<Ref<DesignerPlatform>>
  platforms: Readonly<Ref<DesignerPlatformOption[]>>
}

const defaultPreviewSize: Record<DesignerPlatform, DesignerPreviewSize> = {
  pc: { width: 1440, height: 900 },
  tablet: { width: 1024, height: 768 },
  mobile: { width: 480, height: 852 },
}

const customSizePresets: DesignerPreviewSize[] = [
  { width: 1480, height: 840 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1280, height: 720 },
  { width: 1024, height: 768 },
  { width: 820, height: 1180 },
  { width: 768, height: 1024 },
  { width: 480, height: 852 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
]

function getSizeValue(size: DesignerPreviewSize) {
  return `${size.width}x${size.height}`
}

function getSizeLabel(size: DesignerPreviewSize) {
  return `${size.width} x ${size.height}`
}

function parseSizeValue(value: string) {
  const [width, height] = value.split('x').map((item) => Number(item))
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null
  return { width, height }
}

function canUseNativeShare() {
  return (
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  )
}

export function useDesignerPreview(options: UseDesignerPreviewOptions) {
  const { copy, isSupported } = useClipboard({ legacy: true })
  const previewMode = shallowRef<DesignerPreviewMode>(options.platform.value)
  const isFullscreen = shallowRef(false)
  const customSize = reactive<DesignerPreviewSize>({
    width: defaultPreviewSize[options.platform.value]?.width ?? 1440,
    height: defaultPreviewSize[options.platform.value]?.height ?? 900,
  })

  const platformMap = computed(() => {
    return new Map(options.platforms.value.map((item) => [item.value, item]))
  })

  const previewModeOptions = computed(() => [
    ...options.platforms.value.map((item) => ({
      value: item.value,
      label: item.label,
      iconName: item.icon,
    })),
    {
      value: 'custom',
      label: '自定义',
      iconName: 'i-lucide:ruler',
    },
  ])

  const isCustomMode = computed(() => previewMode.value === 'custom')

  const customSizeValue = computed(() => getSizeValue(customSize))

  const customSizeOptions = computed(() => {
    const optionMap = new Map(
      customSizePresets.map((size) => [
        getSizeValue(size),
        {
          label: getSizeLabel(size),
          value: getSizeValue(size),
        },
      ])
    )

    const currentValue = customSizeValue.value
    if (!optionMap.has(currentValue)) {
      optionMap.set(currentValue, {
        label: getSizeLabel(customSize),
        value: currentValue,
      })
    }

    return Array.from(optionMap.values())
  })

  const previewSize = computed<DesignerPreviewSize>(() => {
    if (previewMode.value === 'custom') {
      return {
        width: customSize.width,
        height: customSize.height,
      }
    }

    const platform = platformMap.value.get(previewMode.value)
    const fallbackSize = defaultPreviewSize[previewMode.value]
    return {
      width: platform?.width ?? fallbackSize.width,
      height: fallbackSize.height,
    }
  })

  const previewModeLabel = computed(() => {
    if (previewMode.value === 'custom') return '自定义'
    return platformMap.value.get(previewMode.value)?.label ?? 'PC'
  })

  const previewSizeText = computed(
    () => `${previewSize.value.width} x ${previewSize.value.height}px`
  )

  const modalWidth = computed(() =>
    isFullscreen.value ? '100vw' : 'min(96vw, 1600px)'
  )

  const modalClassName = computed(() =>
    [
      'low-code-preview-modal',
      isFullscreen.value ? 'low-code-preview-modal--fullscreen' : '',
    ]
      .filter(Boolean)
      .join(' ')
  )

  function getPlatformSize(platform: DesignerPlatform) {
    const fallbackSize = defaultPreviewSize[platform]
    return {
      width: platformMap.value.get(platform)?.width ?? fallbackSize.width,
      height: fallbackSize.height,
    }
  }

  function syncCustomSize(size: DesignerPreviewSize) {
    customSize.width = size.width
    customSize.height = size.height
  }

  function resetPreview(platform = options.platform.value) {
    const nextMode = platformMap.value.has(platform)
      ? platform
      : (options.platforms.value[0]?.value ?? 'pc')
    previewMode.value = nextMode
    syncCustomSize(getPlatformSize(nextMode))
    isFullscreen.value = false
  }

  function setPreviewMode(mode: DesignerPreviewMode) {
    if (mode === previewMode.value) return
    if (mode === 'custom') {
      syncCustomSize(previewSize.value)
    }
    previewMode.value = mode
  }

  function selectCustomSize(value: string | number) {
    const size = parseSizeValue(String(value))
    if (!size) return
    syncCustomSize(size)
  }

  function toggleFullscreen() {
    isFullscreen.value = !isFullscreen.value
  }

  function exitFullscreen() {
    isFullscreen.value = false
  }

  function createPreviewUrl() {
    if (typeof window === 'undefined') return ''

    const url = new URL(window.location.href)
    url.searchParams.set('preview', 'low-code')
    url.searchParams.set('device', previewMode.value)
    url.searchParams.set('width', String(previewSize.value.width))
    url.searchParams.set('height', String(previewSize.value.height))
    return url.toString()
  }

  function createPreviewSummary() {
    return [
      '低代码页面预览',
      `设备：${previewModeLabel.value}`,
      `尺寸：${previewSizeText.value}`,
      `组件：${options.nodes.value.length} 个`,
      createPreviewUrl(),
    ]
      .filter(Boolean)
      .join('\n')
  }

  function createPreviewConfig() {
    return JSON.stringify(
      {
        preview: {
          mode: previewMode.value,
          label: previewModeLabel.value,
          size: previewSize.value,
        },
        components: options.nodes.value,
      },
      null,
      2
    )
  }

  async function copyText(text: string, successText: string) {
    if (!isSupported.value) {
      message.warning('当前环境不支持复制')
      return false
    }

    try {
      await copy(text)
      message.success(successText)
      return true
    } catch {
      message.error('复制失败，请稍后重试')
      return false
    }
  }

  async function copyPreviewLink() {
    return copyText(createPreviewSummary(), '预览分享信息已复制')
  }

  async function copyPreviewConfig() {
    return copyText(createPreviewConfig(), '预览配置已复制')
  }

  async function sharePreview() {
    const url = createPreviewUrl()
    if (canUseNativeShare()) {
      try {
        await navigator.share({
          title: '低代码页面预览',
          text: `${previewModeLabel.value} · ${previewSizeText.value}`,
          url,
        })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
      }
    }

    await copyPreviewLink()
  }

  watch(
    () => options.open.value,
    (open) => {
      if (open) {
        resetPreview()
        return
      }

      exitFullscreen()
    },
    { immediate: true }
  )

  return {
    customSize,
    customSizeOptions,
    customSizeValue,
    isCustomMode,
    isFullscreen,
    modalClassName,
    modalWidth,
    previewMode,
    previewModeLabel,
    previewModeOptions,
    previewSize,
    previewSizeText,
    copyPreviewConfig,
    copyPreviewLink,
    exitFullscreen,
    resetPreview,
    selectCustomSize,
    setPreviewMode,
    sharePreview,
    toggleFullscreen,
  }
}
