<template>
  <i v-if="name" :style="getStyle" :class="['icon', name]"></i>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import type { IconProps } from './types';
  defineOptions({ name: 'Icon' });
  const { name, color, size = 14 } = defineProps<IconProps>();
  const getStyle = computed(() => {
    const fontSize = typeof size === 'number' ? `${size}px` : size;
    return {
      fontSize,
      color,
    };
  });
</script>
<style scoped>
  .icon {
    display: inline-block;
    vertical-align: middle;
  }
</style>
