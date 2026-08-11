# Upload png file only

## Description (en-US)

`beforeUpload` only prevent upload behavior when return false or reject promise, the prevented file would still show in file list. Here is the example you can keep prevented files out of list by return `UPLOAD.LIST_IGNORE`.

## Source

```vue
<script setup lang="ts">
import type { UploadEmits, UploadProps } from 'antdv-next'
import { UploadOutlined } from '@antdv-next/icons'
import { message, Upload } from 'antdv-next'

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isPng = file.type === 'image/png'
  if (!isPng) {
    message.error(`${file.name} is not a png file`)
  }
  return isPng || Upload.LIST_IGNORE
}

const handleChange: UploadEmits['change'] = (info) => {
  console.log(info.fileList)
}
</script>

<template>
  <a-upload :before-upload="beforeUpload" @change="handleChange">
    <a-button>
      <template #icon>
        <UploadOutlined />
      </template>
      Upload png only
    </a-button>
  </a-upload>
</template>
```
