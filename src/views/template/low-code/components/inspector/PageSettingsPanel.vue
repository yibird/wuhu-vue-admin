<template>
  <div class="grid gap-18">
    <section class="grid gap-12">
      <div class="text-base text-main font-600">应用设置</div>
      <label class="lc-setting-row">
        <span>应用名称</span>
        <a-input
          :value="designer.schema.app.name"
          @change="updateApp('name', $event)"
        />
      </label>
      <label class="lc-setting-row">
        <span>应用版本</span>
        <a-input
          :value="designer.schema.app.version"
          @change="updateApp('version', $event)"
        />
      </label>
      <label class="lc-setting-row">
        <span>主题色</span>
        <span class="flex-y-center gap-6">
          <input
            class="size-24 shrink-0 cursor-pointer rounded-4 border-1 border-color-2 border-solid bg-transparent p-0"
            type="color"
            :value="themeColor"
            @input="updateTheme('primaryColor', $event)"
          />
          <a-input
            :value="designer.schema.theme?.primaryColor ?? ''"
            @change="updateTheme('primaryColor', $event)"
          />
        </span>
      </label>
      <label class="lc-setting-row">
        <span>圆角</span>
        <a-input-number
          :value="designer.schema.theme?.borderRadius"
          :min="0"
          :max="24"
          class="w-full"
          @change="updateTheme('borderRadius', $event)"
        />
      </label>
    </section>

    <section class="grid gap-12">
      <div class="text-base text-main font-600">当前页面</div>
      <label class="lc-setting-row">
        <span>页面名称</span>
        <a-input
          :value="designer.activePage.value.name"
          @change="updatePage('name', $event)"
        />
      </label>
      <label class="lc-setting-row">
        <span>页面路径</span>
        <a-input
          :value="designer.activePage.value.path"
          @change="updatePage('path', $event)"
        />
      </label>
      <div class="grid grid-cols-3 gap-6">
        <div class="lc-stat-card">
          <span class="lc-stat-card__value">{{ nodeCount }}</span>
          <span class="lc-stat-card__label">组件</span>
        </div>
        <div class="lc-stat-card">
          <span class="lc-stat-card__value">{{
            designer.schema.pages.length
          }}</span>
          <span class="lc-stat-card__label">页面</span>
        </div>
        <div class="lc-stat-card">
          <span class="lc-stat-card__value">{{
            designer.schema.queries.length
          }}</span>
          <span class="lc-stat-card__label">查询</span>
        </div>
      </div>
    </section>

    <section class="grid gap-12">
      <div class="flex-between-center">
        <span class="text-base text-main font-600">页面管理</span>
        <a-button type="text" @click="addPageOpen = true">
          <Icon name="i-lucide:plus" :size="13" />
          新增
        </a-button>
      </div>
      <div class="grid gap-4">
        <div
          v-for="page in designer.schema.pages"
          :key="page.id"
          class="flex-between-center rounded-6 border-1 px-8 py-6 text-xs transition"
          :class="
            page.id === designer.activePageId.value
              ? 'border-primary/40 bg-primary/6 text-primary'
              : 'border-color-2 bg-container text-regular'
          "
        >
          <button
            class="span-button min-w-0 flex-1 truncate text-left"
            type="button"
            @click="designer.setActivePage(page.id)"
          >
            {{ page.name }}
            <span class="ml-4 text-xs text-muted">{{ page.path }}</span>
          </button>
          <button
            v-if="designer.schema.pages.length > 1"
            class="span-button shrink-0 text-muted hover:text-error"
            type="button"
            title="删除页面"
            @click="designer.removePage(page.id)"
          >
            <Icon name="i-lucide:trash-2" :size="12" />
          </button>
        </div>
      </div>
    </section>

    <a-modal v-model:open="addPageOpen" title="新增页面" @ok="confirmAddPage">
      <div class="grid gap-10">
        <label class="grid gap-4">
          <span class="text-sm text-secondary">页面名称</span>
          <a-input v-model:value="newPageName" />
        </label>
        <label class="grid gap-4">
          <span class="text-sm text-secondary">页面路径</span>
          <a-input v-model:value="newPagePath" />
        </label>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@/components'
import { useDesignerContext } from '../../composables'

const designer = useDesignerContext()
const addPageOpen = ref(false)
const newPageName = ref('')
const newPagePath = ref('/')

const themeColor = computed(() => {
  const color = designer.schema.theme?.primaryColor ?? ''
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#1677ff'
})

const nodeCount = computed(() => {
  let count = 0
  designer.activeIndex.value.walk(() => {
    count += 1
  })
  return count
})

function updateApp(key: 'name' | 'version', event: Event) {
  const value = (event.target as HTMLInputElement).value
  designer.editSection(
    'app',
    '修改应用信息',
    (app) => {
      app[key] = value
    },
    `app-${key}`
  )
}

function updateTheme(key: 'primaryColor' | 'borderRadius', event: Event) {
  const raw = (event.target as HTMLInputElement).value
  designer.editSection(
    'theme',
    '修改主题',
    (theme) => {
      if (!theme) return
      if (key === 'borderRadius') theme.borderRadius = Number(raw)
      else theme.primaryColor = raw
    },
    `theme-${key}`
  )
}

function updatePage(key: 'name' | 'path', event: Event) {
  const value = (event.target as HTMLInputElement).value
  const pageId = designer.activePageId.value
  designer.editSection(
    'pages',
    '修改页面信息',
    (pages) => {
      const page = pages.find((item) => item.id === pageId)
      if (page) page[key] = value
    },
    `page-${key}`
  )
}

function confirmAddPage() {
  const name = newPageName.value.trim()
  const path = newPagePath.value.trim()
  if (!name || !path) return
  designer.addPage(name, path)
  addPageOpen.value = false
  newPageName.value = ''
  newPagePath.value = '/'
}
</script>

<style scoped lang="less">
.lc-setting-row {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;

  & > span:first-child {
    flex: none;
    width: 84px;
    font-size: 14px;
    color: rgb(var(--w-text-secondary));
  }

  & > :last-child {
    flex: 1;
    min-width: 0;
  }
}

.lc-stat-card {
  display: grid;
  gap: 4px;
  padding: 10px;
  text-align: center;
  background: rgb(var(--w-bg-fill-quaternary));
  border-radius: 6px;

  &__value {
    font-size: 18px;
    font-weight: 600;
    color: rgb(var(--w-text-main));
  }

  &__label {
    font-size: 12px;
    color: rgb(var(--w-text-muted));
  }
}
</style>
