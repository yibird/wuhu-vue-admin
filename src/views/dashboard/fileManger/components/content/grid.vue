<template>
  <n-grid :x-gap="10" :y-gap="10" responsive="screen" item-responsive class="max-h-full py-10">
    <n-gi v-for="item in items" :key="item.id" span="xs:8 s:6 md:6 lg:4 xl:2 xxl:2">
      <div class="flex items-center justify-center">
        <div
          class="group focus-within:scale-105 size-104 flex flex-col justify-between px-20 py-10 text-center rounded-4 overflow-hidden cursor-pointer hover:bg-[#e8f3ff]"
        >
          <div class="m-auto size-60 group-active:scale-90 transition">
            <img :src="getIcon(item)" class="size-60" />
          </div>
          <div class="truncate group-active:select-none">{{ getName(item.filename) }}</div>
        </div>
      </div>
    </n-gi>
  </n-grid>
</template>
<script lang="ts" setup>
  import type { FileItem } from '../types'
  import textIcon from '@/assets/svg/text.svg'
  import videoIcon from '@/assets/svg/video.svg'
  import mp3Icon from '@/assets/svg/mp3.svg'
  import zipIcon from '@/assets/svg/zip.svg'
  import xlsIcon from '@/assets/svg/xls.svg'
  import docIcon from '@/assets/svg/doc.svg'
  import pptIcon from '@/assets/svg/ppt.svg'
  import htmlIcon from '@/assets/svg/html.svg'
  import cssIcon from '@/assets/svg/css.svg'
  import jsIcon from '@/assets/svg/js.svg'
  import unknownIcon from '@/assets/svg/unknown.svg'

  const icons: Recordable = {
    'txt|text': textIcon,
    'mp4|avi|mkv|mov|wmv|flv|webm|m4v': videoIcon,
    'mp3|wav|m4a': mp3Icon,
    'zip|tar|tar|tar.gz|tgz|tar.bz2|.tbz2|rar|7z|gz|bz2|lzma|xz': zipIcon,
    'xlsx|xls|xlsm|xltx|xltm|xlsb|csv|tsv|ods': xlsIcon,
    'doc|docx|dot|dotx|dotm|docm': docIcon,
    'ppt|pptx': pptIcon,
    css: cssIcon,
    html: htmlIcon,
    js: jsIcon
  }

  const items = [
    { id: 1, filename: 'text1.txt', url: '' },
    {
      id: 2,
      filename: '1111.png',
      url: 'https://photo.colorhub.me/OHvhfAsqnNU/rs:auto:0:500:0/g:ce/fn:colorhub/bG9jYWw6Ly8vYzAvNmIvYTI1OWNjODI5MTkwYjFlYWZmY2NjMDY5NDg1NWQ5YmZiNDM0YzA2Yi5qcGVn.webp'
    },
    {
      id: 3,
      filename: '2222.jpg',
      url: 'https://img.colorhub.me/DMzGTrGOVFQ/rs:auto:0:500:0/g:ce/fn:colorhub/bG9jYWw6Ly8vMDYvN2QvMTViMmQ4YjNiZjkwYmVhY2Y0NGE2Y2M5MjUwZmVkMjEzMzE3MDY3ZC5qcGVn.webp'
    },
    {
      id: 4,
      filename: '3333.webp',
      url: 'https://photo.colorhub.me/IB0qHmie-6I/rs:auto:0:500:0/g:ce/fn:colorhub/bG9jYWw6Ly8vM2UvNjkvYzRiNDlmZjc0MGQ2N2QxMzcxMWY1ZTY3ZDYxYTMyYzgxNTVlM2U2OS5qcGVn.webp'
    },
    { id: 5, filename: 'mp41.mp4', url: '' },
    { id: 6, filename: '爱你.mp3', url: '' },
    { id: 7, filename: 'wuhu-demo11111.zip', url: '' },
    { id: 8, filename: '个人绩效.xlsx', url: '' },
    { id: 9, filename: 'doc.docx', url: '' },
    { id: 10, filename: '个人演讲.ppt', url: '' }
  ]

  const getName = (filename: string) => {
    return filename.substring(0, filename.lastIndexOf('.'))
  }

  const getIcon = (file: FileItem) => {
    const type = file.filename.substring(file.filename.lastIndexOf('.') + 1).toLowerCase()
    if (['png', 'jpg', 'webp'].includes(type)) {
      return file.url
    }
    const icon = Object.entries(icons).find(([key]) => key.split('|').includes(type))?.[1]
    return icon || unknownIcon
  }
</script>
