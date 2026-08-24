<script setup lang="ts">
import { Icon } from '@/components/icon'
import VirtualList from '../VirtualList.vue'
import type {
  Conversation,
  GroupMember,
  GroupMemberRole,
  GroupPanelTab,
  UserInfo,
} from '../types'

const props = defineProps<{
  conversation?: Conversation
}>()

const emit = defineEmits<{
  updateAnnouncement: [conversation: Conversation, content: string]
  showUser: [user: UserInfo]
}>()

const open = defineModel<boolean>('open', { default: false })
const activeTab = defineModel<GroupPanelTab>('activeTab', {
  default: 'announcement',
})
const memberKeyword = shallowRef('')
const announcementDraft = shallowRef('')
const editingAnnouncement = shallowRef(false)

const drawerStyles = {
  body: { padding: 0, overflow: 'hidden' },
}
const roleLabels: Record<GroupMemberRole, string> = {
  owner: '群主',
  admin: '管理员',
  member: '成员',
}
const roleColors: Record<GroupMemberRole, string | undefined> = {
  owner: 'gold',
  admin: 'blue',
  member: undefined,
}

const groupInfo = computed(() => props.conversation?.groupInfo)
const announcement = computed(() => groupInfo.value?.announcement)
const members = computed(() => groupInfo.value?.members ?? [])
const tabOptions = computed(() => [
  { label: '群公告', value: 'announcement' },
  {
    label: `群成员 ${groupInfo.value?.memberCount ?? members.value.length}`,
    value: 'members',
  },
])
const filteredMembers = computed(() => {
  const keyword = memberKeyword.value.trim().toLowerCase()
  if (!keyword) return members.value

  return members.value.filter((member) =>
    [
      member.name,
      member.title,
      member.department,
      roleLabels[member.role],
    ].some((value) => value?.toLowerCase().includes(keyword))
  )
})
const canSaveAnnouncement = computed(() => {
  const content = announcementDraft.value.trim()
  return Boolean(content) && content !== announcement.value?.content
})

watch(
  [open, () => props.conversation?.id],
  ([isOpen]) => {
    if (!isOpen) return
    memberKeyword.value = ''
    editingAnnouncement.value = false
    announcementDraft.value = announcement.value?.content ?? ''
  },
  { immediate: true }
)

function startAnnouncementEdit() {
  announcementDraft.value = announcement.value?.content ?? ''
  editingAnnouncement.value = true
}

function cancelAnnouncementEdit() {
  announcementDraft.value = announcement.value?.content ?? ''
  editingAnnouncement.value = false
}

function saveAnnouncement() {
  if (!props.conversation || !canSaveAnnouncement.value) return
  emit('updateAnnouncement', props.conversation, announcementDraft.value.trim())
  editingAnnouncement.value = false
}

function getMemberInitial(member: GroupMember) {
  return member.name.trim().slice(0, 1).toUpperCase()
}
</script>

<template>
  <a-drawer
    v-model:open="open"
    :destroy-on-hidden="true"
    :size="420"
    :styles="drawerStyles"
  >
    <template #title>
      <div class="min-w-0 flex items-center gap-10 pr-12">
        <a-avatar :src="conversation?.avatar" :size="36">
          {{ conversation?.title?.slice(0, 1) }}
        </a-avatar>
        <div class="min-w-0">
          <div class="truncate text-main font-600">
            {{ conversation?.title }}
          </div>
          <div class="mt-2 text-xs text-secondary">
            {{ groupInfo?.memberCount ?? members.length }} 位成员
          </div>
        </div>
      </div>
    </template>

    <div class="h-full min-h-0 flex flex-col bg-container">
      <div class="shrink-0 border-b-1 border-b-solid border-color-1 p-12">
        <a-segmented v-model:value="activeTab" block :options="tabOptions" />
      </div>

      <div
        v-if="activeTab === 'announcement'"
        class="min-h-0 flex-1 overflow-y-auto p-18"
      >
        <div v-if="editingAnnouncement" class="flex flex-col gap-12">
          <div class="flex items-center gap-8 text-main font-600">
            <Icon name="i-lucide:megaphone" :size="17" class="text-primary" />
            {{ announcement ? '编辑群公告' : '发布群公告' }}
          </div>
          <a-textarea
            v-model:value="announcementDraft"
            :auto-size="{ minRows: 7, maxRows: 12 }"
            :maxlength="500"
            show-count
            placeholder="请输入群公告内容"
          />
          <div class="flex justify-end gap-8">
            <a-button @click="cancelAnnouncementEdit">取消</a-button>
            <a-button
              type="primary"
              :disabled="!canSaveAnnouncement"
              @click="saveAnnouncement"
            >
              保存公告
            </a-button>
          </div>
        </div>

        <div v-else-if="announcement" class="flex flex-col gap-16">
          <div class="flex items-start justify-between gap-12">
            <div class="flex items-center gap-8 text-main font-600">
              <Icon name="i-lucide:megaphone" :size="17" class="text-primary" />
              群公告
            </div>
            <a-button type="text" @click="startAnnouncementEdit">
              <template #icon>
                <Icon name="i-lucide:pencil" :size="15" />
              </template>
              编辑
            </a-button>
          </div>
          <div
            class="whitespace-pre-wrap break-words border-y-1 border-color-1 border-y-solid bg-fill-quaternary px-14 py-16 text-sm text-main leading-7"
          >
            {{ announcement.content }}
          </div>
          <div class="flex items-center gap-6 text-xs text-secondary">
            <Icon name="i-lucide:clock-3" :size="13" />
            <span>{{ announcement.updatedBy }}</span>
            <span>更新于 {{ announcement.updatedAt }}</span>
          </div>
        </div>

        <div
          v-else
          class="h-full min-h-320 flex flex-col items-center justify-center text-center"
        >
          <span
            class="size-52 flex items-center justify-center rounded-full bg-fill-quaternary text-secondary"
          >
            <Icon name="i-lucide:megaphone" :size="24" />
          </span>
          <div class="mt-14 text-main font-600">暂无群公告</div>
          <a-button class="mt-16" type="primary" @click="startAnnouncementEdit">
            发布公告
          </a-button>
        </div>
      </div>

      <div v-else class="min-h-0 flex flex-1 flex-col">
        <div class="shrink-0 border-b-1 border-b-solid border-color-1 p-12">
          <a-input
            v-model:value="memberKeyword"
            allow-clear
            placeholder="搜索群成员"
          >
            <template #prefix>
              <Icon name="i-lucide:search" :size="15" class="text-secondary" />
            </template>
          </a-input>
          <div class="mt-8 text-xs text-secondary">
            {{
              memberKeyword.trim()
                ? `找到 ${filteredMembers.length} 位成员`
                : `共 ${members.length} 位成员`
            }}
          </div>
        </div>

        <VirtualList
          class="min-h-0 flex-1"
          aria-label="群成员列表"
          :items="filteredMembers"
          :estimate-size="62"
          :get-item-key="(member) => member.id"
        >
          <template #default="{ item: member }">
            <div class="px-8 py-1">
              <button
                type="button"
                class="button group w-full flex items-center gap-10 rounded-6 px-10 py-9 text-left transition-[background-color,box-shadow,transform] duration-motion-base ease-motion-enter hover:(translate-x-1 bg-hover shadow-all-sm) active:scale-99 focus-visible:(outline-none bg-hover shadow-[0_0_0_2px_rgb(var(--w-color-primary)/24%)]) motion-reduce:(transform-none transition-none)"
                @click="emit('showUser', member)"
              >
                <span class="relative shrink-0">
                  <a-avatar
                    :src="member.avatar"
                    :size="38"
                    class="transition-transform duration-motion-base ease-motion-enter group-hover:scale-105 motion-reduce:transform-none"
                  >
                    {{ getMemberInitial(member) }}
                  </a-avatar>
                  <span
                    class="absolute bottom-0 right-0 size-9 rounded-full border-2 border-container"
                    :class="{
                      'bg-success': member.status === 'online',
                      'bg-fill': member.status === 'offline',
                      'bg-error': member.status === 'busy',
                      'bg-warning': member.status === 'away',
                    }"
                  />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="flex items-center gap-6">
                    <span class="truncate text-sm text-main font-500">
                      {{ member.name }}
                    </span>
                    <a-tag
                      v-if="member.role !== 'member'"
                      :color="roleColors[member.role]"
                      class="shrink-0"
                    >
                      {{ roleLabels[member.role] }}
                    </a-tag>
                  </span>
                  <span class="mt-3 block truncate text-xs text-secondary">
                    {{
                      [member.title, member.department]
                        .filter(Boolean)
                        .join(' · ') || '暂无职位信息'
                    }}
                  </span>
                </span>
                <Icon
                  name="i-lucide:chevron-right"
                  :size="15"
                  class="shrink-0 text-placeholder opacity-0 transition-opacity group-hover:opacity-100"
                />
              </button>
            </div>
          </template>

          <template #empty>
            <div class="h-full flex items-center justify-center">
              <a-empty description="没有匹配的群成员" />
            </div>
          </template>
        </VirtualList>
      </div>
    </div>
  </a-drawer>
</template>
