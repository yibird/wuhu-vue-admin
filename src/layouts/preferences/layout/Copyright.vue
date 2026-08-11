<template>
  <div>
    <a-divider>版权</a-divider>
    <ConfigItem title="启用版权">
      <a-switch v-model:checked="copyright.show" :disabled="!footer.show" />
    </ConfigItem>
    <ConfigItem title="公司名称">
      <a-input
        v-model:value="copyright.companyName"
        :disabled="!copyright.show"
        placeholder="请输入公司名称"
        class="max-w-200"
      />
    </ConfigItem>
    <ConfigItem title="公司主页">
      <a-input
        v-model:value="copyright.companyUrl"
        :disabled="!copyright.show"
        placeholder="请输入公司主页"
        class="max-w-200"
      />
    </ConfigItem>
    <ConfigItem title="日期">
      <a-input
        v-model:value="copyright.date"
        :disabled="!copyright.show"
        placeholder="请输入日期"
        class="max-w-200"
      />
    </ConfigItem>
    <ConfigItem title="ICP 备案号">
      <a-input
        v-model:value="copyright.icpNo"
        :disabled="!copyright.show"
        placeholder="请输入ICP备案号"
        class="max-w-200"
      />
    </ConfigItem>
    <ConfigItem title="ICP 网站链接">
      <a-input
        v-model:value="copyright.icpUrl"
        :disabled="!copyright.show"
        placeholder="请输入ICP网站链接"
        class="max-w-200"
      />
    </ConfigItem>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import ConfigItem from '../ConfigItem.vue'

const { footer, copyright } = useAppStore()
</script>
