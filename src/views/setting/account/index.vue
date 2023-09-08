<template>
  <a-row :gutter="10" class="full">
    <a-col :span="6">
      <UserInfo />
    </a-col>
    <a-col :span="18">
      <UserSetting />
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
  import UserInfo from './components/UserInfo.vue';
  import UserSetting from './components/userSetting/index.vue';
</script>
