<template>
  <List :config="modelPageConfig" :items="modelResources" />
</template>

<script setup lang="ts">
import List from './components/list.vue'
import { modelPageConfig, modelResources } from './data'
</script>
