<template>
  <div class="full-flex p-10 overflow-hidden">
    <a-row :gutter="[12, 0]" class="h-full">
      <a-col :span="4">
        <Sider :data="treeData" :keys="keys" @change:keys="onChangeKeys" />
      </a-col>
      <a-col :span="20">
        <Content />
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { Sider, Content } from './components'
const keys = ref<Array<string | number>>([1])
const treeData = [
  {
    key: 1,
    label: 'xxxx',
  },
  {
    key: 2,
    label:
      'xxxxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xxxx111xx111',
  },
]
const onChangeKeys = (newKeys: Array<string | number>) => {
  keys.value = newKeys
}
</script>
