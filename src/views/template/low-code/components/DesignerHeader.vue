<template>
  <header
    class="flex-y-center gap-12 shrink-0 border-0 border-b-1 border-color-2 border-b-solid bg-container px-14 py-10"
  >
    <div class="flex-y-center gap-10">
      <span
        class="size-32 flex-center rounded-8 bg-primary text-white shadow-[0_6px_16px_rgb(22_119_255_/_35%)]"
      >
        <Icon name="i-lucide:blocks" :size="17" />
      </span>
      <div class="min-w-0">
        <div class="flex-y-center gap-6">
          <span class="truncate text-sm text-main font-700">
            {{ designer.schema.app.name }}
          </span>
          <span
            class="rounded-4 border-1 border-primary/25 border-solid bg-primary/8 px-4 text-10px text-primary"
          >
            Schema Driven
          </span>
        </div>
        <div class="mt-1 text-11px text-muted">
          {{ designer.activePage.value.name }} ·
          {{ designer.activePage.value.path }}
        </div>
      </div>
    </div>

    <div class="mx-auto flex-y-center gap-10">
      <a-select
        v-if="designer.schema.pages.length > 1"
        :value="designer.activePageId.value"
        class="w-140px"
        :options="pageOptions"
        @change="designer.setActivePage(String($event))"
      />
    </div>

    <div class="flex-y-center gap-4">
      <a-tooltip :title="`撤销${designer.history.undoDepth ? '' : '（无）'}`">
        <button
          class="lc-header-btn"
          type="button"
          :disabled="!designer.canUndo.value"
          @click="designer.history.undo()"
        >
          <Icon name="i-lucide:undo-2" :size="15" />
        </button>
      </a-tooltip>
      <a-tooltip title="重做">
        <button
          class="lc-header-btn"
          type="button"
          :disabled="!designer.canRedo.value"
          @click="designer.history.redo()"
        >
          <Icon name="i-lucide:redo-2" :size="15" />
        </button>
      </a-tooltip>

      <span class="mx-4 h-16px w-1px bg-border-color-2" />

      <a-tooltip title="变量 / 数据源 / 查询 / 动作 / 工作流 / 权限">
        <button class="lc-header-btn" type="button" @click="emit('open-data')">
          <Icon name="i-lucide:database" :size="15" />
        </button>
      </a-tooltip>
      <a-tooltip title="物料中心">
        <button
          class="lc-header-btn"
          type="button"
          @click="emit('open-materials')"
        >
          <Icon name="i-lucide:package" :size="15" />
        </button>
      </a-tooltip>
      <a-tooltip title="查看源码">
        <button
          class="lc-header-btn"
          type="button"
          @click="emit('open-source')"
        >
          <Icon name="i-lucide:code-xml" :size="15" />
        </button>
      </a-tooltip>

      <span class="mx-4 h-16px w-1px bg-border-color-2" />

      <a-tooltip :title="saveTip">
        <button class="lc-header-btn" type="button" @click="saveDraft">
          <Icon name="i-lucide:save" :size="15" />
          <span v-if="designer.dirty.value" class="lc-header-btn__dot" />
        </button>
      </a-tooltip>
      <a-tooltip title="版本管理（发布历史 / 切换线上版本）">
        <button
          class="lc-header-btn"
          type="button"
          @click="emit('open-versions')"
        >
          <Icon name="i-lucide:history" :size="15" />
        </button>
      </a-tooltip>

      <span class="mx-4 h-16px w-1px bg-border-color-2" />

      <a-button @click="emit('open-preview')">
        <Icon name="i-lucide:play" :size="13" class="mr-4" />
        预览
      </a-button>
      <a-button @click="share">
        <Icon name="i-lucide:share-2" :size="13" class="mr-4" />
        分享
      </a-button>
      <a-button type="primary" @click="emit('open-publish')">
        <Icon name="i-lucide:rocket" :size="13" class="mr-4" />
        发布
      </a-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { message } from 'antdv-next'
import { computed } from 'vue'
import { Icon } from '@/components'
import { useDesignerContext } from '../composables'

const emit = defineEmits<{
  'open-data': []
  'open-materials': []
  'open-source': []
  'open-preview': []
  'open-versions': []
  'open-publish': []
}>()

const designer = useDesignerContext()

const pageOptions = computed(() =>
  designer.schema.pages.map((page) => ({
    label: page.name,
    value: page.id,
  }))
)

const saveTip = computed(() => {
  if (designer.dirty.value) return '有未保存的更改，保存到草稿'
  if (designer.lastSavedAt.value) {
    return `已保存到草稿 ${new Date(designer.lastSavedAt.value).toLocaleTimeString()}`
  }
  return '保存到草稿'
})

function saveDraft() {
  if (designer.saveDraftNow()) {
    message.success('已保存到草稿')
  } else {
    message.error('保存失败，请检查浏览器存储空间')
  }
}

async function share() {
  if (!designer.currentVersion.value) {
    message.warning('尚未发布版本，请先发布后再分享')
    emit('open-versions')
    return
  }
  const params = new URLSearchParams({ app: designer.schema.app.id })
  const link = `${window.location.origin}/template/low-code/runtime?${params.toString()}`
  await navigator.clipboard.writeText(link)
  message.success('运行时链接已复制（默认加载当前线上版本）')
}
</script>

<style scoped lang="less">
.lc-header-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: rgb(var(--w-text-secondary));
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 6px;

  &:hover:not(:disabled) {
    color: rgb(var(--w-color-primary));
    background: rgb(var(--w-bg-primary) / 8%);
  }

  &:disabled {
    color: rgb(var(--w-text-disabled));
    cursor: not-allowed;
  }
}

.lc-header-btn__dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 7px;
  height: 7px;
  background: rgb(var(--w-color-warning));
  border: 1px solid rgb(var(--w-bg-container));
  border-radius: 50%;
}
</style>
