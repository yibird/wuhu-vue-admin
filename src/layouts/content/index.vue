<template>
  <a-layout-content
    class="relative grid w-full min-h-full flex-1 overflow-hidden"
  >
    <div v-if="renderRouteView" class="relative h-full overflow-x-hidden">
      <IframeView v-if="isIframe" :src="iframeSrc" />
      <ErrorBoundary v-else stop-propagation @error="handleClientError">
        <router-view v-slot="{ Component, route }">
          <transition :name="transitionName" mode="out-in">
            <keep-alive :include="include" :max="max">
              <suspense>
                <component :is="Component" :key="getRouteViewKey(route)" />
                <template #fallback>
                  <Loading :animation="loadingAnimation" />
                </template>
              </suspense>
            </keep-alive>
          </transition>
        </router-view>
      </ErrorBoundary>
    </div>
  </a-layout-content>
</template>

<script lang="ts" setup>
import {
  getRouteViewKey,
  useIframe,
  useKeepAlive,
  useTransition,
} from './composables'
import { ErrorBoundary } from '@/components/errorBoundary'
import { Loading } from '@/components/loading'
import { IframeView } from './components'
import type { ErrorBoundaryErrorPayload } from '@/components/errorBoundary'

const emit = defineEmits<{
  clientError: [payload: ErrorBoundaryErrorPayload]
}>()

const { renderRouteView, include, max } = useKeepAlive()
const { transitionName, loadingAnimation } = useTransition()
const { isIframe, iframeSrc } = useIframe()

function handleClientError(payload: ErrorBoundaryErrorPayload) {
  emit('clientError', payload)
}
</script>
