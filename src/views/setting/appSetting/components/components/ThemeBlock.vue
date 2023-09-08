<!-- 主题块 -->
<template>
  <space wrap :size="8">
    <div
      v-for="item in themes"
      :key="item"
      @click="changeHandle(item)"
      :style="getStyle(item)"
      class="flex-center w-[20px] h-[20px] box-content rounded-[2px] cursor-pointer"
    >
      <icon name="ri-check-line" :size="16" color="#fff" />
    </div>
  </space>
</template>
<script setup lang="ts">
  import { CSSProperties } from "vue";

  const { themes = [] } = defineProps<{ themes: string[] }>();
  const emits = defineEmits<{ (e: "change", theme: string): void }>();
  const changeHandle = (item: string) => {
    emits("change", item);
  };
  const getStyle = (item: string): CSSProperties => {
    const whiteColors = ["#fff", "white"];
    return {
      backgroundColor: item,
      border: "1px solid",
      borderColor: whiteColors.includes(item) ? "#000" : "#ddd",
    };
  };
</script>
