<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import LayoutSider from './sider/index.vue'
import LayoutHeader from './header/index.vue'
import LayoutTabs from './tabs/index.vue'
import LayoutContent from './content/index.vue'
import LayoutFooter from './footer/index.vue'
import PreferencesFloatingBar from './preferences/FloatingBar.vue'
import { LockScreenModal, SearchModal } from './config'
import { useGlobalSearch, useLockScreen } from './config/composables'
import { usePreferences } from './preferences/composables'
import { useGlobalShortcuts } from './shortcuts'
import { useTabNav } from './tabs/composables'
import { useAppStore } from '@/store'
import type { ErrorBoundaryErrorPayload } from '@/components'
import type { ScrollbarProps } from '@/components'

const { header, tab } = useAppStore()
const { searchVisible } = useGlobalSearch()
const { isLocked } = useLockScreen()
const { preferencesOpen, closePreferences } = usePreferences()
useGlobalShortcuts()
useTabNav()

const Preferences = defineAsyncComponent(
  () => import('./preferences/index.vue')
)

const fixedHeader = computed(() => header.value.fixed)
const contentMinHeight = computed(() => {
  if (!fixedHeader.value) return '100%'
  return tab.value.show ? 'calc(100% - 90px)' : 'calc(100% - 50px)'
})
const layoutScrollbarOptions = {
  overflow: { x: 'hidden', y: 'scroll' },
} satisfies ScrollbarProps['options']

const handleClientError = (payload: ErrorBoundaryErrorPayload) => {
  if (!import.meta.env.DEV) return
  console.error('[ClientError]', payload)
}
</script>

<template>
  <a-layout class="h-full">
    <LayoutSider />
    <a-layout content-class="h-full">
      <Scrollbar
        class="h-full"
        content-class="min-h-full flex flex-col"
        :options="layoutScrollbarOptions"
      >
        <div :class="fixedHeader ? 'sticky top-0 z-1000' : ''">
          <LayoutHeader />
          <LayoutTabs v-if="tab.show" />
        </div>
        <LayoutContent
          class="w-full"
          :style="{ minHeight: contentMinHeight }"
          @client-error="handleClientError"
        />
        <layoutFooter />
      </Scrollbar>
    </a-layout>
  </a-layout>
  <PreferencesFloatingBar />
  <Preferences v-model:open="preferencesOpen" @close="closePreferences" />
  <SearchModal v-model:show="searchVisible" />
  <LockScreenModal v-if="isLocked" v-model:show="isLocked" />
</template>
