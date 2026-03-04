<template>
  <n-tooltip>
    <template #trigger>
      <button @click="show = true">
        <Icon name="i-lucide:book-marked" :size="20" />
      </button>
    </template>
    <span>记事本</span>
  </n-tooltip>
  <NoteBookModal v-model:show="show" />
</template>
<script lang="ts" setup>
import { NoteBookModal } from '@/layouts/config';
const show = ref(false);
</script>
