<script setup lang="ts">
import type {
  EditorComment,
  EditorDocument,
  EditorVersion,
  OutlineItem,
} from '../types'

const props = defineProps<{
  activeDocument: EditorDocument | undefined
  wordCount: number
  paragraphCount: number
  readingMinutes: number
  outlineOpen: boolean
  outline: OutlineItem[]
  activeVersions: EditorVersion[]
  activeComments: EditorComment[]
  unresolvedCommentCount: number
  commentDraft: string
}>()

const emit = defineEmits<{
  (e: 'toggle-outline'): void
  (e: 'copy-html'): void
  (e: 'import'): void
  (e: 'export', format: 'html' | 'md' | 'txt'): void
  (e: 'save-version'): void
  (e: 'restore-version', version: EditorVersion): void
  (e: 'add-comment'): void
  (e: 'toggle-comment-resolved', commentId: string): void
  (e: 'update-status', status: EditorDocument['status']): void
  (e: 'update:commentDraft', value: string): void
}>()
</script>

<template>
  <aside
    class="ml-12 w-300 shrink-0 rounded-8 border-1 border-solid border-color-1 bg-container max-xl:w-260 max-lg:ml-0 max-lg:mt-12 max-lg:w-full"
  >
    <div
      class="flex items-center justify-between border-b-1 border-b-solid border-color-1 px-14 py-12"
    >
      <div class="text-sm text-main font-600">文档信息</div>
      <button
        type="button"
        class="button size-28 rounded-4 text-secondary transition-colors hover:(bg-hover text-primary)"
        @click="emit('toggle-outline')"
      >
        <Icon
          :name="
            props.outlineOpen
              ? 'i-lucide:panel-right-close'
              : 'i-lucide:panel-right-open'
          "
        />
      </button>
    </div>
    <div class="space-y-12 p-14">
      <div class="grid grid-cols-3 gap-8">
        <div class="rounded-6 bg-fill-quaternary p-10">
          <div class="text-xs text-secondary">字数</div>
          <div class="mt-6 text-lg text-main font-650">
            {{ props.wordCount }}
          </div>
        </div>
        <div class="rounded-6 bg-fill-quaternary p-10">
          <div class="text-xs text-secondary">段落</div>
          <div class="mt-6 text-lg text-main font-650">
            {{ props.paragraphCount }}
          </div>
        </div>
        <div class="rounded-6 bg-fill-quaternary p-10">
          <div class="text-xs text-secondary">阅读</div>
          <div class="mt-6 text-lg text-main font-650">
            {{ props.readingMinutes }}m
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-8">
        <a-button block @click="emit('copy-html')">
          <template #icon>
            <Icon name="i-lucide:copy" />
          </template>
          复制 HTML
        </a-button>
        <a-button block @click="emit('import')">
          <template #icon>
            <Icon name="i-lucide:upload" />
          </template>
          导入内容
        </a-button>
      </div>

      <div class="grid grid-cols-3 gap-8">
        <a-button @click="emit('export', 'html')">
          <template #icon>
            <Icon name="i-lucide:file-code" />
          </template>
          HTML
        </a-button>
        <a-button @click="emit('export', 'md')">
          <template #icon>
            <Icon name="i-lucide:file-type" />
          </template>
          MD
        </a-button>
        <a-button @click="emit('export', 'txt')">
          <template #icon>
            <Icon name="i-lucide:file-text" />
          </template>
          TXT
        </a-button>
      </div>

      <!-- 版本历史 -->
      <div class="rounded-6 border-1 border-solid border-color-1">
        <div
          class="flex items-center justify-between border-b-1 border-b-solid border-color-1 px-10 py-8"
        >
          <div class="text-sm text-main font-600">版本历史</div>
          <a-button size="small" type="link" @click="emit('save-version')">
            保存版本
          </a-button>
        </div>
        <div
          v-if="props.activeVersions.length"
          class="max-h-170 overflow-auto p-8"
        >
          <button
            v-for="version in props.activeVersions"
            :key="version.id"
            type="button"
            class="mb-7 w-full rounded-6 border-1 border-solid border-color-1 bg-container-secondary p-8 text-left transition-colors hover:(border-color-primary bg-hover)"
            @click="emit('restore-version', version)"
          >
            <span class="block truncate text-sm text-main font-600">
              {{ version.title }}
            </span>
            <span class="mt-3 block truncate text-xs text-secondary">
              {{ version.createdAt }} · {{ version.wordCount }} 字
            </span>
          </button>
        </div>
        <a-empty v-else class="py-18" description="暂无版本" />
      </div>

      <!-- 协作评论 -->
      <div class="rounded-6 border-1 border-solid border-color-1">
        <div
          class="flex items-center justify-between border-b-1 border-b-solid border-color-1 px-10 py-8"
        >
          <div class="text-sm text-main font-600">协作评论</div>
          <span class="text-xs text-secondary">
            {{ props.unresolvedCommentCount }} 未解决
          </span>
        </div>
        <div class="grid gap-8 p-8">
          <a-textarea
            :value="props.commentDraft"
            :rows="2"
            placeholder="添加评论或修改建议"
            @update:value="(v: string) => emit('update:commentDraft', v)"
          />
          <a-button size="small" type="primary" @click="emit('add-comment')">
            添加评论
          </a-button>
          <button
            v-for="comment in props.activeComments"
            :key="comment.id"
            type="button"
            class="rounded-6 border-1 border-solid border-color-1 bg-container-secondary p-8 text-left transition-colors hover:(border-color-primary bg-hover)"
            @click="emit('toggle-comment-resolved', comment.id)"
          >
            <span class="flex items-center justify-between gap-8">
              <strong class="truncate text-sm text-main">
                {{ comment.author }}
              </strong>
              <a-tag :color="comment.resolved ? 'success' : 'warning'">
                {{ comment.resolved ? '已解决' : '待处理' }}
              </a-tag>
            </span>
            <span class="mt-5 block text-xs text-secondary leading-18px">
              {{ comment.content }}
            </span>
            <span class="mt-5 block text-xs text-placeholder">
              {{ comment.createdAt }}
            </span>
          </button>
        </div>
      </div>

      <!-- 发布/草稿切换 -->
      <a-button
        block
        :type="
          props.activeDocument?.status === 'published' ? 'default' : 'primary'
        "
        @click="
          emit(
            'update-status',
            props.activeDocument?.status === 'published' ? 'draft' : 'published'
          )
        "
      >
        <template #icon>
          <Icon
            :name="
              props.activeDocument?.status === 'published'
                ? 'i-lucide:archive-restore'
                : 'i-lucide:send'
            "
          />
        </template>
        {{
          props.activeDocument?.status === 'published' ? '转为草稿' : '发布文档'
        }}
      </a-button>

      <!-- 大纲 -->
      <div
        v-if="props.outlineOpen"
        class="rounded-6 border-1 border-solid border-color-1"
      >
        <div
          class="border-b-1 border-b-solid border-color-1 px-10 py-8 text-sm text-main font-600"
        >
          大纲
        </div>
        <div v-if="props.outline.length" class="p-8">
          <div
            v-for="item in props.outline"
            :key="item.id"
            class="truncate rounded-4 px-8 py-5 text-sm text-secondary"
            :style="{ paddingLeft: `${item.level * 8}px` }"
          >
            {{ item.text }}
          </div>
        </div>
        <a-empty v-else class="py-20" description="暂无标题" />
      </div>
    </div>
  </aside>
</template>
