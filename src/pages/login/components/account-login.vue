<template>
  <n-form ref="formRef" label-placement="left" :model="formData" :rules="rules">
    <n-form-item path="account">
      <n-input
        v-model:value="formData.account"
        size="large"
        :placeholder="$t('login.inputAccount')"
      >
        <template #prefix>
          <Icon name="i-lucide:shield-user" :size="18" color="#666" />
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="password">
      <n-input
        v-model:value="formData.password"
        size="large"
        type="password"
        show-password-on="click"
        :placeholder="$t('login.inputPassword')"
      >
        <template #prefix>
          <Icon name="i-lucide:lock-keyhole" :size="18" color="#666" />
        </template>
      </n-input>
    </n-form-item>
  </n-form>
  <div class="flex justify-between">
    <n-checkbox>{{ $t('login.rememberMe') }}</n-checkbox>
    <a class="text-theme cursor-pointer">{{ $t('login.forgetPassword') }}</a>
  </div>
  <div class="flex flex-col gap-15">
    <n-button
      type="primary"
      size="large"
      block
      class="mt-20"
      @click="onSubmit"
      >{{ $t('login.submit') }}</n-button
    >
    <div class="flex justify-between gap-20">
      <n-button class="flex-1">{{ $t('login.mobileLogin') }}</n-button>
      <n-button class="flex-1">{{ $t('login.scanLogin') }}</n-button>
    </div>
    <div>
      <n-divider class="text-sm! text-secondary! font-normal!">{{
        $t('login.loginMode')
      }}</n-divider>
      <div class="flex justify-center gap-10">
        <n-tooltip v-for="item in items" :key="item.value">
          <template #trigger>
            <button
              class="span-button size-36 rounded-full transition hover:bg-gray-100"
            >
              <Icon :name="item.icon" :size="20" />
            </button>
          </template>
          <span>{{ item.label }}</span>
        </n-tooltip>
      </div>
    </div>
    <div class="text-center">
      <span>{{ $t('login.noAccount') }}</span>
      <a class="ml-4 text-theme cursor-pointer">{{ $t('login.register') }}</a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FormInst } from 'naive-ui'
import type { LoginEmits } from './types'

const items = [
  {
    label: '微信',
    value: 'wechat',
    icon: 'i-lucide:bot-message-square',
  },
  {
    label: 'QQ',
    value: 'qq',
    icon: 'i-lucide:bot-message-square',
  },
  {
    label: 'github',
    value: 'github',
    icon: 'i-lucide:github',
  },
  {
    label: 'google',
    value: 'google',
    icon: 'i-lucide:grip-horizontal',
  },
]

const emits = defineEmits<LoginEmits>()
const { t } = useI18n()
const formRef = ref<FormInst | null>(null)
const formData = ref({
  account: '',
  password: '',
})
const rules = {
  account: {
    required: true,
    message: t('login.inputAccount'),
    trigger: ['blur'],
  },
  password: {
    required: true,
    message: t('login.inputPassword'),
    trigger: ['blur'],
  },
}

const onSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      emits('success')
      return
    }
  })
}
</script>
