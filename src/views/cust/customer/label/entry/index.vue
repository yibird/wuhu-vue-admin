<template>
  <div class="p-10">
    <a-tabs
      type="line"
      animated
      :tabs-padding="20"
      pane-wrapper-class="flex-1 overflow-hidden"
      pane-class="full p-0!"
      class="h-full bg-white rounded-4 overflow-hidden"
    >
      <a-tab-pane
        v-for="item in options"
        :key="item.value"
        :name="item.value"
        :tab="item.label"
        display-directive="show:lazy"
      >
        <Content />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import Content from './components/Content.vue'
const options = [
  {
    label: '企业标签',
    value: 1,
  },
  {
    label: '个人标签',
    value: 2,
  },
]
</script>
