<template>
  <WView :full="true" :padding="false" class="bg-page">
    <div
      class="h-full min-h-full w-full p-16 md:p-20 overflow-x-hidden overflow-y-auto"
    >
      <section
        class="mx-auto max-w-1280 rounded-8 b-1-muted bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 b-b-1-muted pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">SlidingHighlight</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              包裹式共享布局高亮：悬浮子项时高亮块平滑跟随，与选中状态无关。
            </p>
          </div>
          <a-tag color="blue">src/components/sliding-highlight</a-tag>
        </header>

        <div class="mb-24 grid gap-10 sm:grid-cols-3">
          <div class="rounded-6 bg-secondary p-14">
            <p class="m-0 flex items-center gap-7 text-sm text-main font-500">
              <Icon name="i-lucide:gift" :size="15" class="text-primary" />
              一个组件包裹
            </p>
            <p class="mb-0 mt-5 text-xs leading-18 text-secondary">
              包裹子项即可，无需额外状态与事件绑定。
            </p>
          </div>
          <div class="rounded-6 bg-secondary p-14">
            <p class="m-0 flex items-center gap-7 text-sm text-main font-500">
              <Icon name="i-lucide:list" :size="15" class="text-primary" />
              语义标签可切换
            </p>
            <p class="mb-0 mt-5 text-xs leading-18 text-secondary">
              as 支持 div / ul，列表场景自动渲染为合法结构。
            </p>
          </div>
          <div class="rounded-6 bg-secondary p-14">
            <p class="m-0 flex items-center gap-7 text-sm text-main font-500">
              <Icon name="i-lucide:palette" :size="15" class="text-primary" />
              样式可定制
            </p>
            <p class="mb-0 mt-5 text-xs leading-18 text-secondary">
              inset 控制外扩，pill-class-name 定制高亮块视觉。
            </p>
          </div>
        </div>

        <div class="grid gap-24 lg:grid-cols-2">
          <article class="min-w-0">
            <div
              class="mb-12 flex flex-wrap items-start justify-between gap-10"
            >
              <div>
                <h2 class="m-0 text-lg text-main font-600">基础用法</h2>
                <p class="mb-0 mt-4 text-sm text-secondary">
                  默认 div 容器，悬浮列表项时高亮块平滑跟随。
                </p>
              </div>
              <code
                class="rounded-4 bg-secondary px-7 py-4 text-xs text-secondary"
              >
                as="div"
              </code>
            </div>

            <SlidingHighlight
              :inset="8"
              pill-class-name="rounded-6 bg-primary/10"
              class="flex flex-col gap-2 rounded-8 b-1-muted bg-container p-8"
            >
              <button
                v-for="item in navItems"
                :key="item.label"
                type="button"
                class="h-42 flex cursor-pointer items-center gap-10 rounded-6 border-none bg-transparent px-12 text-sm text-secondary transition-colors hover:text-main"
              >
                <Icon :name="item.icon" :size="17" />
                <span class="flex-1 text-left">{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="h-18 inline-flex items-center justify-center rounded-full bg-primary/10 px-6 text-xs text-primary"
                >
                  {{ item.badge }}
                </span>
              </button>
            </SlidingHighlight>
          </article>

          <article class="min-w-0">
            <div
              class="mb-12 flex flex-wrap items-start justify-between gap-10"
            >
              <div>
                <h2 class="m-0 text-lg text-main font-600">语义化列表</h2>
                <p class="mb-0 mt-4 text-sm text-secondary">
                  as="ul" 时高亮块渲染为 li，保持列表 DOM 结构合法。
                </p>
              </div>
              <code
                class="rounded-4 bg-secondary px-7 py-4 text-xs text-secondary"
              >
                as="ul"
              </code>
            </div>

            <SlidingHighlight
              as="ul"
              :inset="8"
              pill-class-name="rounded-6 bg-primary/10"
              class="m-0 flex list-none flex-col gap-2 rounded-8 b-1-muted bg-container p-8"
            >
              <li v-for="item in navItems.slice(0, 5)" :key="item.label">
                <button
                  type="button"
                  class="h-42 w-full flex cursor-pointer items-center gap-10 rounded-6 border-none bg-transparent px-12 text-sm text-secondary transition-colors hover:text-main"
                >
                  <Icon :name="item.icon" :size="17" />
                  <span class="flex-1 text-left">{{ item.label }}</span>
                </button>
              </li>
            </SlidingHighlight>

            <p
              class="mb-0 mt-12 rounded-6 b-1-muted bg-secondary p-14 text-sm leading-22 text-secondary"
            >
              高亮块只表达悬浮位置，选中态请由业务自行维护（例如 a-tabs 或自定义
              active 样式）。
            </p>
          </article>
        </div>

        <article class="mt-24 b-t-1-muted pt-24">
          <div class="mb-12 flex flex-wrap items-start justify-between gap-10">
            <div>
              <h2 class="m-0 text-lg text-main font-600">换行与自定义</h2>
              <p class="mb-0 mt-4 text-sm text-secondary">
                折行或尺寸不一致的网格中，位移、宽度与高度同时过渡；
                pill-container-class-name 可覆盖定位层样式。
              </p>
            </div>
            <code
              class="rounded-4 bg-secondary px-7 py-4 text-xs text-secondary"
            >
              inset / pill-class-name
            </code>
          </div>

          <SlidingHighlight
            :inset="4"
            pill-class-name="rounded-full bg-muted"
            pill-container-class-name="rounded-full"
            class="flex flex-wrap gap-8 rounded-8 b-1-muted bg-container p-12"
          >
            <button
              v-for="tag in tagItems"
              :key="tag"
              type="button"
              class="h-32 flex cursor-pointer items-center rounded-full border-none bg-transparent px-14 text-sm text-secondary transition-colors hover:text-main"
            >
              {{ tag }}
            </button>
          </SlidingHighlight>
        </article>
      </section>
    </div>
  </WView>
</template>

<script setup lang="ts">
import { Icon, SlidingHighlight } from '@/components'

interface NavItem {
  label: string
  icon: string
  badge?: string
}

const navItems: NavItem[] = [
  { label: '总览', icon: 'i-lucide:layout-dashboard' },
  { label: '成员', icon: 'i-lucide:users', badge: '12' },
  { label: '权限', icon: 'i-lucide:shield-check' },
  { label: '集成', icon: 'i-lucide:plug-zap', badge: '3' },
  { label: '操作日志', icon: 'i-lucide:scroll-text' },
  { label: '项目设置', icon: 'i-lucide:settings-2' },
]

const tagItems = [
  'Vue 3',
  'TypeScript',
  'Vite',
  'Pinia',
  'UnoCSS',
  'Antdv Next',
  'Vue Router',
  'Dayjs',
]
</script>
