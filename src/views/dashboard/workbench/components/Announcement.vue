<script lang="ts" setup>
import { useRouter } from 'vue-router'
import AnnouncementSkeleton from './AnnouncementSkeleton.vue'
import type { WorkbenchAnnouncement } from './types'

const { loading = false } = defineProps<{
  loading?: boolean
}>()

const router = useRouter()
const detailOpen = shallowRef(false)
const selectedAnnouncement = shallowRef<WorkbenchAnnouncement>()

const announcements: WorkbenchAnnouncement[] = [
  {
    id: 1,
    title: '第三季度重点项目评审安排',
    summary: '本周五前完成材料提交，下周统一进行项目评审。',
    content:
      '第三季度重点项目评审将于 8 月 24 日开始。请项目负责人于本周五 18:00 前提交阶段成果、风险清单和下一阶段计划，评审日程将在材料收齐后统一发布。',
    category: '重要',
    categoryClass: 'bg-error-tint text-error',
    icon: 'i-lucide:badge-alert',
    publisher: '项目管理办公室',
    publishedAt: '08-17 09:30',
  },
  {
    id: 2,
    title: '生产环境维护窗口通知',
    summary: '本周六凌晨将进行数据库升级和缓存节点切换。',
    content:
      '平台计划于 8 月 22 日 01:00 至 03:00 进行数据库升级和缓存节点切换。维护期间部分统计数据可能延迟更新，核心业务操作不受影响。',
    category: '系统',
    categoryClass: 'bg-info-tint text-info',
    icon: 'i-lucide:server-cog',
    publisher: '平台运维组',
    publishedAt: '08-16 16:20',
  },
  {
    id: 3,
    title: '需求评审流程规范更新',
    summary: '新增高风险需求的安全会签和上线回溯要求。',
    content:
      '新版需求评审规范已生效。涉及权限、支付和敏感数据的需求需增加安全会签；高风险需求上线后一周内需完成效果回溯，并在项目空间归档结论。',
    category: '制度',
    categoryClass: 'bg-warning-tint text-warning',
    icon: 'i-lucide:file-check-2',
    publisher: '产品委员会',
    publishedAt: '08-15 11:40',
  },
  {
    id: 4,
    title: '八月技术分享报名开启',
    summary: '本期主题聚焦前端性能治理与可观测性实践。',
    content:
      '八月技术分享将围绕前端性能治理、异常监控和构建产物分析展开。欢迎提交案例或问题，报名截止时间为 8 月 21 日 17:00。',
    category: '活动',
    categoryClass: 'bg-success-tint text-success',
    icon: 'i-lucide:presentation',
    publisher: '技术委员会',
    publishedAt: '08-14 14:10',
    read: true,
  },
]

const readIds = shallowRef(
  new Set(announcements.filter((item) => item.read).map((item) => item.id))
)
const unreadCount = computed(() => announcements.length - readIds.value.size)

function isRead(id: WorkbenchAnnouncement['id']) {
  return readIds.value.has(id)
}

function markAsRead(id: WorkbenchAnnouncement['id']) {
  if (isRead(id)) return

  readIds.value = new Set([...readIds.value, id])
}

function markAllAsRead() {
  readIds.value = new Set(announcements.map((item) => item.id))
}

function openDetail(item: WorkbenchAnnouncement) {
  markAsRead(item.id)
  selectedAnnouncement.value = item
  detailOpen.value = true
}

function closeDetail() {
  detailOpen.value = false
}

function clearSelectedAnnouncement() {
  selectedAnnouncement.value = undefined
}

async function openNoticeCenter() {
  closeDetail()
  await router.push('/sys/notice')
}
</script>

<template>
  <AnnouncementSkeleton v-if="loading" />
  <section
    v-else
    data-swapy-slot="announcement"
    class="page-enter page-enter--6 min-w-0"
  >
    <a-card
      data-swapy-item="announcement"
      :styles="{ body: { padding: '12px' } }"
    >
      <template #title>
        <div class="min-w-0 flex items-center gap-8">
          <span class="text-base text-main font-700">通知公告</span>
          <span
            v-if="unreadCount > 0"
            class="shrink-0 rounded-full bg-primary/10 px-7 py-2 text-xs text-primary"
          >
            {{ unreadCount }} 条未读
          </span>
        </div>
      </template>
      <template #extra>
        <a-button
          type="link"
          size="small"
          :disabled="unreadCount === 0"
          @click="markAllAsRead"
        >
          全部已读
        </a-button>
      </template>

      <div v-if="announcements.length" class="flex flex-col gap-5">
        <button
          v-for="item in announcements"
          :key="item.id"
          type="button"
          class="group w-full min-w-0 flex gap-10 rounded-6 border-0 bg-transparent px-8 py-10 text-left outline-none transition-[background-color,box-shadow,transform] duration-motion-base hover:(-translate-y-1 bg-hover shadow-all-sm) focus-visible:(bg-hover shadow-[0_0_0_2px_rgb(var(--w-color-primary)/18%)]) active:translate-y-0"
          :class="{ 'bg-primary/3': !isRead(item.id) }"
          :aria-label="`查看公告：${item.title}`"
          @click="openDetail(item)"
        >
          <span
            class="size-32 shrink-0 grid place-items-center rounded-8 bg-fill-tertiary text-secondary transition-[background-color,color,transform] duration-motion-base group-hover:(scale-105 bg-container text-primary)"
          >
            <Icon :name="item.icon" :size="16" />
          </span>

          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-6">
              <span
                v-if="!isRead(item.id)"
                class="size-5 shrink-0 rounded-full bg-primary"
              />
              <span
                class="truncate text-sm"
                :class="
                  isRead(item.id)
                    ? 'text-regular font-500'
                    : 'text-main font-650'
                "
              >
                {{ item.title }}
              </span>
            </span>
            <span
              class="mt-4 line-clamp-2 block text-xs text-secondary leading-18px"
            >
              {{ item.summary }}
            </span>
            <span class="mt-7 flex items-center gap-7 text-xs text-muted">
              <span class="rounded-4 px-5 py-1" :class="item.categoryClass">
                {{ item.category }}
              </span>
              <time>{{ item.publishedAt }}</time>
            </span>
          </span>

          <Icon
            name="i-lucide:chevron-right"
            :size="20"
            class="self-center shrink-0 text-placeholder opacity-0 transition-[opacity,transform,color] duration-motion-base group-hover:(translate-x-1 text-primary opacity-100)"
          />
        </button>
      </div>

      <a-empty
        v-else
        :image-style="{ height: '42px' }"
        description="暂无公告"
      />

      <button
        type="button"
        class="w-full flex-center gap-5 border-0 border-color-2 border-t-1 border-t-solid bg-transparent px-12 py-10 text-sm text-secondary outline-none cursor-pointer transition-[background-color,color] hover:(bg-hover text-primary) focus-visible:(bg-hover text-primary)"
        @click="openNoticeCenter"
      >
        查看全部公告
        <Icon name="i-lucide:arrow-right" :size="14" />
      </button>
    </a-card>
  </section>

  <a-modal
    v-model:open="detailOpen"
    centered
    :width="560"
    @after-close="clearSelectedAnnouncement"
  >
    <template #title>公告详情</template>

    <article v-if="selectedAnnouncement" class="py-4">
      <div class="flex items-start gap-12">
        <span
          class="size-38 shrink-0 grid place-items-center rounded-8 bg-fill-tertiary text-primary"
        >
          <Icon :name="selectedAnnouncement.icon" :size="19" />
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="m-0 text-md text-main font-700 leading-24px">
            {{ selectedAnnouncement.title }}
          </h3>
          <div
            class="mt-8 flex flex-wrap items-center gap-8 text-xs text-muted"
          >
            <span
              class="rounded-4 px-6 py-2"
              :class="selectedAnnouncement.categoryClass"
            >
              {{ selectedAnnouncement.category }}
            </span>
            <span>{{ selectedAnnouncement.publisher }}</span>
            <time>{{ selectedAnnouncement.publishedAt }}</time>
          </div>
        </div>
      </div>

      <p
        class="mb-0 mt-18 whitespace-pre-line rounded-8 bg-fill-tertiary p-14 text-sm text-regular leading-24px"
      >
        {{ selectedAnnouncement.content }}
      </p>
    </article>

    <template #footer>
      <a-button @click="closeDetail">关闭</a-button>
      <a-button type="primary" @click="openNoticeCenter">
        前往公告中心
      </a-button>
    </template>
  </a-modal>
</template>
