<template>
  <a-dropdown
    v-model:open="showDropdown"
    :trigger="['click']"
    :menu="{ items: options }"
    placement="bottomLeft"
    @menu-click="handleSelect"
  >
    <span class="context-menu-anchor" :style="anchorStyle" />
  </a-dropdown>
</template>
<script lang="ts" setup>
import type { TablePlusContextMenuInstance } from '../types'

const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)
const options = ref<any[]>([])
const anchorStyle = computed(() => ({
  left: `${x.value}px`,
  top: `${y.value}px`,
}))

const hide = () => {
  showDropdown.value = false
}

const handleSelect = () => {
  hide()
}

defineExpose<TablePlusContextMenuInstance>({
  show(e, menuOptions) {
    e.preventDefault()
    showDropdown.value = false
    nextTick().then(() => {
      showDropdown.value = true
      x.value = e.clientX
      y.value = e.clientY
      options.value = menuOptions ?? []
    })
  },
  hide: hide,
})
</script>
<style scoped>
.context-menu-anchor {
  position: fixed;
  width: 0;
  height: 0;
  pointer-events: none;
}
</style>
