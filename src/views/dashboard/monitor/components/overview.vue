<template>
  <n-card title="概览">
    <n-grid :cols="4">
      <n-gi v-for="item in items" :key="item.id" class="py-10 text-center">
        <div className="text-base">{{ item.title }}</div>
        <div className="mt-8 text-theme text-lg font-bold">
          <n-number-animation show-separator :from="0" :to="item.value" />
        </div>
      </n-gi>
    </n-grid>
  </n-card>
</template>
<script lang="ts" setup>
  const items = [
    {
      id: 1,
      title: '网站数量',
      value: 2
    },
    {
      id: 2,
      title: '数据库 - 全部',
      value: 1
    },
    {
      id: 3,
      title: '计划任务',
      value: 20
    },
    {
      id: 4,
      title: '已安装应用',
      value: 4
    }
  ]
</script>
