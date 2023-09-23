<!-- 锁屏 -->
<template>
  <div class="full overflow-hidden relative bg-black text-white">
    <div class="content">
      <div>
        <icon @click="visible = true" name="ri-lock-fill" />
      </div>
      <Chart />
      <div>充电中...</div>
    </div>
    <div class="footer">
      <div>
        <div class="text-[36px] mb-[10px]">11:39</div>
        <div class="text-[26px]">10月28号，星期五</div>
      </div>
      <ul class="footer-tool">
        <li>
          <icon name="ri-wifi-fill" />
        </li>
        <li>
          <icon name="ri-links-line" />
        </li>
      </ul>
    </div>
    <Unlock v-model:visible="visible" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from "vue";
  import Chart from "./components/Chart.vue";
  import Unlock from "./components/Unlock.vue";

  const visible = ref(false);
</script>
<style scoped>
  .content {
    @apply flex items-center flex-col py-[50px] text-[24px];
  }
  .footer {
    @apply absolute bottom-[20px] w-full p-20 flex justify-between;
  }
  .footer-tool {
    @apply self-end flex text-[20px];
  }
  .footer-tool li {
    margin-left: 10px;
  }
</style>
