<template>
  <div class="loading" id="__app-loading__">
    <div class="loader"></div>
    <div class="loading-title" v-if="description">{{ description }}</div>
  </div>
</template>

<script lang="ts" setup>
  import type { LoadingProps } from './types'
  const { description } = defineProps<LoadingProps>()
</script>
