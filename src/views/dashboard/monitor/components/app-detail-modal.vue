<template>
  <a-modal
    v-model:open="open"
    :title="app ? `${app.title} 详情` : '应用详情'"
    :footer="null"
    :width="560"
  >
    <div v-if="app" class="grid gap-14">
      <div class="flex items-start gap-12">
        <div
          class="size-48 shrink-0 flex items-center justify-center rounded-8 icon-primary-soft"
        >
          <Icon :name="app.icon" :size="22" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-8">
            <strong class="text-base text-main">{{ app.title }}</strong>
            <a-tag :color="app.status === 'installed' ? 'green' : 'blue'">
              {{ app.status === 'installed' ? '已安装' : '可安装' }}
            </a-tag>
          </div>
          <div class="mt-5 text-sm text-secondary">
            {{ app.description }}
          </div>
        </div>
      </div>

      <a-descriptions :column="1" bordered size="small">
        <a-descriptions-item label="当前版本">
          {{ app.version }}
        </a-descriptions-item>
        <a-descriptions-item label="运行状态">
          {{
            app.status === 'installed' ? '可从应用中心打开和维护' : '等待安装'
          }}
        </a-descriptions-item>
        <a-descriptions-item label="部署建议">
          {{
            app.status === 'installed'
              ? '建议在低峰期检查更新并备份配置。'
              : '安装前请确认端口、存储和权限策略。'
          }}
        </a-descriptions-item>
      </a-descriptions>

      <div class="flex justify-end gap-8">
        <a-button @click="open = false">关闭</a-button>
        <a-button
          v-if="app.status === 'available'"
          type="primary"
          @click="emit('install', app)"
        >
          安装应用
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import type { AppDetailModalEmits, AppDetailModalProps } from './types'

defineOptions({ name: 'AppDetailModal' })

const open = defineModel<boolean>('open', { default: false })
const { app = null } = defineProps<AppDetailModalProps>()
const emit = defineEmits<AppDetailModalEmits>()
</script>
