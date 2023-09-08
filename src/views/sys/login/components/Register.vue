<template>
  <a-form class="w-300">
    <a-form-item>
      <a-input size="large" placeholder="请输入手机号">
        <template #prefix>
          <Icon name="ri-smartphone-line" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <div class="flex">
        <a-input class="mr-20" size="large" placeholder="请输入验证码">
          <template #prefix>
            <Icon name="ri-shield-keyhole-line" />
          </template>
        </a-input>
        <a-button size="large">获取验证码</a-button>
      </div>
    </a-form-item>
    <div class="text-right">
      <a-button class="!p-0" type="link" size="small">收不到验证码?</a-button>
    </div>
    <div class="my-15">
      <a-button size="large" type="primary" block>注册</a-button>
    </div>
    <div class="text-right">
      <a-button @click="toLogin" class="!p-0" type="link" size="small"
        >去登录</a-button
      >
    </div>
  </a-form>
</template>
<script setup lang="ts">
const emit = defineEmits<{ (e: "action", key: string): void }>();
const toLogin = () => {
  emit("action", "account");
};
</script>
