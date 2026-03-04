<template>
  <div class="h-full p-10 overflow-hidden">
    <n-grid :x-gap="10" :y-gap="10" responsive="screen" item-responsive class="h-full">
      <n-gi :span="4" class="h-full">
        <Sider />
      </n-gi>
      <n-gi :span="20">
        <Content />
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
  import { Sider, Content } from './components'
</script>
