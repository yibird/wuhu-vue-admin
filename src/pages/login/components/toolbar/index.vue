<template>
  <div class="absolute top-20 right-20 z-10 flex items-center">
    <Layout @placement="(value) => emits('placement', value)" />
    <Theme />
    <Translate />
  </div>
</template>
<script setup lang="ts">
import Layout from './layout.vue'
import Theme from './theme.vue'
import Translate from './translate.vue'

const emits = defineEmits<{ (e: 'placement', value: string): void }>()
</script>
