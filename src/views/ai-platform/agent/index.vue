<script setup lang="ts">
import List from './components/List.vue'
import { agentPageConfig, agentResources } from './data'
</script>

<template>
  <List
    :config="agentPageConfig"
    detail-path="/ai-platform/agent/edit"
    edit-path="/ai-platform/agent/edit"
    :items="agentResources"
  />
</template>
