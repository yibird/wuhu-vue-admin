<template>
  <div class="flex-x-center">
    <a-switch class="switch" v-model:checked="checked">
      <template #checkedChildren>
        <icon :size="20" name="ri-sun-fill" />
      </template>
      <template #unCheckedChildren>
        <icon :size="20" name="ri-moon-clear-line" />
      </template>
    </a-switch>
  </div>
</template>
<script setup lang="ts">
  let checked = $ref(true);
</script>
<style scoped>
  .switch {
    background-color: #151515;
    height: 28px;
    line-height: 28px;
    min-width: 55px;
  }
  .switch:deep(.ant-switch-handle) {
    color: red;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
