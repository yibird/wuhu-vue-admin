<script setup lang="ts">
import { shallowRef } from 'vue'
import { ErrorBoundary } from '@/components/errorBoundary'
import { Icon } from '@/components/icon'
import { Scrollbar } from '@/components/scrollbar'
import DemoFault from './DemoFault.vue'
import type { ErrorBoundaryErrorPayload } from '@/components/errorBoundary'

const faultActive = shallowRef(false)
const lastError = shallowRef('尚未捕获错误')

function handleBoundaryError(payload: ErrorBoundaryErrorPayload) {
  lastError.value = `${payload.componentName}: ${payload.message}`
}

function resetBoundaryDemo() {
  faultActive.value = false
}
</script>

<template>
  <WView :full="true" :padding="false" class="bg-page">
    <Scrollbar class="h-full" content-class="min-h-full p-16 md:p-20">
      <section
        class="mx-auto max-w-1280 rounded-8 border-1 border-color-1 border-solid bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 border-b-1 border-color-1 border-b-solid pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">ErrorBoundary</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              捕获 Vue 子树异常并提供详情、上报与恢复入口。
            </p>
          </div>
          <a-tag color="blue">src/components/errorBoundary</a-tag>
        </header>

        <div class="grid gap-14">
          <div class="flex flex-wrap items-center gap-10">
            <a-button danger @click="faultActive = true">
              <template #icon><Icon name="i-lucide:triangle-alert" /></template>
              触发渲染异常
            </a-button>
            <span class="min-w-0 truncate text-xs text-muted">
              {{ lastError }}
            </span>
          </div>
          <div
            class="min-h-280 overflow-hidden rounded-6 border-1 border-color-1 border-solid bg-page"
          >
            <ErrorBoundary
              :show-details="true"
              :stop-propagation="true"
              @error="handleBoundaryError"
              @reset="resetBoundaryDemo"
            >
              <DemoFault :active="faultActive" />
            </ErrorBoundary>
          </div>
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
