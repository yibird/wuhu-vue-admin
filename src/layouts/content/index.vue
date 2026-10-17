<template>
  <a-layout-content
    class="relative grid w-full min-h-full flex-1 overflow-hidden"
  >
    <div class="relative h-full overflow-x-hidden">
      <ErrorBoundary :fallback="ContentError" stop-propagation>
        <IframeView v-if="isIframe" :src="iframeSrc" />
        <RouterView v-else v-slot="{ Component, route }">
          <!--
            不要在这里再套 Suspense:Transition / KeepAlive 必须直接包住页面组件,
            否则页面切换、入场动画与 KeepAlive 的 include 匹配都会失效。
            页面加载态由路由组件自身的 loadingComponent 承接。
          -->
          <Transition
            :name="pageAnimation"
            :mode="pageAnimationMode"
            @before-enter="emits('pageEnter')"
          >
            <KeepAlive :include="include" :exclude="exclude" :max="max">
              <component
                v-if="!refreshing"
                :is="Component"
                :key="route.fullPath"
              />
            </KeepAlive>
          </Transition>
        </RouterView>
      </ErrorBoundary>
    </div>
  </a-layout-content>
</template>

<script lang="ts" setup>
import { ErrorBoundary } from '@/components/error-boundary'
import { useIframe, useKeepAlive, useTransition } from './hooks'
import { ContentError, IframeView } from './components'

const emits = defineEmits<{
  /**
   * 新页面入场前触发
   *
   * @desc 供外层复位内容区滚动位置
   */
  pageEnter: []
}>()

const { include, exclude, max, refreshing } = useKeepAlive()
const { pageAnimation, pageAnimationMode } = useTransition()
const { isIframe, iframeSrc } = useIframe()
</script>
