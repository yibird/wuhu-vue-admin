<script setup lang="ts">
import { useSystemConfig } from '../composables'
import ConfigPanel from './ConfigPanel.vue'

interface ClientConfigForm {
  sessionTimeoutMinutes: number
  fileSizeLimitMb: number
  allowedExtensions: string[]
  defaultPageSize: number
  enableUploadCompression: boolean
  clientVersion: string
  updateUrl: string
}

const pageSizeOptions = [10, 20, 50, 100].map((value) => ({
  label: `${value} 条/页`,
  value,
}))

const { form, save, reset } = useSystemConfig<ClientConfigForm>({
  key: 'client',
  label: '客户端配置',
  defaults: {
    sessionTimeoutMinutes: 60,
    fileSizeLimitMb: 20,
    allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'xlsx'],
    defaultPageSize: 20,
    enableUploadCompression: true,
    clientVersion: '1.0.0',
    updateUrl: '',
  },
})
</script>

<template>
  <ConfigPanel
    description="统一管理会话时长、上传限制、分页和客户端更新信息。"
    icon="i-lucide:monitor-cog"
    title="客户端配置"
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
        <a-form-item label="会话超时（分钟）" name="sessionTimeoutMinutes">
          <a-input-number
            v-model:value="form.sessionTimeoutMinutes"
            class="w-full"
            :max="1440"
            :min="5"
          />
        </a-form-item>
        <a-form-item label="单文件大小上限（MB）" name="fileSizeLimitMb">
          <a-input-number
            v-model:value="form.fileSizeLimitMb"
            class="w-full"
            :max="2048"
            :min="1"
          />
        </a-form-item>
        <a-form-item label="默认分页条数" name="defaultPageSize">
          <a-select
            v-model:value="form.defaultPageSize"
            :options="pageSizeOptions"
          />
        </a-form-item>
        <a-form-item label="上传时压缩图片" name="enableUploadCompression">
          <a-switch v-model:checked="form.enableUploadCompression" />
        </a-form-item>
        <a-form-item label="客户端版本" name="clientVersion">
          <a-input v-model:value="form.clientVersion" allow-clear />
        </a-form-item>
        <a-form-item label="更新地址" name="updateUrl">
          <a-input
            v-model:value="form.updateUrl"
            allow-clear
            placeholder="选填"
          />
        </a-form-item>
      </div>

      <a-form-item
        extra="输入扩展名后按回车确认，不包含点号。"
        label="允许上传的文件类型"
        name="allowedExtensions"
      >
        <a-select
          v-model:value="form.allowedExtensions"
          allow-clear
          mode="tags"
          placeholder="例如：pdf"
        />
      </a-form-item>
    </a-form>
  </ConfigPanel>
</template>
