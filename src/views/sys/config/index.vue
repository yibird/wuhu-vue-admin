<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 bg-page p-10">
      <div class="h-full min-h-0 flex overflow-hidden bg-container">
        <div
          class="w-300 shrink-0 overflow-y-auto px-10 py-20 flex flex-col gap-10 b-r-1-muted max-sm:(w-72 px-6)"
        >
          <button
            v-for="item in items"
            :key="item.key"
            type="button"
            :class="[
              'group reset-button px-12 py-10 flex items-center rounded-6 motion-press hover:bg-hover max-sm:(flex justify-center)',
              { 'bg-hover text-primary': item.key === activeKey },
            ]"
            :aria-pressed="item.key === activeKey"
            :title="item.label"
            @click="onClick(item.key)"
          >
            <Icon
              :name="item.icon"
              :size="22"
              class="group-hover:text-primary"
            />
            <span
              class="ml-8 text-base group-hover:text-primary max-sm:hidden"
              >{{ item.label }}</span
            >
          </button>
        </div>
        <div class="h-full min-w-0 flex-1 py-20 max-sm:py-12">
          <Transition name="slide-right" mode="out-in">
            <div :key="activeKey" class="h-full">
              <component :is="currentComponent" />
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </WView>
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
] as const

type ConfigKey = (typeof items)[number]['key']

const activeKey = shallowRef<ConfigKey>('app')
const currentComponent = computed(
  () => items.find((item) => item.key === activeKey.value)?.component ?? App
)

function onClick(key: ConfigKey) {
  activeKey.value = key
}
</script>
