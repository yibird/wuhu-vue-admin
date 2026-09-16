<script setup lang="ts">
import { useSystemConfig } from '../composables'
import ConfigPanel from './ConfigPanel.vue'

interface OssConfigForm {
  provider: string
  endpoint: string
  region: string
  bucket: string
  accessKeyId: string
  accessKeySecret: string
  publicDomain: string
  pathPrefix: string
}

const providerOptions = [
  { label: '阿里云 OSS', value: 'aliyun-oss' },
  { label: '腾讯云 COS', value: 'tencent-cos' },
  { label: 'AWS S3', value: 'aws-s3' },
  { label: 'MinIO', value: 'minio' },
]

const { form, save, reset } = useSystemConfig<OssConfigForm>({
  key: 'oss',
  label: '存储配置',
  defaults: {
    provider: 'aliyun-oss',
    endpoint: '',
    region: '',
    bucket: '',
    accessKeyId: '',
    accessKeySecret: '',
    publicDomain: '',
    pathPrefix: 'uploads/',
  },
})
</script>

<template>
  <ConfigPanel
    description="设置附件、图片与导出文件使用的对象存储服务。"
    icon="i-lucide:hard-drive"
    title="存储配置"
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
        <a-form-item label="对象存储服务商" name="provider">
          <a-select v-model:value="form.provider" :options="providerOptions" />
        </a-form-item>
        <a-form-item label="区域" name="region">
          <a-input
            v-model:value="form.region"
            allow-clear
            placeholder="例如：cn-hangzhou"
          />
        </a-form-item>
        <a-form-item label="Endpoint" name="endpoint">
          <a-input
            v-model:value="form.endpoint"
            allow-clear
            placeholder="https://oss.example.com"
          />
        </a-form-item>
        <a-form-item label="Bucket" name="bucket">
          <a-input v-model:value="form.bucket" allow-clear />
        </a-form-item>
        <a-form-item label="Access Key ID" name="accessKeyId">
          <a-input v-model:value="form.accessKeyId" allow-clear />
        </a-form-item>
        <a-form-item label="Access Key Secret" name="accessKeySecret">
          <a-input-password v-model:value="form.accessKeySecret" allow-clear />
        </a-form-item>
        <a-form-item label="公开访问域名" name="publicDomain">
          <a-input
            v-model:value="form.publicDomain"
            allow-clear
            placeholder="https://cdn.example.com"
          />
        </a-form-item>
        <a-form-item label="文件路径前缀" name="pathPrefix">
          <a-input v-model:value="form.pathPrefix" allow-clear />
        </a-form-item>
      </div>
    </a-form>
  </ConfigPanel>
</template>
