<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { Icon } from '@/components/icon'
import {
  categoryMeta,
  categoryOptions,
  statusMeta,
  statusOptions,
} from './data'
import { useDownloadCenter } from './composables/useDownloadCenter'
import type { DownloadItem } from './types'

const show = defineModel('show', { default: false })
const isNarrowScreen = useMediaQuery('(max-width: 768px)')
const drawerSize = computed(() => (isNarrowScreen.value ? '100%' : 980))
const {
  activeDownload,
  activeDownloadCount,
  categoryFilter,
  failedDownloadCount,
  filteredDownloads,
  hasFinishedDownloads,
  keyword,
  overallProgress,
  stats,
  statusFilter,
  totalDownloadCount,
  clearFinishedDownloads,
  copyPath,
  deleteDownload,
  openFile,
  pauseDownload,
  resetFilters,
  resumeDownload,
  retryDownload,
  selectDownload,
} = useDownloadCenter()

const queueSummary = computed(() => {
  if (!totalDownloadCount.value) return '当前没有下载记录'
  if (!activeDownloadCount.value)
    return `${totalDownloadCount.value} 个下载已归档`
  return `${activeDownloadCount.value} 个队列项正在等待或处理中`
})

function canResume(item: DownloadItem) {
  return ['paused', 'waiting'].includes(item.status)
}
</script>

<template>
  <a-drawer
    v-model:open="show"
    :size="drawerSize"
    placement="right"
    closable
    :classes="{ body: 'p-0! overflow-hidden!' }"
  >
    <template #title>
      <div class="min-w-0 flex items-center justify-between gap-12">
        <div class="min-w-0">
          <div class="text-base text-main font-700">下载中心</div>
          <div class="mt-2 text-xs text-secondary">
            {{ totalDownloadCount }} 个下载 · {{ activeDownloadCount }} 个队列中
          </div>
        </div>
        <a-badge :count="totalDownloadCount" :overflow-count="99" />
      </div>
    </template>

    <div class="h-full min-h-0 overflow-hidden bg-page">
      <div class="h-full min-h-0 flex flex-col gap-12 p-14 max-sm:p-10">
        <section
          class="rounded-8 border-1 border-color-2 border-solid bg-container p-14"
        >
          <div
            class="grid grid-cols-[minmax(0,1fr)_260px] items-center gap-16 max-lg:grid-cols-1"
          >
            <div class="min-w-0 flex items-start gap-12">
              <span
                class="size-44 shrink-0 flex items-center justify-center rounded-8 icon-primary-soft"
              >
                <Icon name="i-lucide:hard-drive-download" :size="22" />
              </span>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-8">
                  <h3 class="m-0 text-18px text-main font-800">下载队列</h3>
                  <a-tag v-if="failedDownloadCount" color="error">
                    {{ failedDownloadCount }} 个失败
                  </a-tag>
                  <a-tag v-else color="success">队列正常</a-tag>
                </div>
                <p class="mt-6 m-0 text-sm text-secondary">
                  {{ queueSummary }}
                </p>
              </div>
            </div>

            <div class="min-w-0">
              <div class="mb-6 flex items-center justify-between text-xs">
                <span class="text-secondary">整体完成度</span>
                <strong class="text-main">{{ overallProgress }}%</strong>
              </div>
              <a-progress :percent="overallProgress" :show-info="false" />
            </div>
          </div>
        </section>

        <div
          class="grid grid-cols-4 gap-10 max-lg:grid-cols-2 max-sm:grid-cols-1"
        >
          <button
            v-for="stat in stats"
            :key="stat.key"
            type="button"
            class="min-w-0 rounded-8 border-1 border-color-2 border-solid bg-container p-12 text-left transition-colors hover:(border-color-primary bg-hover)"
          >
            <div class="flex items-center justify-between gap-10">
              <div class="min-w-0">
                <div class="text-xs text-secondary">{{ stat.label }}</div>
                <div class="mt-4 text-22px text-main font-800">
                  {{ stat.value }}
                </div>
              </div>
              <span
                class="size-36 shrink-0 flex items-center justify-center rounded-8"
                :class="stat.class"
              >
                <Icon :name="stat.icon" :size="18" />
              </span>
            </div>
          </button>
        </div>

        <section
          class="rounded-8 border-1 border-color-2 border-solid bg-container p-12"
        >
          <div
            class="grid grid-cols-[minmax(190px,1fr)_150px_150px_auto_auto] gap-10 max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            <a-input
              v-model:value="keyword"
              allow-clear
              placeholder="搜索文件、来源或保存路径"
            >
              <template #prefix>
                <Icon
                  name="i-lucide:search"
                  :size="15"
                  class="text-secondary"
                />
              </template>
            </a-input>
            <a-select
              v-model:value="statusFilter"
              :options="statusOptions"
              option-filter-prop="label"
            />
            <a-select
              v-model:value="categoryFilter"
              :options="categoryOptions"
              option-filter-prop="label"
            />
            <a-button @click="resetFilters">
              <template #icon>
                <Icon name="i-lucide:rotate-ccw" :size="15" />
              </template>
              重置
            </a-button>
            <a-button
              danger
              :disabled="!hasFinishedDownloads"
              @click="clearFinishedDownloads"
            >
              <template #icon>
                <Icon name="i-lucide:eraser" :size="15" />
              </template>
              清理完成项
            </a-button>
          </div>
        </section>

        <Scrollbar
          class="min-h-0 flex-1"
          content-class="min-h-full grid grid-cols-[380px_minmax(0,1fr)] gap-12 max-lg:grid-cols-1 max-lg:grid-rows-[minmax(320px,42vh)_minmax(440px,1fr)]"
        >
          <section
            class="h-full min-h-0 flex flex-col overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container"
          >
            <div
              class="flex items-center justify-between border-b-1 border-b-solid border-color-1 px-14 py-12"
            >
              <div class="min-w-0">
                <span class="text-sm text-main font-800">下载列表</span>
                <p class="mt-2 m-0 text-xs text-secondary">
                  当前筛选 {{ filteredDownloads.length }} /
                  {{ totalDownloadCount }}
                </p>
              </div>
              <a-tag>{{ filteredDownloads.length }} 项</a-tag>
            </div>

            <Scrollbar
              v-if="filteredDownloads.length"
              class="min-h-0 flex-1"
              content-class="p-8"
            >
              <button
                v-for="item in filteredDownloads"
                :key="item.id"
                type="button"
                class="mb-8 w-full rounded-8 border-1 border-color-2 border-solid bg-container p-12 text-left transition-colors hover:(border-color-primary bg-hover)"
                :class="
                  item.id === activeDownload?.id
                    ? 'border-color-primary bg-primary-tint'
                    : ''
                "
                @click="selectDownload(item.id)"
              >
                <div class="flex items-start justify-between gap-10">
                  <div class="min-w-0 flex items-start gap-8">
                    <span
                      class="size-32 shrink-0 flex items-center justify-center rounded-7 border-1 border-solid"
                      :class="categoryMeta[item.category].class"
                    >
                      <Icon
                        :name="categoryMeta[item.category].icon"
                        :size="16"
                      />
                    </span>
                    <div class="min-w-0">
                      <div class="truncate text-sm text-main font-700">
                        {{ item.name }}
                      </div>
                      <div class="mt-3 truncate text-xs text-secondary">
                        {{ categoryMeta[item.category].label }} ·
                        {{ item.size }}
                      </div>
                    </div>
                  </div>
                  <a-tag :color="statusMeta[item.status].color">
                    {{ statusMeta[item.status].label }}
                  </a-tag>
                </div>

                <div class="mt-10">
                  <a-progress
                    :percent="item.progress"
                    size="small"
                    :show-info="false"
                    :status="item.status === 'failed' ? 'exception' : undefined"
                  />
                  <div
                    class="mt-6 flex items-center justify-between gap-8 text-xs text-secondary"
                  >
                    <span>{{ item.progress }}%</span>
                    <span class="truncate">{{ item.speed }}</span>
                  </div>
                </div>
              </button>
            </Scrollbar>

            <div
              v-else
              class="min-h-0 flex-1 flex items-center justify-center p-20"
            >
              <a-empty description="暂无匹配下载" />
            </div>
          </section>

          <section
            class="h-full min-h-0 flex flex-col overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container"
          >
            <template v-if="activeDownload">
              <div
                class="border-b-1 border-b-solid border-color-1 bg-container-secondary px-16 py-14"
              >
                <div class="flex items-start justify-between gap-12">
                  <div class="min-w-0">
                    <div class="truncate text-base text-main font-800">
                      {{ activeDownload.name }}
                    </div>
                    <div class="mt-5 text-xs text-secondary">
                      {{ activeDownload.description }}
                    </div>
                  </div>
                  <a-tag :color="statusMeta[activeDownload.status].color">
                    {{ statusMeta[activeDownload.status].label }}
                  </a-tag>
                </div>
              </div>

              <Scrollbar class="min-h-0 flex-1" content-class="p-16">
                <div class="rounded-8 bg-page p-12">
                  <div class="mb-8 flex items-center justify-between gap-8">
                    <span class="text-xs text-secondary">文件进度</span>
                    <strong class="text-main"
                      >{{ activeDownload.progress }}%</strong
                    >
                  </div>
                  <a-progress
                    :percent="activeDownload.progress"
                    :status="
                      activeDownload.status === 'failed'
                        ? 'exception'
                        : undefined
                    "
                  />
                </div>

                <div class="mt-12 grid grid-cols-2 gap-10 max-sm:grid-cols-1">
                  <div class="rounded-8 bg-container-secondary p-12">
                    <div class="text-xs text-secondary">来源</div>
                    <div class="mt-5 break-words text-sm text-main">
                      {{ activeDownload.source }}
                    </div>
                  </div>
                  <div class="rounded-8 bg-container-secondary p-12">
                    <div class="text-xs text-secondary">保存位置</div>
                    <div class="mt-5 break-words text-sm text-main">
                      {{ activeDownload.savePath }}
                    </div>
                  </div>
                  <div class="rounded-8 bg-container-secondary p-12">
                    <div class="text-xs text-secondary">文件大小</div>
                    <div class="mt-5 text-sm text-main">
                      {{ activeDownload.size }}
                    </div>
                  </div>
                  <div class="rounded-8 bg-container-secondary p-12">
                    <div class="text-xs text-secondary">当前速度</div>
                    <div class="mt-5 text-sm text-main">
                      {{ activeDownload.speed }}
                    </div>
                  </div>
                </div>

                <div
                  class="mt-12 rounded-8 border-1 border-color-2 border-solid p-12"
                >
                  <div class="flex items-center gap-7 text-xs text-secondary">
                    <Icon name="i-lucide:shield-check" :size="15" />
                    <span>校验信息</span>
                  </div>
                  <div class="mt-6 text-sm text-main">
                    {{ activeDownload.checksum }}
                  </div>
                  <div class="mt-8 text-xs text-secondary">
                    创建于 {{ activeDownload.createdAt }}，更新于
                    {{ activeDownload.updatedAt }}
                  </div>
                </div>
              </Scrollbar>

              <div
                class="flex flex-wrap items-center justify-end gap-8 border-t-1 border-t-solid border-color-1 p-12"
              >
                <a-button
                  v-if="activeDownload.status === 'downloading'"
                  @click="pauseDownload(activeDownload)"
                >
                  <template #icon>
                    <Icon name="i-lucide:pause" :size="15" />
                  </template>
                  暂停
                </a-button>
                <a-button
                  v-if="canResume(activeDownload)"
                  type="primary"
                  @click="resumeDownload(activeDownload)"
                >
                  <template #icon>
                    <Icon name="i-lucide:play" :size="15" />
                  </template>
                  继续
                </a-button>
                <a-button
                  v-if="activeDownload.status === 'failed'"
                  type="primary"
                  @click="retryDownload(activeDownload)"
                >
                  <template #icon>
                    <Icon name="i-lucide:refresh-cw" :size="15" />
                  </template>
                  重试
                </a-button>
                <a-button
                  :disabled="activeDownload.status !== 'success'"
                  @click="openFile(activeDownload)"
                >
                  <template #icon>
                    <Icon name="i-lucide:folder-open" :size="15" />
                  </template>
                  打开
                </a-button>
                <a-button @click="copyPath(activeDownload)">
                  <template #icon>
                    <Icon name="i-lucide:copy" :size="15" />
                  </template>
                  复制路径
                </a-button>
                <a-button danger @click="deleteDownload(activeDownload)">
                  <template #icon>
                    <Icon name="i-lucide:trash-2" :size="15" />
                  </template>
                  删除
                </a-button>
              </div>
            </template>

            <div v-else class="h-full flex items-center justify-center p-20">
              <a-empty description="请选择下载任务" />
            </div>
          </section>
        </Scrollbar>
      </div>
    </div>
  </a-drawer>
</template>
