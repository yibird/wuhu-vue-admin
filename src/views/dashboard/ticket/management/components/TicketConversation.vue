<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import {
  getTicketCategoryMeta,
  getTicketPriorityMeta,
  getTicketStatusMeta,
} from '../../data'
import type { TicketRecord } from '../../types'
import { activityTypeMeta } from '../data'

const props = defineProps<{
  ticket?: TicketRecord
  currentAgent: string
}>()

const emit = defineEmits<{
  publicReply: [content: string]
  internalNote: [content: string]
}>()

const composerMode = shallowRef<'reply' | 'internal'>('reply')
const composerContent = shallowRef('')
const composerOptions = [
  { label: '公开回复', value: 'reply' },
  { label: '内部备注', value: 'internal' },
]

watch(
  () => props.ticket?.id,
  () => {
    composerMode.value = 'reply'
    composerContent.value = ''
  }
)

function submitComposer() {
  const content = composerContent.value.trim()
  if (!content) return

  if (composerMode.value === 'reply') emit('publicReply', content)
  else emit('internalNote', content)
  composerContent.value = ''
}
</script>

<template>
  <section class="min-h-0 flex flex-col bg-container">
    <a-empty v-if="!ticket" class="my-auto" description="请选择一条工单" />

    <template v-else>
      <header
        class="flex-none border-b-1 border-color-2 border-b-solid px-16 py-14"
      >
        <div class="flex flex-wrap items-center gap-7">
          <span class="text-xs text-secondary">{{ ticket.id }}</span>
          <a-tag
            :bordered="false"
            :color="getTicketStatusMeta(ticket.status).color"
          >
            {{ getTicketStatusMeta(ticket.status).label }}
          </a-tag>
          <a-tag
            :bordered="false"
            :color="getTicketPriorityMeta(ticket.priority).color"
          >
            {{ getTicketPriorityMeta(ticket.priority).label }}优先级
          </a-tag>
        </div>
        <h2 class="mb-0 mt-8 text-lg text-main font-700 leading-7">
          {{ ticket.subject }}
        </h2>
        <div
          class="mt-7 flex flex-wrap items-center gap-x-14 gap-y-5 text-xs text-secondary"
        >
          <span class="inline-flex items-center gap-4">
            <Icon name="i-lucide:user-round" :size="13" />
            {{ ticket.reporter }}
          </span>
          <span class="inline-flex items-center gap-4">
            <Icon name="i-lucide:mail" :size="13" />
            {{ ticket.contact }}
          </span>
          <span class="inline-flex items-center gap-4">
            <Icon
              :name="getTicketCategoryMeta(ticket.category).icon"
              :size="13"
            />
            {{ getTicketCategoryMeta(ticket.category).label }}
          </span>
        </div>
      </header>

      <div class="min-h-0 flex-1 overflow-y-auto">
        <section class="border-b-1 border-color-2 border-b-solid px-16 py-14">
          <div class="mb-7 flex items-center justify-between">
            <h3 class="mb-0 text-sm text-main font-600">问题描述</h3>
            <span class="text-xs text-secondary"
              >提交于 {{ ticket.createdAt }}</span
            >
          </div>
          <p class="mb-0 whitespace-pre-wrap text-sm text-regular leading-7">
            {{ ticket.description }}
          </p>
          <div v-if="ticket.tags.length" class="mt-11 flex flex-wrap gap-6">
            <a-tag v-for="tag in ticket.tags" :key="tag" :bordered="false">
              {{ tag }}
            </a-tag>
          </div>
        </section>

        <section class="px-16 py-14">
          <div class="mb-14 flex items-center justify-between">
            <h3 class="mb-0 text-sm text-main font-600">处理时间线</h3>
            <span class="text-xs text-secondary"
              >{{ ticket.activities.length }} 条记录</span
            >
          </div>

          <a-timeline>
            <a-timeline-item
              v-for="activity in ticket.activities"
              :key="activity.id"
              :color="activityTypeMeta[activity.type].color"
            >
              <div class="flex flex-wrap items-center gap-6">
                <span class="text-xs text-secondary">
                  {{ activityTypeMeta[activity.type].label }}
                </span>
                <a-tag
                  v-if="activity.visibility === 'internal'"
                  :bordered="false"
                  color="orange"
                >
                  内部可见
                </a-tag>
              </div>
              <p
                class="mb-0 mt-5 whitespace-pre-wrap text-sm text-main leading-6"
              >
                {{ activity.content }}
              </p>
              <div class="mt-4 text-xs text-secondary">
                {{ activity.actor }} · {{ activity.createdAt }}
              </div>
            </a-timeline-item>
          </a-timeline>
        </section>
      </div>

      <footer
        class="flex-none border-t-1 border-color-2 border-t-solid px-12 py-10"
      >
        <div class="mb-8 flex items-center justify-between gap-8">
          <a-segmented
            v-model:value="composerMode"
            :options="composerOptions"
          />
          <span class="text-xs text-secondary">{{ currentAgent }}</span>
        </div>
        <a-textarea
          v-model:value="composerContent"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          :disabled="ticket.status === 'closed'"
          :maxlength="1000"
          :placeholder="
            composerMode === 'reply'
              ? '回复提交人，说明当前处理进展'
              : '仅客服团队可见的处理备注'
          "
          show-count
        />
        <div class="mt-8 flex justify-end">
          <a-button
            type="primary"
            :disabled="ticket.status === 'closed' || !composerContent.trim()"
            @click="submitComposer"
          >
            <template #icon>
              <Icon
                :name="
                  composerMode === 'reply'
                    ? 'i-lucide:send'
                    : 'i-lucide:lock-keyhole'
                "
              />
            </template>
            {{ composerMode === 'reply' ? '发送回复' : '添加备注' }}
          </a-button>
        </div>
      </footer>
    </template>
  </section>
</template>
