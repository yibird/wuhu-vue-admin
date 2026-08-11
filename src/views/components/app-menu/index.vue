<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { AppMenu } from '@/layouts/menu'
import { Scrollbar } from '@/components/scrollbar'
import { menus } from '@/config'

const collapsed = shallowRef(false)
const dashboardMenus = computed(() => (menus[0] ? [menus[0]] : []))
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
            <h1 class="m-0 text-xl text-main font-600">AppMenu</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              适配项目菜单模型、路由和折叠模式的导航菜单。
            </p>
          </div>
          <a-tag color="blue">src/layouts/menu</a-tag>
        </header>

        <div class="grid gap-14">
          <div class="flex items-center justify-between gap-12">
            <span class="text-sm text-secondary">折叠菜单</span>
            <a-switch v-model:checked="collapsed" />
          </div>
          <div
            class="h-420 overflow-hidden rounded-6 border-1 border-color-2 border-solid bg-container"
            :class="collapsed ? 'w-72' : 'w-240 max-w-full'"
          >
            <Scrollbar>
              <AppMenu
                :items="dashboardMenus"
                :collapsed="collapsed"
                selected-key="11"
                theme="light"
              />
            </Scrollbar>
          </div>
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
