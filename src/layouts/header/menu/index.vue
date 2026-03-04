<template>
  <div class="flex-1">
    <n-menu
      v-model:value="selectedKey"
      :options="options"
      mode="horizontal"
      accordion
      @update-value="onUpdateValue"
    />
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { appStore, permissionStore } from '@/store'
import { MenuMode } from '@/constant'
import { emitter, renderIcon, renderMenus } from '@/utils'
import { useTabs } from '@/composables'
import { Events } from '@/constant'

const { app } = storeToRefs(appStore())
const { menus } = storeToRefs(permissionStore())
const { openTab, currentTab } = useTabs()
const selectedKey = ref()

const options = computed(() => {
  const items =
    app.value.menuMode === MenuMode.Horizontal
      ? menus.value
      : menus.value.map((item) => ({ ...item, children: undefined }))
  return renderMenus(items, (item) => ({
    key: String(item.id),
    icon: renderIcon(item.icon, { size: 20 }),
  }))
})

const onUpdateValue = (key: string) => {
  if (app.value.menuMode === MenuMode.Horizontal) {
    openTab(Number(key))
  }
  emitter.emit(Events.CHANGE_TOP_MENU_ID, key)
}

watch(
  [() => currentTab.value, () => app.value.menuMode],
  ([val, mode]) => {
    if (!val) return
    if (mode === MenuMode.Horizontal) {
      selectedKey.value = val?.name
    }

    if (mode === MenuMode.Mix) {
      selectedKey.value = String(val.rootId)
      emitter.emit(Events.CHANGE_TOP_MENU_ID, selectedKey.value)
    }
  },
  { immediate: true }
)
</script>
