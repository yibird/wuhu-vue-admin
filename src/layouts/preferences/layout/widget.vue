<template>
  <div>
    <a-divider>小部件</a-divider>
    <ConfigItem title="启用全局搜索">
      <a-switch
        :checked="showSearch"
        @update:checked="(v: boolean) => onChange(v, widgetKeys.Search)"
      />
    </ConfigItem>
    <ConfigItem title="启用任务中心">
      <a-switch
        :checked="showTaskCenter"
        @update:checked="(v: boolean) => onChange(v, widgetKeys.TaskCenter)"
      />
    </ConfigItem>
    <ConfigItem title="启用下载中心">
      <a-switch
        :checked="showDownloadCenter"
        @update:checked="(v: boolean) => onChange(v, widgetKeys.DownloadCenter)"
      />
    </ConfigItem>
    <ConfigItem title="启用记事本">
      <a-switch
        :checked="showNoteBook"
        @update:checked="(v: boolean) => onChange(v, widgetKeys.NoteBook)"
      />
    </ConfigItem>
    <ConfigItem title="启用主题切换">
      <a-switch
        :checked="showTheme"
        @update:checked="(v: boolean) => onChange(v, widgetKeys.Theme)"
      />
    </ConfigItem>
    <ConfigItem title="启用语言切换">
      <a-switch
        :checked="showTranslate"
        @update:checked="(v: boolean) => onChange(v, widgetKeys.Translate)"
      />
    </ConfigItem>
    <ConfigItem title="启用全屏">
      <a-switch
        :checked="showFullScreen"
        @update:checked="(v: boolean) => onChange(v, widgetKeys.FullScreen)"
      />
    </ConfigItem>
    <ConfigItem title="启用通知">
      <a-switch
        :checked="showNotice"
        @update:checked="(v: boolean) => onChange(v, widgetKeys.Notice)"
      />
    </ConfigItem>
    <ConfigItem title="启用锁屏">
      <a-switch
        :checked="showLockScreen"
        @update:checked="(v: boolean) => onChange(v, widgetKeys.LockScreen)"
      />
    </ConfigItem>
    <ConfigItem title="启用AI助手">
      <a-switch
        :checked="showAI"
        @update:checked="(v: boolean) => onChange(v, widgetKeys.AI)"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useWidget } from '@/layouts/header/hooks'
import { HEADER_WIDGET } from '@/constants'
import { ConfigItem } from '../components'

/** 模板里直接用导入常量会被当作 maybe-ref,这里落到本地 const */
const widgetKeys = HEADER_WIDGET

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
  onChange,
} = useWidget()
</script>
