<template>
  <div class="h-full flex flex-col">
    <Search
      v-if="showToolbar"
      v-model="searchValue"
      placeholder="搜索群聊…"
      @create-group="emits('createGroup')"
      @add-contact="emits('addContact')"
      @open-global-search="emits('openGlobalSearch')"
    />

    <div class="min-h-0 flex-1 overflow-hidden">
      <Scrollbar>
        <a-listy
          v-if="filteredGroups.length"
          aria-label="群聊列表"
          role="list"
          :items="filteredGroups"
          :styles="{ item: { padding: '0', borderBottom: 'none' } }"
          row-key="id"
        >
          <template #itemRender="group">
            <div>
              <button
                type="button"
                class="group block-button p-10 cursor-pointer press-spring transition-[background-color,box-shadow,transform] duration-motion-base ease-motion-enter hover:(translate-x-1 bg-hover shadow-all-sm) active:scale-99 focus-visible:(outline-none bg-hover shadow-[0_0_0_2px_rgb(var(--w-color-primary)/24%)]) motion-reduce:(transform-none transition-none)"
                :aria-label="`打开群聊${group.title}`"
                @click="handleSelect(group)"
              >
                <span class="flex items-start gap-10">
                  <span class="relative shrink-0">
                    <a-avatar
                      :src="group.avatar"
                      :size="44"
                      round
                      class="transition-transform duration-motion-base ease-motion-enter group-hover:scale-105 motion-reduce:transform-none"
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
                      class="text-placeholder opacity-0 transition-[opacity,transform] duration-motion-base group-hover:(translate-x-1 opacity-100)"
                    />
                  </span>
                </span>
              </button>
            </div>
          </template>
        </a-listy>

        <div v-else class="py-60 flex items-center justify-center">
          <div class="text-center text-regular">
            <Icon name="i-lucide:users" :size="40" class="mb-10 opacity-50" />
            <div>暂无群聊</div>
          </div>
        </div>
      </Scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Scrollbar } from '@/components'
import { Icon } from '@/components/icon'
import Search from './search.vue'
import type { Conversation } from '../types'

interface Props {
  groups?: Conversation[]
  searchKeyword?: string
  showToolbar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  groups: () => [],
  searchKeyword: '',
  showToolbar: true,
})

const emits = defineEmits<{
  select: [group: Conversation]
  createGroup: []
  addContact: []
  openGlobalSearch: []
}>()

const searchValue = shallowRef('')

const filteredGroups = computed(() => {
  const normalizedKeyword = (props.searchKeyword || searchValue.value)
    .trim()
    .toLowerCase()
  if (!normalizedKeyword) {
    return props.groups
  }
  return props.groups.filter(
    (g) =>
      g.title.toLowerCase().includes(normalizedKeyword) ||
      g.groupInfo?.name.toLowerCase().includes(normalizedKeyword)
  )
})

function handleSelect(group: Conversation) {
  emits('select', group)
}
</script>
