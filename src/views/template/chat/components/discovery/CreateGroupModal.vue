<script setup lang="ts">
import { computed, reactive, shallowRef, watch } from 'vue'
import { Icon } from '@/components'
import type { Contact, CreateGroupPayload, GroupCategory } from '../types'

interface CreateGroupForm {
  name: string
  category?: GroupCategory
  memberIds: string[]
}

const props = withDefaults(
  defineProps<{
    contacts?: Contact[]
  }>(),
  {
    contacts: () => [],
  }
)

const emit = defineEmits<{
  submit: [payload: CreateGroupPayload]
}>()

const open = defineModel<boolean>('open', { default: false })
const friendKeyword = shallowRef('')
const form = reactive<CreateGroupForm>({
  name: '',
  category: undefined,
  memberIds: [],
})

const categoryOptions = [
  { label: '项目协作', value: 'project' },
  { label: '部门沟通', value: 'department' },
  { label: '兴趣交流', value: 'interest' },
  { label: '学习成长', value: 'study' },
  { label: '其他', value: 'other' },
]

const filteredContacts = computed(() => {
  const keyword = friendKeyword.value.trim().toLowerCase()
  if (!keyword) return props.contacts

  return props.contacts.filter((contact) =>
    [contact.name, contact.title, contact.department].some((text) =>
      text?.toLowerCase().includes(keyword)
    )
  )
})

const canSubmit = computed(
  () =>
    Boolean(form.name.trim()) &&
    form.name.trim().length <= 50 &&
    Boolean(form.category) &&
    form.memberIds.length > 0
)

watch(open, (isOpen) => {
  if (isOpen) resetForm()
})

function resetForm() {
  form.name = ''
  form.category = undefined
  form.memberIds = []
  friendKeyword.value = ''
}

function handleSubmit() {
  if (!canSubmit.value || !form.category) return

  emit('submit', {
    name: form.name.trim(),
    category: form.category,
    memberIds: [...form.memberIds],
  })
  open.value = false
}
</script>

<template>
  <a-modal
    v-model:open="open"
    centered
    :destroy-on-hidden="true"
    :mask-closable="false"
    :width="640"
    ok-text="创建群聊"
    cancel-text="取消"
    :ok-button-props="{ disabled: !canSubmit }"
    @ok="handleSubmit"
  >
    <template #title>
      <div class="flex items-center gap-10">
        <span
          class="size-36 flex items-center justify-center rounded-8 bg-primary/10 text-primary"
        >
          <Icon name="i-lucide:users-round" :size="18" />
        </span>
        <div>
          <div class="text-lg text-main font-600">创建群聊</div>
          <div class="mt-2 text-xs text-secondary font-400">
            设置群信息并邀请好友加入
          </div>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-18 py-6">
      <div>
        <div class="mb-7 text-sm text-main font-500">
          <span class="mr-4 text-error">*</span>群名称
        </div>
        <a-input
          v-model:value="form.name"
          :maxlength="50"
          show-count
          allow-clear
          placeholder="请输入群名称"
        >
          <template #prefix>
            <Icon name="i-lucide:message-square-text" class="text-secondary" />
          </template>
        </a-input>
      </div>

      <div>
        <div class="mb-7 text-sm text-main font-500">
          <span class="mr-4 text-error">*</span>群分类
        </div>
        <a-select
          v-model:value="form.category"
          class="w-full"
          :options="categoryOptions"
          placeholder="请选择群分类"
        >
          <template #prefix>
            <Icon name="i-lucide:shapes" class="text-secondary" />
          </template>
        </a-select>
      </div>

      <div>
        <div class="mb-7 flex items-center justify-between gap-10">
          <div class="text-sm text-main font-500">
            <span class="mr-4 text-error">*</span>选择好友
          </div>
          <span class="text-xs text-secondary">
            已选择 {{ form.memberIds.length }} 人
          </span>
        </div>
        <a-input
          v-model:value="friendKeyword"
          allow-clear
          placeholder="搜索好友"
        >
          <template #prefix>
            <Icon name="i-lucide:search" class="text-secondary" />
          </template>
        </a-input>

        <div
          class="mt-10 max-h-260 overflow-y-auto border-y-1 border-color-1 border-y-solid py-4"
        >
          <a-empty
            v-if="filteredContacts.length === 0"
            class="py-24"
            description="没有匹配的好友"
          />
          <a-checkbox-group
            v-else
            v-model:value="form.memberIds"
            class="w-full flex flex-col"
          >
            <label
              v-for="contact in filteredContacts"
              :key="contact.id"
              class="flex items-center gap-10 rounded-6 px-10 py-8 cursor-pointer transition-colors hover:bg-hover"
            >
              <a-checkbox :value="contact.id" />
              <a-avatar
                :src="contact.avatar"
                :size="36"
                round
                fallback-src="https://i.pravatar.cc/100?img=1"
              />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm text-main font-500">
                  {{ contact.name }}
                </span>
                <span class="mt-2 block truncate text-xs text-secondary">
                  {{ contact.title || contact.department || '暂无职位信息' }}
                </span>
              </span>
            </label>
          </a-checkbox-group>
        </div>
      </div>
    </div>
  </a-modal>
</template>
