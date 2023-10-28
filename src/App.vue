<template>
  <a-config-provider :locale="locale" :theme="theme">
    <RouterView />
  </a-config-provider>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import zh_CN from 'ant-design-vue/es/locale/zh_CN';

  const { locale, theme } = reactive({
    locale: zh_CN,
    theme: {
      token: {
        colorPrimary: '#1677ff',
        borderRadius: '4px',
      },
    },
  });
</script>
