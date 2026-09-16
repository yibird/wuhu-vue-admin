<template>
  <WView class="absolute overflow-hidden bg-page">
    <div class="h-full min-h-0 flex flex-col">
      <DesignerHeader
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
          class="min-h-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-elevated"
        >
          <SidebarPanel />
        </aside>

        <CanvasStage
          class="min-h-0 rounded-8 border-1 border-color-2 border-solid bg-container shadow-elevated"
          :space-pressed="spacePressed"
          :fullscreen="fullscreen"
          @toggle-fullscreen="fullscreen = !fullscreen"
        />

        <aside
          v-show="!fullscreen"
          class="min-h-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-elevated"
        >
          <InspectorPanel />
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
import {
  provideDesigner,
  useDesigner,
  useDesignerShortcuts,
} from './composables'
import { setupLowCodePlatform } from './core/setup'

setupLowCodePlatform()

const designer = useDesigner()
provideDesigner(designer)

const fullscreen = ref(false)
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
