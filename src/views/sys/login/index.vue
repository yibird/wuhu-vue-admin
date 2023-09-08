<template>
  <div class="full bg-[#F3F7FA] grid-center">
    <div class="login-container shadow-xl">
      <div class="w-240 h-full bg-[#1890FF]"></div>
      <div class="bg-white h-full">
        <div class="text-center py-15">
          <div class="text-[18px] font-[500] text-[#1890FF]">wuhu-admin</div>
          <div class="text-[#999] text-[13px]">一个还不错的Admin</div>
        </div>
        <div class="px-100">
          <a-tabs v-model:activeKey="activeMode" centered class="h-full w-300">
            <a-tab-pane
              v-for="item in loginModes"
              :key="item.key"
              :tab="item.title"
            >
              <div class="py-40 h-full">
                <component @action="actionHandle" :is="item.component" />
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import AccountLogin from "./components/AccountLogin.vue";
import QRCodeLoginVue from "./components/QRCodeLogin.vue";
import Register from "./components/Register.vue";
let activeMode = $ref("account");
const loginModes = [
  {
    key: "account",
    title: "账号登录",
    component: AccountLogin,
  },
  {
    key: "qrcode",
    title: "二维码登录",
    component: QRCodeLoginVue,
  },
  {
    key: "register",
    title: "注册",
    component: Register,
  },
];
const actionHandle = (key: string) => {
  activeMode = key;
};
</script>
<style>
.login-container {
  @apply flex-center h-[500px];
}
.login-container .ant-tabs .ant-tabs-content {
  height: 100%;
  position: relative;
}
</style>
