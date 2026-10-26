<template>
  <section
    class="w-full min-h-0 flex flex-1 flex-col overflow-hidden rounded-8 b-1-regular bg-overlay shadow-md"
  >
    <header
      class="shrink-0 flex items-center justify-between gap-12 b-b-1-muted bg-secondary px-14 py-12"
    >
      <div class="min-w-0 flex items-center gap-10">
        <span
          class="size-32 flex shrink-0 items-center justify-center rounded-7 bg-primary/10 text-primary"
        >
          <Icon name="i-lucide:search" :size="17" />
        </span>
        <div class="min-w-0">
          <p class="truncate text-sm text-main font-600">菜单搜索</p>
          <p class="mt-2 truncate text-xs text-muted">
            {{ keyword ? '按回车打开当前选中项' : '输入关键词查找页面' }}
          </p>
        </div>
      </div>
      <kbd
        class="shrink-0 rounded-4 b-1-regular bg-container px-6 py-3 text-11px text-muted leading-14px"
      >
        ↑↓
      </kbd>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <section class="px-10 py-10">
        <div class="mb-6 flex items-center justify-between px-4">
          <span class="text-xs text-muted font-500">
            {{ keyword ? '搜索结果' : '搜索提示' }}
          </span>
          <span v-if="keyword" class="text-xs text-muted">
            {{ resultSummary }}
          </span>
        </div>

        <TransitionGroup
          v-if="keyword && results.length"
          name="list"
          tag="div"
          role="listbox"
          aria-label="菜单搜索结果"
          class="list-group flex flex-col gap-4"
        >
          <button
            v-for="(result, index) in results"
            :key="result.item.id"
            type="button"
            role="option"
            :aria-selected="activeIndex === index"
            :class="[
              'group w-full min-w-0 flex cursor-pointer items-center gap-10 text-left rounded-8 bg-transparent px-8 py-8  transition-all hover:(translate-x-1 b-1-[border-primary] bg-white) active:translate-x-0',
              activeIndex === index
                ? 'bg-primary/20 border-1 border-primary shadow-md shadow-primary/10'
                : 'b-1-transparent',
            ]"
            @mouseenter="emits('active-change', index)"
            @click="emits('select', result.item)"
          >
            <span
              class="size-34 flex-center shrink-0 rounded-8 bg-primary text-white shadow-md shadow-primary/22 transition-all group-hover:scale-105"
              :class="
                activeIndex === index ? 'shadow-lg shadow-primary/34' : ''
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
                class="mt-4 block truncate text-xs text-muted"
              >
                {{ result.breadcrumb }}
              </span>
            </span>
            <Icon
              name="i-lucide:arrow-up-right"
              :size="16"
              class="shrink-0 opacity-0 transition-all group-hover:(translate-x-1 -translate-y-1 text-primary opacity-100)"
              :class="
                activeIndex === index
                  ? 'text-primary opacity-100'
                  : 'text-muted'
              "
            />
          </button>
        </TransitionGroup>

        <div
          v-else-if="keyword"
          class="flex flex-col items-center justify-center rounded-7 bg-container px-12 py-24 text-center"
        >
          <span
            class="size-42 flex items-center justify-center rounded-full bg-muted text-muted"
          >
            <Icon name="i-lucide:search-x" :size="19" />
          </span>
          <div class="mt-10 text-sm text-main font-500">没有找到匹配页面</div>
          <div class="mt-5 text-xs text-muted">
            尝试更换关键词或搜索页面名称
          </div>
        </div>

        <div
          v-else
          class="flex items-center gap-10 rounded-7 bg-secondary px-12 py-12 text-xs text-muted"
        >
          <Icon name="i-lucide:sparkles" :size="16" class="text-primary" />
          <span>支持页面名称、拼音、菜单路径和所属目录</span>
        </div>
      </section>

      <section class="b-t-1-muted px-10 py-10">
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
            <Icon name="i-lucide:trash-2" :size="14" />
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
              class="pointer-events-none mr-4 size-26 flex shrink-0 cursor-pointer items-center justify-center rounded-5 border-0 bg-transparent p-0 text-muted opacity-0 outline-none transition-[background-color,color,opacity] duration-100 group-hover:(pointer-events-auto opacity-100) hover:(bg-muted text-main) focus-visible:(pointer-events-auto bg-muted text-primary opacity-100)"
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
          />
        </button>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SearchPanelEmits, SearchPanelProps } from '../types'

const props = defineProps<SearchPanelProps>()
const emits = defineEmits<SearchPanelEmits>()

const resultSummary = computed(() =>
  props.resultCount > props.results.length
    ? `仅显示前 ${props.results.length} 条 / 共 ${props.resultCount} 条`
    : `${props.resultCount} 个结果`
)
</script>
