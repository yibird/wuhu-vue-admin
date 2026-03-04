<template>
  <div
    class="h-40 px-10 flex items-center border-b border-b-solid border-[#eee] overflow-hidden"
  >
    <Icon name="i-lucide:search" :size="18" class="text-[#999]" />
    <input
      v-model="value"
      placeholder="请输入搜索内容"
      class="h-full flex-1 px-10 py-0 border-transparent outline-none border-none"
    />
    <Icon
      v-if="showClear"
      name="i-lucide:x"
      :size="18"
      class="text-[#999] cursor-pointer hover:text-[#333]"
      @click="onClear"
    />
  </div>
</template>
<script setup lang="ts">
const value = defineModel<string>({ default: '' })
const showClear = computed(() => value.value?.trim().length > 0)
const onClear = () => {
  value.value = ''
}
</script>
