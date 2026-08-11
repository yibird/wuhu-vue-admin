<script lang="ts" setup>
import Card from './Card.vue'
import type { SysInfoEmits, SysInfoProps } from './types'

const { items = [] } = defineProps<SysInfoProps>()
const emit = defineEmits<SysInfoEmits>()
</script>

<template>
  <Card
    title="系统信息"
    icon="i-lucide:info"
    description="实例、系统与网络基础信息"
  >
    <template #extra>
      <a-button size="small" @click="emit('copyAll')">
        <template #icon>
          <Icon name="i-lucide:copy" />
        </template>
        复制
      </a-button>
    </template>

    <div v-if="items.length > 0" class="flex flex-col gap-8">
      <div
        v-for="item in items"
        :key="item.id"
        class="group min-w-0 flex items-center rounded-6 bg-container-secondary px-10 py-9 transition-[border-color,background-color,box-shadow,transform] duration-180 ease-out hover:(-translate-y-2 shadow-[0_6px_16px_rgb(var(--w-color-primary)_/_10%)]) active:(translate-y-0 scale-[0.995]) motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
      >
        <span class="w-76 shrink-0 text-xs text-secondary">{{
          item.title
        }}</span>
        <span class="min-w-0 flex-1 truncate text-sm text-main">
          {{ item.value }}
        </span>
        <button
          v-if="item.copyable"
          type="button"
          class="button ml-8 size-24 shrink-0 rounded-4 text-secondary opacity-0 transition group-hover:opacity-100 hover:(bg-hover text-primary)"
          title="复制"
          @click="emit('copy', item)"
        >
          <Icon name="i-lucide:copy" :size="14" />
        </button>
      </div>
    </div>
    <a-empty v-else />
  </Card>
</template>
