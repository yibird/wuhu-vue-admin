<template>
  <div class="full flex flex-col overflow-hidden">
    <n-form inline label-placement="left" :show-feedback="false" class="bg-white p-20">
      <n-form-item label="标签名称:">
        <n-input placeholder="请输入标签名称" />
      </n-form-item>
      <n-form-item>
        <n-space>
          <n-button type="primary">搜索</n-button>
          <n-button>重置</n-button>
        </n-space>
      </n-form-item>
    </n-form>
    <div class="flex-1 flex flex-col bg-white overflow-hidden">
      <div class="px-20 flex justify-end">
        <n-space>
          <n-button type="primary">添加标签</n-button>
          <n-button>同步标签</n-button>
        </n-space>
      </div>
      <div class="flex-1 p-10 flex flex-col gap-10 overflow-hidden">
        <div class="flex-1 flex flex-col gap-10 overflow-auto">
          <Group />
          <Group />
        </div>
        <n-pagination :page-count="100" show-quick-jumper show-size-picker class="ml-auto">
          <template #prefix="{ itemCount }"> 共 {{ itemCount }} 项 </template>
        </n-pagination>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Group from './Group.vue'
</script>
