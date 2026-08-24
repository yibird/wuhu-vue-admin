<template>
  <a-layout-content
    class="relative grid w-full min-h-full flex-1 overflow-hidden"
  >
    <div v-if="renderRouteView" class="relative h-full overflow-x-hidden">
      <IframeView v-if="isIframe" :src="iframeSrc" />
      <ErrorBoundary v-else stop-propagation @error="handleClientError">
        <RouterView v-slot="{ Component, route }">
          <Transition :name="pageAnimation" :mode="pageAnimationMode">
            <KeepAlive :include="include" :max="max">
              <Suspense>
                <component :is="Component" :key="route.path" />
                <template #fallback>
                  <Loading :animation="loadingAnimation" />
                </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </RouterView>
      </ErrorBoundary>
    </div>
  </a-layout-content>
</template>

<script lang="ts" setup>
import {
  ErrorBoundary,
  Loading,
  type ErrorBoundaryErrorPayload,
} from '@/components'
import { useIframe, useKeepAlive, useTransition } from './composables'
import { IframeView } from './components'

const emit = defineEmits<{
  clientError: [payload: ErrorBoundaryErrorPayload]
}>()

const { renderRouteView, include, max } = useKeepAlive()
const { pageAnimation, pageAnimationMode, loadingAnimation } = useTransition()
const { isIframe, iframeSrc } = useIframe()

function handleClientError(payload: ErrorBoundaryErrorPayload) {
  emit('clientError', payload)
}
</script>
