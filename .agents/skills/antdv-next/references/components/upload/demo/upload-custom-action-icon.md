# Custom action icon and extra info

## Description (en-US)

Use `showUploadList` for custom action icons and extra information of files.

## Source

```vue
<script setup lang="ts">
import type { UploadEmits, UploadFile, UploadProps } from 'antdv-next'
import { StarOutlined, UploadOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const defaultFileList: UploadFile[] = [
  {
    uid: '1',
    name: 'xxx.png',
    size: 1234567,
    status: 'done',
    response: 'Server Error 500',
    url: 'http://www.baidu.com/xxx.png',
  },
  {
    uid: '2',
    name: 'yyy.png',
    size: 1234567,
    status: 'done',
    url: 'http://www.baidu.com/yyy.png',
  },
  {
    uid: '3',
    name: 'zzz.png',
    size: 1234567,
    status: 'error',
    response: 'Server Error 500',
    url: 'http://www.baidu.com/zzz.png',
  },
]

const handleChange: UploadEmits['change'] = ({ file, fileList }) => {
  if (file?.status !== 'uploading') {
    console.log(file, fileList)
  }
}

const showUploadList: UploadProps['showUploadList'] = {
  extra: ({ size = 0 }) => {
    return h('span', { style: { color: '#cccccc' } }, `(${(size / 1024 / 1024).toFixed(2)}MB)`)
  },
  showDownloadIcon: true,
  downloadIcon: 'Download',
  showRemoveIcon: true,
  removeIcon: h(StarOutlined, {
    onClick: (event: MouseEvent) => console.log(event, 'custom removeIcon event'),
  }),
}
</script>

<template>
  <a-upload
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    :default-file-list="defaultFileList"
    :show-upload-list="showUploadList"
    @change="handleChange"
  >
    <a-button>
      <template #icon>
        <UploadOutlined />
      </template>
      Upload
    </a-button>
  </a-upload>
</template>
```
