<script lang="ts" setup>
import Item from './Item.vue'
import type { CardListProps } from '../types'
const { items = [] } = defineProps<CardListProps>()
</script>

<template>
  <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4">
    <Item
      v-for="(item, index) in items"
      :key="item.id"
      :item="item"
      :index="index"
    />
  </div>
</template>
