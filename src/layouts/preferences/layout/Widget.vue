<template>
  <div>
    <a-divider>小部件</a-divider>
    <ConfigItem title="启用全局搜索">
      <a-switch
        :checked="enableSearch"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.Search)"
      />
    </ConfigItem>
    <ConfigItem title="启用任务中心">
      <a-switch
        :checked="enableTaskCenter"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.TaskCenter)"
      />
    </ConfigItem>
    <ConfigItem title="启用下载中心">
      <a-switch
        :checked="enableDownloadCenter"
        @update:checked="
          (v: boolean) => onChange(v, HeaderWidget.DownloadCenter)
        "
      />
    </ConfigItem>
    <ConfigItem title="启用记事本">
      <a-switch
        :checked="enableNoteBook"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.NoteBook)"
      />
    </ConfigItem>
    <ConfigItem title="启用主题切换">
      <a-switch
        :checked="enableTheme"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.Theme)"
      />
    </ConfigItem>
    <ConfigItem title="启用语言切换">
      <a-switch
        :checked="enableTranslate"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.Translate)"
      />
    </ConfigItem>
    <ConfigItem title="启用全屏">
      <a-switch
        :checked="enableFullScreen"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.FullScreen)"
      />
    </ConfigItem>
    <ConfigItem title="启用通知">
      <a-switch
        :checked="enableNotice"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.Notice)"
      />
    </ConfigItem>
    <ConfigItem title="启用锁屏">
      <a-switch
        :checked="enableLockScreen"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.LockScreen)"
      />
    </ConfigItem>
    <ConfigItem title="启用AI助手">
      <a-switch
        :checked="enableAI"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.AI)"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useWidget } from '@/layouts/header/composables'
import { HeaderWidget } from '@/constants'
import { ConfigItem } from '../components'

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
  onChange,
} = useWidget()
</script>
