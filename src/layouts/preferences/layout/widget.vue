<template>
  <div>
    <a-divider>小部件</a-divider>
    <ConfigItem title="启用全局搜索">
      <a-switch
        :checked="showSearch"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.Search)"
      />
    </ConfigItem>
    <ConfigItem title="启用任务中心">
      <a-switch
        :checked="showTaskCenter"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.TaskCenter)"
      />
    </ConfigItem>
    <ConfigItem title="启用下载中心">
      <a-switch
        :checked="showDownloadCenter"
        @update:checked="
          (v: boolean) => onChange(v, HeaderWidget.DownloadCenter)
        "
      />
    </ConfigItem>
    <ConfigItem title="启用记事本">
      <a-switch
        :checked="showNoteBook"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.NoteBook)"
      />
    </ConfigItem>
    <ConfigItem title="启用主题切换">
      <a-switch
        :checked="showTheme"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.Theme)"
      />
    </ConfigItem>
    <ConfigItem title="启用语言切换">
      <a-switch
        :checked="showTranslate"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.Translate)"
      />
    </ConfigItem>
    <ConfigItem title="启用全屏">
      <a-switch
        :checked="showFullScreen"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.FullScreen)"
      />
    </ConfigItem>
    <ConfigItem title="启用通知">
      <a-switch
        :checked="showNotice"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.Notice)"
      />
    </ConfigItem>
    <ConfigItem title="启用锁屏">
      <a-switch
        :checked="showLockScreen"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.LockScreen)"
      />
    </ConfigItem>
    <ConfigItem title="启用AI助手">
      <a-switch
        :checked="showAI"
        @update:checked="(v: boolean) => onChange(v, HeaderWidget.AI)"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useWidget } from '@/layouts/header/hooks'
import { HeaderWidget } from '@/constants'
import { ConfigItem } from '../components'

defineOptions({ name: 'Widget' })

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
