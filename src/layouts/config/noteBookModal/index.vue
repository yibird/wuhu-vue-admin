<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import dayjs from 'dayjs'
import { useMediaQuery } from '@vueuse/core'
import message from 'antdv-next/dist/message/index'
import { Icon } from '@/components/icon'

interface NoteItem {
  id: string
  title: string
  content: string
  pinned: boolean
  updatedAt: string
}

const storageKey = 'wuhu-note-book-items'
const show = defineModel('show', { default: false })
const isNarrowScreen = useMediaQuery('(max-width: 768px)')
const drawerSize = computed(() => (isNarrowScreen.value ? '100%' : 920))

function createId() {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function createDefaultNotes(): NoteItem[] {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return [
    {
      id: createId(),
      title: '今日跟进',
      content: '客户转化报表导出后，核对华南区发票归档与活动素材下载状态。',
      pinned: true,
      updatedAt: now,
    },
    {
      id: createId(),
      title: '发布检查',
      content: '确认任务中心、下载中心、记事本入口在顶部工具栏都可打开。',
      pinned: false,
      updatedAt: now,
    },
  ]
}

function readNotes() {
  if (typeof window === 'undefined') return createDefaultNotes()

  try {
    const rawValue = window.localStorage.getItem(storageKey)
    if (!rawValue) return createDefaultNotes()

    const payload = JSON.parse(rawValue)
    return Array.isArray(payload) && payload.length
      ? (payload as NoteItem[])
      : createDefaultNotes()
  } catch {
    return createDefaultNotes()
  }
}

function persistNotes(items: NoteItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(storageKey, JSON.stringify(items))
}

const notes = shallowRef<NoteItem[]>(readNotes())
const activeId = shallowRef(notes.value[0]?.id ?? '')
const keyword = shallowRef('')

const sortedNotes = computed(() => {
  return [...notes.value].sort((left, right) => {
    if (left.pinned !== right.pinned) return left.pinned ? -1 : 1
    return dayjs(right.updatedAt).valueOf() - dayjs(left.updatedAt).valueOf()
  })
})

const filteredNotes = computed(() => {
  const value = keyword.value.trim().toLowerCase()
  if (!value) return sortedNotes.value

  return sortedNotes.value.filter((note) => {
    return [note.title, note.content].join(' ').toLowerCase().includes(value)
  })
})

const activeNote = computed(() => {
  return (
    notes.value.find((note) => note.id === activeId.value) ??
    filteredNotes.value[0] ??
    null
  )
})

const noteCountLabel = computed(() => {
  const pinnedCount = notes.value.filter((note) => note.pinned).length
  return `${notes.value.length} 条笔记 · ${pinnedCount} 条置顶`
})

function updateNote(id: string, patch: Partial<NoteItem>) {
  const updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
  notes.value = notes.value.map((note) => {
    return note.id === id ? { ...note, ...patch, updatedAt } : note
  })
  persistNotes(notes.value)
}

function addNote() {
  const note: NoteItem = {
    id: createId(),
    title: '未命名笔记',
    content: '',
    pinned: false,
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }

  notes.value = [note, ...notes.value]
  activeId.value = note.id
  persistNotes(notes.value)
}

function selectNote(id: string) {
  activeId.value = id
}

function togglePin(note: NoteItem) {
  updateNote(note.id, { pinned: !note.pinned })
}

function deleteNote(note: NoteItem) {
  notes.value = notes.value.filter((item) => item.id !== note.id)
  activeId.value = filteredNotes.value[0]?.id ?? notes.value[0]?.id ?? ''
  persistNotes(notes.value)
}

async function copyNote(note: NoteItem) {
  await navigator.clipboard?.writeText(`${note.title}\n${note.content}`)
  message.success('已复制笔记内容')
}
</script>

<template>
  <a-drawer
    v-model:open="show"
    title="记事本"
    :size="drawerSize"
    placement="right"
    closable
    :classes="{ body: 'p-0! overflow-hidden!' }"
  >
    <div class="h-full min-h-0 overflow-hidden bg-page">
      <div
        class="h-full min-h-0 grid grid-cols-[280px_minmax(0,1fr)] max-md:grid-cols-1"
      >
        <aside
          class="min-h-0 flex flex-col border-r-1 border-r-solid border-color-1 bg-container"
        >
          <div class="border-b-1 border-b-solid border-color-1 p-12">
            <div class="mb-10 flex items-center justify-between gap-8">
              <div class="min-w-0">
                <div class="text-sm text-main font-800">便签列表</div>
                <div class="mt-2 text-xs text-secondary">
                  {{ noteCountLabel }}
                </div>
              </div>
              <a-button type="primary" @click="addNote">
                <template #icon>
                  <Icon name="i-lucide:plus" :size="15" />
                </template>
                新建
              </a-button>
            </div>
            <a-input v-model:value="keyword" allow-clear placeholder="搜索笔记">
              <template #prefix>
                <Icon
                  name="i-lucide:search"
                  :size="14"
                  class="text-secondary"
                />
              </template>
            </a-input>
          </div>

          <Scrollbar
            v-if="filteredNotes.length"
            class="min-h-0 flex-1"
            content-class="p-8"
          >
            <button
              v-for="note in filteredNotes"
              :key="note.id"
              type="button"
              class="mb-8 w-full rounded-8 border-1 border-color-2 border-solid bg-container p-10 text-left transition-colors hover:(border-color-primary bg-hover)"
              :class="
                note.id === activeNote?.id
                  ? 'border-color-primary bg-primary-tint'
                  : ''
              "
              @click="selectNote(note.id)"
            >
              <div class="flex items-start gap-8">
                <span
                  class="mt-1 size-28 shrink-0 flex items-center justify-center rounded-7"
                  :class="
                    note.pinned
                      ? 'bg-warning-tint text-warning'
                      : 'bg-fill-quaternary text-secondary'
                  "
                >
                  <Icon
                    :name="
                      note.pinned ? 'i-lucide:pin' : 'i-lucide:notebook-tabs'
                    "
                    :size="15"
                  />
                </span>
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm text-main font-700">
                    {{ note.title || '未命名笔记' }}
                  </div>
                  <div class="mt-4 line-clamp-2 text-xs text-secondary">
                    {{ note.content || '空白笔记' }}
                  </div>
                  <div class="mt-6 text-11px text-placeholder">
                    {{ note.updatedAt }}
                  </div>
                </div>
              </div>
            </button>
          </Scrollbar>

          <div
            v-else
            class="min-h-0 flex-1 flex items-center justify-center p-20"
          >
            <a-empty description="暂无匹配笔记" />
          </div>
        </aside>

        <section class="min-h-0 flex flex-col bg-page">
          <template v-if="activeNote">
            <header
              class="flex flex-wrap items-center justify-between gap-10 border-b-1 border-b-solid border-color-1 bg-container px-16 py-12"
            >
              <div class="min-w-0">
                <div class="text-sm text-main font-800">编辑笔记</div>
                <div class="mt-2 text-xs text-secondary">
                  更新于 {{ activeNote.updatedAt }}
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-8">
                <a-button @click="togglePin(activeNote)">
                  <template #icon>
                    <Icon
                      :name="
                        activeNote.pinned ? 'i-lucide:pin-off' : 'i-lucide:pin'
                      "
                      :size="15"
                    />
                  </template>
                  {{ activeNote.pinned ? '取消置顶' : '置顶' }}
                </a-button>
                <a-button @click="copyNote(activeNote)">
                  <template #icon>
                    <Icon name="i-lucide:copy" :size="15" />
                  </template>
                  复制
                </a-button>
                <a-popconfirm
                  title="确认删除这条笔记？"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="deleteNote(activeNote)"
                >
                  <a-button danger>
                    <template #icon>
                      <Icon name="i-lucide:trash-2" :size="15" />
                    </template>
                    删除
                  </a-button>
                </a-popconfirm>
              </div>
            </header>

            <div class="min-h-0 flex-1 p-16">
              <div
                class="h-full min-h-0 flex flex-col rounded-8 border-1 border-color-2 border-solid bg-container p-14"
              >
                <a-input
                  :value="activeNote.title"
                  class="note-title-input"
                  placeholder="笔记标题"
                  size="large"
                  @update:value="
                    updateNote(activeNote.id, { title: String($event) })
                  "
                />
                <a-textarea
                  :value="activeNote.content"
                  class="mt-12 flex-1"
                  placeholder="记录想法、待办或临时信息"
                  :bordered="false"
                  @update:value="
                    updateNote(activeNote.id, { content: String($event) })
                  "
                />
              </div>
            </div>
          </template>

          <div v-else class="h-full flex items-center justify-center p-20">
            <a-empty description="请选择或新建笔记" />
          </div>
        </section>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped lang="less">
.note-title-input :deep(input) {
  font-weight: 800;
}

:deep(.ant-input-textarea),
:deep(.ant-input-textarea textarea) {
  height: 100%;
  min-height: 0;
  resize: none;
}
</style>
