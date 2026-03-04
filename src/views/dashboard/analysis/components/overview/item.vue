<template>
  <n-card bordered size="small" :title="item.title" v-if="item">
    <template #header-extra>
      <ItemExtra @change="onChange" />
    </template>
    <div class="flex-between-center">
      <span class="text-base font-bold">
        <n-number-animation show-separator :from="0" :to="item.value ?? 0" />
      </span>
      <div class="w-40 h-40">
        <img :src="item.icon" alt="" />
      </div>
    </div>
    <div class="flex-between-center mt-20">
      <span>{{ item.description }}</span>
      <span class="text-md font-bold">{{ item.totalValue }}</span>
    </div>
  </n-card>
</template>
<script lang="ts" setup>
import ItemExtra from './item-extra.vue'
import type { CardItemProps, CardItemEmits } from '../types'

const { item, index } = defineProps<CardItemProps>()
const emits = defineEmits<CardItemEmits>()
const onChange = (val: string) => {
  emits('change', val, index)
}
</script>
