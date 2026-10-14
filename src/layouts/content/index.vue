<template>
  <a-layout-content
    class="relative grid w-full min-h-full flex-1 overflow-hidden"
  >
    <div class="relative h-full overflow-x-hidden">
      <ErrorBoundary
        ref="errorBoundaryRef"
        :fallback="ContentError"
        stop-propagation
      >
        <IframeView v-if="isIframe" :src="iframeSrc" />
        <RouterView v-else v-slot="{ Component, route }">
          <Suspense v-if="!refreshing" :timeout="0">
            <Transition :name="pageAnimation" :mode="pageAnimationMode">
              <KeepAlive :include="include" :exclude="exclude" :max="max">
                <component :is="Component" :key="route.fullPath" />
              </KeepAlive>
            </Transition>
            <template #fallback>
              <!-- 固定为内容区可视高度并脱离文档流,避免被新页面的高度撑开而偏离垂直居中 -->
              <div class="absolute inset-x-0 top-0" :style="loadingStyle">
                <Loading :type="loadingAnimation" />
              </div>
            </template>
          </Suspense>
        </RouterView>
      </ErrorBoundary>
    </div>
  </a-layout-content>
</template>

<script lang="ts" setup>
import { ErrorBoundary } from '@/components/error-boundary'
import { Loading } from '@/components/loading'
import { useIframe, useKeepAlive, useTransition } from './hooks'
import { ContentError, IframeView } from './components'

const { include, exclude, max, refreshing } = useKeepAlive()
const { pageAnimation, pageAnimationMode, loadingAnimation, loadingStyle } =
  useTransition()
const { isIframe, iframeSrc } = useIframe()
</script>
