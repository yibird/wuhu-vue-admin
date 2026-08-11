# Paste

## Description (en-US)

Copy the file and paste it anywhere on the page to upload.

## Source

```vue
<script setup lang="ts">
import type { UploadEmits } from 'antdv-next'
import { UploadOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next'

const handleChange: UploadEmits['change'] = (info) => {
  if (info.file?.status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (info.file?.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`)
  }
  else if (info.file?.status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}
</script>

<template>
  <a-upload
    name="file"
    pastable
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    :headers="{
      authorization: 'authorization-text',
    }"
    @change="handleChange"
  >
    <a-button>
      <template #icon>
        <UploadOutlined />
      </template>
      Paste or click to upload
    </a-button>
  </a-upload>
</template>
```
