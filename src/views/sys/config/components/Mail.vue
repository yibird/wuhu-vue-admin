<script setup lang="ts">
import { useSystemConfig } from '../composables'
import ConfigPanel from './ConfigPanel.vue'

interface MailConfigForm {
  provider: string
  host: string
  port: number
  encryption: string
  username: string
  password: string
  senderName: string
  senderEmail: string
}

const providerOptions = [
  { label: '自建 SMTP', value: 'smtp' },
  { label: '阿里云邮件推送', value: 'aliyun' },
  { label: '腾讯企业邮', value: 'tencent' },
]

const encryptionOptions = [
  { label: 'SSL/TLS', value: 'ssl' },
  { label: 'STARTTLS', value: 'starttls' },
  { label: '不加密', value: 'none' },
]

const { form, save, reset } = useSystemConfig<MailConfigForm>({
  key: 'mail',
  label: '邮箱配置',
  defaults: {
    provider: 'smtp',
    host: 'smtp.example.com',
    port: 465,
    encryption: 'ssl',
    username: '',
    password: '',
    senderName: 'Wuhu Admin',
    senderEmail: 'noreply@example.com',
  },
})
</script>

<template>
  <ConfigPanel
    description="配置系统邮件通知所使用的发送通道与发件人信息。"
    icon="i-lucide:mail"
    title="邮箱配置"
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
        <a-form-item label="邮件服务商" name="provider">
          <a-select v-model:value="form.provider" :options="providerOptions" />
        </a-form-item>
        <a-form-item label="加密方式" name="encryption">
          <a-select
            v-model:value="form.encryption"
            :options="encryptionOptions"
          />
        </a-form-item>
        <a-form-item label="SMTP 主机" name="host">
          <a-input v-model:value="form.host" allow-clear />
        </a-form-item>
        <a-form-item label="端口" name="port">
          <a-input-number
            v-model:value="form.port"
            class="w-full"
            :max="65535"
            :min="1"
          />
        </a-form-item>
        <a-form-item label="登录账号" name="username">
          <a-input v-model:value="form.username" allow-clear />
        </a-form-item>
        <a-form-item label="登录密码或授权码" name="password">
          <a-input-password v-model:value="form.password" allow-clear />
        </a-form-item>
        <a-form-item label="发件人名称" name="senderName">
          <a-input v-model:value="form.senderName" allow-clear />
        </a-form-item>
        <a-form-item label="发件人邮箱" name="senderEmail">
          <a-input v-model:value="form.senderEmail" allow-clear />
        </a-form-item>
      </div>
    </a-form>
  </ConfigPanel>
</template>
