<template>
  <div>
    <a-divider>动画</a-divider>
    <ConfigItem title="页面切换进度条">
      <a-switch v-model:checked="animation.enableProgressBar" />
    </ConfigItem>
    <ConfigItem title="页面切换 Loading">
      <a-switch v-model:checked="animation.enablePageLoading" />
    </ConfigItem>
    <ConfigItem title="Loading 动画">
      <a-select
        v-model:value="animation.loadingAnimation"
        :options="loadingOptions"
        class="w-180"
      />
    </ConfigItem>
    <ConfigItem title="页面切换动画">
      <a-select
        v-model:value="animation.pageAnimation"
        :options="pageAnimationOptions"
        class="w-180"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import { ConfigItem } from '../components'
import { pageAnimationOptions, loadingOptions } from './options'

const { animation } = useAppStore()
</script>
