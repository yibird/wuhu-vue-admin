<template>
  <div class="p-10 full-flex">
    <div class="full flex bg-white">
      <!-- <a-tabs
        v-model:active-key="activeKey"
        type="line"
        placement="left"
        :tabs-padding="10"
        :bar-width="0"
        @update:value="onChange"
      >
      
        <a-tab-pane v-for="item in items" :name="item.key">
          <template #tab>
            <div
              :class="[
                'w-300 px-20 py-10 flex items-center rounded-6 transition-colors hover:bg-[#f2f3f5]',
                { 'bg-[#f2f3f5]': item.key === activeKey },
              ]"
            >
              <Icon :name="item.icon" :size="20" />
              <span class="ml-6">{{ item.label }}</span>
            </div>
          </template>
        </a-tab-pane>
      </a-tabs> -->
      <div
        class="h-full px-10 py-20 flex flex-col gap-10 border-r-1 border-r-solid border-[#f0f0f6]"
      >
        <div
          v-for="item in items"
          :key="item.key"
          :class="[
            'w-300 px-20 py-10 flex items-center rounded-6 cursor-pointer select-none transition-colors hover:bg-[#f2f3f5]',
            { 'bg-[#f2f3f5] text-theme': item.key === activeKey },
          ]"
          @click="onClick(item.key)"
        >
          <Icon :name="item.icon" :size="22" />
          <span class="ml-8 text-base">{{ item.label }}</span>
        </div>
      </div>
      <div class="h-full p-20">
        <Transition name="slide-right" mode="out-in">
          <div :key="activeKey" class="h-full">
            <component :is="currentComponent" />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { App, Security, Login, Mail, Sms, Oss, Client } from './components'
const items = [
  {
    key: 'app',
    label: '网站配置',
    icon: 'i-lucide:layout-grid',
    component: App,
  },
  {
    key: 'security',
    label: '安全配置',
    icon: 'i-lucide:shield-ellipsis',
    component: Security,
  },
  {
    key: 'login',
    label: '登录配置',
    icon: 'i-lucide:key',
    component: Login,
  },
  {
    key: 'mail',
    label: '邮箱配置',
    icon: 'i-lucide:mail',
    component: Mail,
  },
  {
    key: 'sms',
    label: '短信配置',
    icon: 'i-lucide:message-circle-more',
    component: Sms,
  },
  {
    key: 'oss',
    label: '存储配置',
    icon: 'i-lucide:database',
    component: Oss,
  },
  {
    key: 'client',
    label: '客户端配置',
    icon: 'i-lucide:pyramid',
    component: Client,
  },
]
const activeKey = ref('app')
const currentComponent = computed(
  () => items.find((item) => item.key === activeKey.value)?.component ?? App
)

const onClick = (key: string) => {
  activeKey.value = key
}
</script>
