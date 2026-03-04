<template>
  <div class="full flex flex-col gap-10 bg-white">
    <div className="px-12 mt-10">
      <n-breadcrumb>
        <n-breadcrumb-item>Home</n-breadcrumb-item>
        <n-breadcrumb-item><a href="">Application Center</a></n-breadcrumb-item>
        <n-breadcrumb-item><a href="">Application List</a></n-breadcrumb-item>
        <n-breadcrumb-item>An Application</n-breadcrumb-item>
      </n-breadcrumb>
    </div>
    <div class="px-12 flex items-center justify-between">
      <n-space>
        <n-button type="primary">上传文件</n-button>
        <n-select :options="options" defaultValue="all" class="w-100" />
        <n-input placeholder="请输入搜索内容" />
      </n-space>
      <n-space>
        <n-button type="primary">批量操作</n-button>
        <n-radio-group v-model:value="type">
          <n-radio-button v-for="item in items" :key="item.value" :value="item.value">{{
            item.title
          }}</n-radio-button>
        </n-radio-group>
      </n-space>
    </div>
    <div class="flex-1 px-12 overflow-hidden">
      <Grid />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import Grid from './grid.vue'
  const options = [
    {
      value: 'all',
      label: '全部'
    },
    {
      value: 'img',
      label: '图片'
    },
    {
      value: 'doc',
      label: '文档'
    },
    {
      value: 'video',
      label: '视频'
    },
    {
      value: 'mp3',
      label: '音频'
    },
    {
      value: 'zip',
      label: '压缩包'
    },
    {
      value: 'unknow',
      label: '其他'
    }
  ]
  const items = [
    {
      value: 'a',
      title: '传输列表',
      icon: ''
    },
    {
      value: 's',
      title: '排序',
      icon: ''
    },
    {
      value: 'b',
      title: '视图',
      icon: ''
    }
  ]
  const type = ref('a')
</script>
