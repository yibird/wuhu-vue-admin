<template>
  <div class="h-full bg-white p-[10px]">
    <div class="text-center">
      <a-avatar :src="image" :size="64" />
      <div class="my-[5px] color-[#333] text-[20px]">zchengfeng</div>
      <div class="color-[#666]">我的人生我做主</div>
    </div>

    <a-space direction="vertical" class="my-[20px]">
      <a-row v-for="item in list" :key="item.icon" class="flex items-center">
        <a-col :span="4" class="text-right pr-[10px]">
          <icon :name="item.icon" />
        </a-col>
        <a-col :span="20">{{ item.value }}</a-col>
      </a-row>
    </a-space>
    <a-divider />
    <a-typography-title :level="5">Tag</a-typography-title>
    <div>
      <a-tag v-for="item in tags" :color="item.color" :key="item.value"> {{ item.title }}</a-tag>
    </div>
  </div>
</template>
<script setup lang="ts">
  const image =
    'http://p3.music.126.net/r70sGz4zw6Zv01JNsiKPhQ==/109951168008830675.jpg?param=30y30';
  const list = [
    {
      icon: 'ri-user-line',
      value: '资深全栈工程师',
    },
    {
      icon: 'ri-home-smile-line',
      value: '牛B公司 - 牛B事业群 - 牛B技术部',
    },
    {
      icon: 'ri-map-pin-line',
      value: '中国 • 广东省 • 鸡城',
    },
    {
      icon: 'ri-price-tag-3-line',
      value: 'JavaScript、HTML、CSS、Vue、Node、Java、Golang、Mysql',
    },
  ];
  const tags = [
    {
      title: '技术牛逼',
      color: '#f50',
      value: 1,
    },
    {
      title: '运动达人',
      color: '#2db7f5',
      value: 2,
    },
  ];
</script>
