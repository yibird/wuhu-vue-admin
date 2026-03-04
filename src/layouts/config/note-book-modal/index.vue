<template>
  <n-drawer v-model:show="show" title="任务中心" width="90%" placement="right">
    <n-drawer-content header-class="py-0! px-20" body-content-class="p-0!">
      <div class="full flex">
        <div class="w-220 bg-[#f8f9fa]">
          <div class="p-20">
            <n-button type="primary" block>新建</n-button>
          </div>
        </div>
        <div class="w-300">123123123</div>
        <div class="flex-1 border-l-1 border-l-solid border-[#f2f2f2]">1231</div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
  const show = defineModel('show', { default: false })
</script>
