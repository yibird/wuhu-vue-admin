<template>
  <div
    class="group h-full flex items-center overflow-hidden [&>button]:(span-button p-8 flex rounded-8 cursor-pointer transition) [&>button:hover]:(bg-[#f5f5f4] [&>button>i:hover]:scale-110) [&>button>i]:(transition) [&>button:hover_i]:scale-110 dark:[&>button:hover]:(bg-[#2e3033])"
  >
    <Search v-if="enableSearch" />
    <Download v-if="enableDownloadCenter" />
    <NoteBook v-if="enableNoteBook" />
    <Translate v-if="enableTranslate" />
    <LockScreen v-if="enableLockScreen" />
    <FullScreen v-if="enableFullScreen" />
    <Theme v-if="enableTheme" />
    <Notice v-if="enableNotice" />
    <Chat v-if="enableAI" />
    <Setting />
    <UserProfile />
  </div>
</template>
<script lang="ts" setup>
import { useWidget } from '@/layouts/composables'

import Search from './search.vue'
import Download from './download.vue'
import NoteBook from './note-book.vue'
import Translate from './translate.vue'
import LockScreen from './lock-screen.vue'
import FullScreen from './full-screen.vue'
import Theme from './theme.vue'
import Setting from './setting.vue'
import Notice from './notice.vue'
import Chat from './chat.vue'
import UserProfile from './user-profile.vue'

const {
  enableSearch,
  enableDownloadCenter,
  enableNoteBook,
  enableTheme,
  enableTranslate,
  enableFullScreen,
  enableNotice,
  enableLockScreen,
  enableAI,
} = useWidget()
</script>
