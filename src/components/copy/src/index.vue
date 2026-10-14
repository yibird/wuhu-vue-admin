<template>
  <span
    class="w-copy inline-flex items-center gap-4 cursor-pointer"
    @click="handleCopy"
  >
    <slot name="prefix" />
    <span ref="contentRef">
      <slot />
    </span>
    <slot name="suffix">
      <Icon name="i-lucide:copy" />
    </slot>
  </span>
</template>

<script lang="ts" setup>
import { message } from 'antdv-next'
import { useClipboard } from '@vueuse/core'
import { Icon } from '../../icon'
import type { CopySlots } from './types'

defineOptions({ name: 'Copy' })

defineSlots<CopySlots>()

const contentRef = useTemplateRef<HTMLElement>('contentRef')
const { copy } = useClipboard({ legacy: true })

/**
 * 复制默认插槽中的文本并提示结果
 */
async function handleCopy() {
  const text = contentRef.value?.textContent?.trim()
  if (!text) return

  try {
    await copy(text)
    message.success('复制成功')
  } catch {
    message.error('复制失败')
  }
}
</script>
