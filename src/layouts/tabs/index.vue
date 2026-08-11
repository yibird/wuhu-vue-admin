<template>
  <div
    data-testid="layout-tabs"
    :class="['layout-tabs', `layout-tabs-${theme ?? 'card'}`]"
  >
    <TabPrev @click="rollLeft" />
    <TabHome :active="current === -1" @click="openHomeTab" />
    <div ref="tabsRef" class="layout-tabs-list">
      <TabList
        v-model:items="tabs"
        :current="current"
        :showIcon="showIcon"
        @change="openTab"
        @close="closeTab"
        @drag-end="onDragEnd"
        @close-current="closeCurrentTab"
        @close-left="closeLeftTab"
        @close-right="closeRightTab"
        @close-other="closeOtherTab"
        @close-all="closeAllTab"
        @toggle-pin="togglePinTab"
      />
    </div>
    <TabNext @click="rollRight" />
    <TabRefresh @click="refreshTab" />
    <TabAction
      @refresh="refreshTab"
      @close-current="closeCurrentTab"
      @close-left="closeLeftTab"
      @close-right="closeRightTab"
      @close-other="closeOtherTab"
      @close-all="closeAllTab"
    />
  </div>
</template>
<script lang="ts" setup>
import { useTabs } from '@/composables'
import { useRoll } from './composables'
import {
  TabPrev,
  TabHome,
  TabList,
  TabNext,
  TabRefresh,
  TabAction,
} from './components'
import './style/index.less'

const {
  tabs,
  current,
  currentTab,
  showIcon,
  theme,

  openHomeTab,
  openTab,
  closeTab,
  closeCurrentTab,
  closeLeftTab,
  closeRightTab,
  closeOtherTab,
  closeAllTab,
  sortTabs,
  togglePinTab,
  refreshTab,
} = useTabs()

const tabsRef = useTemplateRef<HTMLElement>('tabsRef')
const { rollLeft, rollRight } = useRoll(tabsRef, () => currentTab.value?.name)

const onDragEnd = (tab: (typeof tabs.value)[number]) => {
  sortTabs(tab)
}
</script>
