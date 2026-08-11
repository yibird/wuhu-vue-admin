<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        data-testid="search-modal"
        class="fixed inset-0 z-[var(--w-global-search-z-index)] full bg-mask-5 backdrop-blur-3"
        role="dialog"
        aria-label="全局搜索"
        aria-modal="true"
        @click.self="onClickOut"
        @keydown.esc.stop.prevent="close"
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
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script lang="ts" setup>
import { Search, List } from './components'
import { useTabs } from '@/composables'
import type { SearchModalEmits } from '../types'
import type { IMenu } from '#/config'

const show = defineModel('show', { default: false })
const emits = defineEmits<SearchModalEmits>()

const containerRef = ref<HTMLDivElement>()
const searchRef = ref<InstanceType<typeof Search> | null>(null)
const searchValue = ref('')
const isMouseDownInside = ref(false)
const { flatMenus, openTab } = useTabs()
const searchableMenus = computed(() =>
  flatMenus.value.filter((item) => [1, 2].includes(item.type) && item.path)
)

const close = () => {
  show.value = false
  emits('close')
}

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

watch(show, (value) => {
  if (!value) {
    searchValue.value = ''
    return
  }

  nextTick(() => {
    searchRef.value?.focus()
  })
})
</script>
