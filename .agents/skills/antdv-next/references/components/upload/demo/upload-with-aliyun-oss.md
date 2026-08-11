# Aliyun OSS

## Description (en-US)

Use Aliyun OSS upload example.

## Source

```vue
<script setup lang="ts">
import type { UploadEmits, UploadFile, UploadProps } from 'antdv-next'
import { UploadOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next'
import { onMounted, ref } from 'vue'

interface OSSDataType {
  dir: string
  expire: string
  host: string
  accessId: string
  policy: string
  signature: string
}

const fileList = ref<UploadFile[]>([])
const ossData = ref<OSSDataType | null>(null)

function mockOSSData() {
  return Promise.resolve({
    dir: 'user-dir/',
    expire: '1577811661',
    host: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    accessId: 'c2hhb2RhaG9uZw==',
    policy: 'eGl4aWhhaGFrdWt1ZGFkYQ==',
    signature: 'ZGFob25nc2hhbw==',
  })
}

async function init() {
  try {
    ossData.value = await mockOSSData()
  }
  catch (err) {
    if (err instanceof Error) {
      message.error(err.message)
    }
  }
}

onMounted(() => {
  init()
})

const handleChange: UploadEmits['change'] = ({ fileList: newFileList }) => {
  console.log('Aliyun OSS:', newFileList)
  fileList.value = [...newFileList]
}

const handleRemove: UploadProps['onRemove'] = (file) => {
  fileList.value = fileList.value.filter(item => item.url !== file.url)
}

const getExtraData: UploadProps['data'] = file => ({
  key: file.url,
  OSSAccessKeyId: ossData.value?.accessId,
  policy: ossData.value?.policy,
  Signature: ossData.value?.signature,
})

const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
  if (!ossData.value) {
    return false
  }

  const expire = Number(ossData.value.expire) * 1000
  if (expire < Date.now()) {
    await init()
  }

  const suffix = file.name.slice(file.name.lastIndexOf('.'))
  const filename = Date.now() + suffix
  ;(file as UploadFile).url = ossData.value.dir + filename

  return file
}
</script>

<template>
  <a-form :label-col="{ span: 4 }">
    <a-form-item label="Photos" name="photos">
      <a-upload
        v-model:file-list="fileList"
        name="file"
        :action="ossData?.host"
        :data="getExtraData"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        @change="handleChange"
      >
        <a-button>
          <template #icon>
            <UploadOutlined />
          </template>
          Click to Upload
        </a-button>
      </a-upload>
    </a-form-item>
  </a-form>
</template>
```
