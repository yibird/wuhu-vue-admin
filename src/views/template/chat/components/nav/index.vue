<template>
  <nav
    class="h-full flex flex-col bg-white border-r-1 border-solid border-[#E8E8E8]"
  >
    <!-- Header -->
    <Header />
    <!-- Nav Tabs -->
    <div class="flex-1 px-10 py-15 flex flex-col gap-6">
      <button
        v-for="item in navItems"
        :key="item.key"
        class="flex flex-col items-center gap-4 py-8 px-12 rounded-6 cursor-pointer transition-all"
        :class="[
          activeKey === item.key
            ? 'bg-primary/10 text-primary'
            : 'text-regular hover:bg-[#f5f5f5]',
        ]"
        @click="handleNavClick(item.key)"
      >
        <div class="relative">
          <Icon :name="item.icon" :size="22" />
          <span
            v-if="item.badge && item.badge > 0"
            class="absolute -top-6 -right-6 min-w-16 h-16 px-4 flex items-center justify-center text-xs bg-error text-white rounded-full"
          >
            {{ item.badge > 99 ? '99+' : item.badge }}
          </span>
        </div>
        <span class="text-xs">{{ item.label }}</span>
      </button>
    </div>
    <Setting />
  </nav>
</template>

<script setup lang="ts">
import Header from './header.vue'
import Setting from './setting.vue'
import type { NavType, NavItem, NavigationEmits } from '../types'

const emit = defineEmits<NavigationEmits>()
const navItems = ref<NavItem[]>([
  {
    key: 'conversation',
    label: '会话',
    icon: 'i-lucide:message-circle',
    badge: 3,
  },
  { key: 'contact', label: '通讯录', icon: 'i-lucide:notebook-text' },
  { key: 'group', label: '群聊', icon: 'i-lucide:users' },
])

const activeKey = defineModel<NavType>('activeKey', { default: 'conversation' })

function handleNavClick(key: NavType) {
  activeKey.value = key
  emit('navChange', key)
}
</script>
