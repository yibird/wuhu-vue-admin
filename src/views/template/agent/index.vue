<template>
  <div class="full p-10">
    <div class="h-full flex bg-white rounded-4">
      <Sider :items="chats" />
      <Main />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Sider, Main } from './components'
import type { ChatItem } from './components/types'
const chats: ChatItem[] = [
  {
    id: '1',
    title: '对话1',
    createTime: '2023-01-01',
  },
  {
    id: '2',
    title: '对话2',
    createTime: '2023-01-01',
  },
]
</script>
