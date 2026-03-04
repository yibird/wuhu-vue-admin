<template>
  <div class="full p-10 overflow-hidden">
    <n-grid :x-gap="12" class="h-full">
      <n-gi :span="4">
        <Sider :data="treeData" :keys="keys" @change:keys="onChangeKeys" />
      </n-gi>
      <n-gi :span="20">
        <Content />
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
import { Sider, Content } from './components'
const keys = ref<Array<string | number>>([1])
const treeData = [
  {
    key: 1,
    label: 'xxxx'
  },
  {
    key: 2,
    label: 'xxxxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xx111'
  }
]
const onChangeKeys = (newKeys: Array<string | number>) => {
  keys.value = newKeys
}
</script>
