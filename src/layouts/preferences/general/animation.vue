<template>
  <div>
    <a-divider>动画</a-divider>
    <ConfigItem title="页面切换进度条">
      <a-switch v-model:checked="enableProgressBar" />
    </ConfigItem>
    <ConfigItem title="页面切换 Loading">
      <a-switch v-model:checked="enablePageLoading" />
    </ConfigItem>
    <ConfigItem title="Loading 动画">
      <a-select
        v-model:value="loadingAnimation"
        :options="loadingAnimationOptions"
        class="w-180"
      />
    </ConfigItem>
    <ConfigItem title="页面切换动画">
      <a-select
        v-model:value="pageAnimation"
        :options="pageAnimationOptions"
        class="w-180"
      />
    </ConfigItem>
    <ConfigItem title="页面动画模式">
      <a-select
        v-model:value="pageAnimationMode"
        :options="pageAnimationModeOptions"
        class="w-180"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import {
  pageAnimationOptions,
  loadingAnimationOptions,
  pageAnimationModeOptions,
} from '@/config'
import { ConfigItem } from '../components'

const { animation } = useAppStore()
const {
  enableProgressBar,
  enablePageLoading,
  loadingAnimation,
  pageAnimation,
  pageAnimationMode,
} = toRefs(animation.value)
</script>
