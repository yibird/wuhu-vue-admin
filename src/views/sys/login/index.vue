<template>
  <div class="full bg-[#F3F7FA] grid-center">
    <div class="login-container">
      <div class="flex flex-col w-280 h-full px-30 bg-white border-0 border-solid border-r-1 border-[#eee]">
        <div class="py-20">
          <div class="flex-center">
            <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            class="w-30 h-30" />
          <span class="ml-10 text-18">Wuhu-vue-admin</span>
          </div>
          <p class="py-10 text-center text-[#999] font-light">一个还不错的Admin</p>
        </div>
        <div class="flex-1 flex-col-center" >
          <img class="h-280" src="/@/assets/images/login-bg.png"/>
        </div>
      </div>
      <div class="flex-center h-full bg-white">
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
  @apply flex items-center h-500 shadow-xl overflow-hidden rounded-[6px];
}
.login-container .ant-tabs .ant-tabs-content {
  height: 100%;
  position: relative;
}
</style>
