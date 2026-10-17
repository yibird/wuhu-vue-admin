<template>
  <List
    :config="knowledgeBasePageConfig"
    detail-path="/ai-platform/knowledge-base/detail"
    :items="knowledgeBaseResources"
  />
</template>

<script setup lang="ts">
import List from './components/list.vue'
import { knowledgeBasePageConfig, knowledgeBaseResources } from '../data'
</script>
