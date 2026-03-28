<template>
  <div class="h-full flex flex-col">
    <!-- Search -->
    <div class="px-10 py-10">
      <n-input
        v-model:value="searchValue"
        placeholder="搜索群聊"
        clearable
        size="small"
      >
        <template #prefix>
          <Icon name="i-lucide:search" :size="16" class="text-regular" />
        </template>
      </n-input>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-if="filteredGroups.length === 0"
        class="h-full flex items-center justify-center"
      >
        <div class="text-center text-regular">
          <Icon name="i-lucide:users" :size="40" class="mb-10 opacity-50" />
          <div>暂无群聊</div>
        </div>
      </div>
      <div v-else class="p-10">
        <div
          v-for="group in filteredGroups"
          :key="group.id"
          class="p-10 mb-8 rounded-6 cursor-pointer transition-all hover:bg-[#f5f5f5]"
          @click="handleSelect(group)"
        >
          <div class="flex items-start gap-10">
            <!-- Avatar -->
            <div class="relative shrink-0">
              <n-avatar
                :src="group.avatar"
                :size="44"
                round
                fallback-src="https://i.pravatar.cc/100?img=5"
              />
              <!-- Member count badge -->
              <span
                v-if="group.groupInfo?.memberCount"
                class="absolute -bottom-4 -right-4 px-6 py-2 text-xs bg-[#f5f5f5] text-regular rounded-full"
              >
                {{ group.groupInfo.memberCount }}人
              </span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-10">
                <span class="font-500 text-main truncate">{{
                  group.title
                }}</span>
                <span class="text-xs text-regular shrink-0">{{
                  group.lastMessageTime
                }}</span>
              </div>
              <div class="mt-4 text-sm text-regular truncate">
                {{ group.lastMessage }}
              </div>
            </div>

            <!-- Unread badge -->
            <div v-if="group.unreadCount > 0" class="shrink-0">
              <span
                class="min-w-18 h-18 px-4 flex items-center justify-center text-xs bg-primary text-white rounded-full"
              >
                {{ group.unreadCount > 99 ? '99+' : group.unreadCount }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Conversation } from '../types'

interface Props {
  groups?: Conversation[]
}

const props = withDefaults(defineProps<Props>(), {
  groups: () => [],
})

const emit = defineEmits<{
  select: [group: Conversation]
}>()

const searchValue = ref('')

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
