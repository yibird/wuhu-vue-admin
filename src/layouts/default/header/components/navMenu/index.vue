<template>
  <ul class="flex-col-center h-full">
    <Search />
    <LockScreen />
    <Notice />
    <Account />
    <Fullscreen />
    <Language />
    <Setting />
  </ul>
</template>
<script setup lang="ts">
  import Search from './Search.vue';
  import LockScreen from './LockScreen.vue';
  import Notice from './Notice.vue';
  import Account from './Account.vue';
  import Fullscreen from './Fullscreen.vue';
  import Language from './Language.vue';
  import Setting from './Setting.vue';
</script>
<style scoped>
  :deep(li) {
    @apply flex items-center h-full hover:bg-[#f6f6f6] px-10 cursor-pointer;
  }
</style>
