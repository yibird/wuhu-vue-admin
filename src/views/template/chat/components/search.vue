<template>
  <div
    class="h-60 flex items-center justify-between gap-10 p-10 border-b-1 border-solid border-[#E8E8E8]"
  >
    <n-input v-model:value="searchValue" placeholder="请输入" clearable>
      <template #prefix>
        <Icon name="i-lucide:search" :size="16" class="text-regular" />
      </template>
    </n-input>
    <button
      class="h-34 px-8 flex items-center justify-center bg-[#eee] rounded-2 cursor-pointer"
    >
      <Icon name="i-lucide:plus" :size="18" />
    </button>
  </div>
</template>
<script lang="ts" setup>
const searchValue = ref('')
</script>
