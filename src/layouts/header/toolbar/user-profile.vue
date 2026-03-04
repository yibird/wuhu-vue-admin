<template>
  <n-dropdown :options="options" @select="onSelect">
    <div
      class="p-4 flex align-middle rounded-full cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#2e3033]"
    >
      <n-avatar :size="30" round />
    </div>
  </n-dropdown>
</template>
<script lang="ts" setup>
import { useGo } from '@/router'
import { renderIcon } from '@/utils'

const options = [
  {
    key: 'userProfile',
    label: '个人中心',
    icon: renderIcon('i-lucide:user', { size: 16 }),
    path: '/sys/userProfile',
  },
  {
    key: 'changePassword',
    label: '修改密码',
    icon: renderIcon('i-lucide:lock-keyhole', { size: 16 }),
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: renderIcon('i-lucide:log-out', { size: 16 }),
  },
]

const { to } = useGo()

const onSelect = (key: string) => {
  switch (key) {
    case 'userProfile':
      to('/sys/userProfile')
      break
    case 'changePassword':
      break
    case 'logout':
      to('/login')
      break
  }
}
</script>
