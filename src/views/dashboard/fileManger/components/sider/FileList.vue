<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { LayoutGroup, Motion, MotionConfig } from 'motion-v'
import { Icon } from '@/components'
import type { FileCategory, FileCategoryStats } from '../types'
import { fileCategoryOptions } from '../utils'

const props = defineProps<{
  activeCategory: FileCategory
  stats: FileCategoryStats
}>()

const emit = defineEmits<{
  'update:activeCategory': [category: FileCategory]
}>()

const onlyUsed = shallowRef(false)

const categoryPress = { scale: 0.985 }
const categorySelectionTransition = {
  type: 'tween' as const,
  duration: 0.26,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}
const categoryPressTransition = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 38,
  mass: 0.4,
}
const categoryItemTransition = {
  layout: categorySelectionTransition,
  scale: categoryPressTransition,
}

const iconMap: Record<FileCategory, string> = {
  all: 'i-lucide:files',
  image: 'i-lucide:image',
  document: 'i-lucide:file-text',
  video: 'i-lucide:film',
  audio: 'i-lucide:music-2',
  archive: 'i-lucide:archive',
  code: 'i-lucide:code-2',
  trash: 'i-lucide:trash-2',
  other: 'i-lucide:file-question',
}

const visibleItems = computed(() => {
  if (!onlyUsed.value) return fileCategoryOptions
  return fileCategoryOptions.filter((item) => {
    return item.value === 'all' || props.stats[item.value].count > 0
  })
})
</script>

<template>
  <div
    class="file-list min-h-0 flex flex-1 flex-col overflow-hidden max-[1199px]:min-h-120"
  >
    <div
      class="file-list__header flex items-center justify-between px-16 py-14 max-[575px]:(px-12 py-12)"
    >
      <div class="flex min-w-0 items-center gap-10">
        <span
          class="file-list__header-icon size-30 flex-center shrink-0 rounded-6 bg-primary/10 text-primary max-[575px]:hidden"
        >
          <Icon name="i-lucide:folder-tree" :size="16" />
        </span>
        <div class="min-w-0">
          <div class="flex items-center gap-6 text-main font-medium">
            <span>文件</span>
            <span class="text-xs text-secondary font-normal">
              {{ stats.all.count }} 项
            </span>
          </div>
          <div class="mt-2 text-11px text-secondary max-[575px]:hidden">
            按类型浏览
          </div>
        </div>
      </div>
      <a-tooltip title="仅显示有文件的类型">
        <a-switch v-model:checked="onlyUsed" size="small" />
      </a-tooltip>
    </div>
    <Scrollbar
      class="file-list__scroll min-h-0 flex-1 overflow-hidden"
      content-class="flex flex-col gap-2 px-8 pb-10 max-[1199px]:(min-w-max flex-row gap-6 px-10 pb-10)"
    >
      <MotionConfig reduced-motion="user">
        <LayoutGroup id="file-manager-categories">
          <Motion
            v-for="item in visibleItems"
            :key="item.value"
            as="button"
            type="button"
            layout="position"
            :while-press="categoryPress"
            :transition="categoryItemTransition"
            :class="[
              'file-list__item group relative w-full min-w-0 flex cursor-pointer items-center overflow-hidden rounded-6 border-0 bg-transparent px-10 py-9 text-left text-regular outline-none transition-[background-color,color] max-[1199px]:(min-w-132 bg-fill-quaternary px-12 py-9) max-[575px]:min-w-112',
              activeCategory === item.value
                ? 'file-list__item--active text-primary font-medium dark:text-main'
                : 'hover:bg-hover hover:text-main',
            ]"
            @click="emit('update:activeCategory', item.value)"
          >
            <Motion
              v-if="activeCategory === item.value"
              as="span"
              layout-id="file-manager-category-selection"
              :initial="false"
              class="file-list__selection pointer-events-none absolute inset-0 rounded-6 bg-primary/9 dark:bg-primary/16"
              :transition="categorySelectionTransition"
            />
            <span
              class="file-list__item-icon relative z-1 size-28 flex-center shrink-0 rounded-6 text-secondary transition-[background-color,color,transform] group-hover:(bg-primary/8 text-primary) max-[575px]:size-24"
              :class="
                activeCategory === item.value
                  ? 'bg-primary/12 text-primary'
                  : ''
              "
            >
              <Icon :name="iconMap[item.value]" :size="16" />
            </span>
            <span class="relative z-1 ml-10 min-w-0 flex-1 truncate">
              {{ item.label }}
            </span>
            <span
              class="file-list__item-count relative z-1 ml-8 shrink-0 text-xs transition-colors"
              :class="
                activeCategory === item.value
                  ? 'text-primary dark:text-main'
                  : 'text-secondary'
              "
            >
              {{ stats[item.value].count }}
            </span>
          </Motion>
        </LayoutGroup>
      </MotionConfig>
    </Scrollbar>
  </div>
</template>

<style scoped>
.file-list__header-icon,
.file-list__item-icon {
  transition:
    background-color 180ms ease,
    color 180ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.file-list__selection::before {
  position: absolute;
  top: 7px;
  bottom: 7px;
  left: 0;
  width: 3px;
  content: '';
  background-color: rgb(var(--w-color-primary));
  border-radius: 0 999px 999px 0;
}

.file-list__item:not(.file-list__item--active):hover .file-list__item-icon {
  transform: translateX(2px);
}

.file-list__item:focus-visible {
  box-shadow: 0 0 0 2px rgb(var(--w-color-primary) / 18%);
}

@media (width <= 1199px) and (width > 767px) {
  .file-list__header {
    padding-block: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .file-list__header-icon,
  .file-list__item-icon {
    transition: none;
  }
}
</style>
