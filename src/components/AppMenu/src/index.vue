<template>
  <n-menu
    v-model:value="innerSelectedKey"
    v-model:expanded-keys="innerExpandedKeys"
    :collapsed="collapsed"
    :collapsed-width="collapsedWidth"
    :options="options"
    :mode="mode"
    accordion
    :responsive="responsive"
    @update:expanded-keys="onExpandedKeys"
    @update-value="onUpdateValue"
  />
</template>
<script lang="ts" setup>
import { useTabs } from '@/composables'
import { renderIcon, renderMenus } from '@/utils'
import type { AppMenuProps, MenuEmits } from './types'

const { currentTab, openTab } = useTabs()

const {
  items = [],
  collapsed = false,
  collapsedWidth = 240,
  mode = 'vertical',
  responsive = false,
  selectedKey,
  expandedKeys = [],
} = defineProps<AppMenuProps>()
const emits = defineEmits<MenuEmits>()

const innerSelectedKey = ref<string | undefined>(selectedKey)
const innerExpandedKeys = ref<string[]>(expandedKeys)

const options = computed(() => {
  return renderMenus(
    items,
    (item) => {
      return {
        key: String(item.id),
        icon: renderIcon(item.icon, { size: 22 }),
      }
    },
    (item) => [0, 1].includes(item.type)
  )
})

const onExpandedKeys = () => {
  collapsed && emits('open')
}

const onUpdateValue = (key: string) => {
  openTab(key)
  collapsed && emits('open')
}

watch(
  () => selectedKey,
  (val) => {
    innerSelectedKey.value = val
  }
)

watch(
  () => expandedKeys,
  (val) => {
    innerExpandedKeys.value = val
  }
)

watch(
  () => currentTab.value,
  (val) => {
    const currentValue = String(val?.id ?? '')
    innerExpandedKeys.value = val?.level?.split('-') ?? []
    if (currentValue !== innerSelectedKey.value) {
      innerSelectedKey.value = currentValue
    }
  },
  { immediate: true }
)
</script>
