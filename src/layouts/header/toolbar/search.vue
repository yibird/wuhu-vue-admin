<template>
  <div
    class="group h-34 w-150 px-10 mx-10 flex justify-between items-center bg-[#f5f5f5] rounded-30 cursor-pointer"
    @click="onClick"
  >
    <Icon name="i-lucide:search" class="text-secondary group-hover:text-regular" />
    <div class="flex-1 px-10 text-sm text-secondary whitespace-nowrap group-hover:text-regular"
      >搜索</div
    >
    <span
      class="inline-block py-2 px-5 text-10 text-secondary bg-white rounded-2 whitespace-nowrap group-hover:text-regular"
      >Ctrl K</span
    >
  </div>
  <SearchModal v-model:show="show" @close="show = false" />
</template>
<script lang="ts" setup>
import { SearchModal } from '@/layouts/config';
const show = ref(false);

const onClick = () => {
  show.value = true;
  console.log('asdasdasd');
};
</script>
