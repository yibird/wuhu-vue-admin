<script setup lang="ts">
import { Loading } from '@/components/loading'
import { Icon } from '@/components/icon'
import { Scrollbar } from '@/components/scrollbar'
import { LoadingAnimation, type LoadingAnimationType } from '@/constants'

const loadingType = shallowRef<LoadingAnimationType>(LoadingAnimation.Beat)
const showDescription = shallowRef(true)
const fullScreenVisible = shallowRef(false)
let fullScreenTimer: ReturnType<typeof setTimeout> | undefined

const loadingOptions = [
  { label: '跳动', value: LoadingAnimation.Beat },
  { label: '旋转点阵', value: LoadingAnimation.Spinner },
  { label: '脉冲扩散', value: LoadingAnimation.Pulse },
  { label: '柱状跳动', value: LoadingAnimation.Bars },
  { label: '圆环旋转', value: LoadingAnimation.Ring },
] satisfies Array<{ label: string; value: LoadingAnimationType }>

function previewFullScreen() {
  if (fullScreenTimer) clearTimeout(fullScreenTimer)
  fullScreenVisible.value = true
  fullScreenTimer = setTimeout(() => {
    fullScreenVisible.value = false
    fullScreenTimer = undefined
  }, 1800)
}

onBeforeUnmount(() => {
  if (fullScreenTimer) clearTimeout(fullScreenTimer)
})
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
            <h1 class="m-0 text-xl text-main font-600">Loading</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              支持多种动画和容器、全局两种加载模式。
            </p>
          </div>
          <a-tag color="blue">src/components/loading</a-tag>
        </header>

        <div class="grid gap-14">
          <div class="flex flex-wrap items-center justify-between gap-10">
            <a-segmented
              v-model:value="loadingType"
              :options="loadingOptions"
            />
            <div class="flex items-center gap-12">
              <label class="flex items-center gap-7 text-sm text-secondary">
                <span>显示描述</span>
                <a-switch v-model:checked="showDescription" size="small" />
              </label>
              <a-button @click="previewFullScreen">
                <template #icon>
                  <Icon name="i-lucide:maximize-2" :size="15" />
                </template>
                预览全屏加载
              </a-button>
            </div>
          </div>
          <div
            class="h-300 overflow-hidden rounded-6 border-1 border-color-1 border-solid"
          >
            <Loading
              :type="loadingType"
              :description="showDescription ? '正在加载业务数据...' : ''"
            />
          </div>
        </div>
      </section>
    </Scrollbar>
    <Loading
      v-if="fullScreenVisible"
      :type="loadingType"
      description="Wuhu-admin"
      full-screen
    />
  </WView>
</template>
