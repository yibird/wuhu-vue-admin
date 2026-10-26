<template>
  <WView class="absolute overflow-hidden bg-page">
    <div class="h-full min-h-0 flex flex-col">
      <DesignerHeader
        @open-ai="openAi"
        @open-data="dataOpen = true"
        @open-materials="materialsOpen = true"
        @open-source="sourceOpen = true"
        @open-preview="previewOpen = true"
        @open-versions="versionOpen = true"
        @open-publish="publishOpen = true"
      />

      <div
        class="min-h-0 flex-1 overflow-hidden py-8"
        :class="
          fullscreen
            ? 'grid grid-cols-1'
            : 'grid grid-cols-[280px_minmax(0,1fr)_320px] gap-8'
        "
      >
        <aside
          v-show="!fullscreen"
          class="min-h-0 overflow-hidden rounded-8 b-1-regular bg-container shadow-overlay"
        >
          <SidebarPanel />
        </aside>

        <CanvasStage
          class="min-h-0 rounded-8 b-1-regular bg-container shadow-overlay"
          :space-pressed="spacePressed"
          :fullscreen="fullscreen"
          @toggle-fullscreen="fullscreen = !fullscreen"
          @open-ai="openAi"
        />

        <aside
          v-show="!fullscreen"
          class="min-h-0 overflow-hidden rounded-8 b-1-regular bg-container shadow-overlay"
        >
          <InspectorPanel v-model:mode="inspectorMode" />
        </aside>
      </div>
    </div>

    <DataDrawer :open="dataOpen" @close="dataOpen = false" />
    <MaterialCenterDrawer
      :open="materialsOpen"
      @close="materialsOpen = false"
    />
    <SourceModal :open="sourceOpen" @close="sourceOpen = false" />
    <PreviewModal :open="previewOpen" @close="previewOpen = false" />
    <VersionModal :open="versionOpen" @close="versionOpen = false" />
    <PublishModal :open="publishOpen" @close="publishOpen = false" />
  </WView>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { WView } from '@/components'
import {
  CanvasStage,
  DataDrawer,
  DesignerHeader,
  InspectorPanel,
  MaterialCenterDrawer,
  PreviewModal,
  PublishModal,
  SidebarPanel,
  SourceModal,
  VersionModal,
} from './components'
import { provideDesigner, useDesigner, useDesignerShortcuts } from './hooks'
import { setupLowCodePlatform } from './core/setup'

setupLowCodePlatform()

const designer = useDesigner()
provideDesigner(designer)

const fullscreen = ref(false)
const inspectorMode = ref<'settings' | 'ai'>('settings')
const dataOpen = ref(false)
const materialsOpen = ref(false)
const sourceOpen = ref(false)
const previewOpen = ref(false)
const versionOpen = ref(false)
const publishOpen = ref(false)

const overlayOpen = computed(
  () =>
    dataOpen.value ||
    materialsOpen.value ||
    sourceOpen.value ||
    previewOpen.value ||
    versionOpen.value ||
    publishOpen.value
)

/** 打开右侧检查器的 AI 生成面板 */
function openAi() {
  fullscreen.value = false
  inspectorMode.value = 'ai'
}

const { spacePressed } = useDesignerShortcuts({
  designer,
  disabled: () => overlayOpen.value,
})

onMounted(() => {
  designer.runtime.refreshAutoQueries()
})

onBeforeUnmount(() => {
  designer.saveDraftNow()
  designer.runtime.dispose()
})
</script>
