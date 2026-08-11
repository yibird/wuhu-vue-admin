<template>
  <div
    class="w-layout-toolbar ml-auto h-full min-w-0 shrink-0 flex items-center justify-end gap-2 overflow-hidden sm:gap-4"
  >
    <Search v-if="enableSearch" />
    <Task v-if="enableTaskCenter" />
    <Download v-if="enableDownloadCenter" />
    <NoteBook v-if="enableNoteBook" />
    <Translate v-if="enableTranslate" />
    <LockScreen v-if="enableLockScreen" />
    <FullScreen v-if="enableFullScreen" />
    <Theme v-if="enableTheme" />
    <Notice v-if="enableNotice" />
    <Chat v-if="enableAI" />
    <Setting />
    <div class="shrink-0">
      <UserProfile />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useWidget } from '../composables'

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
  enableSearch,
  enableTaskCenter,
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

<style lang="less">
.w-layout-toolbar-item {
  position: relative;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: rgb(var(--w-text-regular));
  cursor: pointer;
  outline: none;
  background: transparent;
  border: 0;
  border-radius: 4px;
  transition:
    background-color 180ms ease-out,
    color 180ms ease-out,
    box-shadow 180ms ease-out,
    transform 180ms cubic-bezier(0.16, 1, 0.3, 1);

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
