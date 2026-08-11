<template>
  <div class="h-full flex flex-col">
    <Search
      v-model="searchValue"
      placeholder="搜索群聊…"
      @create-group="emit('createGroup')"
      @add-contact="emit('addContact')"
      @open-global-search="emit('openGlobalSearch')"
    />

    <VirtualList
      class="flex-1"
      aria-label="群聊列表"
      :items="filteredGroups"
      :estimate-size="78"
      :get-item-key="(group) => group.id"
    >
      <template #default="{ item: group }">
        <div class="px-8 py-3">
          <button
            type="button"
            class="group block w-full rounded-6 border-0 bg-transparent p-10 text-left cursor-pointer transition-[background-color,box-shadow,transform] duration-180 ease-out hover:(translate-x-1 bg-hover shadow-all-sm) active:scale-99 focus-visible:(outline-none bg-hover shadow-[0_0_0_2px_rgb(var(--w-color-primary)/24%)]) motion-reduce:(transform-none transition-none)"
            :aria-label="`打开群聊${group.title}`"
            @click="handleSelect(group)"
          >
            <span class="flex items-start gap-10">
              <span class="relative shrink-0">
                <a-avatar
                  :src="group.avatar"
                  :size="44"
                  round
                  fallback-src="https://i.pravatar.cc/100?img=5"
                  class="transition-transform duration-180 ease-out group-hover:scale-105 motion-reduce:transform-none"
                />
                <span
                  v-if="group.groupInfo?.memberCount"
                  class="absolute -bottom-4 -right-4 rounded-full bg-fill-quaternary px-6 py-2 text-xs text-secondary"
                >
                  {{ group.groupInfo.memberCount }}人
                </span>
              </span>

              <span class="min-w-0 flex-1">
                <span class="flex items-center justify-between gap-10">
                  <span class="truncate text-main font-500">
                    {{ group.title }}
                  </span>
                  <span class="shrink-0 text-xs text-secondary">
                    {{ group.lastMessageTime }}
                  </span>
                </span>
                <span class="mt-4 block truncate text-sm text-secondary">
                  {{ group.lastMessage }}
                </span>
              </span>

              <span class="min-h-20 shrink-0 flex items-center gap-5">
                <a-badge
                  v-if="group.unreadCount > 0"
                  :count="group.unreadCount"
                  :overflow-count="99"
                  :number-style="{
                    height: '18px',
                    minWidth: '18px',
                    padding: '0 4px',
                    fontSize: '12px',
                  }"
                />
                <Icon
                  name="i-lucide:chevron-right"
                  :size="15"
                  class="text-placeholder opacity-0 transition-[opacity,transform] duration-180 group-hover:(translate-x-1 opacity-100)"
                />
              </span>
            </span>
          </button>
        </div>
      </template>

      <template #empty>
        <div class="h-full flex items-center justify-center">
          <div class="text-center text-regular">
            <Icon name="i-lucide:users" :size="40" class="mb-10 opacity-50" />
            <div>暂无群聊</div>
          </div>
        </div>
      </template>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import Search from '../Search.vue'
import VirtualList from '../VirtualList.vue'
import type { Conversation } from '../types'

interface Props {
  groups?: Conversation[]
}

const props = withDefaults(defineProps<Props>(), {
  groups: () => [],
})

const emit = defineEmits<{
  select: [group: Conversation]
  createGroup: []
  addContact: []
  openGlobalSearch: []
}>()

const searchValue = shallowRef('')

const filteredGroups = computed(() => {
  if (!searchValue.value) {
    return props.groups
  }
  const keyword = searchValue.value.toLowerCase()
  return props.groups.filter(
    (g) =>
      g.title.toLowerCase().includes(keyword) ||
      g.groupInfo?.name.toLowerCase().includes(keyword)
  )
})

function handleSelect(group: Conversation) {
  emit('select', group)
}
</script>
