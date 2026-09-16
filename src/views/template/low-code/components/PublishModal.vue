<template>
  <a-modal
    :open="open"
    title="发布应用"
    :width="560"
    :footer="null"
    :destroy-on-close="true"
    @cancel="emit('close')"
  >
    <div class="grid gap-16">
      <section class="grid gap-8">
        <div class="text-sm text-main font-600">版本号</div>
        <div class="flex-y-center gap-8">
          <a-input v-model:value="version" placeholder="1.0.0" />
          <a-button @click="bump('patch')">补丁 +1</a-button>
          <a-button @click="bump('minor')">小版本 +1</a-button>
          <a-button @click="bump('major')">大版本 +1</a-button>
        </div>
        <div class="text-xs text-muted">
          发布后应用版本号会同步更新，便于下次自增
        </div>
      </section>

      <label class="grid gap-8">
        <span class="text-sm text-main font-600">发布说明</span>
        <a-textarea
          v-model:value="note"
          :rows="3"
          placeholder="本次更新内容（可选），会记录在版本历史中"
        />
      </label>

      <div class="flex-between-center">
        <span class="inline-flex-y-center gap-8 text-sm text-secondary">
          设为当前线上版本
          <a-tooltip title="运行时页面默认加载当前线上版本">
            <Icon name="i-lucide:help-circle" :size="13" class="text-muted" />
          </a-tooltip>
        </span>
        <a-switch v-model:checked="setCurrent" />
      </div>

      <div class="rounded-8 bg-fill-quaternary p-10 text-xs text-muted">
        发布记录会保留完整 Schema
        快照，可在「版本管理」中切换当前线上版本、将历史版本载入设计器或下载导出。
      </div>

      <div
        v-if="published"
        class="grid gap-8 rounded-8 border-1 border-success/40 border-solid p-10"
      >
        <div class="inline-flex-y-center gap-6 text-sm text-success font-600">
          <Icon name="i-lucide:circle-check" :size="15" />
          已发布 v{{ published.version }}
        </div>
        <div class="flex-y-center gap-6">
          <a-input :value="link" readonly />
          <a-button @click="copyLink">复制链接</a-button>
          <a-button @click="openLink">打开</a-button>
        </div>
      </div>

      <div v-else class="flex justify-end gap-8">
        <a-button @click="emit('close')">取消</a-button>
        <a-button type="primary" @click="submit">
          <Icon name="i-lucide:rocket" :size="14" class="mr-4" />
          确认发布
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { message } from 'antdv-next'
import { computed, ref, watch } from 'vue'
import { Icon } from '@/components'
import { useDesignerContext } from '../composables'
import type { PublishedVersion } from '../composables'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const designer = useDesignerContext()
const version = ref('1.0.1')
const note = ref('')
const setCurrent = ref(true)
const published = ref<PublishedVersion | undefined>(undefined)

const link = computed(() => {
  const params = new URLSearchParams({
    app: designer.schema.app.id,
    version: published.value?.version ?? version.value,
  })
  return `${window.location.origin}/template/low-code/runtime?${params.toString()}`
})

function parseVersion(value: string) {
  const parts = value.split('.').map((part) => Number(part) || 0)
  while (parts.length < 3) parts.push(0)
  return parts
}

function bump(type: 'major' | 'minor' | 'patch') {
  const current = published.value?.version ?? version.value
  const parts = parseVersion(current)
  if (type === 'major') {
    parts[0] += 1
    parts[1] = 0
    parts[2] = 0
  } else if (type === 'minor') {
    parts[1] += 1
    parts[2] = 0
  } else {
    parts[2] += 1
  }
  version.value = parts.join('.')
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    published.value = undefined
    note.value = ''
    setCurrent.value = true
    const base =
      designer.versions.value[0]?.version ?? designer.schema.app.version
    version.value = base
    bump('patch')
  }
)

function submit() {
  const next = version.value.trim()
  if (!next) {
    message.warning('请填写版本号')
    return
  }
  published.value = designer.publish({
    version: next,
    note: note.value,
    setCurrent: setCurrent.value,
  })
  message.success(`发布成功 v${next}`)
}

async function copyLink() {
  await navigator.clipboard.writeText(link.value)
  message.success('运行时链接已复制')
}

function openLink() {
  window.open(link.value, '_blank')
}
</script>
