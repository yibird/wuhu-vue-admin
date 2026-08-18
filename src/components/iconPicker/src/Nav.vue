<script setup lang="ts">
import { computed } from 'vue'
import { ALL_ICON_CATEGORY, FREQUENT_ICON_CATEGORY } from './data'
import type { IconCategoryItem } from './types'

interface IconCategoryGroup {
  key: 'categories' | 'quick'
  label: string
  items: readonly IconCategoryItem[]
}

const props = withDefaults(
  defineProps<{
    activeKey: string
    items: readonly IconCategoryItem[]
    total?: number
  }>(),
  {
    total: undefined,
  }
)

const emit = defineEmits<{
  select: [key: string]
}>()

const categoryGroups = computed<IconCategoryGroup[]>(() => {
  const quickKeys = new Set([ALL_ICON_CATEGORY, FREQUENT_ICON_CATEGORY])
  const quickItems = props.items.filter((category) =>
    quickKeys.has(category.key)
  )
  const categoryItems = props.items.filter(
    (category) => !quickKeys.has(category.key)
  )

  return [
    { key: 'quick' as const, label: '快捷入口', items: quickItems },
    { key: 'categories' as const, label: '按用途浏览', items: categoryItems },
  ].filter((group) => group.items.length > 0)
})

const totalCount = computed(
  () =>
    props.total ??
    props.items.find(({ key }) => key === ALL_ICON_CATEGORY)?.count ??
    0
)
</script>

<template>
  <aside
    class="w-icon-category-nav-panel min-h-0 min-w-0 flex flex-col border-r-1 border-color-1 border-r-solid bg-fill-1"
  >
    <div
      class="h-48 shrink-0 flex items-center justify-between gap-6 border-b-1 border-color-1 border-b-solid bg-fill-1 px-10 text-xs text-secondary font-500"
    >
      <div class="min-w-0 flex items-center gap-6">
        <Icon
          name="i-lucide:layout-list"
          :size="14"
          class="shrink-0 text-primary"
        />
        <span class="truncate">图标库</span>
      </div>
      <span
        class="shrink-0 rounded-4 bg-fill-2 px-5 py-2 text-10px text-muted tabular-nums"
      >
        {{ totalCount }}
      </span>
    </div>
    <nav
      class="w-icon-category-nav min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-6"
      aria-label="图标分类导航"
    >
      <section
        v-for="(group, groupIndex) in categoryGroups"
        :key="group.key"
        :class="
          groupIndex > 0
            ? 'mt-12 border-t-1 border-color-1 border-t-solid pt-10'
            : ''
        "
      >
        <div
          class="mb-5 flex items-center gap-6 px-8 text-10px text-muted font-600"
        >
          <span>{{ group.label }}</span>
          <span class="h-1 flex-1 bg-fill-2" />
        </div>
        <button
          v-for="category in group.items"
          :key="category.key"
          type="button"
          class="w-icon-category-nav__item group relative mb-3 h-36 w-full min-w-0 flex cursor-pointer items-center gap-7 overflow-hidden rounded-5 border-0 bg-transparent px-8 text-left text-xs text-secondary hover:(bg-hover text-main) focus-visible:(outline-none ring-2 ring-primary/15)"
          :class="{
            'bg-selected text-primary font-500 shadow-all-sm':
              activeKey === category.key,
          }"
          :aria-pressed="activeKey === category.key"
          @click="emit('select', category.key)"
        >
          <Transition name="w-icon-category-nav-indicator">
            <span
              v-if="activeKey === category.key"
              class="absolute bottom-7 left-0 top-7 w-2 rounded-r-2 bg-primary"
            />
          </Transition>
          <span
            class="size-22 shrink-0 flex items-center justify-center rounded-4 bg-container text-muted transition-colors group-hover:(bg-container text-primary)"
            :class="{
              'bg-primary/10 text-primary': activeKey === category.key,
            }"
          >
            <Icon :name="category.icon" :size="14" />
          </span>
          <span class="min-w-0 flex-1 truncate">{{ category.label }}</span>
          <span
            class="hidden min-w-18 shrink-0 rounded-4 bg-fill-2 px-4 text-center text-10px text-muted tabular-nums transition-colors group-hover:bg-container sm:inline-block"
            :class="{
              'bg-primary/10 text-primary': activeKey === category.key,
            }"
          >
            {{ category.count }}
          </span>
        </button>
      </section>
    </nav>
  </aside>
</template>

<style scoped lang="less">
.w-icon-category-nav {
  overscroll-behavior: contain;
  scrollbar-color: rgb(var(--w-border-color-3)) transparent;
  scrollbar-width: thin;

  &__item {
    transition:
      color var(--w-motion-duration-base) var(--w-motion-ease-standard),
      background-color var(--w-motion-duration-base)
        var(--w-motion-ease-standard),
      box-shadow var(--w-motion-duration-base) var(--w-motion-ease-standard),
      transform var(--w-motion-duration-base) var(--w-motion-ease-enter);

    &:active {
      transform: scale(0.98);
    }
  }

  &-indicator {
    &-enter-active,
    &-leave-active {
      transform-origin: center;
      transition:
        opacity var(--w-motion-duration-fast) var(--w-motion-ease-standard),
        transform var(--w-motion-duration-base) var(--w-motion-ease-enter);
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      transform: scaleY(0.25);
    }
  }

  @media (hover: hover) {
    &__item:not([aria-pressed='true']):hover {
      transform: translate3d(2px, 0, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__item,
    &-indicator-enter-active,
    &-indicator-leave-active {
      transition: none;
    }
  }
}
</style>
