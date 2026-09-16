<script setup lang="ts">
import { useSystemConfig } from '../composables'
import ConfigPanel from './ConfigPanel.vue'

interface SecurityConfigForm {
  passwordMinLength: number
  passwordExpiresDays: number
  maxLoginFailures: number
  lockDurationMinutes: number
  enableCaptcha: boolean
  singleSession: boolean
  trustedIps: string[]
}

const { form, save, reset } = useSystemConfig<SecurityConfigForm>({
  key: 'security',
  label: '安全配置',
  defaults: {
    passwordMinLength: 8,
    passwordExpiresDays: 90,
    maxLoginFailures: 5,
    lockDurationMinutes: 30,
    enableCaptcha: true,
    singleSession: false,
    trustedIps: [],
  },
})
</script>

<template>
  <ConfigPanel
    description="控制账号凭据、登录保护和受信任访问范围。"
    icon="i-lucide:shield-check"
    title="安全配置"
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
        <a-form-item label="密码最小长度" name="passwordMinLength">
          <a-input-number
            v-model:value="form.passwordMinLength"
            class="w-full"
            :max="64"
            :min="6"
          />
        </a-form-item>
        <a-form-item label="密码有效期（天）" name="passwordExpiresDays">
          <a-input-number
            v-model:value="form.passwordExpiresDays"
            class="w-full"
            :max="3650"
            :min="0"
          />
        </a-form-item>
        <a-form-item label="最大连续失败次数" name="maxLoginFailures">
          <a-input-number
            v-model:value="form.maxLoginFailures"
            class="w-full"
            :max="20"
            :min="1"
          />
        </a-form-item>
        <a-form-item label="锁定时长（分钟）" name="lockDurationMinutes">
          <a-input-number
            v-model:value="form.lockDurationMinutes"
            class="w-full"
            :max="1440"
            :min="1"
          />
        </a-form-item>
      </div>

      <div class="grid grid-cols-1 gap-x-16 md:grid-cols-2">
        <a-form-item label="登录验证码" name="enableCaptcha">
          <a-switch v-model:checked="form.enableCaptcha" />
        </a-form-item>
        <a-form-item label="限制单端登录" name="singleSession">
          <a-switch v-model:checked="form.singleSession" />
        </a-form-item>
      </div>

      <a-form-item
        extra="输入 IP 或网段后按回车确认，留空表示不限制来源。"
        label="受信任 IP"
        name="trustedIps"
      >
        <a-select
          v-model:value="form.trustedIps"
          allow-clear
          mode="tags"
          placeholder="例如：10.0.0.0/24"
        />
      </a-form-item>
    </a-form>
  </ConfigPanel>
</template>
