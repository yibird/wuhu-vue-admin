<script setup lang="ts">
import { computed } from 'vue'
import { renderIcon } from '@/utils'
import { formatTokenWindow, getCapabilityLabel, getProviderMeta } from '../data'
import type { ModelAction, ModelItem, ModelStatus } from '../types'

const props = defineProps<{
  item: ModelItem
  statusLabels: Record<ModelStatus, string>
}>()

const emit = defineEmits<{
  action: [key: ModelAction, item: ModelItem]
}>()

const providerMeta = computed(() => getProviderMeta(props.item.provider))
const statusMeta = computed(() => {
  const map = {
    online: {
      color: 'green',
      class: 'bg-success/10 text-success',
      icon: 'i-lucide:circle-check',
    },
    draft: {
      color: 'blue',
      class: 'bg-primary/10 text-primary',
      icon: 'i-lucide:clock-3',
    },
    offline: {
      color: 'default',
      class: 'bg-fill-tertiary text-secondary',
      icon: 'i-lucide:circle-pause',
    },
  } as const

  return {
    ...map[props.item.status],
    label: props.statusLabels[props.item.status],
  }
})
const menuItems = computed(() => [
  {
    key: 'edit',
    label: '编辑配置',
    icon: renderIcon('i-lucide:pencil'),
  },
  {
    key: 'duplicate',
    label: '创建副本',
    icon: renderIcon('i-lucide:copy-plus'),
  },
  {
    key: 'toggle',
    label: props.item.status === 'online' ? '停用模型' : '启用模型',
    icon: renderIcon(
      props.item.status === 'online'
        ? 'i-lucide:circle-pause'
        : 'i-lucide:circle-play'
    ),
  },
  {
    key: 'test',
    label: '测试连接',
    icon: renderIcon('i-lucide:plug-zap'),
  },
  { type: 'divider' },
  {
    key: 'delete',
    label: '删除模型',
    danger: true,
    icon: renderIcon('i-lucide:trash-2'),
  },
])

function handleAction(key: ModelAction) {
  emit('action', key, props.item)
}

function handleMenuClick(info: { key: string | number }) {
  const key = String(info.key)
  if (
    key === 'delete' ||
    key === 'duplicate' ||
    key === 'edit' ||
    key === 'test' ||
    key === 'toggle'
  ) {
    handleAction(key)
  }
}
</script>

<template>
  <article
    class="group min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)] transition-[border-color,box-shadow,transform] duration-motion-base hover:-translate-y-2 hover:border-primary/45 hover:shadow-[var(--w-shadow-elevated)] motion-reduce:transform-none"
  >
    <header class="flex min-w-0 items-start gap-10 p-14 pb-12">
      <span
        class="size-42 flex flex-none items-center justify-center rounded-9 transition-transform duration-motion-base group-hover:rotate-3 group-hover:scale-105"
        :style="{
          backgroundColor: providerMeta.softBackground,
          color: providerMeta.accent,
        }"
      >
        <Icon :name="providerMeta.icon" :size="21" />
      </span>
      <div class="min-w-0 flex-1">
        <div class="flex min-w-0 items-start justify-between gap-8">
          <div class="min-w-0">
            <div class="flex min-w-0 items-center gap-7">
              <h2 class="m-0 truncate text-md text-main font-700">
                {{ props.item.name }}
              </h2>
              <a-tag
                :bordered="false"
                :color="statusMeta.color"
                class="m-0 flex-none"
              >
                <span class="inline-flex items-center gap-4">
                  <Icon :name="statusMeta.icon" :size="12" />
                  {{ statusMeta.label }}
                </span>
              </a-tag>
            </div>
            <div
              class="mt-5 flex min-w-0 items-center gap-6 text-xs text-secondary"
            >
              <span class="truncate">{{ props.item.providerName }}</span>
              <span class="text-disabled">/</span>
              <code class="truncate text-xs text-secondary">{{
                props.item.modelId
              }}</code>
            </div>
          </div>

          <a-dropdown
            :menu="{ items: menuItems }"
            :trigger="['click']"
            @menu-click="handleMenuClick"
          >
            <a-button
              type="text"
              size="small"
              :aria-label="`打开${props.item.name}操作菜单`"
              @click.stop
            >
              <template #icon>
                <Icon name="i-lucide:more-horizontal" />
              </template>
            </a-button>
          </a-dropdown>
        </div>
      </div>
    </header>

    <div class="px-14 pb-14">
      <p class="m-0 min-h-42 line-clamp-2 text-sm leading-21 text-regular">
        {{ props.item.description }}
      </p>

      <div class="mt-12 grid grid-cols-2 gap-8 rounded-7 bg-page p-10">
        <div class="min-w-0">
          <div class="text-xs text-secondary">上下文窗口</div>
          <div class="mt-4 text-sm text-main font-700">
            {{ formatTokenWindow(props.item.contextWindow) }} tokens
          </div>
        </div>
        <div class="min-w-0">
          <div class="text-xs text-secondary">最大输出</div>
          <div class="mt-4 text-sm text-main font-700">
            {{ formatTokenWindow(props.item.maxOutputTokens) }} tokens
          </div>
        </div>
        <div class="min-w-0">
          <div class="text-xs text-secondary">本月调用</div>
          <div class="mt-4 text-sm text-main font-700">
            {{ props.item.monthlyCalls }}
          </div>
        </div>
        <div class="min-w-0">
          <div class="text-xs text-secondary">平均延迟</div>
          <div class="mt-4 text-sm text-main font-700">
            {{ props.item.avgLatency }}
          </div>
        </div>
      </div>

      <div class="mt-12 flex min-h-24 flex-wrap items-center gap-6">
        <span
          v-for="capability in props.item.capabilities"
          :key="capability"
          class="rounded-5 bg-fill-tertiary px-7 py-3 text-xs text-secondary"
        >
          {{ getCapabilityLabel(capability) }}
        </span>
      </div>
    </div>

    <footer
      class="flex min-w-0 items-center gap-8 border-t-1 border-color-2 border-t-solid px-14 py-10"
    >
      <span
        class="inline-flex min-w-0 flex-1 items-center gap-6 text-xs"
        :class="props.item.apiKeyConfigured ? 'text-success' : 'text-warning'"
      >
        <Icon
          :name="
            props.item.apiKeyConfigured
              ? 'i-lucide:key-round'
              : 'i-lucide:key-square'
          "
          :size="14"
        />
        <span class="truncate">
          {{ props.item.apiKeyConfigured ? '密钥已配置' : '待配置密钥' }}
        </span>
      </span>
      <a-button
        type="text"
        size="small"
        class="flex-none text-secondary"
        @click="handleAction('test')"
      >
        <template #icon>
          <Icon name="i-lucide:plug-zap" :size="14" />
        </template>
        测试连接
      </a-button>
      <a-button
        type="text"
        size="small"
        class="flex-none text-primary"
        @click="handleAction('edit')"
      >
        <template #icon>
          <Icon name="i-lucide:pencil" :size="14" />
        </template>
        编辑
      </a-button>
    </footer>
  </article>
</template>
