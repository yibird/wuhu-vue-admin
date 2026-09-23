<template>
  <div
    data-testid="layout-tabs"
    :class="['layout-tabs', `layout-tabs-${theme ?? 'card'}`]"
  >
    <TabPrev @click="rollLeft" />
    <TabHome :active="!activeKey" @click="openHomeTab" />
    <div ref="tabsRef" class="layout-tabs-list">
      <TabList
        v-model:items="tabs"
        :activeKey="activeKey"
        :showIcon="showIcon"
        @change="openTab"
        @close="closeTab"
        @drag-end="onDragEnd"
        @close-current="closeCurrentTab"
        @close-left="closeLeftTabs"
        @close-right="closeRightTabs"
        @close-other="closeOtherTabs"
        @close-all="closeAllTabs"
        @toggle-pin="togglePinTab"
      />
    </div>
    <TabNext @click="rollRight" />
    <TabRefresh @click="refreshCurrentTab" />
    <TabAction
      @refresh="refreshCurrentTab"
      @close-current="closeCurrentTab"
      @close-left="closeLeftTabs"
      @close-right="closeRightTabs"
      @close-other="closeOtherTabs"
      @close-all="closeAllTabs"
    />
  </div>
</template>
<script lang="ts" setup>
import { useTabs } from '@/hooks'
import { useConfig, useRoll } from './hooks'
import {
  TabPrev,
  TabHome,
  TabList,
  TabNext,
  TabRefresh,
  TabAction,
} from './components'
import './style'

const {
  tabs,
  currentTab,
  activeKey,

  openHomeTab,
  openTab,
  closeTab,
  closeCurrentTab,
  closeLeftTabs,
  closeRightTabs,
  closeOtherTabs,
  closeAllTabs,
  sortTabs,
  togglePinTab,
  refreshCurrentTab,
} = useTabs()

const tabsRef = useTemplateRef<HTMLElement>('tabsRef')

const { showIcon, theme } = useConfig()
const { rollLeft, rollRight } = useRoll(tabsRef, () => currentTab.value?.key)

const onDragEnd = () => {
  sortTabs()
}
</script>
