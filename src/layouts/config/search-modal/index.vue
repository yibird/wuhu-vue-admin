<template>
  <Transition name="fade">
    <Teleport to="body">
      <div
        v-if="show"
        :class="['search-modal', { 'search-modal-show': show }]"
        @click.self="onClickOut"
        @mousedown="onMousedown"
        @mouseup="onMouseUp"
      >
        <div
          ref="containerRef"
          class="absolute-x-center w-500 my-150 bg-white rounded-4"
          @click.stop="onClickInner"
        >
          <Search v-model.lazy="searchValue" />
          <List :items="flatMenus" :searchValue="searchValue" />
        </div>
      </div>
    </Teleport>
  </Transition>
</template>
<script lang="ts" setup>
import { onKeyStroke } from '@vueuse/core'
import { Search, List } from './components'
import type { SearchModalEmits } from '../types'
import { useTabs } from '@/composables'

const show = defineModel('show', { default: false })
const emits = defineEmits<SearchModalEmits>()

const containerRef = ref<HTMLDivElement>()
const searchValue = ref('')
const isMouseDownInside = ref(false)
const { flatMenus } = useTabs()

onKeyStroke('Escape', () => {
  if (show.value) {
    emits('close')
  }
})

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
  console.log('Asdasdasd')

  if (
    containerEl &&
    !containerEl.contains(targetEl) &&
    !isMouseDownInside.value
  ) {
    emits('close')
  }
}
const onClickInner = () => {}
</script>
<style scoped lang="less">
.search-modal {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
