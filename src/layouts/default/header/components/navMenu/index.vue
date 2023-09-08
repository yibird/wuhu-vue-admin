<template>
  <ul class="h-full flex">
    <li>
      <icon :size="18" name="ri-search-line" />
    </li>
    <a-tooltip>
      <template #title>锁屏</template>
      <li @click="gotoLockScreen">
        <icon :size="18" name="ri-lock-line" />
      </li>
    </a-tooltip>
    <li @click="openMessagePannel">
      <icon :size="18" name="ri-notification-line" />
    </li>
    <Account />
    <a-tooltip>
      <template #title>退出全屏</template>
      <li>
        <icon :size="18" name="ri-fullscreen-exit-line" />
      </li>
    </a-tooltip>
    <Language />
    <li @click="openSettings">
      <icon :size="18" name="ri-settings-line" />
    </li>
    <AppSetting v-model:visible="settingVisible" />
    <MessagePannel v-model:visible="messageVisible" />
  </ul>
</template>
<script setup lang="ts">
  import { reactive, toRefs } from "vue";
  import { useRouter } from "vue-router";
  import { useGo } from "/@/hooks/web/usePage";
  import Account from "./Account.vue";
  import Language from "./Language.vue";
  import AppSetting from "/@/views/setting/appSetting/index.vue";
  import MessagePannel from "/@/views/setting/messagePanel/index.vue";
  const router = useRouter();
  const go = useGo(router);

  const config = reactive({
    settingVisible: false,
    messageVisible: false,
  });
  const { settingVisible, messageVisible } = toRefs(config);
  const gotoLockScreen = () => {
    go("/lockScreen");
  };
  const openSettings = () => {
    Object.assign(config, { settingVisible: true });
  };
  const openMessagePannel = () => {
    config.messageVisible = true;
  };
</script>
<style scoped>
  :deep(li) {
    @apply inline-block hover:bg-[#f6f6f6] px-8 cursor-pointer;
  }
</style>
