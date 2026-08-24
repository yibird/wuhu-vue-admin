<script lang="ts" setup>
import LayoutSider from './sider/index.vue'
import LayoutHeader from './header/index.vue'
import LayoutTabs from './tabs/index.vue'
import LayoutContent from './content/index.vue'
import LayoutFooter from './footer/index.vue'
import FloatingBar from './preferences/components/FloatingBar.vue'
import { useGlobalSearch, useLockScreen } from './config/composables'
import { usePreferences } from './preferences/composables/usePreferences'
import { useGlobalShortcuts } from './preferences/composables/useShortcuts'
import { useTabNav } from './tabs/composables'
import { useAppStore } from '@/store'

const { header, tab } = useAppStore()
const { searchMounted, searchVisible } = useGlobalSearch()
const { isLocked } = useLockScreen()
const { preferencesOpen, closePreferences } = usePreferences()
useTabNav()
useGlobalShortcuts()

const Preferences = defineAsyncComponent(
  () => import('./preferences/index.vue')
)
const SearchModal = defineAsyncComponent(
  () => import('./config/searchModal/index.vue')
)
const LockScreenModal = defineAsyncComponent(
  () => import('./config/lockScreen/index.vue')
)

const fixedHeader = computed(() => header.value.fixed)
const contentMinHeight = computed(() => {
  if (!fixedHeader.value) return '100%'
  return tab.value.show ? 'calc(100% - 90px)' : 'calc(100% - 50px)'
})
</script>

<template>
  <a-layout class="h-full">
    <LayoutSider />
    <a-layout content-class="h-full">
      <Scrollbar
        class="h-full"
        content-class="min-h-full flex flex-col"
        :options="{ x: 'hidden', y: 'scroll' }"
      >
        <div :class="fixedHeader ? 'sticky top-0 z-1000' : ''">
          <LayoutHeader />
          <LayoutTabs v-if="tab.show" />
        </div>
        <LayoutContent :style="{ minHeight: contentMinHeight }" />
        <layoutFooter />
      </Scrollbar>
    </a-layout>
  </a-layout>
  <FloatingBar />
  <Preferences
    v-if="preferencesOpen"
    v-model:open="preferencesOpen"
    @close="closePreferences"
  />
  <SearchModal v-if="searchMounted" v-model:open="searchVisible" />
  <LockScreenModal v-if="isLocked" v-model:open="isLocked" />
</template>
