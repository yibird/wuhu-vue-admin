<script setup lang="ts">
import { computed, shallowRef, useTemplateRef, watch } from 'vue'
import { Icon } from '@/components/icon'
import { useDraggableCallWindow } from './useDraggable'
import type { CallStatus } from './types'

const props = defineProps<{
  fallbackHeight?: number
  fallbackWidth?: number
  open: boolean
  status: CallStatus
  statusText: string
  title: string
  variant?: 'voice' | 'video'
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  end: []
}>()

const minimized = shallowRef(false)
const windowRef = useTemplateRef<HTMLElement>('windowRef')
const dragHandleRef = useTemplateRef<HTMLElement>('dragHandleRef')
const {
  dragging,
  windowStyle,
  keepWindowInViewportAfterRender,
  placeWindowAtBottomRightAfterRender,
  resetWindowPositionAfterRender,
} = useDraggableCallWindow(windowRef, dragHandleRef, {
  disabled: () => !props.open,
  fallbackHeight: () => props.fallbackHeight ?? 420,
  fallbackWidth: () =>
    props.fallbackWidth ?? (props.variant === 'video' ? 420 : 380),
})

const windowClass = computed(() => ({
  'call-window-minimized': minimized.value,
  'call-window-dragging': dragging.value,
  '!w-420 max-w-[calc(100vw-32px)]':
    props.variant === 'video' && !minimized.value,
}))

watch(
  () => props.open,
  (open) => {
    if (!open) return

    minimized.value = false
    resetWindowPositionAfterRender()
  },
  { immediate: true }
)

watch(minimized, (value) => {
  if (value) {
    placeWindowAtBottomRightAfterRender()
    return
  }
  keepWindowInViewportAfterRender()
})

function endCall() {
  emit('end')
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <transition name="chat-call-window">
      <section
        v-if="open"
        ref="windowRef"
        class="call-window"
        :class="windowClass"
        :style="windowStyle"
      >
        <header class="call-header">
          <div
            ref="dragHandleRef"
            aria-label="移动通话窗口"
            class="call-drag-handle min-w-0 flex items-center gap-10"
            role="button"
            tabindex="0"
          >
            <span class="call-status-dot" :class="`call-status-${status}`" />
            <div class="min-w-0">
              <div class="truncate text-sm text-main font-600">
                {{ title }}
              </div>
              <div class="text-xs text-secondary">{{ statusText }}</div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button
              type="button"
              class="call-icon-button"
              :title="minimized ? '展开' : '最小化'"
              @click="minimized = !minimized"
            >
              <Icon
                :name="minimized ? 'i-lucide:maximize-2' : 'i-lucide:minus'"
                :size="16"
              />
            </button>
            <button
              type="button"
              class="call-icon-button"
              title="关闭"
              @click="endCall"
            >
              <Icon name="i-lucide:x" :size="16" />
            </button>
          </div>
        </header>

        <div v-show="!minimized" class="call-body">
          <slot />
        </div>
      </section>
    </transition>
  </Teleport>
</template>
