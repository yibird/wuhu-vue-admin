<script setup lang="ts">
import { useSystemConfig } from '../composables'
import ConfigPanel from './ConfigPanel.vue'

interface SmsConfigForm {
  provider: string
  accessKey: string
  accessSecret: string
  signature: string
  loginTemplateId: string
  notificationTemplateId: string
}

const providerOptions = [
  { label: '阿里云短信', value: 'aliyun' },
  { label: '腾讯云短信', value: 'tencent' },
  { label: '华为云短信', value: 'huawei' },
]

const { form, save, reset } = useSystemConfig<SmsConfigForm>({
  key: 'sms',
  label: '短信配置',
  defaults: {
    provider: 'aliyun',
    accessKey: '',
    accessSecret: '',
    signature: '',
    loginTemplateId: '',
    notificationTemplateId: '',
  },
})
</script>

<template>
  <ConfigPanel
    description="配置验证码和业务通知使用的短信服务商凭据与模板。"
    icon="i-lucide:messages-square"
    title="短信配置"
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
        <a-form-item label="短信服务商" name="provider">
          <a-select v-model:value="form.provider" :options="providerOptions" />
        </a-form-item>
        <a-form-item label="短信签名" name="signature">
          <a-input
            v-model:value="form.signature"
            allow-clear
            placeholder="例如：Wuhu 管理平台"
          />
        </a-form-item>
        <a-form-item label="Access Key" name="accessKey">
          <a-input v-model:value="form.accessKey" allow-clear />
        </a-form-item>
        <a-form-item label="Access Secret" name="accessSecret">
          <a-input-password v-model:value="form.accessSecret" allow-clear />
        </a-form-item>
        <a-form-item label="登录验证码模板 ID" name="loginTemplateId">
          <a-input v-model:value="form.loginTemplateId" allow-clear />
        </a-form-item>
        <a-form-item label="通知短信模板 ID" name="notificationTemplateId">
          <a-input v-model:value="form.notificationTemplateId" allow-clear />
        </a-form-item>
      </div>
    </a-form>
  </ConfigPanel>
</template>
