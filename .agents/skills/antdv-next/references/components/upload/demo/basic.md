# Upload by clicking

## Description (en-US)

Classic mode. File selection dialog pops up when upload button is clicked.

## Source

```vue
<script setup lang="ts">
import type { UploadEmits } from 'antdv-next'
import { UploadOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next'
import { ref } from 'vue'

const fileList = ref([])
const onChange: UploadEmits['change'] = (info) => {
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
    v-model:file-list="fileList"
    name="file"
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    :headers="{
      authorization: 'authorization-text',
    }"
    @change="onChange"
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
