<script setup lang="ts">
import { shallowRef } from 'vue'
import { Scrollbar } from '@/components/scrollbar'
import { WView } from '@/components/view'

const headerCollapsed = shallowRef(false)
const siderCollapsed = shallowRef(false)
const gap = shallowRef(8)

function changeGap(step: number) {
  gap.value = Math.min(32, Math.max(0, gap.value + step))
}
</script>

<template>
  <WView :full="true" :padding="false" class="bg-page">
    <Scrollbar class="h-full" content-class="min-h-full p-16 md:p-20">
      <section
        class="mx-auto max-w-1280 rounded-8 border-1 border-color-1 border-solid bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 border-b-1 border-color-1 border-b-solid pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">WView</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              页面区域组件：统一处理布局、折叠状态和内容间距。
            </p>
          </div>
          <a-tag color="blue">src/components/view</a-tag>
        </header>

        <div
          class="mb-16 flex flex-wrap items-center gap-8 text-sm text-secondary"
        >
          <span>布局间距：{{ gap }}px</span>
          <a-button size="small" @click="changeGap(-4)">减少间距</a-button>
          <a-button size="small" @click="changeGap(4)">增加间距</a-button>
        </div>

        <div
          class="min-h-420 overflow-hidden rounded-6 border-1 border-color-2 border-solid bg-fill-quaternary p-12"
        >
          <WView
            :full="false"
            :padding="12"
            :gap="gap"
            class="h-full min-h-396"
          >
            <WView.Header
              v-model:collapsed="headerCollapsed"
              collapsible
              class="rounded-6 border-1 border-color-1 border-solid bg-container p-12 shadow-b-sm"
            >
              <div class="flex min-h-48 items-center gap-10">
                <div
                  class="size-36 flex shrink-0 items-center justify-center rounded-6 bg-primary/10 text-primary"
                >
                  <Icon name="i-lucide:layout-dashboard" :size="18" />
                </div>
                <div class="min-w-0">
                  <div class="truncate text-md text-main font-600">
                    WView.Header
                  </div>
                  <div class="mt-2 truncate text-xs text-secondary">
                    当前状态：{{ headerCollapsed ? '已收起' : '已展开' }}
                  </div>
                </div>
              </div>
            </WView.Header>

            <WView
              :full="false"
              :padding="false"
              :gap="gap"
              direction="horizontal"
              class="min-h-0 flex-1"
            >
              <WView.Sider
                v-model:collapsed="siderCollapsed"
                collapsible
                width="min(240px, 100%)"
                class="min-h-180 rounded-6 border-1 border-color-1 border-solid bg-container"
              >
                <template #default="{ collapsed }">
                  <nav class="h-full p-8" aria-label="示例侧栏">
                    <div
                      class="mb-8 flex h-36 items-center gap-8 rounded-4 bg-primary/10 px-8 text-primary"
                    >
                      <Icon name="i-lucide:layers-3" :size="16" />
                      <span v-if="!collapsed" class="truncate text-sm font-600"
                        >侧栏导航</span
                      >
                    </div>
                    <div
                      v-for="item in ['概览', '数据分析', '系统设置']"
                      :key="item"
                      class="mb-4 flex h-36 items-center gap-8 rounded-4 px-8 text-sm text-secondary transition-colors hover:bg-hover hover:text-main"
                    >
                      <Icon name="i-lucide:dot" :size="16" />
                      <span v-if="!collapsed" class="truncate">{{ item }}</span>
                    </div>
                  </nav>
                </template>
              </WView.Sider>

              <WView.Content
                class="min-h-180 rounded-6 border-1 border-color-1 border-solid bg-container p-16"
              >
                <div class="h-full min-h-148">
                  <div class="flex items-center justify-between gap-8">
                    <div>
                      <div class="text-md text-main font-600">
                        WView.Content
                      </div>
                      <div class="mt-4 text-xs text-secondary">
                        内容区会自动占据剩余空间。
                      </div>
                    </div>
                    <a-tag color="green">可复用</a-tag>
                  </div>
                  <div
                    class="mt-16 grid grid-cols-1 gap-8 text-sm md:grid-cols-3"
                  >
                    <div
                      v-for="index in 3"
                      :key="index"
                      class="rounded-4 border-1 border-color-1 border-solid bg-fill-quaternary p-12 text-secondary"
                    >
                      内容块 {{ index }}
                    </div>
                  </div>
                </div>
              </WView.Content>
            </WView>

            <WView.Footer
              class="flex items-center justify-between gap-8 rounded-6 border-1 border-color-1 border-solid bg-container px-12 py-10 text-xs text-secondary"
            >
              <span>WView.Footer</span>
              <span>底部区域不会参与内容收缩</span>
            </WView.Footer>
          </WView>
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
