<template>
  <div>
    <n-divider>主题</n-divider>
    <div class="flex gap-20">
      <n-tooltip v-for="item in items" :key="item.value">
        <template #trigger>
          <div
            class="inline-block size-20 rounded-full transition-all cursor-pointer"
            :style="getStyle(item.value)"
            @click="changeThemeColor(item.value)"
          ></div>
        </template>
        <span>{{ item.label }}</span>
      </n-tooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useTheme } from '@/theme'
const { themeColor, changeThemeColor } = useTheme()
const items = [
  {
    label: '天空蓝',
    value: '24, 144, 255',
  },
  {
    label: '魅力紫',
    value: '90, 84, 249',
  },
  {
    label: '活力橙',
    value: '255, 103, 0',
  },
  {
    label: '高贵紫',
    value: '158, 51, 159',
  },
  {
    label: '少女粉',
    value: '237, 65, 146',
  },
  {
    label: '姨妈红',
    value: '224, 40, 46',
  },
  {
    label: '落日黄',
    value: '242, 189, 39',
  },
  {
    label: '森林绿',
    value: '0, 185, 107',
  },
]

const getStyle = (color: string) => {
  return {
    backgroundColor: `rgb(${color})`,
    boxShadow:
      themeColor.value === color
        ? `0 0 0 1px #ffffff,0 0 0 5px rgb(${color})`
        : 'none',
  }
}
</script>
