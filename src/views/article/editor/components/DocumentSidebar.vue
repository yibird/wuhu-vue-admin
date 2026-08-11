<script setup lang="ts">
import type { MenuProps } from 'antdv-next'
import type { EditorDocument } from '../types'

const props = defineProps<{
  documents: EditorDocument[]
  activeId: string
  keyword: string
  getActionMenu: (doc: EditorDocument) => {
    items: MenuProps['items']
    onClick: MenuProps['onClick']
  }
  getSelectedClass: (id: string) => string
  compact?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'create'): void
  (e: 'update:keyword', value: string): void
}>()
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      v-if="!compact"
      class="flex items-center justify-between border-b-1 border-b-solid border-color-1 p-14"
    >
      <div>
        <div class="text-lg text-main font-650">文档</div>
        <div class="mt-2 text-xs text-secondary">
          {{ props.documents.length }} 份内容
        </div>
      </div>
      <button
        type="button"
        class="button size-34 rounded-6 bg-primary text-white"
        title="新建文档"
        @click="emit('create')"
      >
        <Icon name="i-lucide:plus" :size="18" />
      </button>
    </div>

    <div class="border-b-1 border-b-solid border-color-1 p-12">
      <a-input
        :value="props.keyword"
        allow-clear
        placeholder="搜索标题、摘要、标签"
        @update:value="(v: string) => emit('update:keyword', v)"
      >
        <template #prefix>
          <Icon name="i-lucide:search" class="text-secondary" />
        </template>
      </a-input>
    </div>

    <Scrollbar class="min-h-0 flex-1" content-class="p-10">
      <div
        v-for="doc in props.documents"
        :key="doc.id"
        :class="[
          'group mb-8 cursor-pointer rounded-6 border-1 border-solid p-10 transition-colors hover:(border-color-primary bg-hover)',
          getSelectedClass(doc.id),
        ]"
        role="button"
        tabindex="0"
        @click="emit('select', doc.id)"
        @keydown.enter="emit('select', doc.id)"
        @keydown.space.prevent="emit('select', doc.id)"
      >
        <div class="flex items-start justify-between gap-8">
          <div class="min-w-0">
            <div class="truncate text-sm text-main font-600">
              {{ doc.title }}
            </div>
            <div
              v-if="!compact"
              class="mt-5 line-clamp-2 text-xs text-secondary leading-18px"
            >
              {{ doc.summary }}
            </div>
          </div>
          <span
            v-if="!compact"
            class="shrink-0 rounded-full px-7 py-2 text-xs"
            :class="
              doc.status === 'published'
                ? 'bg-success-tint text-success'
                : 'bg-fill-quaternary text-secondary'
            "
          >
            {{ doc.status === 'published' ? '发布' : '草稿' }}
          </span>
        </div>
        <div
          v-if="!compact"
          class="mt-10 flex items-center justify-between gap-8"
        >
          <div class="min-w-0 flex flex-wrap gap-5">
            <span
              v-for="tag in doc.tags"
              :key="tag"
              class="rounded-4 bg-fill-quaternary px-6 py-2 text-xs text-secondary"
            >
              {{ tag }}
            </span>
          </div>
          <a-dropdown :trigger="['click']" :menu="getActionMenu(doc)">
            <button
              type="button"
              class="button size-26 rounded-4 text-secondary opacity-0 transition-opacity group-hover:opacity-100 hover:(bg-hover text-primary)"
              @click.stop
            >
              <Icon name="i-lucide:more-horizontal" :size="16" />
            </button>
          </a-dropdown>
        </div>
      </div>

      <a-empty
        v-if="props.documents.length === 0"
        class="py-42"
        description="没有匹配的文档"
      />
    </Scrollbar>
  </div>
</template>
