<template>
  <div class="full-flex flex flex-col overflow-hidden">
    <a-form layout="inline" class="bg-white p-20">
      <a-form-item label="标签名称:">
        <a-input placeholder="请输入标签名称" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary">搜索</a-button>
          <a-button>重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <div class="flex-1 flex flex-col bg-white overflow-hidden">
      <div class="px-20 flex justify-end">
        <a-space>
          <a-button type="primary">添加标签</a-button>
          <a-button>同步标签</a-button>
        </a-space>
      </div>
      <div class="flex-1 p-10 flex flex-col gap-10 overflow-hidden">
        <Scrollbar
          class="flex-1 overflow-hidden"
          content-class="flex flex-col gap-10"
        >
          <Group />
          <Group />
        </Scrollbar>
        <a-pagination
          :page-count="100"
          show-quick-jumper
          show-size-picker
          class="ml-auto"
        >
          <template #prefix="{ itemCount }"> 共 {{ itemCount }} 项 </template>
        </a-pagination>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Group from './Group.vue'
</script>
