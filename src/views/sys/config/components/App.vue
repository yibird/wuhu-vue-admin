<script setup lang="ts">
import { useSystemConfig } from '../composables'
import ConfigPanel from './ConfigPanel.vue'

interface AppConfigForm {
  siteName: string
  siteUrl: string
  description: string
  supportEmail: string
  copyright: string
  recordNumber: string
  enabled: boolean
  maintenanceMode: boolean
  maintenanceMessage: string
}

const { form, save, reset } = useSystemConfig<AppConfigForm>({
  key: 'app',
  label: '网站配置',
  defaults: {
    siteName: 'Wuhu Admin',
    siteUrl: 'https://admin.example.com',
    description: '面向企业团队的统一管理平台',
    supportEmail: 'support@example.com',
    copyright: 'Copyright 2026 Wuhu Admin',
    recordNumber: '',
    enabled: true,
    maintenanceMode: false,
    maintenanceMessage: '系统维护中，请稍后再试。',
  },
})
</script>

<template>
  <ConfigPanel
    description="管理站点对外展示信息与服务状态。"
    icon="i-lucide:panels-top-left"
    title="网站配置"
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
        <a-form-item label="站点名称" name="siteName">
          <a-input v-model:value="form.siteName" allow-clear />
        </a-form-item>
        <a-form-item label="站点地址" name="siteUrl">
          <a-input v-model:value="form.siteUrl" allow-clear />
        </a-form-item>
        <a-form-item label="支持邮箱" name="supportEmail">
          <a-input v-model:value="form.supportEmail" allow-clear />
        </a-form-item>
        <a-form-item label="备案号" name="recordNumber">
          <a-input
            v-model:value="form.recordNumber"
            allow-clear
            placeholder="选填"
          />
        </a-form-item>
      </div>

      <a-form-item label="站点简介" name="description">
        <a-textarea
          v-model:value="form.description"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          :maxlength="200"
          show-count
        />
      </a-form-item>
      <a-form-item label="版权信息" name="copyright">
        <a-input v-model:value="form.copyright" allow-clear />
      </a-form-item>

      <div class="grid grid-cols-1 gap-x-16 md:grid-cols-2">
        <a-form-item label="启用站点" name="enabled">
          <a-switch v-model:checked="form.enabled" />
        </a-form-item>
        <a-form-item label="维护模式" name="maintenanceMode">
          <a-switch v-model:checked="form.maintenanceMode" />
        </a-form-item>
      </div>
      <a-form-item
        v-if="form.maintenanceMode"
        label="维护提示"
        name="maintenanceMessage"
      >
        <a-textarea
          v-model:value="form.maintenanceMessage"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :maxlength="120"
          show-count
        />
      </a-form-item>
    </a-form>
  </ConfigPanel>
</template>
