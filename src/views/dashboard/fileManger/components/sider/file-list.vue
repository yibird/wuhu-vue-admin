<template>
  <div class="flex-1 flex flex-col bg-white">
    <div class="flex items-center justify-between px-20 py-12 bb-1px_solid_#f0f0f0">
      <span>文件类型</span>
      <n-switch />
    </div>
    <div class="flex-1 p-12 flex flex-col gap-6 overflow-y-auto">
      <div
        v-for="item in items"
        :key="item.value"
        :class="[
          'group px-12 py-10 flex items-center rounded-4 hover:(bg-[#f2f3f5] text-theme) cursor-pointer',
          { 'bg-[#f2f3f5] text-theme': value === item.value }
        ]"
        @click="onClick(item)"
      >
        <img :src="item.icon" alt="" class="size-30 group-active:scale-90 transition" />
        <span class="ml-10">{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import allLogo from '@/assets/svg/all.svg'
  import textLogo from '@/assets/svg/text.svg'
  import imgLogo from '@/assets/svg/img.svg'
  import videoLogo from '@/assets/svg/video.svg'
  import mp3Logo from '@/assets/svg/mp3.svg'
  import unknownLogo from '@/assets/svg/unknown.svg'

  const items = [
    {
      value: 'all',
      title: '全部',
      icon: allLogo
    },
    {
      value: 'text',
      title: '文本',
      icon: textLogo
    },
    {
      value: 'image',
      title: '图片',
      icon: imgLogo
    },
    {
      value: 'viode',
      title: '视频',
      icon: videoLogo
    },
    {
      value: 'mp3',
      title: '音频',
      icon: mp3Logo
    },
    {
      value: 'unknow',
      title: '其他',
      icon: unknownLogo
    }
  ]
  const value = ref('all')

  const onClick = (item: { value: string }) => {
    value.value = item.value
  }
</script>
