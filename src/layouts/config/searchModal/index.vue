<template>
  <Teleport to="body">
    <Transition name="fade" @after-leave="restoreFocus">
      <div
        v-if="open"
        data-testid="search-modal"
        class="fixed inset-0 z-[var(--w-global-search-z-index)] full bg-mask-5 backdrop-blur-3"
        role="dialog"
        aria-label="全局搜索"
        aria-modal="true"
        @click.self="onClickOut"
        @mousedown="onMousedown"
        @mouseup="onMouseUp"
      >
        <div
          ref="containerRef"
          class="absolute left-1/2 top-80 w-560 max-w-[calc(100vw-24px)] -translate-x-1/2 sm:top-112"
          @click.stop
        >
          <Transition name="fade-zoom" appear>
            <div
              class="w-full origin-top translate-y-0 scale-100 transform-gpu overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-elevated shadow-[0_28px_80px_rgb(var(--w-bg-mask-rgb)_/_28%)] will-change-[transform,opacity]"
            >
              <Search ref="searchRef" v-model.lazy="searchValue" />
              <List
                :items="searchableMenus"
                :searchValue="searchValue"
                @select="onSelect"
              />
              <div
                class="flex items-center justify-end gap-6 border-t-1 border-color-2 border-t-solid px-14 py-8 text-xs text-muted"
              >
                <span>按</span>
                <kbd
                  class="rounded-4 border-1 border-color-2 border-solid bg-fill-3 px-6 py-2 font-500 text-main leading-16px"
                >
                  Esc
                </kbd>
                <span>关闭</span>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { Search, List } from './components'
import { useTabs } from '@/composables'
import type { SearchModalEmits } from '../types'
import type { IMenu } from '#/config'

const open = defineModel('open', { default: false })
const emits = defineEmits<SearchModalEmits>()

const containerRef = ref<HTMLDivElement>()
const searchRef = ref<InstanceType<typeof Search> | null>(null)
const searchValue = ref('')
const isMouseDownInside = ref(false)
const previouslyFocusedElement = shallowRef<HTMLElement | null>(null)
const { flatMenus, openTab } = useTabs()
const searchableMenus = computed(() =>
  flatMenus.value.filter((item) => [1, 2].includes(item.type) && item.path)
)

const close = () => {
  if (!open.value) return
  open.value = false
  emits('close')
}

function handleWindowKeydown(event: KeyboardEvent) {
  if (!open.value || event.key !== 'Escape') return

  event.preventDefault()
  event.stopPropagation()
  close()
}

useEventListener(window, 'keydown', handleWindowKeydown, { capture: true })

const onMousedown = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const container = containerRef.value
  isMouseDownInside.value = container?.contains(target) || false
}

const onMouseUp = () => {
  setTimeout(() => {
    isMouseDownInside.value = false
  }, 0)
}

const onClickOut = (e: MouseEvent) => {
  const targetEl = e.target as HTMLElement
  const containerEl = containerRef.value

  if (
    containerEl &&
    !containerEl.contains(targetEl) &&
    !isMouseDownInside.value
  ) {
    close()
  }
}

const onSelect = ({ item }: { item: IMenu; index: number }) => {
  openTab(String(item.id))
  close()
}

const restoreFocus = () => {
  const element = previouslyFocusedElement.value
  previouslyFocusedElement.value = null
  if (element?.isConnected) element.focus({ preventScroll: true })
}

watch(
  open,
  async (value) => {
    if (!value) {
      searchValue.value = ''
      return
    }

    previouslyFocusedElement.value =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    await nextTick()
    searchRef.value?.focus()
  },
  { immediate: true }
)
</script>
