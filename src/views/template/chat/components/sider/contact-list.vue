<template>
  <div class="h-full flex flex-col">
    <Search />
    <!-- Tabs -->
    <Tabs v-model:active-key="activeKey" :items="tabItems" />

    <!-- List -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-if="filteredContacts.length === 0"
        class="h-full flex items-center justify-center"
      >
        <div class="text-center text-regular">
          <Icon name="i-lucide:user-x" :size="40" class="mb-10 opacity-50" />
          <div>暂无联系人</div>
        </div>
      </div>
      <div v-else class="p-10">
        <div
          v-for="contact in filteredContacts"
          :key="contact.id"
          class="p-10 mb-8 rounded-6 cursor-pointer transition-all hover:bg-[#f5f5f5]"
          @click="handleSelect(contact)"
        >
          <div class="flex items-center gap-10">
            <!-- Avatar -->
            <div class="relative shrink-0">
              <n-avatar
                :src="contact.avatar"
                :size="44"
                round
                fallback-src="https://i.pravatar.cc/100?img=1"
              />
              <!-- Status -->
              <span
                v-if="contact.status"
                class="absolute bottom-0 right-0 w-10 h-10 rounded-full border-2 border-white"
                :class="{
                  'bg-success': contact.status === 'online',
                  'bg-regular': contact.status === 'offline',
                  'bg-error': contact.status === 'busy',
                  'bg-warning': contact.status === 'away',
                }"
              />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="font-500 text-main truncate">{{ contact.name }}</div>
              <div class="text-sm text-regular mt-2">
                {{ statusText(contact.status) }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-5 shrink-0">
              <button
                class="p-8 rounded-4 hover:bg-[#e8e8e8] text-regular"
                title="发起会话"
                @click.stop="startChat(contact)"
              >
                <Icon name="i-lucide:message-circle" :size="16" />
              </button>
              <button
                class="p-8 rounded-4 hover:bg-[#e8e8e8] text-regular"
                title="更多"
              >
                <Icon name="i-lucide:more-vertical" :size="16" />
              </button>
            </div>
          </div>

          <!-- Remark -->
          <div v-if="contact.remark" class="mt-6 text-sm text-regular">
            备注: {{ contact.remark }}
          </div>

          <!-- Tags -->
          <div v-if="contact.tags?.length" class="mt-6 flex flex-wrap gap-5">
            <span
              v-for="tag in contact.tags"
              :key="tag"
              class="px-6 py-2 text-xs bg-[#f5f5f5] text-regular rounded-4"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Search from '../search.vue'
import Tabs from '../tabs.vue'
import type { Contact } from '../types'

interface Props {
  contacts?: Contact[]
}

const props = withDefaults(defineProps<Props>(), {
  contacts: () => [],
})

const emit = defineEmits<{
  select: [contact: Contact]
  chat: [contact: Contact]
}>()
const activeKey = ref('all')
const tabItems = [
  { key: 'all', label: '全部' },
  { key: 'online', label: '在线' },
]

const filteredContacts = computed(() => {
  if (activeKey.value === 'online') {
    return props.contacts.filter((c) => c.status === 'online')
  }
  return props.contacts
})

function statusText(status?: Contact['status']) {
  switch (status) {
    case 'online':
      return '在线'
    case 'offline':
      return '离线'
    case 'busy':
      return '忙碌'
    case 'away':
      return '离开'
    default:
      return ''
  }
}

function handleSelect(contact: Contact) {
  emit('select', contact)
}

function startChat(contact: Contact) {
  emit('chat', contact)
}
</script>
