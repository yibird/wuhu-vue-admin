<script setup lang="ts">
import type { SearchPanelEmits, SearchPanelProps } from '../types'

defineProps<SearchPanelProps>()
const emits = defineEmits<SearchPanelEmits>()
</script>

<template>
  <section
    id="layout-sider-search-panel"
    aria-label="菜单搜索面板"
    class="w-full max-w-[calc(100vw-24px)] overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-elevated shadow-[0_20px_60px_rgb(var(--w-bg-mask-rgb)_/_36%)]"
  >
    <header
      class="flex items-center justify-between gap-12 border-b-1 border-color-1 border-b-solid bg-fill-1 px-14 py-12"
    >
      <div class="min-w-0 flex items-center gap-10">
        <span
          class="size-32 flex shrink-0 items-center justify-center rounded-7 bg-primary/10 text-primary"
        >
          <Icon name="i-lucide:search" :size="17" />
        </span>
        <div class="min-w-0">
          <p class="m-0 truncate text-sm text-main font-600">菜单搜索</p>
          <p class="m-0 mt-2 truncate text-xs text-muted">
            {{ keyword ? '按回车打开当前选中项' : '输入关键词查找页面' }}
          </p>
        </div>
      </div>
      <kbd
        class="shrink-0 rounded-4 border-1 border-color-2 border-solid bg-container px-6 py-3 text-11px text-muted leading-14px"
      >
        ↑↓
      </kbd>
    </header>

    <div class="max-h-[calc(100vh-148px)] overflow-y-auto">
      <section class="px-10 py-10">
        <div class="mb-6 flex items-center justify-between px-4">
          <span class="text-xs text-muted font-500">
            {{ keyword ? '搜索结果' : '搜索提示' }}
          </span>
          <span v-if="keyword" class="text-xs text-muted">
            {{ resultCount }} 个结果
          </span>
        </div>

        <TransitionGroup
          v-if="keyword && results.length"
          name="list"
          tag="div"
          role="listbox"
          aria-label="菜单搜索结果"
          class="list-group flex flex-col gap-3"
        >
          <button
            v-for="(result, index) in results"
            :key="result.item.id"
            type="button"
            role="option"
            :aria-selected="activeIndex === index"
            :class="[
              'content-auto-52 group w-full min-w-0 flex cursor-pointer items-center gap-10 rounded-7 border-1 border-transparent border-solid bg-transparent px-8 py-8 text-left outline-none transition-[background-color,border-color,transform,box-shadow] duration-motion-base hover:(translate-x-1 border-color-2 bg-hover) focus-visible:border-primary focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_16%)] active:translate-x-0 motion-reduce:(transform-none transition-none)',
              activeIndex === index
                ? 'border-primary bg-primary-tint shadow-[0_4px_12px_rgb(var(--w-color-primary)_/_10%)]'
                : '',
            ]"
            @mouseenter="emits('active-change', index)"
            @click="emits('select', result.item)"
          >
            <span
              class="size-34 flex shrink-0 items-center justify-center rounded-7 bg-primary [color:#fff] shadow-[0_4px_10px_rgb(var(--w-color-primary)_/_22%)] transition-[box-shadow,transform] duration-motion-base group-hover:scale-105 motion-reduce:transition-none"
              :class="
                activeIndex === index
                  ? 'shadow-[0_6px_14px_rgb(var(--w-color-primary)_/_34%)]'
                  : ''
              "
            >
              <Icon
                :name="result.item.icon || 'i-lucide:layout-dashboard'"
                :size="18"
              />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm text-main font-500">
                {{ result.item.title }}
              </span>
              <span
                v-if="result.breadcrumb"
                class="mt-3 block truncate text-xs text-muted"
              >
                {{ result.breadcrumb }}
              </span>
            </span>
            <Icon
              name="i-lucide:arrow-up-right"
              :size="16"
              class="shrink-0 text-muted opacity-0 transition-[color,opacity,transform] duration-motion-base group-hover:(translate-x-1 -translate-y-1 text-primary opacity-100)"
              :class="activeIndex === index ? 'text-primary opacity-100' : ''"
            />
          </button>
        </TransitionGroup>

        <div
          v-else-if="keyword"
          class="flex flex-col items-center justify-center rounded-7 bg-fill-1 px-12 py-24 text-center"
        >
          <span
            class="size-42 flex items-center justify-center rounded-full bg-fill-4 text-muted"
          >
            <Icon name="i-lucide:search-x" :size="19" />
          </span>
          <p class="m-0 mt-10 text-sm text-main font-500">没有找到匹配页面</p>
          <p class="m-0 mt-5 text-xs text-muted">
            尝试更换关键词或搜索页面名称
          </p>
        </div>

        <div
          v-else
          class="flex items-center gap-10 rounded-7 bg-fill-1 px-12 py-12 text-xs text-muted"
        >
          <Icon name="i-lucide:sparkles" :size="16" class="text-primary" />
          <span>支持页面名称、拼音、菜单路径和所属目录</span>
        </div>
      </section>

      <section class="border-t-1 border-color-1 border-t-solid px-10 py-10">
        <div class="mb-6 flex items-center justify-between px-4">
          <span class="flex items-center gap-6 text-xs text-muted font-500">
            <Icon name="i-lucide:history" :size="14" />
            最近搜索
          </span>
          <button
            v-if="history.length"
            type="button"
            class="inline-flex cursor-pointer items-center gap-4 border-0 bg-transparent px-4 py-3 text-xs text-muted outline-none transition-colors hover:text-primary focus-visible:text-primary"
            @click="emits('clear-history')"
          >
            <Icon name="i-lucide:trash-2" :size="13" />
            清空
          </button>
        </div>

        <TransitionGroup
          v-if="history.length"
          name="list"
          tag="div"
          class="list-group flex flex-col gap-2"
        >
          <div
            v-for="record in history"
            :key="record"
            class="content-auto-36 group flex min-w-0 items-center rounded-6 transition-colors hover:bg-hover"
          >
            <button
              type="button"
              class="min-w-0 flex flex-1 cursor-pointer items-center gap-8 border-0 bg-transparent px-8 py-7 text-left text-sm text-regular outline-none transition-colors group-hover:text-main focus-visible:text-primary"
              @click="emits('select-history', record)"
            >
              <Icon
                name="i-lucide:clock-3"
                :size="14"
                class="shrink-0 text-muted"
              />
              <span class="truncate">{{ record }}</span>
            </button>
            <button
              type="button"
              :aria-label="`删除搜索记录 ${record}`"
              class="mr-4 size-26 flex shrink-0 cursor-pointer items-center justify-center rounded-5 border-0 bg-transparent p-0 text-muted opacity-0 outline-none transition-[background-color,color,opacity] duration-motion-fast group-hover:opacity-100 hover:(bg-fill-4 text-main) focus-visible:(bg-fill-4 text-primary opacity-100)"
              @click="emits('remove-history', record)"
            >
              <Icon name="i-lucide:x" :size="14" />
            </button>
          </div>
        </TransitionGroup>
        <div v-else class="px-8 py-10 text-xs text-muted">暂无搜索记录</div>

        <button
          v-if="canToggleHistory"
          type="button"
          class="mt-5 w-full cursor-pointer border-0 bg-transparent py-4 text-center text-xs text-primary outline-none transition-colors hover:text-primary/80 focus-visible:text-primary/80"
          @click="emits('toggle-history')"
        >
          {{ historyExpanded ? '收起记录' : '展开全部记录' }}
          <Icon
            :name="
              historyExpanded ? 'i-lucide:chevron-up' : 'i-lucide:chevron-down'
            "
            :size="14"
            class="ml-3 align-[-2px]"
          />
        </button>
      </section>
    </div>
  </section>
</template>
