# Upload directory

## Description (en-US)

You can select and upload a whole directory. [Can still select files when uploading a folder in Safari?](#can-still-select-files-when-uploading-a-folder-in-safari)

## Source

```vue
<script setup lang="ts">
import { UploadOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-upload action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" directory>
    <a-button>
      <template #icon>
        <UploadOutlined />
      </template>
      Upload Directory
    </a-button>
  </a-upload>
</template>
```
