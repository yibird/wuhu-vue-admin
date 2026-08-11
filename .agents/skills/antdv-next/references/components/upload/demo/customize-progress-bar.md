# Customize Progress Bar

## Description (en-US)

Use `progress` for customize progress bar.

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

function formatPercent(percent?: number) {
  return percent && `${Number.parseFloat(percent.toFixed(2))}%`
}
</script>

<template>
  <a-upload
    name="file"
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    :headers="{
      authorization: 'authorization-text',
    }"
    :progress="{
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      size: 3,
      format: formatPercent,
    }"
    @change="handleChange"
  >
    <a-button>
      <template #icon>
        <UploadOutlined />
      </template>
      Click to Upload
    </a-button>
  </a-upload>
</template>
```
