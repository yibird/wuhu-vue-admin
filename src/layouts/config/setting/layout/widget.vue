<template>
  <div>
    <n-divider>小部件</n-divider>
    <ConfigItem title="启用全局搜索">
      <n-switch
        :default-value="enableSearch"
        :round="false"
        @update:value="(v: boolean) => onChange(v, HeaderWidget.Search)"
      />
    </ConfigItem>
    <ConfigItem title="启用下载中心">
      <n-switch
        :default-value="enableDownloadCenter"
        :round="false"
        @update:value="(v: boolean) => onChange(v, HeaderWidget.DownloadCenter)"
      />
    </ConfigItem>
    <ConfigItem title="启用记事本">
      <n-switch
        :default-value="enableNoteBook"
        :round="false"
        @update:value="(v: boolean) => onChange(v, HeaderWidget.NoteBook)"
      />
    </ConfigItem>
    <ConfigItem title="启用主题切换">
      <n-switch
        :default-value="enableTheme"
        :round="false"
        @update:value="(v: boolean) => onChange(v, HeaderWidget.Theme)"
      />
    </ConfigItem>
    <ConfigItem title="启用语言切换">
      <n-switch
        :default-value="enableTranslate"
        :round="false"
        @update:value="(v: boolean) => onChange(v, HeaderWidget.Translate)"
      />
    </ConfigItem>
    <ConfigItem title="启用全屏">
      <n-switch
        :default-value="enableFullScreen"
        :round="false"
        @update:value="(v: boolean) => onChange(v, HeaderWidget.FullScreen)"
      />
    </ConfigItem>
    <ConfigItem title="启用通知">
      <n-switch
        :default-value="enableNotice"
        :round="false"
        @update:value="(v: boolean) => onChange(v, HeaderWidget.Notice)"
      />
    </ConfigItem>
    <ConfigItem title="启用锁屏">
      <n-switch
        :default-value="enableLockScreen"
        :round="false"
        @update:value="(v: boolean) => onChange(v, HeaderWidget.LockScreen)"
      />
    </ConfigItem>
    <ConfigItem title="启用AI助手">
      <n-switch
        :default-value="enableAI"
        :round="false"
        @update:value="(v: boolean) => onChange(v, HeaderWidget.AI)"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useWidget } from '@/layouts/composables'
import { HeaderWidget } from '@/constant'
import ConfigItem from '../config-item.vue'

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
  onChange,
} = useWidget()
</script>
