<template>
  <nav
    class="h-full w-84 shrink-0 flex flex-col border-r-1 border-r-solid border-color-1 bg-container"
  >
    <!-- Header -->
    <Header />
    <!-- Nav Tabs -->
    <div class="flex-1 px-10 py-15 flex flex-col gap-6">
      <LayoutGroup>
        <Motion
          v-for="item in navItems"
          :key="item.key"
          as="button"
          type="button"
          layout
          class="button relative w-full flex-col gap-4 rounded-6 px-10 py-8 user-select-none"
          :class="
            activeKey === item.key
              ? 'text-primary'
              : 'text-secondary hover:bg-hover'
          "
          :while-hover="navItemHover"
          :while-press="navItemPress"
          :transition="navItemTransition"
          :aria-label="`切换到${item.label}`"
          @click="handleNavClick(item.key)"
        >
          <Motion
            v-if="activeKey === item.key"
            as="span"
            layout-id="chat-nav-active-background"
            class="pointer-events-none absolute inset-0 rounded-6 bg-primary/10"
            :transition="activeIndicatorTransition"
          />
          <Motion
            v-if="activeKey === item.key"
            as="span"
            layout-id="chat-nav-active-indicator"
            class="pointer-events-none absolute left-0 top-1/2 h-24 w-3 -translate-y-1/2 rounded-r-full bg-primary"
            :transition="activeIndicatorTransition"
          />
          <a-badge
            class="relative z-1"
            :count="item.badge ?? 0"
            :overflow-count="99"
            :offset="[-4, 4]"
          >
            <span
              class="size-30 flex items-center justify-center rounded-6 transition-colors"
              :class="
                activeKey === item.key
                  ? 'bg-primary/12 text-primary'
                  : 'text-secondary'
              "
            >
              <Icon
                :name="item.icon"
                :size="22"
                :class="
                  activeKey === item.key ? 'text-primary' : 'text-secondary'
                "
              />
            </span>
          </a-badge>
          <span class="relative z-1 text-xs">{{ item.label }}</span>
        </Motion>
      </LayoutGroup>
    </div>
    <Setting @open-settings="emit('openSettings')" />
  </nav>
</template>

<script setup lang="ts">
import { LayoutGroup, Motion } from 'motion-v'
import Header from './Header.vue'
import Setting from './Setting.vue'
import type { NavType, NavItem, NavigationEmits } from '../types'

const emit = defineEmits<NavigationEmits>()
const props = withDefaults(
  defineProps<{
    unreadCount?: number
  }>(),
  {
    unreadCount: 0,
  }
)

const navItems = computed<NavItem[]>(() => [
  {
    key: 'conversation',
    label: '会话',
    icon: 'i-lucide:message-circle',
    badge: props.unreadCount,
  },
  { key: 'contact', label: '通讯录', icon: 'i-lucide:notebook-text' },
  { key: 'group', label: '群聊', icon: 'i-lucide:users' },
])

const activeKey = defineModel<NavType>('activeKey', { default: 'conversation' })

const navItemHover = { x: 2 }
const navItemPress = { scale: 0.97 }
const navItemTransition = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 30,
}
const activeIndicatorTransition = {
  type: 'spring' as const,
  stiffness: 360,
  damping: 32,
}

function handleNavClick(key: NavType) {
  activeKey.value = key
  emit('navChange', key)
}
</script>
