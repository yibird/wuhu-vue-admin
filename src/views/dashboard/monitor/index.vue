<template>
  <div class="h-full p-10 overflow-y-auto">
    <n-grid :cols="24" :x-gap="10" :y-gap="10" responsive="screen" item-responsive>
      <n-gi span="xs:24 s:24 m:24 l:16 xl:16 xxl:16">
        <n-grid :x-gap="10" :y-gap="10" responsive="screen" item-responsive>
          <n-gi :span="24">
            <Overview />
          </n-gi>
          <n-gi :span="24">
            <Status :items="statusItems" />
          </n-gi>
          <n-gi :span="24">
            <SysMonitor :data="monitorData" />
          </n-gi>
        </n-grid>
      </n-gi>
      <n-gi span="xs:24 s:24 m:24 l:8 xl:8 xxl:8">
        <n-grid :x-gap="10" :y-gap="10" responsive="screen" item-responsive>
          <n-gi :span="24">
            <SysInfo :items="sysInfoItems" />
          </n-gi>
          <n-gi :span="24">
            <RecommendApp :items="appItems" />
          </n-gi>
        </n-grid>
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
  import { Overview, Status, SysMonitor, SysInfo, RecommendApp } from './components'
  import { statusItems, sysInfoItems, appItems, monitorData } from './config'
</script>
