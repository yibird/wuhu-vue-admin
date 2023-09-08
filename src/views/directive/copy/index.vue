<template>
  <a-button v-copy="[text, handleCopySuccess, handleCopyFail]"> copy text </a-button>
  <input v-model="text" />
</template>
<script setup lang="ts">
  import { ref } from "vue";
  import { message } from "ant-design-vue";
  const text = ref("你是一头猪");
  function handleCopySuccess() {
    message.success("Copy Success");
  }
  function handleCopyFail() {
    message.error("Copy Fail");
  }
</script>
