<template>
  <a-layout-content
    class="relative grid w-full min-h-full flex-1 overflow-hidden"
  >
    <div v-if="renderRouteView" class="relative h-full overflow-x-hidden">
      <ErrorBoundary
        ref="errorBoundaryRef"
        :fallback="ContentError"
        stop-propagation
        @error="handleClientError"
      >
        <NetworkGuard :online="online">
          <IframeView v-if="isIframe" :src="iframeSrc" />
          <RouterView v-else v-slot="{ Component, route }">
            <Transition :name="pageAnimation" :mode="pageAnimationMode">
              <KeepAlive :include="include" :max="max">
                <Suspense>
                  <component :is="Component" :key="route.path" />
                  <template #fallback>
                    <Loading :type="loadingAnimation" />
                  </template>
                </Suspense>
              </KeepAlive>
            </Transition>
          </RouterView>
        </NetworkGuard>
      </ErrorBoundary>
    </div>
  </a-layout-content>
</template>

<script lang="ts" setup>
import {
  ErrorBoundary,
  Loading,
  type ErrorBoundaryErrorPayload,
  type ErrorBoundaryInstance,
} from '@/components'
import { useOnline } from '@vueuse/core'
import { useIframe, useKeepAlive, useTransition } from './composables'
import {
  ContentError,
  IframeView,
  isNetworkDisconnectedError,
  NetworkGuard,
} from './components'

const emit = defineEmits<{
  clientError: [payload: ErrorBoundaryErrorPayload]
}>()

const { renderRouteView, include, max } = useKeepAlive()
const { pageAnimation, pageAnimationMode, loadingAnimation } = useTransition()
const { isIframe, iframeSrc } = useIframe()
const online = useOnline()
const errorBoundaryRef =
  useTemplateRef<ErrorBoundaryInstance>('errorBoundaryRef')
const networkErrorActive = shallowRef(false)

function handleClientError(payload: ErrorBoundaryErrorPayload) {
  networkErrorActive.value = isNetworkDisconnectedError(payload.error)
  emit('clientError', payload)
}

watch(online, (isOnline) => {
  if (!isOnline || !networkErrorActive.value) return
  networkErrorActive.value = false
  errorBoundaryRef.value?.resetError()
})
</script>
