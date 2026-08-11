# Crop image before uploading

## Description (en-US)

Use [antd-img-crop](https://github.com/nanxiaobei/antd-img-crop) to crop image before uploading.

## Source

```vue
<script setup lang="ts">
import type { UploadEmits, UploadFile, UploadProps } from 'antdv-next'
import { ref } from 'vue'

type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0]

const fileList = ref<UploadFile[]>([
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
])

function getBase64(file: FileType) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function cropToSquare(file: FileType) {
  if (!file.type.startsWith('image/')) {
    return file
  }
  const dataUrl = await getBase64(file)
  const img = await loadImage(dataUrl)
  const size = Math.min(img.width, img.height)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return file
  }
  const startX = (img.width - size) / 2
  const startY = (img.height - size) / 2
  ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size)
  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(file as File)
        return
      }
      resolve(new File([blob], file.name, { type: file.type || 'image/png' }))
    }, file.type || 'image/png')
  })
}

const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
  return cropToSquare(file)
}

const handleChange: UploadEmits['change'] = ({ fileList: newFileList }) => {
  fileList.value = newFileList
}

async function handlePreview(file: UploadFile) {
  let src = file.url as string
  if (!src && file.originFileObj) {
    src = await getBase64(file.originFileObj as FileType)
  }
  const image = new Image()
  image.src = src
  const imgWindow = window.open(src)
  imgWindow?.document.write(image.outerHTML)
}
</script>

<template>
  <a-upload
    v-model:file-list="fileList"
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    list-type="picture-card"
    :before-upload="beforeUpload"
    :on-preview="handlePreview"
    @change="handleChange"
  >
    <template v-if="fileList.length < 5">
      + Upload
    </template>
  </a-upload>
</template>
```
