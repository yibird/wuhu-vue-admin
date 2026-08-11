<script setup lang="ts">
import List from './components/List.vue'
import { knowledgeBasePageConfig, knowledgeBaseResources } from '../data'
</script>

<template>
  <List
    :config="knowledgeBasePageConfig"
    detail-path="/ai-platform/knowledge-base/detail"
    :items="knowledgeBaseResources"
  />
</template>
