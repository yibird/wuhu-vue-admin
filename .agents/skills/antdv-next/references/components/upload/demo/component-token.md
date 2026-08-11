# Component Token

## Description (en-US)

Component Token Debug.

## Source

```vue
<script setup lang="ts">
import type { UploadEmits, UploadFile } from 'antdv-next'
import { UploadOutlined } from '@antdv-next/icons'

const defaultFileList: UploadFile[] = [
  {
    uid: '1',
    name: 'xxx.png',
    status: 'uploading',
    url: 'http://www.baidu.com/xxx.png',
    percent: 33,
  },
  {
    uid: '2',
    name: 'yyy.png',
    status: 'done',
    url: 'http://www.baidu.com/yyy.png',
  },
  {
    uid: '3',
    name: 'zzz.png',
    status: 'error',
    response: 'Server Error 500',
    url: 'http://www.baidu.com/zzz.png',
  },
]

const handleChange: UploadEmits['change'] = ({ file, fileList }) => {
  if (file.status !== 'uploading') {
    console.log(file, fileList)
  }
}
</script>

<template>
  <a-config-provider
    :theme="{
      components: {
        Upload: {
          actionsColor: 'yellow',
        },
      },
    }"
  >
    <a-upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      :default-file-list="defaultFileList"
      @change="handleChange"
    >
      <a-button>
        <template #icon>
          <UploadOutlined />
        </template>
        Upload
      </a-button>
    </a-upload>
  </a-config-provider>
</template>
```
