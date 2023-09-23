<template>
  <a-form
    ref="formRef"
    :model="formData"
    :rules="accountRule"
    @keypress.enter="loginHandle"
  >
    <a-form-item name="account">
      <a-input
        v-model:value="formData.account"
        size="large"
        placeholder="请输入账号(wuhu_1)"
      >
        <template #prefix>
          <Icon name="ri-user-5-line" color="#666" :size="18" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item name="password">
      <a-input-password
        v-model:value="formData.password"
        size="large"
        placeholder="请输入密码(123123)"
      >
        <template #prefix>
          <Icon name="ri-lock-line" color="#666" :size="18" />
        </template>
      </a-input-password>
    </a-form-item>
    <div class="text-right">
      <a-button type="link" size="small">忘记密码?</a-button>
    </div>
    <div class="mt-15 mb-20">
      <a-button size="large" type="primary" block @click="loginHandle"
        >登录</a-button
      >
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <span>其他登录账号</span>
        <a-space class="px-5">
          <a-tooltip placement="bottom" v-for="item in modes" :key="item.icon">
            <template #title>{{ item.title }}</template>
            <Icon
              color="#999"
              :hoverColor="item.color"
              :name="item.icon"
              :size="24"
            />
          </a-tooltip>
        </a-space>
      </div>
      <a-button @click="toRegister" class="!p-0" type="link" size="small"
        >立即注册</a-button
      >
    </div>
  </a-form>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { useFormValid } from "../useLogin";
import { accountRule } from "../rules";
import { useUserStore } from "/@/store";
const modes = [
  {
    icon: "ri-qq-line",
    color: "#1890FF",
    title: "QQ",
  },
  {
    icon: "ri-wechat-fill",
    color: "#05D167",
    title: "Wechat",
  },
  {
    icon: "ri-github-fill",
    color: "#000",
    title: "Github",
  },
];
const emit = defineEmits<{ (e: "action", key: string): void }>();

const formRef = ref();
const formData = reactive({
  account: "wuhu_1",
  password: "123123",
});

const { login } = useUserStore();

const { validForm } = useFormValid(formRef);

const toRegister = () => emit("action", "register");

const loginHandle = async () => {
  const data = await validForm();
  const userInfo = await login(data);
  // console.log("userInfo:", userInfo);
};
</script>
