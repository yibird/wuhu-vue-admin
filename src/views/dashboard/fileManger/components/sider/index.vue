<template>
  <div class="h-full flex flex-col gap-10 overflow-hidden">
    <FileList />
    <Capacity />
  </div>
</template>
<script lang="ts" setup>
  import Capacity from './capacity.vue'
  import FileList from './file-list.vue'
</script>
