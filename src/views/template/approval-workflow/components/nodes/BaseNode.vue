<script setup lang="ts">
import type { ApprovalNode } from '../../types'

const props = withDefaults(
  defineProps<{
    node: ApprovalNode
    selected: boolean
    kindLabel: string
    summaryItems?: readonly string[]
    detailItems?: readonly string[]
  }>(),
  {
    summaryItems: () => [],
    detailItems: () => [],
  }
)
</script>

<template>
  <div>
    <div
      class="flex items-center gap-8 rounded-t-10 px-11 py-9 text-white"
      :style="{ backgroundColor: props.node.accent }"
    >
      <Icon :name="props.node.icon" :size="16" />
      <span class="min-w-0 flex-1">
        <strong class="block truncate text-13px">{{ props.node.title }}</strong>
        <small class="mt-1 block truncate text-10px opacity-78">
          {{ props.kindLabel }}
        </small>
      </span>
      <span v-if="props.selected" class="text-10px opacity-86">选中</span>
      <span v-else-if="props.node.required" class="text-10px opacity-78">
        固定
      </span>
    </div>

    <div class="px-11 py-10">
      <p
        class="m-0 line-clamp-2 min-h-36 text-12px text-secondary leading-18px"
      >
        {{ props.node.description }}
      </p>

      <div v-if="props.summaryItems.length" class="mt-8 flex flex-wrap gap-5">
        <span
          v-for="item in props.summaryItems"
          :key="item"
          class="max-w-110 truncate rounded-5 bg-fill px-6 py-3 text-10px text-tertiary"
        >
          {{ item }}
        </span>
      </div>

      <div v-if="props.detailItems.length" class="mt-8 grid gap-5">
        <span
          v-for="item in props.detailItems"
          :key="item"
          class="truncate rounded-5 bg-hover px-6 py-4 text-10px text-secondary"
        >
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>
