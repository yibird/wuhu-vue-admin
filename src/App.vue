<template>
  <a-config-provider :locale="locale">
    <RouterView />
  </a-config-provider>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import zh_CN from 'ant-design-vue/es/locale/zh_CN';

  const { locale } = reactive({
    locale: zh_CN,
  });

  ConfigProvider.config({
    theme: {
      primaryColor: '',
    },
  });
</script>
<style scoped></style>
