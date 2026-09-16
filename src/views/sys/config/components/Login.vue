<script setup lang="ts">
import { useSystemConfig } from '../composables'
import ConfigPanel from './ConfigPanel.vue'

interface LoginConfigForm {
  allowRegistration: boolean
  loginMethods: string[]
  rememberMeDays: number
  defaultRole: string
  loginTitle: string
  loginSubtitle: string
}

const loginMethodOptions = [
  { label: '账号密码', value: 'account' },
  { label: '邮箱验证码', value: 'email' },
  { label: '手机验证码', value: 'phone' },
  { label: '企业 SSO', value: 'sso' },
]

const roleOptions = [
  { label: '普通成员', value: 'member' },
  { label: '访客', value: 'guest' },
  { label: '运营人员', value: 'operator' },
]

const { form, save, reset } = useSystemConfig<LoginConfigForm>({
  key: 'login',
  label: '登录配置',
  defaults: {
    allowRegistration: false,
    loginMethods: ['account'],
    rememberMeDays: 7,
    defaultRole: 'member',
    loginTitle: 'Wuhu Admin',
    loginSubtitle: '欢迎回来，请登录你的工作台',
  },
})
</script>

<template>
  <ConfigPanel
    description="设置登录页文案、账号创建策略和可用认证方式。"
    icon="i-lucide:log-in"
    title="登录配置"
    @reset="reset"
    @save="save"
  >
    <a-form
      :label-col="{ flex: '136px' }"
      :model="form"
      :wrapper-col="{ flex: '1 1 0' }"
      layout="horizontal"
    >
      <div class="grid grid-cols-1 gap-x-16 md:grid-cols-2">
        <a-form-item label="开放用户注册" name="allowRegistration">
          <a-switch v-model:checked="form.allowRegistration" />
        </a-form-item>
        <a-form-item label="记住登录时长（天）" name="rememberMeDays">
          <a-input-number
            v-model:value="form.rememberMeDays"
            class="w-full"
            :max="90"
            :min="1"
          />
        </a-form-item>
        <a-form-item label="默认角色" name="defaultRole">
          <a-select v-model:value="form.defaultRole" :options="roleOptions" />
        </a-form-item>
      </div>

      <a-form-item label="可用登录方式" name="loginMethods">
        <a-checkbox-group v-model:value="form.loginMethods">
          <div class="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <a-checkbox
              v-for="item in loginMethodOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-checkbox>
          </div>
        </a-checkbox-group>
      </a-form-item>

      <a-form-item label="登录页标题" name="loginTitle">
        <a-input v-model:value="form.loginTitle" allow-clear />
      </a-form-item>
      <a-form-item label="登录页副标题" name="loginSubtitle">
        <a-input v-model:value="form.loginSubtitle" allow-clear />
      </a-form-item>
    </a-form>
  </ConfigPanel>
</template>
