<template>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="x"
    :y="y"
    :options="options"
    :show="showDropdown"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  />
</template>
<script lang="ts" setup>
  import type { MenuOption } from 'naive-ui'
  import type { TablePlusContextMenuInstance } from '../types'

  const showDropdown = ref(false)
  const x = ref(0)
  const y = ref(0)
  const options = ref<MenuOption[]>([])

  const hide = () => {
    showDropdown.value = false
  }

  const handleSelect = () => {
    hide()
  }

  const onClickoutside = () => {
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
    hide: hide
  })
</script>
