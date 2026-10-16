<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getNoticeRecordApi, type NoticeResp } from '@/apis'
import { Icon } from '@/components'
import { useRequest, useTabs } from '@/hooks'

const route = useRoute()
const { openTabByPath } = useTabs()

const noticeId = computed(() =>
  typeof route.query.id === 'string' ? route.query.id : ''
)

const { data, loading } = useRequest(
  (params: { id: string }) => getNoticeRecordApi(params),
  { defaultParams: [{ id: noticeId.value }], manual: !noticeId.value }
)

const notice = computed<NoticeResp | undefined>(
  () => data.value?.data ?? undefined
)

/** 通知类型标签与颜色,与列表页保持一致 */
const typeLabel = computed(() => (notice.value?.type === 2 ? '公告' : '通知'))
const typeColor = computed(() => (notice.value?.type === 2 ? 'blue' : 'cyan'))

const sendModeLabel = computed(() =>
  notice.value?.sendMode === 'scheduled' ? '定时发送' : '立即发送'
)

function goBack() {
  openTabByPath('/sys/notice/list')
}
</script>

<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <header
      class="flex flex-wrap items-center gap-12 rounded-4 bg-container px-16 py-12"
    >
      <a-button type="text" title="返回列表" @click="goBack">
        <template #icon><Icon name="i-lucide:arrow-left" /></template>
      </a-button>

      <div
        class="size-42 flex-none flex-center rounded-4 bg-primary-tint text-primary"
      >
        <Icon name="i-lucide:bell" :size="20" />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-8">
          <h1 class="m-0 truncate text-base text-main font-700">
            {{ notice?.title || '通知详情' }}
          </h1>
          <a-tag
            v-if="notice"
            :bordered="false"
            :color="notice.status ? 'success' : 'default'"
          >
            {{ notice.status ? '正常' : '停用' }}
          </a-tag>
        </div>
        <p class="m-0 mt-2 truncate text-xs text-secondary">
          {{ notice ? `${typeLabel} · ${sendModeLabel}` : '加载中...' }}
        </p>
      </div>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <a-spin :spinning="loading">
        <div v-if="notice" class="flex flex-col gap-10">
          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">基础信息</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="通知标题">
                {{ notice.title }}
              </a-descriptions-item>
              <a-descriptions-item label="通知类型">
                <a-tag :bordered="false" :color="typeColor">
                  {{ typeLabel }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                <a-tag
                  :bordered="false"
                  :color="notice.status ? 'success' : 'default'"
                >
                  {{ notice.status ? '正常' : '停用' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="排序">
                {{ notice.sort }}
              </a-descriptions-item>
              <a-descriptions-item label="发送方式">
                {{ sendModeLabel }}
              </a-descriptions-item>
              <a-descriptions-item label="定时发送时间">
                {{ notice.scheduledAt || '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">通知内容</h2>
            <p
              class="m-0 whitespace-pre-wrap text-sm text-regular leading-22px"
            >
              {{ notice.content || '-' }}
            </p>
          </section>

          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">其他信息</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="备注" :span="3">
                {{ notice.remark || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建人">
                {{ notice.createdBy || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建时间">
                {{ notice.createdAt || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="更新时间">
                {{ notice.updatedAt || '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </section>
        </div>

        <a-empty
          v-else-if="!loading"
          class="py-80"
          description="通知不存在或已被删除"
        >
          <a-button type="primary" @click="goBack">返回列表</a-button>
        </a-empty>
      </a-spin>
    </div>
  </div>
</template>
