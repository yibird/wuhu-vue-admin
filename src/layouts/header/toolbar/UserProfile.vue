<template>
  <a-dropdown :menu="{ items: options }" @menu-click="onSelect">
    <button
      type="button"
      aria-label="打开用户菜单"
      class="group size-32 flex items-center justify-center rounded-full border-0 bg-transparent p-0 cursor-pointer outline-none transition-[box-shadow,transform] duration-motion-base ease-motion-enter hover:(-translate-y-1 shadow-all-sm) focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] active:(scale-94 translate-y-0 shadow-none) motion-reduce:(transform-none transition-none)"
    >
      <a-avatar
        :size="30"
        round
        class="transition-transform duration-motion-base ease-motion-enter group-hover:scale-105 group-active:scale-98 motion-reduce:transform-none"
      />
    </button>
  </a-dropdown>
</template>
<script lang="ts" setup>
import { useAuth } from '@/composables'
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
const { logout } = useAuth()

const onSelect = ({ key }: { key: string }) => {
  switch (key) {
    case 'userProfile':
      to('/sys/userProfile')
      break
    case 'changePassword':
      break
    case 'logout':
      logout()
      break
  }
}
</script>
