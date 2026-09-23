<template>
  <div
    class="w-layout-toolbar ml-auto h-full min-w-0 shrink-0 flex items-center justify-end gap-2 overflow-hidden sm:gap-4"
  >
    <Search v-if="showSearch" />
    <Task v-if="showTaskCenter" />
    <Download v-if="showDownloadCenter" />
    <NoteBook v-if="showNoteBook" />
    <Translate v-if="showTranslate" />
    <LockScreen v-if="showLockScreen" />
    <FullScreen v-if="showFullScreen" />
    <Theme v-if="showTheme" />
    <Notice v-if="showNotice" />
    <Chat v-if="showAI" />
    <Setting />
    <div class="shrink-0">
      <UserProfile />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useWidget } from '../hooks'

import Search from './Search.vue'
import Download from './Download.vue'
import Task from './Task.vue'
import NoteBook from './NoteBook.vue'
import Translate from './Translate.vue'
import LockScreen from './LockScreen.vue'
import FullScreen from './FullScreen.vue'
import Theme from './Theme.vue'
import Setting from './Setting.vue'
import Notice from './Notice.vue'
import Chat from './Chat.vue'
import UserProfile from './UserProfile.vue'

const {
  showSearch,
  showTaskCenter,
  showDownloadCenter,
  showNoteBook,
  showTheme,
  showTranslate,
  showFullScreen,
  showNotice,
  showLockScreen,
  showAI,
} = useWidget()
</script>

<style lang="less">
:where(.w-layout-toolbar-item) {
  display: grid;
}

.w-layout-toolbar-item {
  position: relative;
  place-items: center;
  width: 32px;
  height: 32px;
  color: rgb(var(--w-text-regular));
  cursor: pointer;
  outline: none;
  background: transparent;
  border-radius: 4px;
  transition:
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    box-shadow var(--w-motion-duration-base) var(--w-motion-ease-standard),
    transform var(--w-motion-duration-base) var(--w-motion-ease-enter);

  &:hover {
    color: rgb(var(--w-text-main));
    background: rgb(var(--w-bg-hover));
    box-shadow: var(--w-shadow-sm);

    .w-icon {
      transform: scale(1.08);
    }
  }

  &:active {
    box-shadow: none;
    transform: translateY(0) scale(0.92);

    .w-icon {
      transform: scale(0.96);
    }
  }
}
</style>
