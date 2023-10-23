<template>
  <div class="flex-center h-50 text-base text-white cursor-pointer">
    <img :src="imgUrl" class="w-36 h-32 mr-5" />
    <span v-if="!collapsed" class="truncate">{{ appName }}</span>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  const { collapsed } = defineProps<{ collapsed: boolean }>();
  let imgUrl = ref(
    'https://turbo.build/images/docs/pack/turbopack-hero-logo-dark.svg',
  );
  let appName = ref('Wuhu-vue-admin');
</script>
