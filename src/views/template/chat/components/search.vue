<template>
  <div
    class="h-60 flex items-center justify-between gap-10 border-b-1 border-b-solid border-color-1 px-10"
  >
    <div class="min-w-0 flex flex-1 items-center gap-8">
      <a-input
        v-model:value="searchValue"
        :aria-label="placeholder"
        :placeholder="placeholder"
        allow-clear
        autocomplete="off"
        name="chat-search"
        spellcheck="false"
      >
        <template #prefix>
          <Icon name="i-lucide:search" :size="16" class="text-secondary" />
        </template>
      </a-input>
      <button
        v-if="showGlobalSearch"
        type="button"
        class="button size-34 shrink-0 rounded-6 bg-fill-quaternary text-secondary transition-colors hover:(bg-hover text-primary)"
        title="全局搜索"
        aria-label="打开全局搜索"
        @click="emit('openGlobalSearch')"
      >
        <Icon name="i-lucide:command" :size="16" />
      </button>
    </div>
    <a-dropdown
      v-if="showCreate"
      :trigger="['click']"
      placement="bottomRight"
      :menu="{ items: createMenuItems, onClick: handleMenuClick }"
      @open-change="menuOpen = $event"
    >
      <button
        type="button"
        class="button size-34 shrink-0 rounded-6 transition-colors hover:(bg-hover text-primary)"
        :class="
          menuOpen
            ? 'bg-primary/10 text-primary'
            : 'bg-fill-quaternary text-secondary'
        "
        title="创建或添加"
        aria-label="打开创建菜单"
      >
        <Icon
          name="i-lucide:plus"
          :size="18"
          class="transition-transform duration-200"
          :class="{ 'rotate-45': menuOpen }"
        />
      </button>
    </a-dropdown>
  </div>
</template>
<script lang="ts" setup>
import { h, shallowRef } from 'vue'
import type { MenuProps } from 'antdv-next'
import { Icon } from '@/components'

withDefaults(
  defineProps<{
    placeholder?: string
    showCreate?: boolean
    showGlobalSearch?: boolean
  }>(),
  {
    placeholder: '搜索…',
    showCreate: true,
    showGlobalSearch: true,
  }
)

const searchValue = defineModel<string>({ default: '' })
const menuOpen = shallowRef(false)

const emit = defineEmits<{
  createGroup: []
  addContact: []
  openGlobalSearch: []
}>()

const createMenuItems: MenuProps['items'] = [
  {
    key: 'create-group',
    label: '创建群聊',
    icon: renderMenuIcon('i-lucide:users-round'),
  },
  {
    key: 'add-contact',
    label: '添加好友或群聊',
    icon: renderMenuIcon('i-lucide:user-round-plus'),
  },
]

function renderMenuIcon(name: string) {
  return () => h(Icon, { name, size: 16 })
}

function handleMenuClick({ key }: { key: string }) {
  if (key === 'create-group') {
    emit('createGroup')
    return
  }
  if (key === 'add-contact') emit('addContact')
}
</script>
