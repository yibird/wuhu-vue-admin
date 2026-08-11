<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { workflowPaletteGroupLabels } from '../data'
import type { WorkflowPaletteGroup, WorkflowPaletteItem } from '../types'

const keyword = defineModel<string>('keyword', { required: true })

const props = defineProps<{
  collapsed: boolean
  palette: WorkflowPaletteItem[]
}>()

defineEmits<{
  add: [item: WorkflowPaletteItem]
}>()

const activeGroup = shallowRef<WorkflowPaletteGroup>('model')

const visibleGroups = computed(() => {
  return (
    Object.keys(workflowPaletteGroupLabels) as WorkflowPaletteGroup[]
  ).filter((group) => props.palette.some((item) => item.group === group))
})

const groupedPalette = computed(() => {
  const groups = new Map<WorkflowPaletteGroup, WorkflowPaletteItem[]>()
  props.palette.forEach((item) => {
    groups.set(item.group, [...(groups.get(item.group) ?? []), item])
  })
  return groups
})

const visiblePalette = computed(() => {
  const items = groupedPalette.value.get(activeGroup.value)
  if (items) return items
  return props.palette
})
</script>

<template>
  <aside
    class="min-h-0 min-w-0 flex flex-col gap-12 overflow-hidden rounded-12 border-1 border-color-2 border-solid bg-main p-14 opacity-100 shadow-[0_10px_24px_rgb(15_23_42_/_8%)] transition-[opacity,transform,padding,border-color,box-shadow,max-height] duration-300 ease-in-out max-lg:max-h-280"
    :class="
      collapsed
        ? 'pointer-events-none -translate-x-12 border-transparent p-0 opacity-0 shadow-none max-lg:max-h-0 max-lg:-translate-y-8'
        : ''
    "
    :aria-hidden="collapsed"
  >
    <div class="flex flex-col gap-2">
      <span class="text-15px text-main font-700 leading-22px">节点库</span>
      <small class="text-xs text-muted leading-18px">点击节点添加到画布</small>
    </div>

    <a-input
      v-model:value="keyword"
      allow-clear
      class="!h-36 !rounded-9"
      placeholder="搜索节点"
    >
      <template #prefix>
        <Icon name="i-lucide:search" :size="15" class="text-muted" />
      </template>
    </a-input>

    <div
      class="pb-10 flex flex-wrap gap-6 overflow-hidden border-b-1 border-color-2 border-solid"
    >
      <a-button
        v-for="group in visibleGroups"
        :key="group"
        size="small"
        class="!h-30 shrink-0 !px-10 text-12px"
        :type="activeGroup === group ? 'primary' : 'default'"
        @click="activeGroup = group"
      >
        {{ workflowPaletteGroupLabels[group] }}
      </a-button>
    </div>

    <Scrollbar
      class="min-h-0 flex-1"
      content-class="grid grid-cols-5 gap-8 py-4"
    >
      <a-tooltip
        v-for="item in visiblePalette"
        :key="item.kind"
        placement="top"
      >
        <template #title>
          <div class="max-w-200">
            <div class="text-13px font-700 leading-20px">{{ item.title }}</div>
            <div class="text-xs opacity-80 leading-18px">
              {{ item.description }}
            </div>
          </div>
        </template>
        <a-button
          type="text"
          class="aspect-square !h-auto !w-full !rounded-10 !border-1 !border-color-secondary !border-solid !bg-main !p-0 transition-[border-color,box-shadow,transform,background-color] duration-200 hover:-translate-y-1 hover:!border-primary hover:!bg-primary-tint hover:shadow-[0_8px_18px_rgb(15_23_42_/_8%)]"
          :aria-label="`添加${item.title}`"
          @click="$emit('add', item)"
        >
          <Icon :name="item.icon" :size="22" :color="item.accent" />
        </a-button>
      </a-tooltip>
    </Scrollbar>

    <div
      class="rounded-10 border-1 border-color-primary border-solid bg-primary-tint p-12"
    >
      <span class="text-13px text-primary font-700">搭建建议</span>
      <p class="m-0 mt-6 text-xs text-regular leading-20px">
        从输入节点开始，串联模型、知识库、条件分支，最后输出到消息或结束节点。
      </p>
    </div>
  </aside>
</template>
