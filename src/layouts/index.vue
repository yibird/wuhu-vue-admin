<template>
  <a-layout class="h-full">
    <LayoutSider />
    <a-layout content-class="h-full">
      <Scrollbar class="h-full" content-class="min-h-full flex flex-col">
        <div :class="fixedHeader ? 'sticky top-0 z-100' : ''">
          <LayoutHeader />
          <LayoutTabs v-if="showTabs" />
        </div>
        <LayoutContent :style="contentStyle" />
        <LayoutFooter />
      </Scrollbar>
    </a-layout>
  </a-layout>
  <FloatingBar />
  <Preferences
    v-if="preferencesOpen"
    v-model:open="preferencesOpen"
    @close="closePreferences"
  />
  <!-- 首次打开后保持挂载,关闭动画才能播完 -->
  <SearchModal v-if="searchMounted" v-model:open="searchOpen" />
  <LockScreenModal v-if="isLocked" v-model:open="isLocked" />
</template>

<script lang="ts" setup>
import LayoutSider from './sider/index.vue'
import LayoutHeader from './header/index.vue'
import LayoutTabs from './tabs/index.vue'
import LayoutContent from './content/index.vue'
import LayoutFooter from './footer/index.vue'
import { Preferences, FloatingBar } from './preferences'
import { SearchModal, LockScreenModal } from './config'
import { Scrollbar } from '@/components/scrollbar'
import { useLayout } from './hooks'

const {
  fixedHeader,
  showTabs,
  contentStyle,
  searchOpen,
  searchMounted,
  preferencesOpen,
  isLocked,
  closePreferences,
} = useLayout()
</script>
