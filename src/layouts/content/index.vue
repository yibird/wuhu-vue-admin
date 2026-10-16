<template>
  <a-layout-content
    class="relative grid w-full min-h-full flex-1 overflow-hidden"
  >
    <div class="relative h-full overflow-x-hidden">
      <ErrorBoundary :fallback="ContentError" stop-propagation>
        <IframeView v-if="isIframe" :src="iframeSrc" />
        <RouterView v-else v-slot="{ Component, route }">
          <Transition :name="pageAnimation" :mode="pageAnimationMode">
            <KeepAlive :include="include" :exclude="exclude" :max="max">
              <Suspense>
                <component
                  v-if="!refreshing"
                  :is="Component"
                  :key="route.fullPath"
                />
                <template #fallback>
                  <Loading :type="loadingAnimation" />
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
import { ErrorBoundary } from '@/components/error-boundary'
import { Loading } from '@/components/loading'
import { useAppStore } from '@/store'
import { useIframe, useKeepAlive, useTransition } from './hooks'
import { ContentError, IframeView } from './components'

const { include, exclude, max, refreshing } = useKeepAlive()
const { pageAnimation, pageAnimationMode } = useTransition()
const { isIframe, iframeSrc } = useIframe()

const { animation } = useAppStore()
const loadingAnimation = computed(() => animation.value.loadingAnimation)
</script>
