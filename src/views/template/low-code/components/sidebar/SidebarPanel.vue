<template>
  <div
    class="h-full min-h-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden"
  >
    <div class="flex shrink-0 gap-4 p-8">
      <button
        v-for="item in tabs"
        :key="item.key"
        class="lc-sidebar-tab"
        :class="{ 'is-active': activeTab === item.key }"
        type="button"
        @click="activeTab = item.key"
      >
        <Icon :name="item.icon" :size="14" />
        {{ item.label }}
      </button>
    </div>
    <PalettePanel v-show="activeTab === 'palette'" class="min-h-0" />
    <OutlineTree v-show="activeTab === 'outline'" class="min-h-0" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@/components'
import OutlineTree from './OutlineTree.vue'
import PalettePanel from './PalettePanel.vue'

type SidebarTab = 'palette' | 'outline'

const tabs: { key: SidebarTab; label: string; icon: string }[] = [
  { key: 'palette', label: '组件', icon: 'i-lucide:blocks' },
  { key: 'outline', label: '组件树', icon: 'i-lucide:list-tree' },
]

const activeTab = ref<SidebarTab>('palette')
</script>

<style scoped lang="less">
.lc-sidebar-tab {
  display: inline-flex;
  flex: 1;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 7px 8px;
  font-size: 12px;
  color: rgb(var(--w-text-secondary));
  cursor: pointer;
  background: rgb(var(--w-bg-fill-quaternary));
  border: 1px solid transparent;
  border-radius: 7px;

  &:hover {
    color: rgb(var(--w-color-primary));
  }

  &.is-active {
    color: rgb(var(--w-color-primary));
    background: rgb(var(--w-bg-primary) / 8%);
    border-color: rgb(var(--w-color-primary) / 30%);
  }
}
</style>
