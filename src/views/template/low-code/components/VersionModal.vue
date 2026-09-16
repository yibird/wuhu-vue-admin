<template>
  <a-modal
    :open="open"
    title="版本管理"
    :width="760"
    :footer="null"
    :destroy-on-close="true"
    @cancel="emit('close')"
  >
    <div class="grid gap-18">
      <section class="grid gap-8">
        <div class="flex-between-center">
          <span class="text-sm text-main font-600">运行时链接</span>
          <span v-if="currentVersion" class="text-xs text-success">
            当前线上版本 v{{ currentVersion.version }}
          </span>
          <span v-else class="text-xs text-warning">尚未发布任何版本</span>
        </div>
        <div class="flex-y-center gap-6">
          <a-input :value="runtimeLink" readonly />
          <a-button @click="copyLink">复制</a-button>
          <a-button @click="openLink">打开</a-button>
        </div>
        <div v-if="currentVersion?.note" class="text-xs text-secondary">
          发布说明：{{ currentVersion.note }}
        </div>
      </section>

      <section class="grid gap-10">
        <div class="flex-between-center">
          <span class="text-sm text-main font-600">发布历史</span>
          <span class="text-xs text-muted">
            共 {{ versions.length }} 个版本，最多保留 30 个
          </span>
        </div>

        <div
          v-if="versions.length"
          class="grid max-h-[420px] gap-8 overflow-auto pr-2"
        >
          <div
            v-for="item in versions"
            :key="item.id"
            class="grid gap-8 rounded-8 border-1 border-solid p-10"
            :class="
              item.current
                ? 'border-primary/40 bg-primary/4'
                : 'border-color-2 bg-container'
            "
          >
            <div class="flex-between-center gap-10">
              <div class="min-w-0">
                <div class="flex-y-center gap-8">
                  <span class="text-sm text-main font-600">
                    v{{ item.version }}
                  </span>
                  <span
                    v-if="item.current"
                    class="rounded-4 bg-primary/10 px-6 py-1 text-11px text-primary"
                  >
                    当前线上
                  </span>
                  <span class="text-xs text-muted">
                    {{ formatTime(item.time) }}
                  </span>
                </div>
                <div v-if="item.note" class="mt-4 text-xs text-secondary">
                  {{ item.note }}
                </div>
              </div>

              <div class="flex shrink-0 items-center gap-6">
                <a-button @click="loadVersion(item)">载入设计器</a-button>
                <a-button
                  v-if="!item.current"
                  type="primary"
                  @click="setCurrent(item)"
                >
                  设为当前
                </a-button>
                <a-button @click="preview(item)">预览</a-button>
                <a-dropdown
                  :menu="{ items: moreItems(item) }"
                  :trigger="['click']"
                  placement="bottomRight"
                  @menu-click="onMore(item, $event)"
                >
                  <a-button>
                    <Icon name="i-lucide:ellipsis" :size="15" />
                  </a-button>
                </a-dropdown>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="rounded-8 bg-fill-quaternary p-20 text-center text-xs text-muted"
        >
          还没有发布记录，点击右上角「发布」生成第一个版本
        </div>
      </section>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { Modal, message } from 'antdv-next'
import { computed, onBeforeUnmount, watch } from 'vue'
import { Icon } from '@/components'
import { useDesignerContext } from '../composables'
import type { PublishedVersion } from '../composables'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const designer = useDesignerContext()

const versions = computed(() => designer.versions.value)
const currentVersion = computed(() => designer.currentVersion.value)

const runtimeLink = computed(() => {
  const params = new URLSearchParams({ app: designer.schema.app.id })
  return `${window.location.origin}/template/low-code/runtime?${params.toString()}`
})

function versionLink(version: string) {
  const params = new URLSearchParams({
    app: designer.schema.app.id,
    version,
  })
  return `${window.location.origin}/template/low-code/runtime?${params.toString()}`
}

function formatTime(time: number) {
  return new Date(time).toLocaleString()
}

function moreItems(item: PublishedVersion) {
  return [
    { key: 'copy-link', label: '复制此版本链接' },
    { key: 'download', label: '下载 Schema' },
    { type: 'divider' as const },
    { key: 'delete', label: '删除该版本', danger: true },
  ].filter((entry) => entry.key !== 'delete' || !item.current)
}

function onMore(item: PublishedVersion, info: { key: string | number }) {
  switch (info.key) {
    case 'copy-link':
      copyVersionLink(item)
      break
    case 'download':
      downloadVersion(item)
      break
    case 'delete':
      confirmDelete(item)
      break
    default:
      break
  }
}

async function copyLink() {
  await navigator.clipboard.writeText(runtimeLink.value)
  message.success('运行时链接已复制')
}

async function copyVersionLink(item: PublishedVersion) {
  await navigator.clipboard.writeText(versionLink(item.version))
  message.success(`v${item.version} 链接已复制`)
}

function openLink() {
  window.open(runtimeLink.value, '_blank')
}

function preview(item: PublishedVersion) {
  window.open(versionLink(item.version), '_blank')
}

function loadVersion(item: PublishedVersion) {
  designer.restoreVersion(item.snapshotSchema)
  message.success(`已将 v${item.version} 载入设计器`)
  emit('close')
}

function setCurrent(item: PublishedVersion) {
  designer.setCurrentVersion(item.id)
  message.success(`已将 v${item.version} 设为当前线上版本`)
}

function downloadVersion(item: PublishedVersion) {
  const blob = new Blob([JSON.stringify(item.snapshotSchema, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${designer.schema.app.id}-${item.version}.schema.json`
  link.click()
  URL.revokeObjectURL(url)
}

function confirmDelete(item: PublishedVersion) {
  Modal.confirm({
    title: `删除版本 v${item.version}？`,
    content: '删除后不可恢复，当前线上版本会回退到最新版本。',
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      designer.deleteVersion(item.id)
      message.success(`已删除 v${item.version}`)
    },
  })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (open) => {
    if (open) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>
