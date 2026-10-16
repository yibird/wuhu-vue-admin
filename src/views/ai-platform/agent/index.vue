<template>
  <List
    :config="agentPageConfig"
    detail-path="/ai-platform/agent/edit"
    edit-path="/ai-platform/agent/edit"
    :items="agentResources"
  />
</template>
<script setup lang="ts">
import List from './components/list.vue'
import { agentPageConfig, agentResources } from './data'
</script>
