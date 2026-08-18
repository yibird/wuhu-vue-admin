<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue'
import { usePreferredReducedMotion, useScroll, useToggle } from '@vueuse/core'
import { LazyContainer, ResizeContainer } from '@/components/container'
import { Icon } from '@/components/icon'
import { Scrollbar } from '@/components/scrollbar'
import type { ContainerSize } from '@/components/container'

const lazyViewportRef = useTemplateRef<HTMLElement>('lazyViewportRef')
const preferredMotion = usePreferredReducedMotion()
const scrollBehavior = computed<ScrollBehavior>(() =>
  preferredMotion.value === 'reduce' ? 'auto' : 'smooth'
)
const { y: lazyScrollTop } = useScroll(lazyViewportRef, {
  behavior: scrollBehavior,
})

const lazyVersion = shallowRef(0)
const lazyLoaded = shallowRef(false)
const panelWidth = shallowRef(520)
const measuredSize = shallowRef<ContainerSize>({ width: 0, height: 0 })
const [expanded, toggleExpanded] = useToggle(false)

const resetLazyDemo = () => {
  lazyScrollTop.value = 0
  lazyLoaded.value = false
  lazyVersion.value += 1
}

const onLazyLoad = () => {
  lazyLoaded.value = true
}

const onResize = (size: ContainerSize) => {
  measuredSize.value = size
}
</script>

<template>
  <WView :full="true" :padding="false" class="bg-page">
    <Scrollbar class="h-full" content-class="min-h-full p-16 md:p-20">
      <section
        class="mx-auto max-w-1280 rounded-8 border-1 border-color-1 border-solid bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-20 flex flex-wrap items-start justify-between gap-12 border-b-1 border-color-1 border-b-solid pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">Container</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              面向延迟挂载和响应式尺寸计算的轻量容器组件。
            </p>
          </div>
          <a-tag color="blue">src/components/container</a-tag>
        </header>

        <div class="grid gap-28">
          <article>
            <div
              class="mb-12 flex flex-wrap items-center justify-between gap-10"
            >
              <div>
                <h2 class="m-0 text-lg text-main font-600">LazyContainer</h2>
                <p class="mb-0 mt-4 text-sm text-secondary">
                  内容进入滚动视口后才会挂载，并保留首次渲染结果。
                </p>
              </div>
              <div class="flex items-center gap-8">
                <a-tag :color="lazyLoaded ? 'green' : 'default'">
                  {{ lazyLoaded ? '已挂载' : '等待进入视口' }}
                </a-tag>
                <a-button size="small" @click="resetLazyDemo">
                  <template #icon>
                    <Icon name="i-lucide:rotate-ccw" :size="14" />
                  </template>
                  重新演示
                </a-button>
              </div>
            </div>

            <div
              ref="lazyViewportRef"
              class="h-300 overflow-y-auto rounded-6 border-1 border-color-1 border-solid bg-fill-1"
            >
              <div
                class="h-360 flex flex-col items-center justify-center gap-8 text-secondary"
              >
                <Icon name="i-lucide:mouse" :size="24" class="text-muted" />
                <span class="text-sm">向下滚动查看延迟内容</span>
              </div>

              <LazyContainer
                :key="lazyVersion"
                :min-height="180"
                root-margin="0px"
                :threshold="0.15"
                class="px-12 pb-12"
                @load="onLazyLoad"
              >
                <template #placeholder>
                  <div
                    class="h-180 animate-pulse rounded-6 border-1 border-color-1 border-solid bg-container p-16 motion-reduce:animate-none"
                    aria-hidden="true"
                  >
                    <div class="mb-12 h-14 w-2/5 rounded-3 bg-fill-5" />
                    <div class="mb-8 h-10 w-full rounded-3 bg-fill-4" />
                    <div class="h-10 w-3/4 rounded-3 bg-fill-4" />
                  </div>
                </template>

                <div
                  class="min-h-180 flex items-center gap-14 rounded-6 border-1 border-primary/30 border-solid bg-primary/5 p-18"
                >
                  <div
                    class="size-42 flex shrink-0 items-center justify-center rounded-6 bg-primary/10 text-primary"
                  >
                    <Icon name="i-lucide:badge-check" :size="22" />
                  </div>
                  <div class="min-w-0">
                    <h3 class="m-0 text-md text-main font-600">
                      内容已按需挂载
                    </h3>
                    <p class="mb-0 mt-5 text-sm leading-22 text-secondary">
                      再次离开视口不会卸载，适合图表、编辑器和复杂业务区块。
                    </p>
                  </div>
                </div>
              </LazyContainer>
            </div>
          </article>

          <article class="border-t-1 border-color-1 border-t-solid pt-24">
            <div
              class="mb-12 flex flex-wrap items-start justify-between gap-10"
            >
              <div>
                <h2 class="m-0 text-lg text-main font-600">ResizeContainer</h2>
                <p class="mb-0 mt-4 text-sm text-secondary">
                  通过作用域插槽和事件同步容器的实际宽高。
                </p>
              </div>
              <div class="flex items-center gap-6 text-xs text-secondary">
                <span>事件值</span>
                <code class="rounded-4 bg-fill-2 px-7 py-4 text-main">
                  {{ Math.round(measuredSize.width) }} ×
                  {{ Math.round(measuredSize.height) }} px
                </code>
              </div>
            </div>

            <div
              class="mb-14 grid max-w-720 grid-cols-[80px_1fr] items-center gap-12"
            >
              <span class="text-sm text-secondary">容器宽度</span>
              <a-slider v-model:value="panelWidth" :min="280" :max="900" />
            </div>

            <div class="overflow-x-auto pb-4">
              <ResizeContainer
                box="border-box"
                class="max-w-full rounded-6 border-1 border-color-1 border-solid bg-fill-1 p-16 transition-[width]"
                :style="{ width: `${panelWidth}px` }"
                @resize="onResize"
              >
                <template #default="{ width, height }">
                  <div
                    class="flex flex-wrap items-center justify-between gap-12"
                  >
                    <div>
                      <p class="m-0 text-sm text-main font-600">实时测量结果</p>
                      <p class="mb-0 mt-5 text-sm text-secondary">
                        {{ Math.round(width) }} × {{ Math.round(height) }} px
                      </p>
                    </div>
                    <a-button size="small" @click="toggleExpanded()">
                      <template #icon>
                        <Icon
                          :name="
                            expanded
                              ? 'i-lucide:chevrons-up'
                              : 'i-lucide:chevrons-down'
                          "
                          :size="14"
                        />
                      </template>
                      {{ expanded ? '收起内容' : '展开内容' }}
                    </a-button>
                  </div>

                  <div
                    v-if="expanded"
                    class="mt-14 grid gap-8 border-t-1 border-color-1 border-t-solid pt-14 sm:grid-cols-3"
                  >
                    <div
                      class="rounded-5 bg-container p-10 text-sm text-secondary"
                    >
                      ResizeObserver 自动批处理尺寸变化
                    </div>
                    <div
                      class="rounded-5 bg-container p-10 text-sm text-secondary"
                    >
                      组件卸载时自动停止观察
                    </div>
                    <div
                      class="rounded-5 bg-container p-10 text-sm text-secondary"
                    >
                      支持 content-box 与 border-box
                    </div>
                  </div>
                </template>
              </ResizeContainer>
            </div>
          </article>
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
